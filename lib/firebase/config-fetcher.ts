/**
 * Firebase Configuration Fetcher
 * 
 * This module fetches Firebase configuration from API when environment variables
 * are not available due to Vercel Edge Runtime limitations
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Cache for the configuration
let configCache: FirebaseConfig | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get Firebase configuration with multiple fallback strategies
 */
export async function getFirebaseConfig(): Promise<{ 
  config: FirebaseConfig | null; 
  source: string; 
  errors: string[] 
}> {
  const errors: string[] = [];
  
  // Strategy 1: Direct environment variable access (fastest)
  console.log('🔍 Attempting direct environment variable access...');
  try {
    const directConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    
    // Check if all required fields are present
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const hasAllRequired = requiredFields.every(field => 
      directConfig[field as keyof typeof directConfig] && 
      directConfig[field as keyof typeof directConfig] !== 'undefined'
    );
    
    if (hasAllRequired) {
      console.log('✅ Firebase config loaded from environment variables');
      return { 
        config: directConfig as FirebaseConfig, 
        source: 'environment', 
        errors: [] 
      };
    } else {
      const missingFields = requiredFields.filter(field => 
        !directConfig[field as keyof typeof directConfig] ||
        directConfig[field as keyof typeof directConfig] === 'undefined'
      );
      errors.push(`Direct env access missing: ${missingFields.join(', ')}`);
    }
  } catch (error) {
    errors.push(`Direct env access failed: ${error}`);
  }
  
  // Strategy 2: Use cached config if available and fresh
  const now = Date.now();
  if (configCache && (now - cacheTimestamp) < CACHE_TTL) {
    console.log('✅ Firebase config loaded from cache');
    return { 
      config: configCache, 
      source: 'cache', 
      errors: [] 
    };
  }
  
  // Strategy 3: Fetch from API endpoint (bypasses Vercel Edge Runtime issues)
  if (typeof window !== 'undefined') {
    console.log('🔍 Fetching Firebase config from API endpoint...');
    try {
      const response = await fetch('/api/firebase-config', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.config) {
          // Cache the config
          configCache = data.config;
          cacheTimestamp = now;
          
          console.log('✅ Firebase config loaded from API endpoint');
          return { 
            config: data.config, 
            source: 'api', 
            errors: [] 
          };
        } else {
          errors.push(`API returned error: ${data.error || 'Unknown error'}`);
        }
      } else {
        errors.push(`API request failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      errors.push(`API fetch failed: ${error}`);
    }
  } else {
    errors.push('Cannot fetch from API on server side');
  }
  
  console.error('❌ All Firebase config strategies failed:', errors);
  return { config: null, source: 'none', errors };
}

/**
 * Validate Firebase configuration
 */
export function validateConfig(config: FirebaseConfig | null): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!config) {
    errors.push('Configuration is null');
    return { isValid: false, errors };
  }
  
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey', 
    'authDomain', 
    'projectId', 
    'appId'
  ];
  
  for (const field of requiredFields) {
    const value = config[field];
    if (!value || value === 'undefined' || value === 'null') {
      errors.push(`Missing ${field}`);
    } else if (typeof value === 'string' && (
      value === 'your_firebase_api_key' || 
      value === 'your_project_id' ||
      value.includes('placeholder')
    )) {
      errors.push(`${field} has placeholder value: ${value}`);
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

/**
 * Clear configuration cache
 */
export function clearConfigCache(): void {
  configCache = null;
  cacheTimestamp = 0;
  console.log('🗑️ Firebase configuration cache cleared');
}