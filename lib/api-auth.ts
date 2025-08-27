import { NextRequest } from 'next/server';
import { verifyIdToken } from './server/firebase-admin';

export interface AuthResult {
  success: boolean;
  userId?: string;
  userPlan?: 'free' | 'pro' | null;
  error?: string;
  isApiKey?: boolean;
}

/**
 * Validate API key format and extract user information
 */
export async function validateApiKey(apiKey: string): Promise<AuthResult> {
  // API key format: pe_[environment]_[userId]_[randomString]
  // Example: pe_prod_abc123_xyz789 or pe_dev_abc123_xyz789
  
  if (!apiKey.startsWith('pe_')) {
    return {
      success: false,
      error: 'Invalid API key format',
    };
  }

  const parts = apiKey.split('_');
  if (parts.length !== 4) {
    return {
      success: false,
      error: 'Invalid API key format',
    };
  }

  const [prefix, environment, userId, signature] = parts;
  
  // Validate environment
  const validEnvironments = ['prod', 'dev', 'test'];
  if (!validEnvironments.includes(environment)) {
    return {
      success: false,
      error: 'Invalid API key environment',
    };
  }

  // In production, validate the signature against a secret
  // For now, we'll do basic validation
  if (signature.length < 8) {
    return {
      success: false,
      error: 'Invalid API key signature',
    };
  }

  try {
    // API keys are no longer supported - return error
    return {
      success: false,
      error: 'API keys are no longer supported',
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return {
      success: false,
      error: 'Failed to validate API key',
    };
  }
}

/**
 * Authenticate request using either Firebase ID token or API key
 */
export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  // Check for API key in Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer pe_')) {
    const apiKey = authHeader.replace('Bearer ', '');
    return validateApiKey(apiKey);
  }

  // Check for API key in x-api-key header
  const apiKeyHeader = request.headers.get('x-api-key');
  if (apiKeyHeader?.startsWith('pe_')) {
    return validateApiKey(apiKeyHeader);
  }

  // Check for Firebase ID token
  if (authHeader?.startsWith('Bearer ') && !authHeader.includes('pe_')) {
    const idToken = authHeader.replace('Bearer ', '');
    try {
      const userId = await verifyIdToken(idToken);
      if (!userId) {
        return {
          success: false,
          error: 'Invalid Firebase token',
        };
      }

      return {
        success: true,
        userId,
        userPlan: null,
        isApiKey: false,
      };
    } catch (error) {
      console.error('Firebase token validation error:', error);
      return {
        success: false,
        error: 'Failed to validate Firebase token',
      };
    }
  }

  // No authentication provided - allow for anonymous usage with rate limiting
  return {
    success: true,
    userPlan: null,
    isApiKey: false,
  };
}

/**
 * Generate API key for a user (Pro users only)
 */
export function generateApiKey(userId: string, environment: 'prod' | 'dev' | 'test' = 'prod'): string {
  const randomString = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
  
  return `pe_${environment}_${userId}_${randomString}`;
}

/**
 * Middleware to require authentication for protected routes
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const authResult = await authenticateRequest(request);
  
  if (!authResult.success) {
    return authResult;
  }

  // For API endpoints that require authentication, ensure user is logged in
  if (!authResult.userId) {
    return {
      success: false,
      error: 'Authentication required',
    };
  }

  return authResult;
}
