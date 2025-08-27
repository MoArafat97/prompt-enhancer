import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AVAILABLE_MODELS, API_CONFIG } from '@/lib/constants';
import { requireAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {


    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'OpenRouter API key not configured',
          message: 'Please set OPENROUTER_API_KEY in your environment variables'
        },
        { status: 503 }
      );
    }

    const openrouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: API_CONFIG.OPENROUTER_CONFIG.baseURL,
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Prompt Enhancer',
      },
    });

    const testResults = [];
    
    // Test each model with a simple prompt
    for (const model of AVAILABLE_MODELS) {
      try {
        console.log(`Testing model: ${model.name} (${model.id})`);
        
        const completion = await openrouter.chat.completions.create({
          model: model.id,
          messages: [
            { role: 'user', content: 'Say "Hello, I am working!" in exactly those words.' },
          ],
          temperature: 0.1,
          max_tokens: 50,
        });

        const response = completion.choices[0]?.message?.content;
        
        testResults.push({
          model: model.name,
          id: model.id,
          provider: model.provider,
          status: 'working',
          response: response?.trim() || 'No response',
          error: null,
        });
        
        console.log(`✅ ${model.name}: Working`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        testResults.push({
          model: model.name,
          id: model.id,
          provider: model.provider,
          status: 'failed',
          response: null,
          error: errorMessage,
        });
        
        console.log(`❌ ${model.name}: ${errorMessage}`);
      }
    }

    const workingModels = testResults.filter(r => r.status === 'working');
    const failedModels = testResults.filter(r => r.status === 'failed');

    return NextResponse.json({
      success: true,
      message: `Tested ${AVAILABLE_MODELS.length} models`,
      summary: {
        total: AVAILABLE_MODELS.length,
        working: workingModels.length,
        failed: failedModels.length,
      },
      results: testResults,
      recommendation: workingModels.length > 0 
        ? `Use ${workingModels[0].model} (${workingModels[0].id}) - it's working!`
        : 'No models are currently working. Check your API key or try again later.',
    });

  } catch (error) {
    console.error('Model test error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only supports GET requests',
    },
    { status: 405 }
  );
}
