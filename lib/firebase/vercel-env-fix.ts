/**
 * Vercel Environment Variable Access Fix
 * 
 * This module implements multiple strategies to access environment variables
 * in Vercel deployments, especially addressing Edge Runtime limitations.
 */

// Cache for environment variables to avoid repeated lookups
let envCache: Record<string, string | undefined> | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds

/**
 * Get environment variable with multiple fallback strategies for Vercel
 */
export function getVercelEnvVar(key: string): string | undefined {
  const now = Date.now();
  
  // Use cache if still valid
  if (envCache && (now - lastCacheTime) < CACHE_TTL) {
    return envCache[key];
  }
  
  let value: string | undefined;
  
  // Strategy 1: Direct process.env access (most common)
  try {
    value = process.env[key];
    if (value) {
      console.log(`✅ [${key}] Found via process.env`);
      return value;
    }
  } catch (e) {
    console.warn(`⚠️ [${key}] Failed to access process.env:`, e);
  }
  
  // Strategy 2: Check for Vercel build-time injection
  try {
    // @ts-ignore - Vercel sometimes injects variables globally
    value = (globalThis as any)[key];
    if (value) {
      console.log(`✅ [${key}] Found via globalThis`);
      return value;
    }
  } catch (e) {
    console.warn(`⚠️ [${key}] Failed to access globalThis:`, e);
  }
  
  // Strategy 3: Client-side window object (should not be needed for NEXT_PUBLIC_*)
  if (typeof window !== 'undefined') {
    try {
      // @ts-ignore - Check for runtime injection
      value = (window as any).__FIREBASE_CONFIG__?.[key] || 
              (window as any).__VERCEL_ENV__?.[key] ||
              (window as any).__ENV__?.[key];
      if (value) {
        console.log(`✅ [${key}] Found via window object`);
        return value;
      }
    } catch (e) {
      console.warn(`⚠️ [${key}] Failed to access window:`, e);
    }
  }
  
  // Strategy 4: Check Next.js runtime config (legacy)
  try {
    if (typeof window !== 'undefined') {
      // @ts-ignore - Next.js runtime config
      const nextConfig = (window as any).__NEXT_DATA__?.runtimeConfig;
      value = nextConfig?.publicRuntimeConfig?.[key] || nextConfig?.[key];
      if (value) {
        console.log(`✅ [${key}] Found via Next.js runtime config`);
        return value;
      }
    }
  } catch (e) {
    console.warn(`⚠️ [${key}] Failed to access Next.js config:`, e);
  }
  
  console.error(`❌ [${key}] Not found in any strategy`);
  return undefined;
}

/**
 * Get all Firebase environment variables with comprehensive fallbacks
 */
export function getFirebaseEnvVars(): Record<string, string | undefined> {
  const firebaseKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  ];
  
  console.log('🔍 Starting comprehensive environment variable check...');
  console.log('📊 Environment context:', {
    nodeEnv: process.env.NODE_ENV,
    isVercel: !!process.env.VERCEL,
    vercelEnv: process.env.VERCEL_ENV,
    isClient: typeof window !== 'undefined',
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) : 'server',
    timestamp: new Date().toISOString(),
  });
  
  const result: Record<string, string | undefined> = {};
  const foundKeys: string[] = [];
  const missingKeys: string[] = [];
  
  for (const key of firebaseKeys) {
    const value = getVercelEnvVar(key);
    result[key] = value;
    
    if (value && value !== 'undefined' && value !== 'null') {
      foundKeys.push(key);
    } else {
      missingKeys.push(key);
    }
  }
  
  // Update cache
  envCache = result;
  lastCacheTime = Date.now();
  
  console.log('📋 Environment variable summary:', {
    foundKeys,
    missingKeys,
    totalFound: foundKeys.length,
    totalMissing: missingKeys.length,
    allKeys: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_FIREBASE')),
    processEnvKeyCount: Object.keys(process.env).length,
  });
  
  return result;
}

/**
 * Validate Firebase configuration with enhanced Vercel support
 */
export function validateFirebaseConfig(): {
  isValid: boolean;
  config: Record<string, string | undefined>;
  errors: string[];
  missingVars: string[];
  debugInfo: any;
} {
  const config = getFirebaseEnvVars();
  const errors: string[] = [];
  const missingVars: string[] = [];
  
  const requiredKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  for (const key of requiredKeys) {
    const value = config[key];
    if (!value || value === 'undefined' || value === 'null') {
      missingVars.push(key);
    } else if (value === 'your_firebase_api_key' || value === 'your_project_id') {
      errors.push(`${key} has placeholder value: ${value}`);
    }
  }
  
  if (missingVars.length > 0) {
    errors.push(`Missing required variables: ${missingVars.join(', ')}`);
  }
  
  const debugInfo = {
    vercelContext: {
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      nodeEnv: process.env.NODE_ENV,
      region: process.env.VERCEL_REGION,
      url: process.env.VERCEL_URL,
    },
    processEnv: {
      totalKeys: Object.keys(process.env).length,
      firebaseKeys: Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_FIREBASE')),
      hasNextPublicVars: Object.keys(process.env).some(k => k.startsWith('NEXT_PUBLIC_')),
    },
    runtime: {
      isClient: typeof window !== 'undefined',
      timestamp: new Date().toISOString(),
    }
  };
  
  const isValid = errors.length === 0 && missingVars.length === 0;
  
  if (!isValid) {
    console.error('❌ Firebase configuration validation failed:', {
      errors,
      missingVars,
      debugInfo
    });
  } else {
    console.log('✅ Firebase configuration validation passed:', debugInfo);
  }
  
  return {
    isValid,
    config,
    errors,
    missingVars,
    debugInfo
  };
}

/**
 * Clear environment variable cache (useful for testing)
 */
export function clearEnvCache(): void {
  envCache = null;
  lastCacheTime = 0;
  console.log('🗑️ Environment variable cache cleared');
}