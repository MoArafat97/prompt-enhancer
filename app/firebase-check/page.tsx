'use client';

import React, { useEffect, useState } from 'react';
import { getFirebaseStatus, reinitializeFirebase } from '@/lib/firebase/config';
import { firebaseInitService } from '@/lib/firebase/initialization-service';
import { Button } from '@/components/ui/button';

interface EnvCheck {
  key: string;
  value: string | undefined;
  exists: boolean;
  isPlaceholder: boolean;
}

interface ServerDiagnostic {
  environment: string;
  platform?: {
    isVercel: boolean;
    vercelEnv: string;
    region: string;
  };
  envVars: Record<string, any>;
  requiredVarsPresent: boolean;
}

export default function FirebaseCheckPage() {
  const [envChecks, setEnvChecks] = useState<EnvCheck[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState<any>(null);
  const [serverDiagnostic, setServerDiagnostic] = useState<ServerDiagnostic | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      // Get Firebase status
      const status = await getFirebaseStatus();
      setFirebaseStatus(status);

      // Fetch server diagnostic
      try {
        const response = await fetch('/api/debug/firebase?token=debug123');
        if (response.ok) {
          const serverData = await response.json();
          setServerDiagnostic(serverData);
        }
      } catch (error) {
        console.warn('Failed to fetch server diagnostic:', error);
      }
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReinitialize = async () => {
    setLoading(true);
    try {
      console.log('🔄 Forcing Firebase re-initialization...');
      await firebaseInitService.reinitialize();
      await runDiagnostic();
    } catch (error) {
      console.error('Reinitialization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    
    const firebaseEnvVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
      'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    ];

    const checks = firebaseEnvVars.map(key => {
      const value = process.env[key];
      return {
        key,
        value,
        exists: !!value,
        isPlaceholder: value === 'your_firebase_api_key' || value === 'your_project_id',
      };
    });

    setEnvChecks(checks);
    
    // Run initial diagnostic
    runDiagnostic();
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  const allConfigured = envChecks.every(check => check.exists && !check.isPlaceholder);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🔧 Firebase Diagnostics
          </h1>
          <div className="space-x-4">
            <Button onClick={runDiagnostic} disabled={loading}>
              {loading ? 'Running...' : '🔄 Refresh'}
            </Button>
            <Button onClick={handleReinitialize} variant="outline" disabled={loading}>
              🔄 Reinitialize Firebase
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Overall Status: 
            </h2>
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
              allConfigured 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {allConfigured ? '✅ All Configured' : '❌ Missing Configuration'}
            </span>
          </div>

          <div className="space-y-4">
            {envChecks.map((check) => (
              <div key={check.key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {check.key}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    check.exists && !check.isPlaceholder
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {check.exists && !check.isPlaceholder ? 'OK' : 'MISSING'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {check.exists ? (
                    check.isPlaceholder ? (
                      <span className="text-red-600 dark:text-red-400">
                        ⚠️ Placeholder value detected: {check.value}
                      </span>
                    ) : (
                      <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {check.value?.substring(0, 20)}...
                      </span>
                    )
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      ❌ Not set
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Instructions
          </h2>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-medium mb-2">If you&apos;re seeing missing variables:</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Go to your <a href="https://vercel.com/dashboard" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Vercel Dashboard</a></li>
                <li>Select your project</li>
                <li>Go to Settings → Environment Variables</li>
                <li>Add all the missing Firebase environment variables</li>
                <li>Make sure to set them for Production, Preview, and Development</li>
                <li>Redeploy your application</li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">Your Firebase values should be:</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded font-mono text-sm">
                <div>NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB49CP9P1zU_EmxM7Pxerjf9PQEPynnnms</div>
                <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=prompt-enhancer-4636b.firebaseapp.com</div>
                <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=prompt-enhancer-4636b</div>
                <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=prompt-enhancer-4636b.firebasestorage.app</div>
                <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=27112504451</div>
                <div>NEXT_PUBLIC_FIREBASE_APP_ID=1:27112504451:web:b65ba67d8549d2ee486fb6</div>
                <div>NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-C6X317PW42</div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Important Notes:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>These are public Firebase config values (safe to expose)</li>
                <li>Make sure to set them in Vercel for all environments</li>
                <li>After adding variables, trigger a new deployment</li>
                <li>Google OAuth has been temporarily disabled until you configure it</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
