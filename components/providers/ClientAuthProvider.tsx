'use client';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { ensureFirebaseClient, isFirebaseConfigured } from '@/lib/firebase/config';

interface ClientAuthProviderProps {
  children: React.ReactNode;
}

export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Proactively initialize Firebase client SDK on the browser
    if (typeof window !== 'undefined' && isFirebaseConfigured) {
      try {
        ensureFirebaseClient();
      } catch (e) {
        console.warn('Failed to ensure Firebase client on mount:', e);
      }
    }
  }, []);

  // During SSR, render children without AuthProvider to avoid Firebase issues
  if (!isClient) {
    return <>{children}</>;
  }

  // On client side, wrap with AuthProvider
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
