'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?auth=required&redirect=/dashboard/workspace');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-surface-secondary animate-pulse" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

