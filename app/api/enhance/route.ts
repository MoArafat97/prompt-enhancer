import { NextRequest, NextResponse } from 'next/server';
import { EnhancementService } from '@/lib/enhancement-service';
import { rateLimit } from '@/lib/rate-limit';
import { validatePrompt } from '@/lib/utils';
import { EnhanceRequest, ApiResponse, EnhancementResult } from '@/lib/types';
import { API_CONFIG } from '@/lib/constants';
import { verifyIdToken } from '@/lib/server/firebase-admin';
import { authenticateRequest } from '@/lib/api-auth';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Authentication (supports both Firebase tokens and API keys)
    const authResult = await authenticateRequest(request);

    // Get user's billing status for rate limiting
    let userPlan: 'free' | 'pro' | null = null;
    if (authResult.userId) {
      try {
        const { getAdminDb } = await import('@/lib/server/firebase-admin');
        const db = getAdminDb();
        if (db) {
          const userDoc = await db.collection('users').doc(authResult.userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const billingStatus = userData?.billing?.status || 'free';
            // Map billing status to rate limit plan
            userPlan = ['active', 'trialing', 'pro'].includes(billingStatus) ? 'pro' : 'free';
          }
        }
      } catch (error) {
        console.error('Error fetching user billing status:', error);
        userPlan = 'free';
      }
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(request, userPlan, authResult.userId);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${Math.ceil((rateLimitResult.reset - Date.now()) / 1000)} seconds.`,
        } as ApiResponse,
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // Parse request body
    let body: EnhanceRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON',
          message: 'Request body must be valid JSON',
        } as ApiResponse,
        { status: 400 }
      );
    }

    const { prompt, technique, outputFormat } = body;

    // Validate required fields
    if (!prompt || !technique || !outputFormat) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'prompt, technique, and outputFormat are required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate prompt
    const promptValidation = validatePrompt(prompt);
    if (!promptValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid prompt',
          message: promptValidation.error,
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate technique
    const validTechniques = [
      // General techniques
      'clarity', 'chain-of-thought', 'few-shot', 'role-based',
      'co-star', 'smart', 'coast', 'okr', 'swot', '5w1h', 'grow', 'pdca',
      'eisenhower', 'moscow', 'raci', 'balanced-scorecard', 'star', 'prep',
      // Writing techniques
      'creative', 'storytelling', 'aida', 'scamper',
      // Coding techniques
      'pal', 'meta-prompting', 'constitutional-ai', 'tree-of-thought',
      'root-cause-analysis', 'systems-thinking'
    ];
    if (!validTechniques.includes(technique)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid technique',
          message: `Technique must be one of: ${validTechniques.join(', ')}`,
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate output format
    const validFormats = ['natural', 'json', 'xml'];
    if (!validFormats.includes(outputFormat)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid output format',
          message: `Output format must be one of: ${validFormats.join(', ')}`,
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Determine API key: prefer per-user header if provided, else env
    const headerKey = request.headers.get('x-openrouter-key') || undefined;
    if (!headerKey && !process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service unavailable',
          message: 'AI service is not configured',
        } as ApiResponse,
        { status: 503 }
      );
    }



    // Enhance the prompt
    const enhancementService = new EnhancementService(headerKey);
    const result = await enhancementService.enhance({
      prompt,
      technique,
      outputFormat,
    });



    // Add processing time
    result.metadata.processingTime = Date.now() - startTime;
    result.metadata.timestamp = new Date().toISOString();

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: 'Prompt enhanced successfully',
      } as ApiResponse<EnhancementResult>,
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );

  } catch (error) {
    console.error('Enhancement error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Authentication failed',
            message: 'Invalid API configuration',
          } as ApiResponse,
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Service unavailable',
            message: 'AI service quota exceeded',
          } as ApiResponse,
          { status: 503 }
        );
      }

      if (error.message.includes('timeout') || error.message.includes('Request timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Request timeout',
            message: 'The request took too long to process. Please try again with a simpler prompt.',
          } as ApiResponse,
          { status: 504 }
        );
      }

      if (error.message.includes('503') || error.message.includes('Service temporarily unavailable')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Service temporarily unavailable',
            message: 'The AI service is temporarily unavailable. Please try again in a few moments.',
          } as ApiResponse,
          { status: 503 }
        );
      }

      if (error.message.includes('All models failed')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Service unavailable',
            message: 'Unable to process your request at this time. Please try a different technique or try again later.',
          } as ApiResponse,
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only supports POST requests',
    } as ApiResponse,
    { status: 405 }
  );
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}

export async function PATCH() {
  return GET();
}
