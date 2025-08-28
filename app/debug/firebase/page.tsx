'use client';

import React, { useEffect, useState } from 'react';
import { isFirebaseConfigured, getFirebaseStatus, ensureFirebaseClient } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { FirebaseInitializationTest } from '@/components/debug/FirebaseInitializationTest';

interface FirebaseStatus {
  isConfigured: boolean;
  authInitialized: boolean;
  dbInitialized: boolean;
  envVars: Record<string, string | undefined>;
  errors: string[];
  windowDefined: boolean;
  userAgent: string;
}

export default function FirebaseDebugPage() {
  const [status, setStatus] = useState<FirebaseStatus | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { signInWithGoogle, user } = useAuth();

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      const envVars = {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      const errors: string[] = [];

      // Check if environment variables are set
      Object.entries(envVars).forEach(([key, value]) => {
        if (!value || value === 'your_firebase_api_key' || value === 'your_project_id') {
          errors.push(`Missing or invalid ${key}`);
        }
      });

      // Check Firebase configuration using new system
      const configured = isFirebaseConfigured();
      if (!configured) {
        errors.push('Firebase configuration is incomplete');
      }

      // Try to initialize Firebase to get service status
      let authInitialized = false;
      let dbInitialized = false;
      
      try {
        await ensureFirebaseClient();
        const fullStatus = getFirebaseStatus();
        authInitialized = fullStatus.service.instances.hasAuth;
        dbInitialized = fullStatus.service.instances.hasDb;
      } catch (error) {
        errors.push(`Firebase initialization failed: ${error}`);
      }

      setStatus({
        isConfigured: configured,
        authInitialized,
        dbInitialized,
        envVars,
        errors,
        windowDefined: typeof window !== 'undefined',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      });
    };

    checkFirebaseStatus();
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGoogleSignIn = async () => {
    try {
      addTestResult('Starting Google sign-in test via AuthContext...');
      await signInWithGoogle();
      addTestResult('✅ Google sign-in successful via AuthContext');
    } catch (error: any) {
      addTestResult(`❌ Google sign-in error: ${error.message || error}`);
      console.error('Google sign-in error:', error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (!status) {
    return (
      <div className="min-h-screen bg-background text-text-primary p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Firebase Debug</h1>
          <div>Loading Firebase status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Debug Information</h1>
        
        {/* Current User */}
        <div className="bg-surface-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Display Name:</strong> {user.displayName || 'Not set'}</p>
              <p><strong>UID:</strong> {user.uid}</p>
              <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
            </div>
          ) : (
            <p>No user signed in</p>
          )}
        </div>

        {/* Firebase Status */}
        <div className="bg-surface-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <strong>Configuration Status:</strong>
              <span className={status.isConfigured ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                {status.isConfigured ? '✓ Configured' : '✗ Not Configured'}
              </span>
            </div>

            <div>
              <strong>Auth Initialized:</strong>
              <span className={status.authInitialized ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                {status.authInitialized ? '✓ Yes' : '✗ No'}
              </span>
            </div>

            <div>
              <strong>Firestore Initialized:</strong>
              <span className={status.dbInitialized ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                {status.dbInitialized ? '✓ Yes' : '✗ No'}
              </span>
            </div>

            <div>
              <strong>Window Defined:</strong>
              <span className={status.windowDefined ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                {status.windowDefined ? '✓ Yes' : '✗ No (SSR)'}
              </span>
            </div>
          </div>

          {status.errors.length > 0 && (
            <div className="mb-4">
              <strong className="text-red-400">Errors:</strong>
              <ul className="list-disc list-inside text-red-400 mt-2">
                {status.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <strong>User Agent:</strong>
            <p className="text-sm text-text-muted mt-1 break-all">{status.userAgent}</p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-surface-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(status.envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-mono text-sm">{key}:</span>
                <span className={value ? 'text-green-400' : 'text-red-400'}>
                  {value ? `✓ Set (${value.substring(0, 20)}...)` : '✗ Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Test Buttons */}
        <div className="bg-surface-secondary rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Authentication Test</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <Button
              onClick={testGoogleSignIn}
              disabled={!status.authInitialized}
              variant="outline"
            >
              Test Google Sign-In (AuthContext)
            </Button>
            
            <Button
              onClick={clearResults}
              variant="outline"
            >
              Clear Results
            </Button>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-surface-primary rounded p-4">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <div className="space-y-1 text-sm font-mono">
                {testResults.map((result, index) => (
                  <div key={index} className="text-text-muted">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comprehensive Firebase Initialization Test */}
        <div className="bg-surface-secondary rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Comprehensive Firebase Testing</h2>
          <FirebaseInitializationTest />
        </div>
      </div>
    </div>
  );
}