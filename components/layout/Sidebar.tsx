"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSavedPrompts } from '@/lib/hooks/useSavedPrompts';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, Settings, LogOut, User as UserIcon, FileText, BookOpen } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, userProfile, signOut } = useAuth();
  const { prompts } = useSavedPrompts({ realtime: true, limit: 10 });

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <aside className="h-screen sticky top-0 w-72 shrink-0 border-r border-border/50 bg-background/70 backdrop-blur-sm hidden lg:flex flex-col">
      {/* Profile */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
            {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary line-clamp-1">{userProfile?.displayName || 'User'}</div>
            <div className="text-xs text-text-muted line-clamp-1">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3 space-y-1">
        <Link href="/dashboard/workspace" className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/dashboard/workspace') ? 'bg-surface-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'}`}>
          <FileText className="w-4 h-4" />
          <span>Workspace</span>
        </Link>
        <Link href="/dashboard/history" className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/dashboard/history') ? 'bg-surface-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'}`}>
          <Clock className="w-4 h-4" />
          <span>Prompt History</span>
        </Link>
        <Link href="/blog" className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/blog') ? 'bg-surface-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'}`}>
          <BookOpen className="w-4 h-4" />
          <span>Blog</span>
        </Link>
        <Link href="/settings" className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive('/settings') ? 'bg-surface-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'}`}>
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Recent Prompts */}
      <div className="px-3 py-2 border-t border-border/50">
        <div className="text-xs uppercase tracking-wide text-text-muted mb-2">Recent</div>
        <div className="space-y-1">
          {prompts.slice(0, 8).map((p) => (
            <Link key={p.id} href="/dashboard/history" className="group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-tertiary">
              <div className="w-6 h-6 rounded bg-surface-tertiary flex items-center justify-center text-text-muted">
                <FileText className="w-3 h-3" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-text-primary truncate">{p.title}</div>
                <div className="text-[10px] text-text-muted">{new Date((p.createdAt as any)?.toDate ? (p.createdAt as any).toDate() : Date.now()).toLocaleString()}</div>
              </div>
            </Link>
          ))}
          {prompts.length === 0 && (
            <div className="text-xs text-text-muted px-3 py-2">No prompts yet</div>
          )}
        </div>
      </div>

      {/* Sign out */}
      <div className="mt-auto p-3 border-t border-border/50">
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => signOut()}>
          <LogOut className="w-4 h-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

