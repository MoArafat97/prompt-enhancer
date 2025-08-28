'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ConfigResult {
  source: string;
  config: any;
  errors: string[];
  timestamp: string;
}

export default function FirebaseEnvDebug() {
  const [results, setResults] = useState<ConfigResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testDirectEnvAccess = () => {
    const result: ConfigResult = {
      source: 'Direct Environment Access',
      config: {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      },
      errors: [],
      timestamp: new Date().toISOString(),
    };

    // Check what's missing
    const missing = Object.entries(result.config)
      .filter(([key, value]) => !value || value === 'undefined')
      .map(([key]) => key);
    
    if (missing.length > 0) {
      result.errors.push(`Missing vars: ${missing.join(', ')}`);
    }

    console.log('Direct env access result:', result);
    setResults(prev => [result, ...prev.slice(0, 4)]);
  };

  const testAPIFetch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/firebase-config');
      const data = await response.json();
      
      const result: ConfigResult = {
        source: 'API Endpoint',
        config: data.config || {},
        errors: data.success ? [] : [data.error || 'API call failed'],
        timestamp: new Date().toISOString(),
      };

      if (!response.ok) {
        result.errors.push(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('API fetch result:', result);
      setResults(prev => [result, ...prev.slice(0, 4)]);
    } catch (error) {
      const result: ConfigResult = {
        source: 'API Endpoint',
        config: {},
        errors: [`Fetch error: ${error}`],
        timestamp: new Date().toISOString(),
      };
      setResults(prev => [result, ...prev.slice(0, 4)]);
    }
    setIsLoading(false);
  };

  const testConfigFetcher = async () => {
    setIsLoading(true);
    try {
      // Dynamically import the config fetcher
      const { getFirebaseConfig, validateConfig } = await import('@/lib/firebase/config-fetcher');
      const { config, source, errors } = await getFirebaseConfig();
      
      let finalErrors = [...errors];
      if (config) {
        const validation = validateConfig(config);
        if (!validation.isValid) {
          finalErrors.push(...validation.errors);
        }
      }

      const result: ConfigResult = {
        source: `Config Fetcher (${source})`,
        config: config || {},
        errors: finalErrors,
        timestamp: new Date().toISOString(),
      };

      console.log('Config fetcher result:', result);
      setResults(prev => [result, ...prev.slice(0, 4)]);
    } catch (error) {
      const result: ConfigResult = {
        source: 'Config Fetcher',
        config: {},
        errors: [`Import/execution error: ${error}`],
        timestamp: new Date().toISOString(),
      };
      setResults(prev => [result, ...prev.slice(0, 4)]);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Auto-test on mount
  useEffect(() => {
    testDirectEnvAccess();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={testDirectEnvAccess}
          variant="outline"
          size="sm"
        >
          Test Direct Env
        </Button>
        
        <Button
          onClick={testAPIFetch}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Test API Fetch
        </Button>
        
        <Button
          onClick={testConfigFetcher}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Test Config Fetcher
        </Button>
        
        <Button
          onClick={clearResults}
          variant="outline"
          size="sm"
        >
          Clear
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{result.source}</h4>
                <span className="text-xs text-gray-400">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {result.errors.length > 0 && (
                <div className="mb-2">
                  <span className="text-red-400 text-sm">Errors:</span>
                  <ul className="text-red-300 text-sm ml-4">
                    {result.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="text-sm">
                <span className="text-gray-300">Config Preview:</span>
                <div className="mt-1 space-y-1">
                  {Object.entries(result.config).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400 font-mono text-xs">{key}:</span>
                      <span className={`text-xs ${value ? 'text-green-400' : 'text-red-400'}`}>
                        {value 
                          ? `${String(value).substring(0, 15)}...` 
                          : 'MISSING'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && (
        <Card className="p-4 text-center text-gray-400">
          No test results yet. Click a test button to start.
        </Card>
      )}
    </div>
  );
}