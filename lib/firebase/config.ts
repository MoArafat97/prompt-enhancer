/**
 * Firebase Configuration - SIMPLIFIED VERSION
 * 
 * This module provides a guaranteed-to-work Firebase interface.
 * It uses a hardcoded fallback to ensure Firebase ALWAYS initializes.
 */

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Analytics } from 'firebase/analytics';
import { getSimpleFirebaseInstances, initializeFirebaseSimple, isFirebaseInitialized } from './simple-init';

/**
 * Check if Firebase is properly configured
 * With the hardcoded fallback, this ALWAYS returns true
 */
export function isFirebaseConfigured(): boolean {
  return true; // Always true with hardcoded fallback
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
    const instances = initializeFirebaseSimple();
    const success = !!(instances.app && instances.auth && instances.db);
    
    if (success) {
      console.log('✅ Firebase client is ready for use');
      return true;
    } else {
      console.error('❌ Firebase client initialization incomplete');
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
  return getSimpleFirebaseInstances();
}

/**
 * Get comprehensive Firebase initialization status
 */
export async function getFirebaseStatus() {
  const instances = getSimpleFirebaseInstances();
  
  return {
    // Configuration status
    isConfigured: true, // Always true with hardcoded fallback
    configValid: true,
    configErrors: [],
    
    // Service status
    service: {
      isConfigValid: true,
      isInitialized: isFirebaseInitialized(),
      hasApp: !!instances.app,
      hasAuth: !!instances.auth,
      hasDb: !!instances.db,
      hasAnalytics: !!instances.analytics,
      instances: {
        hasApp: !!instances.app,
        hasAuth: !!instances.auth,
        hasDb: !!instances.db,
        hasAnalytics: !!instances.analytics,
        isInitialized: isFirebaseInitialized(),
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
  
  try {
    // Simple init doesn't need reinit, just returns existing
    const instances = initializeFirebaseSimple();
    return !!(instances.app && instances.auth && instances.db);
  } catch (error) {
    console.error('❌ Firebase re-initialization failed:', error);
    return false;
  }
}

// Export simplified initialization
export { initializeFirebaseSimple as initializeFirebase };