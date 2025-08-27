'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndexPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to history (saved prompts) instead of workspace
    router.replace('/dashboard/history');
  }, [router]);
  return null;
}

