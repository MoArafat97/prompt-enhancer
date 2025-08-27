"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, LogIn, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeaderProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import { UserMenu } from '@/components/auth/UserMenu';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';

export function Header({ className }: HeaderProps) {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const pathname = usePathname();
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <motion.div
                className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(102, 126, 234, 0)",
                    "0 0 20px rgba(102, 126, 234, 0.3)",
                    "0 0 0 rgba(102, 126, 234, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold gradient-text">
                Prompt Enhancer
              </h1>
              <p className="text-xs text-text-muted">AI-Powered Enhancement</p>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-primary",
                pathname === "/" ? "text-brand-primary" : "text-text-secondary"
              )}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-brand-primary",
                pathname?.startsWith("/blog") ? "text-brand-primary" : "text-text-secondary"
              )}
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-primary",
                  pathname?.startsWith("/dashboard") ? "text-brand-primary" : "text-text-secondary"
                )}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Side - Social Links and Auth */}
          <div className="flex items-center space-x-3">
            {/* Social Links hidden on dashboard for focus */}
            <motion.button
              className="p-2 text-text-muted hover:text-text-primary transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Theme toggle functionality can be added here
                console.log('Theme toggle clicked');
              }}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-gradient-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            {/* Auth Section */}
            <div className="ml-2 pl-2 border-l border-surface-tertiary">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-surface-secondary animate-pulse" />
              ) : user ? (
                <UserMenu />
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </motion.header>
  );
}
