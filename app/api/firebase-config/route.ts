import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to serve Firebase configuration to client
 * This bypasses Vercel Edge Runtime environment variable issues
 */
export async function GET(request: NextRequest) {
  try {
    // These will work in Node.js runtime (API routes use Node.js by default)
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    // Log what we're getting from the server
    console.log('🔧 Firebase Config API - Server side env vars:', {
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      hasAppId: !!firebaseConfig.appId,
      apiKeyPreview: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
      projectId: firebaseConfig.projectId || 'MISSING',
      authDomain: firebaseConfig.authDomain || 'MISSING',
    });

    // Validate that we have the minimum required config
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing Firebase configuration',
        missingFields,
        serverEnvKeys: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_FIREBASE')),
        debug: {
          nodeEnv: process.env.NODE_ENV,
          isVercel: !!process.env.VERCEL,
          vercelEnv: process.env.VERCEL_ENV,
          allEnvKeys: Object.keys(process.env).length,
        }
      }, { status: 500 });
    }

    // Return config with cache headers
    const response = NextResponse.json({
      success: true,
      config: firebaseConfig,
      timestamp: new Date().toISOString(),
    });

    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300');
    
    return response;
    
  } catch (error) {
    console.error('❌ Firebase Config API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Also handle POST for debugging
export async function POST(request: NextRequest) {
  return GET(request);
}