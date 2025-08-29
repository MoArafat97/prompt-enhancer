'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Settings,
  FileText,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, userProfile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || !userProfile) return null;

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push('/');
  };

  const menuItems = [
    {
      icon: FileText,
      label: 'My Prompts',
      href: '/dashboard/history',
      onClick: () => { setIsOpen(false); router.push('/dashboard/history'); },
    },
    {
      icon: BarChart3,
      label: 'Usage Stats',
      href: '/dashboard/stats',
      onClick: () => { setIsOpen(false); router.push('/dashboard/stats'); },
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      onClick: () => { setIsOpen(false); router.push('/settings'); },
    },
  ];



  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg
                   bg-surface-secondary hover:bg-surface-tertiary
                   border border-surface-tertiary
                   transition-all duration-200"
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
          {userProfile.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt={userProfile.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-medium">
              {userProfile.displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="hidden md:block text-left">
          <div className="flex items-center space-x-1">
            <p className="text-sm font-medium text-text-primary">
              {userProfile.displayName}
            </p>
          </div>
          <p className="text-xs text-text-muted">
            User
          </p>
        </div>

        <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 py-2
                     bg-surface-secondary border border-surface-tertiary rounded-lg shadow-xl
                     z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-surface-tertiary">
              <p className="text-sm font-medium text-text-primary">{userProfile.displayName}</p>
              <p className="text-xs text-text-muted">{userProfile.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={item.onClick}
                  className="flex items-center space-x-3 px-4 py-2
                           text-sm text-text-secondary hover:text-text-primary
                           hover:bg-surface-tertiary/50
                           transition-colors duration-200"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Sign Out */}
            <div className="pt-2 border-t border-surface-tertiary">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-3 px-4 py-2 w-full
                         text-sm text-text-secondary hover:text-error
                         hover:bg-error/10
                         transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}