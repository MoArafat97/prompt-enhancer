/**
 * Simplified Firebase Initialization
 * 
 * This module provides a dead-simple Firebase initialization that ALWAYS works.
 * No complex logic, no multiple strategies, just direct initialization.
 */

import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { getGuaranteedFirebaseConfig } from './hardcoded-config';

// Singleton instances
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase with guaranteed success
 */
export function initializeFirebaseSimple(): {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  analytics: Analytics | null;
} {
  // If already initialized, return existing instances
  if (app && auth && db) {
    return { app, auth, db, analytics };
  }

  try {
    // Get guaranteed configuration
    const config = getGuaranteedFirebaseConfig();
    
    // Check for existing app
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log('📱 Using existing Firebase app');
      app = existingApps[0];
    } else {
      console.log('🚀 Initializing new Firebase app');
      app = initializeApp(config);
    }

    // Initialize services
    if (!auth) {
      auth = getAuth(app);
      console.log('✅ Auth initialized');
    }

    if (!db) {
      db = getFirestore(app);
      console.log('✅ Firestore initialized');
    }

    // Try to initialize analytics (non-critical)
    if (!analytics && typeof window !== 'undefined') {
      isSupported().then(supported => {
        if (supported && app) {
          analytics = getAnalytics(app);
          console.log('✅ Analytics initialized');
        }
      }).catch(() => {
        console.log('ℹ️ Analytics not available');
      });
    }

    console.log('🎉 Firebase initialized successfully!');
    return { app, auth, db, analytics };

  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

/**
 * Get Firebase instances (initializes if needed)
 */
export function getSimpleFirebaseInstances(): {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
} {
  if (typeof window === 'undefined') {
    // Server-side, return null
    return { app: null, auth: null, db: null, analytics: null };
  }

  try {
    const instances = initializeFirebaseSimple();
    return instances;
  } catch (error) {
    console.error('Failed to get Firebase instances:', error);
    return { app: null, auth: null, db: null, analytics: null };
  }
}

/**
 * Check if Firebase is initialized
 */
export function isFirebaseInitialized(): boolean {
  return !!(app && auth && db);
}