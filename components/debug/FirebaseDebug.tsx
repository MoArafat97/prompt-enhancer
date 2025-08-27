'use client';

import React, { useEffect, useState } from 'react';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';

interface FirebaseStatus {
  isConfigured: boolean;
  authInitialized: boolean;
  dbInitialized: boolean;
  envVars: Record<string, string | undefined>;
  errors: string[];
}

export function FirebaseDebug() {
  const [status, setStatus] = useState<FirebaseStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkFirebaseStatus = () => {
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

      // Check Firebase initialization
      if (!isFirebaseConfigured) {
        errors.push('Firebase configuration is incomplete');
      }

      if (!auth) {
        errors.push('Firebase Auth not initialized');
      }

      if (!db) {
        errors.push('Firebase Firestore not initialized');
      }

      setStatus({
        isConfigured: isFirebaseConfigured,
        authInitialized: !!auth,
        dbInitialized: !!db,
        envVars,
        errors,
      });
    };

    checkFirebaseStatus();
  }, []);

  const testGoogleSignIn = async () => {
    try {
      if (!auth) {
        console.error('Firebase Auth not initialized');
        return;
      }

      // Import dynamically to avoid SSR issues
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      
      console.log('Attempting Google sign-in...');
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in successful:', result.user);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  if (!status) {
    return <div>Loading Firebase status...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className="mb-2"
      >
        🔧 Firebase Debug
      </Button>

      {isVisible && (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-md max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-2">Firebase Debug Info</h3>
          
          <div className="space-y-2 text-sm">
            <div>
              <strong>Configuration Status:</strong>
              <span className={status.isConfigured ? 'text-green-600' : 'text-red-600'}>
                {status.isConfigured ? ' ✓ Configured' : ' ✗ Not Configured'}
              </span>
            </div>

            <div>
              <strong>Auth Initialized:</strong>
              <span className={status.authInitialized ? 'text-green-600' : 'text-red-600'}>
                {status.authInitialized ? ' ✓ Yes' : ' ✗ No'}
              </span>
            </div>

            <div>
              <strong>Firestore Initialized:</strong>
              <span className={status.dbInitialized ? 'text-green-600' : 'text-red-600'}>
                {status.dbInitialized ? ' ✓ Yes' : ' ✗ No'}
              </span>
            </div>

            {status.errors.length > 0 && (
              <div>
                <strong className="text-red-600">Errors:</strong>
                <ul className="list-disc list-inside text-red-600">
                  {status.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <strong>Environment Variables:</strong>
              <div className="mt-1 space-y-1">
                {Object.entries(status.envVars).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-mono">{key}:</span>
                    <span className={value ? 'text-green-600' : 'text-red-600'}>
                      {value ? ` ✓ Set (${value.substring(0, 10)}...)` : ' ✗ Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t">
              <Button
                onClick={testGoogleSignIn}
                size="sm"
                disabled={!status.authInitialized}
                className="w-full"
              >
                Test Google Sign-In
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
