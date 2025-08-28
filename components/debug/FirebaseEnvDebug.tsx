'use client';

import { useEffect, useState } from 'react';
import { getFirebaseStatus } from '@/lib/firebase/config';

export default function FirebaseEnvDebug() {
  const [status, setStatus] = useState<any>(null);
  const [envDebug, setEnvDebug] = useState<any>(null);

  useEffect(() => {
    // Get Firebase status
    const firebaseStatus = getFirebaseStatus();
    setStatus(firebaseStatus);

    // Fetch environment debug info
    fetch('/api/debug/env')
      .then(res => res.json())
      .then(data => setEnvDebug(data))
      .catch(err => console.error('Failed to fetch env debug:', err));
  }, []);

  if (!status) {
    return <div>Loading Firebase debug info...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Firebase Environment Debug</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Configuration Status</h3>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {JSON.stringify({
              isConfigured: status.isConfigured,
              configValid: status.configValid,
              configErrors: status.configErrors,
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Service Status</h3>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {JSON.stringify(status.service, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Environment Info</h3>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {JSON.stringify(status.environment, null, 2)}
          </pre>
        </div>

        {envDebug && (
          <div>
            <h3 className="font-semibold">Server Environment Debug</h3>
            <pre className="bg-white p-2 rounded text-sm overflow-auto">
              {JSON.stringify(envDebug, null, 2)}
            </pre>
          </div>
        )}

        <div>
          <h3 className="font-semibold">Client-side Environment Variables</h3>
          <pre className="bg-white p-2 rounded text-sm overflow-auto">
            {JSON.stringify({
              NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING',
              NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING',
              NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
              NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'SET' : 'MISSING',
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
