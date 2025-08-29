/**
 * Hardcoded Firebase Configuration
 * 
 * This is a fallback configuration that ensures Firebase always initializes.
 * These values are safe to hardcode as they are public client-side configuration.
 * Firebase security is enforced through Security Rules, not by hiding these values.
 */

export const HARDCODED_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB49CP9P1zU_EmxM7Pxerjf9PQEPynnnms",
  authDomain: "prompt-enhancer-4636b.firebaseapp.com",
  projectId: "prompt-enhancer-4636b",
  storageBucket: "prompt-enhancer-4636b.firebasestorage.app",
  messagingSenderId: "27112504451",
  appId: "1:27112504451:web:b65ba67d8549d2ee486fb6",
  measurementId: "G-C6X317PW42"
};

/**
 * Get Firebase configuration with hardcoded fallback
 * This ensures Firebase ALWAYS initializes, even if env vars fail
 */
export function getGuaranteedFirebaseConfig() {
  // Try environment variables first
  const envConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Check if we have valid environment config
  const hasValidEnvConfig = envConfig.apiKey && 
                           envConfig.authDomain && 
                           envConfig.projectId && 
                           envConfig.appId &&
                           envConfig.apiKey !== 'undefined' &&
                           envConfig.projectId !== 'undefined';

  if (hasValidEnvConfig) {
    console.log('✅ Using environment variable Firebase config');
    return envConfig;
  }

  // Fall back to hardcoded config
  console.log('⚠️ Environment variables not available, using hardcoded Firebase config');
  return HARDCODED_FIREBASE_CONFIG;
}