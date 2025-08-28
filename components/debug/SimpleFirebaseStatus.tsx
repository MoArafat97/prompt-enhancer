'use client';

import React, { useEffect, useState } from 'react';
import { isFirebaseConfigured, ensureFirebaseClient, getFirebaseInstances } from '@/lib/firebase/config';

interface FirebaseStatus {
  isConfigured: boolean;
  authInitialized: boolean;
  dbInitialized: boolean;
  envVarsStatus: Record<string, boolean>;
  errors: string[];
}

export function SimpleFirebaseStatus() {
  const [status, setStatus] = useState<FirebaseStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const envVars = {
        'API_KEY': !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        'AUTH_DOMAIN': !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        'PROJECT_ID': !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        'STORAGE_BUCKET': !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        'MESSAGING_SENDER_ID': !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        'APP_ID': !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const errors: string[] = [];
      
      // Get current Firebase instances first
      const instances = getFirebaseInstances();
      
      if (!isFirebaseConfigured()) {
        errors.push('Firebase not configured');
      }
      
      if (!instances.auth) {
        errors.push('Auth not initialized');
      }
      
      if (!instances.db) {
        errors.push('Firestore not initialized');
      }

      Object.entries(envVars).forEach(([key, exists]) => {
        if (!exists) {
          errors.push(`Missing ${key}`);
        }
      });
      
      setStatus({
        isConfigured: isFirebaseConfigured(),
        authInitialized: !!instances.auth,
        dbInitialized: !!instances.db,
        envVarsStatus: envVars,
        errors,
      });
    };

    checkStatus();
  }, []);

  if (!status) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-mono"
      >
        Firebase Status {status.errors.length > 0 ? '❌' : '✅'}
      </button>

      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg min-w-80 max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-2 text-sm">Firebase Status</h3>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Configured:</span>
              <span className={status.isConfigured ? 'text-green-600' : 'text-red-600'}>
                {status.isConfigured ? '✅' : '❌'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Auth:</span>
              <span className={status.authInitialized ? 'text-green-600' : 'text-red-600'}>
                {status.authInitialized ? '✅' : '❌'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Firestore:</span>
              <span className={status.dbInitialized ? 'text-green-600' : 'text-red-600'}>
                {status.dbInitialized ? '✅' : '❌'}
              </span>
            </div>

            <hr className="my-2" />
            
            <div className="text-xs">
              <div className="font-semibold mb-1">Environment Variables:</div>
              {Object.entries(status.envVarsStatus).map(([key, exists]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span className={exists ? 'text-green-600' : 'text-red-600'}>
                    {exists ? '✅' : '❌'}
                  </span>
                </div>
              ))}
            </div>

            {status.errors.length > 0 && (
              <>
                <hr className="my-2" />
                <div className="text-xs">
                  <div className="font-semibold mb-1 text-red-600">Errors:</div>
                  {status.errors.map((error, index) => (
                    <div key={index} className="text-red-600">• {error}</div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
