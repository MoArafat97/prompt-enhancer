'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  isFirebaseConfigured, 
  ensureFirebaseClient, 
  getFirebaseStatus, 
  reinitializeFirebase,
  getFirebaseInstances 
} from '@/lib/firebase/config';
import { signInWithGoogle } from '@/lib/firebase/auth';

interface TestResult {
  step: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  data?: any;
  timestamp: string;
}

export function FirebaseInitializationTest() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (step: string, status: TestResult['status'], message: string, data?: any) => {
    const result: TestResult = {
      step,
      status,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    
    setResults(prev => {
      const existing = prev.findIndex(r => r.step === step);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      // Step 1: Configuration Check
      addResult('config-check', 'running', 'Checking Firebase configuration...');
      const configValid = isFirebaseConfigured();
      const status = await getFirebaseStatus();
      
      if (configValid) {
        addResult('config-check', 'success', 'Firebase configuration is valid', status);
      } else {
        addResult('config-check', 'error', 'Firebase configuration is invalid', status);
      }

      // Step 2: Environment Variables Check
      addResult('env-vars', 'running', 'Checking environment variables...');
      const envVars = {
        NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };
      
      const missingVars = Object.entries(envVars).filter(([key, exists]) => !exists);
      if (missingVars.length === 0) {
        addResult('env-vars', 'success', 'All required environment variables are present', envVars);
      } else {
        addResult('env-vars', 'error', `Missing environment variables: ${missingVars.map(([key]) => key).join(', ')}`, envVars);
      }

      // Step 3: Firebase Client Initialization
      addResult('init-client', 'running', 'Initializing Firebase client...');
      const initSuccess = await ensureFirebaseClient();
      const postInitStatus = await getFirebaseStatus();
      
      if (initSuccess) {
        addResult('init-client', 'success', 'Firebase client initialized successfully', postInitStatus);
      } else {
        addResult('init-client', 'error', 'Firebase client initialization failed', postInitStatus);
      }

      // Step 4: Service Instances Check
      addResult('instances-check', 'running', 'Checking Firebase service instances...');
      const instances = getFirebaseInstances();
      const instancesValid = instances.app && instances.auth && instances.db;
      
      if (instancesValid) {
        addResult('instances-check', 'success', 'All Firebase service instances are available', {
          app: !!instances.app,
          auth: !!instances.auth,
          db: !!instances.db,
          analytics: !!instances.analytics,
          appName: instances.app?.name,
          authDomain: instances.auth?.config?.authDomain,
          projectId: instances.db?.app?.options?.projectId,
        });
      } else {
        addResult('instances-check', 'error', 'Some Firebase service instances are missing', {
          app: !!instances.app,
          auth: !!instances.auth,
          db: !!instances.db,
          analytics: !!instances.analytics,
        });
      }

      // Step 5: Auth Configuration Check
      if (instances.auth) {
        addResult('auth-config', 'running', 'Checking Firebase Auth configuration...');
        const authConfig = {
          authDomain: instances.auth.config?.authDomain,
          apiKey: instances.auth.config?.apiKey ? `${instances.auth.config.apiKey.substring(0, 10)}...` : 'MISSING',
          currentUser: instances.auth.currentUser?.email || null,
        };
        addResult('auth-config', 'success', 'Firebase Auth configuration is valid', authConfig);
      }

      // Final Status
      const finalStatus = await getFirebaseStatus();
      const allPassed = configValid && initSuccess && instancesValid;
      
      if (allPassed) {
        addResult('overall', 'success', 'All Firebase initialization tests passed!', finalStatus);
      } else {
        addResult('overall', 'error', 'Some Firebase initialization tests failed', finalStatus);
      }

    } catch (error) {
      addResult('test-error', 'error', `Test execution failed: ${error}`, error);
    } finally {
      setIsRunning(false);
    }
  };

  const testGoogleSignIn = async () => {
    addResult('google-signin', 'running', 'Testing Google Sign-In...');
    
    try {
      await signInWithGoogle();
      addResult('google-signin', 'success', 'Google Sign-In test completed successfully');
    } catch (error: any) {
      addResult('google-signin', 'error', `Google Sign-In test failed: ${error.message}`, error);
    }
  };

  const forceReinitialize = async () => {
    addResult('reinitialize', 'running', 'Forcing Firebase re-initialization...');
    
    try {
      const success = await reinitializeFirebase();
      if (success) {
        addResult('reinitialize', 'success', 'Firebase re-initialization successful');
      } else {
        addResult('reinitialize', 'error', 'Firebase re-initialization failed');
      }
    } catch (error: any) {
      addResult('reinitialize', 'error', `Re-initialization error: ${error.message}`, error);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'running': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        <Button 
          onClick={runComprehensiveTest} 
          disabled={isRunning}
          variant="default"
        >
          {isRunning ? '🔄 Running Tests...' : '🔍 Run Comprehensive Test'}
        </Button>
        
        <Button 
          onClick={testGoogleSignIn} 
          disabled={isRunning}
          variant="outline"
        >
          🔐 Test Google Sign-In
        </Button>
        
        <Button 
          onClick={forceReinitialize} 
          disabled={isRunning}
          variant="outline"
        >
          🔄 Force Re-initialize
        </Button>
        
        <Button 
          onClick={() => setResults([])} 
          disabled={isRunning}
          variant="outline"
        >
          🗑️ Clear Results
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Results</h3>
          
          {results.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getStatusIcon(result.status)}</span>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {result.step.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className={`text-sm ${getStatusColor(result.status)}`}>
                      {result.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mt-1">{result.message}</p>
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                        Show Details
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && !isRunning && (
        <Card className="p-6 text-center">
          <p className="text-gray-400">
            Run the comprehensive test to check Firebase initialization status
          </p>
        </Card>
      )}
    </div>
  );
}