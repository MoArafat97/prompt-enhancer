'use client';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';

interface ClientAuthProviderProps {
  children: React.ReactNode;
}

export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
