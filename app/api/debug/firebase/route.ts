import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow in development or with a debug token
  const debugToken = request.nextUrl.searchParams.get('token');
  const isDevelopment = process.env.NODE_ENV === 'development';
  const validDebugToken = process.env.DEBUG_TOKEN || 'debug123';

  if (!isDevelopment && debugToken !== validDebugToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const firebaseEnvVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Additional environment info for Vercel debugging
  const vercelInfo = {
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_REGION: process.env.VERCEL_REGION,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  };

  const status = {
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    platform: {
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      region: process.env.VERCEL_REGION,
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7),
    },
    envVars: Object.entries(firebaseEnvVars).reduce((acc, [key, value]) => {
      acc[key] = {
        exists: !!value,
        length: value?.length || 0,
        preview: value ? `${value.substring(0, 10)}...` : null,
        isPlaceholder: value === 'your_firebase_api_key' || value === 'your_project_id',
        isEmpty: value === '',
        isUndefined: value === undefined,
      };
      return acc;
    }, {} as Record<string, any>),
    requiredVarsPresent: Object.values(firebaseEnvVars).every(value => 
      value && value !== 'your_firebase_api_key' && value !== 'your_project_id'
    ),
    vercelInfo,
    // Add process.env keys count for debugging
    processEnvKeysCount: Object.keys(process.env).length,
    hasNextPublicVars: Object.keys(process.env).some(key => key.startsWith('NEXT_PUBLIC_')),
    nextPublicVarsCount: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')).length,
  };

  return NextResponse.json(status);
}
