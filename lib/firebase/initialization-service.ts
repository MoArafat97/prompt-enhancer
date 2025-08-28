/**
 * Firebase Initialization Service - DEFINITIVE VERSION
 * 
 * This service provides a bulletproof initialization system that addresses:
 * - Environment variable access timing issues in Vercel
 * - Race conditions between module imports and runtime initialization
 * - Proper error handling and retry logic
 * - Guaranteed readiness before any Firebase operations
 */

import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface InitializationResult {
  success: boolean;
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
  error?: Error;
  retryCount: number;
  configValid: boolean;
}

class FirebaseInitializationService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private analytics: Analytics | null = null;
  private initializationPromise: Promise<InitializationResult> | null = null;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000; // ms

  /**
   * Get Firebase configuration with enhanced environment variable access
   * Handles Vercel build-time vs runtime differences and client-side bundling
   */
  private getFirebaseConfig(): { config: FirebaseConfig | null; errors: string[] } {
    const errors: string[] = [];
    const debugInfo: any = {};
    
    // Enhanced environment variable access with multiple fallback strategies
    const getEnvVar = (key: string): string | undefined => {
      let value: string | undefined;
      
      // Strategy 1: Direct process.env access (build-time)
      value = process.env[key];
      debugInfo[`${key}_strategy1`] = !!value;
      
      // Strategy 2: Runtime process.env access (Vercel edge functions)
      if (!value && typeof process !== 'undefined' && process.env) {
        try {
          value = process.env[key];
          debugInfo[`${key}_strategy2`] = !!value;
        } catch (e) {
          debugInfo[`${key}_strategy2_error`] = e;
        }
      }
      
      // Strategy 3: Client-side window injection (for runtime env vars)
      if (!value && typeof window !== 'undefined') {
        try {
          // @ts-ignore - Check for runtime environment injection
          value = (window as any).__FIREBASE_ENV__?.[key] || (window as any)._env?.[key];
          debugInfo[`${key}_strategy3`] = !!value;
        } catch (e) {
          debugInfo[`${key}_strategy3_error`] = e;
        }
      }
      
      // Strategy 4: Check for Next.js runtime config (if available)
      if (!value && typeof window !== 'undefined') {
        try {
          // @ts-ignore - Next.js runtime config
          const nextConfig = (window as any).__NEXT_DATA__?.props?.pageProps?.__NEXT_ENV__ || {};
          value = nextConfig[key];
          debugInfo[`${key}_strategy4`] = !!value;
        } catch (e) {
          debugInfo[`${key}_strategy4_error`] = e;
        }
      }
      
      debugInfo[`${key}_final_value`] = value ? `${value.substring(0, 10)}...` : 'MISSING';
      return value;
    };

    const config = {
      apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
      authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
      measurementId: getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'),
    };

    // Validate required fields
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      errors.push(`Missing required Firebase config: ${missingFields.join(', ')}`);
      return { config: null, errors };
    }

    // Check for placeholder values
    const placeholderValues = ['your_firebase_api_key', 'your_project_id', 'undefined', 'null'];
    const invalidFields = Object.entries(config).filter(([key, value]) => 
      value && placeholderValues.includes(value.toLowerCase())
    );
    
    if (invalidFields.length > 0) {
      errors.push(`Invalid placeholder values in Firebase config: ${invalidFields.map(([key]) => key).join(', ')}`);
      return { config: null, errors };
    }

    // Log debug information for troubleshooting
    if (typeof window !== 'undefined') {
      console.log('🔧 Firebase Config Debug Info:', debugInfo);
    }
    
    return { config: config as FirebaseConfig, errors };
  }

  /**
   * Initialize Firebase with enhanced error handling and logging
   */
  private async attemptInitialization(): Promise<InitializationResult> {
    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🔄 [${attemptId}] Firebase initialization attempt ${this.retryCount + 1}/${this.maxRetries + 1}`);
    
    // Log current environment state
    if (typeof window !== 'undefined') {
      console.log(`🌐 [${attemptId}] Client Environment:`, {
        userAgent: navigator.userAgent.substring(0, 50),
        url: window.location.href,
        timestamp: new Date().toISOString(),
        hasProcessEnv: typeof process !== 'undefined',
        processEnvKeys: typeof process !== 'undefined' ? Object.keys(process.env || {}).length : 0,
      });
    }
    
    // Server-side check with detailed logging
    if (typeof window === 'undefined') {
      console.log(`⚠️ [${attemptId}] Firebase initialization skipped on server side`);
      console.log(`📊 [${attemptId}] Server Environment:`, {
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV,
        hasFirebaseVars: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      });
      return {
        success: false,
        app: null,
        auth: null,
        db: null,
        analytics: null,
        error: new Error('Firebase initialization not supported on server side'),
        retryCount: this.retryCount,
        configValid: false,
      };
    }

    // Get configuration with detailed validation
    const { config, errors } = this.getFirebaseConfig();
    
    if (!config || errors.length > 0) {
      console.error(`❌ [${attemptId}] Firebase configuration invalid:`, {
        errors,
        hasConfig: !!config,
        envVarsAvailable: typeof process !== 'undefined' ? Object.keys(process.env || {}).filter(k => k.startsWith('NEXT_PUBLIC_FIREBASE')).length : 0,
        windowAvailable: typeof window !== 'undefined',
      });
      return {
        success: false,
        app: null,
        auth: null,
        db: null,
        analytics: null,
        error: new Error(`Firebase configuration invalid: ${errors.join(', ')}`),
        retryCount: this.retryCount,
        configValid: false,
      };
    }

    try {
      // Initialize or get existing app with enhanced logging
      const existingApps = getApps();
      console.log(`📱 [${attemptId}] Existing Firebase apps:`, existingApps.map(app => app.name));
      
      if (!existingApps.length) {
        console.log(`🚀 [${attemptId}] Initializing new Firebase app with config:`, {
          apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'MISSING',
          authDomain: config.authDomain,
          projectId: config.projectId,
          hasAppId: !!config.appId,
        });
        
        this.app = initializeApp(config);
        console.log(`✅ [${attemptId}] Firebase app initialized:`, this.app.name);
      } else {
        console.log(`🔄 [${attemptId}] Using existing Firebase app:`, existingApps[0].name);
        this.app = existingApps[0];
      }

      // Initialize Auth with detailed validation
      if (!this.auth && this.app) {
        console.log(`🔐 [${attemptId}] Initializing Firebase Auth...`);
        this.auth = getAuth(this.app);
        console.log(`✅ [${attemptId}] Firebase Auth initialized:`, {
          authDomain: this.auth.config.authDomain,
          apiKey: this.auth.config.apiKey ? `${this.auth.config.apiKey.substring(0, 10)}...` : 'MISSING',
        });
      }

      // Initialize Firestore with validation
      if (!this.db && this.app) {
        console.log(`🗄️ [${attemptId}] Initializing Firebase Firestore...`);
        this.db = getFirestore(this.app);
        console.log(`✅ [${attemptId}] Firebase Firestore initialized for project:`, this.db.app.options.projectId);
      }

      // Initialize Analytics (optional)
      if (!this.analytics && this.app) {
        try {
          const supported = await isSupported();
          if (supported) {
            this.analytics = getAnalytics(this.app);
            console.log('✅ Firebase Analytics initialized');
          } else {
            console.log('ℹ️ Firebase Analytics not supported in this environment');
          }
        } catch (analyticsError) {
          console.warn('⚠️ Firebase Analytics initialization failed:', analyticsError);
          // Analytics failure is not critical
        }
      }

      const result: InitializationResult = {
        success: true,
        app: this.app,
        auth: this.auth,
        db: this.db,
        analytics: this.analytics,
        retryCount: this.retryCount,
        configValid: true,
      };

      console.log(`🎉 [${attemptId}] Firebase initialization completed successfully:`, {
        hasApp: !!this.app,
        hasAuth: !!this.auth,
        hasDb: !!this.db,
        hasAnalytics: !!this.analytics,
        appName: this.app?.name,
        authDomain: this.auth?.config?.authDomain,
        projectId: this.db?.app?.options?.projectId,
      });
      return result;

    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      
      // Reset instances on failure
      this.app = null;
      this.auth = null;
      this.db = null;
      this.analytics = null;
      
      return {
        success: false,
        app: null,
        auth: null,
        db: null,
        analytics: null,
        error: error as Error,
        retryCount: this.retryCount,
        configValid: true, // Config was valid, but initialization failed
      };
    }
  }

  /**
   * Initialize Firebase with automatic retry
   */
  async initialize(): Promise<InitializationResult> {
    // Return existing initialization promise if in progress
    if (this.initializationPromise) {
      console.log('🔄 Firebase initialization already in progress, waiting...');
      return this.initializationPromise;
    }

    // If already successfully initialized, return current state
    if (this.app && this.auth && this.db) {
      console.log('✅ Firebase already initialized');
      return {
        success: true,
        app: this.app,
        auth: this.auth,
        db: this.db,
        analytics: this.analytics,
        retryCount: this.retryCount,
        configValid: true,
      };
    }

    this.initializationPromise = (async () => {
      let lastResult: InitializationResult | null = null;
      
      for (this.retryCount = 0; this.retryCount <= this.maxRetries; this.retryCount++) {
        if (this.retryCount > 0) {
          console.log(`⏳ Waiting ${this.retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          this.retryDelay *= 2; // Exponential backoff
        }

        lastResult = await this.attemptInitialization();
        
        if (lastResult.success) {
          this.initializationPromise = null; // Reset promise
          return lastResult;
        }

        // If config is invalid, don't retry
        if (!lastResult.configValid) {
          console.log('❌ Configuration invalid, aborting retries');
          break;
        }

        console.log(`❌ Initialization attempt ${this.retryCount + 1} failed, ${this.maxRetries - this.retryCount} retries remaining`);
      }

      this.initializationPromise = null; // Reset promise
      return lastResult!;
    })();

    return this.initializationPromise;
  }

  /**
   * Force re-initialization (useful for debugging)
   */
  async reinitialize(): Promise<InitializationResult> {
    console.log('🔄 Forcing Firebase re-initialization...');
    
    // Reset state
    this.app = null;
    this.auth = null;
    this.db = null;
    this.analytics = null;
    this.initializationPromise = null;
    this.retryCount = 0;
    this.retryDelay = 1000;
    
    return this.initialize();
  }

  /**
   * Get current Firebase instances
   */
  getInstances() {
    return {
      app: this.app,
      auth: this.auth,
      db: this.db,
      analytics: this.analytics,
      isInitialized: !!(this.app && this.auth && this.db),
    };
  }

  /**
   * Get initialization status
   */
  getStatus() {
    const { config, errors } = this.getFirebaseConfig();
    
    return {
      isConfigValid: !!config && errors.length === 0,
      isInitialized: !!(this.app && this.auth && this.db),
      hasApp: !!this.app,
      hasAuth: !!this.auth,
      hasDb: !!this.db,
      hasAnalytics: !!this.analytics,
      retryCount: this.retryCount,
      configErrors: errors,
      isInitializing: !!this.initializationPromise,
    };
  }
}

// Create singleton instance
export const firebaseInitService = new FirebaseInitializationService();

// Export convenience functions
export const initializeFirebase = () => firebaseInitService.initialize();
export const reinitializeFirebase = () => firebaseInitService.reinitialize();
export const getFirebaseInstances = () => firebaseInitService.getInstances();
export const getFirebaseInitStatus = () => firebaseInitService.getStatus();