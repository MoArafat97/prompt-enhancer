/**
 * Firebase Configuration - DEFINITIVE VERSION
 * 
 * This module provides a clean, race-condition-free interface to Firebase services.
 * Key improvements:
 * - No module-level initialization (eliminates race conditions)
 * - Lazy loading of Firebase services only when needed
 * - Comprehensive environment variable validation
 * - Production-ready error handling and debugging
 */

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Analytics } from 'firebase/analytics';
import { firebaseInitService, initializeFirebase as initService } from './initialization-service';
import { validateFirebaseConfig } from './vercel-env-fix';

// Module-level state (lazy-loaded, never initialized at import time)
let _cachedStatus: {
  isConfigured: boolean;
  lastChecked: number;
  configValid: boolean;
  errors: string[];
} | null = null;

const CONFIG_CACHE_TTL = 5000; // 5 seconds

/**
 * Check if Firebase is properly configured using enhanced Vercel environment access
 */
export function isFirebaseConfigured(): boolean {
  const now = Date.now();

  // Return cached result if still valid
  if (_cachedStatus && (now - _cachedStatus.lastChecked) < CONFIG_CACHE_TTL) {
    return _cachedStatus.isConfigured;
  }

  // Use enhanced Vercel environment variable validation
  const validation = validateFirebaseConfig();

  // Cache the result
  _cachedStatus = {
    isConfigured: validation.isValid,
    lastChecked: now,
    configValid: validation.isValid,
    errors: validation.errors
  };

  return validation.isValid;
}

/**
 * Ensure Firebase client is initialized and ready for use
 * This is the ONLY function that should be called before Firebase operations
 */
export async function ensureFirebaseClient(): Promise<boolean> {
  if (typeof window === 'undefined') {
    console.log('🔄 ensureFirebaseClient called on server side, skipping');
    return false;
  }
  
  console.log('🔍 Ensuring Firebase client is ready...');
  
  try {
    const result = await initService();
    
    if (result.success) {
      console.log('✅ Firebase client is ready for use');
      return true;
    } else {
      console.error('❌ Firebase client initialization failed:', result.error?.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Firebase client initialization error:', error);
    return false;
  }
}

/**
 * Get Firebase instances - ONLY call after ensureFirebaseClient() succeeds
 */
export function getFirebaseInstances(): {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
} {
  return firebaseInitService.getInstances();
}

/**
 * Get comprehensive Firebase initialization status
 */
export async function getFirebaseStatus() {
  const serviceStatus = await firebaseInitService.getStatus();
  const instances = firebaseInitService.getInstances();
  const configStatus = _cachedStatus;
  
  return {
    // Configuration status
    isConfigured: isFirebaseConfigured(),
    configValid: configStatus?.configValid ?? false,
    configErrors: configStatus?.errors ?? [],
    lastConfigCheck: configStatus?.lastChecked,
    
    // Service status
    service: {
      ...serviceStatus,
      instances: {
        hasApp: !!instances.app,
        hasAuth: !!instances.auth,
        hasDb: !!instances.db,
        hasAnalytics: !!instances.analytics,
        isInitialized: instances.isInitialized,
      },
    },
    
    // Runtime environment
    environment: {
      isClient: typeof window !== 'undefined',
      isServer: typeof window === 'undefined',
      nodeEnv: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Convenience getters for Firebase services
 * These return the actual instances but should only be used after ensureFirebaseClient()
 */
export const app = () => getFirebaseInstances().app;
export const auth = () => getFirebaseInstances().auth;
export const db = () => getFirebaseInstances().db;
export const analytics = () => getFirebaseInstances().analytics;

/**
 * Force re-initialization (useful for debugging)
 */
export async function reinitializeFirebase(): Promise<boolean> {
  console.log('🔄 Forcing Firebase re-initialization...');
  _cachedStatus = null; // Clear config cache
  
  try {
    const result = await firebaseInitService.reinitialize();
    return result.success;
  } catch (error) {
    console.error('❌ Firebase re-initialization failed:', error);
    return false;
  }
}

// Export the initialization service for advanced usage
export { firebaseInitService, initService as initializeFirebase };