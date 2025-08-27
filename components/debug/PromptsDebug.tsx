'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Loader2, Bug, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DebugInfo {
  isAuthenticated: boolean;
  userId: string | null;
  promptsCount: number;
  rawPrompts: any[];
  error: string | null;
  firestoreConnection: boolean;
}

export function PromptsDebug() {
  const { user } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    const info: DebugInfo = {
      isAuthenticated: !!user,
      userId: user?.uid || null,
      promptsCount: 0,
      rawPrompts: [],
      error: null,
      firestoreConnection: false,
    };

    try {
      // Test Firestore connection
      const testQuery = query(collection(db, 'prompts'), where('userId', '==', user?.uid || 'test'));
      const snapshot = await getDocs(testQuery);
      info.firestoreConnection = true;
      info.promptsCount = snapshot.size;
      
      // Get raw data
      snapshot.forEach((doc) => {
        info.rawPrompts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

    } catch (error) {
      info.error = error instanceof Error ? error.message : 'Unknown error';
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    if (user && showDebug) {
      runDebug();
    }
  }, [user, showDebug]);

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowDebug(true)}
          size="sm"
          variant="outline"
          className="bg-surface-primary border-surface-tertiary"
        >
          <Bug className="w-4 h-4 mr-2" />
          Debug Prompts
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-primary border border-surface-tertiary rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary flex items-center">
            <Bug className="w-5 h-5 mr-2" />
            Prompts Debug Information
          </h2>
          <Button
            onClick={() => setShowDebug(false)}
            size="sm"
            variant="outline"
          >
            Close
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Running diagnostics...</span>
          </div>
        ) : debugInfo ? (
          <div className="space-y-4">
            {/* Authentication Status */}
            <div className="flex items-center space-x-2">
              {debugInfo.isAuthenticated ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-error" />
              )}
              <span className="font-medium">Authentication:</span>
              <span className={debugInfo.isAuthenticated ? 'text-success' : 'text-error'}>
                {debugInfo.isAuthenticated ? 'Authenticated' : 'Not authenticated'}
              </span>
            </div>

            {/* User ID */}
            {debugInfo.userId && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">User ID:</span>
                <code className="text-sm bg-surface-secondary px-2 py-1 rounded">
                  {debugInfo.userId}
                </code>
              </div>
            )}

            {/* Firestore Connection */}
            <div className="flex items-center space-x-2">
              {debugInfo.firestoreConnection ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <XCircle className="w-5 h-5 text-error" />
              )}
              <span className="font-medium">Firestore Connection:</span>
              <span className={debugInfo.firestoreConnection ? 'text-success' : 'text-error'}>
                {debugInfo.firestoreConnection ? 'Connected' : 'Failed'}
              </span>
            </div>

            {/* Prompts Count */}
            <div className="flex items-center space-x-2">
              {debugInfo.promptsCount > 0 ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning" />
              )}
              <span className="font-medium">Saved Prompts:</span>
              <span className="text-text-primary font-bold">
                {debugInfo.promptsCount} found
              </span>
            </div>

            {/* Error */}
            {debugInfo.error && (
              <div className="p-3 bg-error/10 border border-error/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-error">Error:</p>
                    <p className="text-sm text-text-secondary">{debugInfo.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Raw Data Preview */}
            {debugInfo.rawPrompts.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-text-primary">Sample Prompts:</h3>
                <div className="bg-surface-secondary p-3 rounded-lg max-h-40 overflow-auto">
                  <pre className="text-xs text-text-secondary">
                    {JSON.stringify(debugInfo.rawPrompts.slice(0, 2), null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
              <h3 className="font-medium text-brand-primary mb-2">Recommendations:</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                {!debugInfo.isAuthenticated && (
                  <li>• Please sign in to view your saved prompts</li>
                )}
                {debugInfo.isAuthenticated && debugInfo.promptsCount === 0 && (
                  <li>• No prompts found. Try enhancing and saving a prompt first</li>
                )}
                {debugInfo.error && (
                  <li>• Check your internet connection and Firebase configuration</li>
                )}
                {debugInfo.firestoreConnection && debugInfo.promptsCount > 0 && (
                  <li>• ✅ Everything looks good! Your prompts should be visible</li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button onClick={runDebug} size="sm" disabled={loading}>
                <Bug className="w-4 h-4 mr-2" />
                Re-run Debug
              </Button>
              {debugInfo.isAuthenticated && debugInfo.promptsCount === 0 && (
                <Button 
                  onClick={() => window.location.href = '/dashboard/workspace'} 
                  size="sm" 
                  variant="outline"
                >
                  Create First Prompt
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Button onClick={runDebug}>
              <Bug className="w-4 h-4 mr-2" />
              Start Debug
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
