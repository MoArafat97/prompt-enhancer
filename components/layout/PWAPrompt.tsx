"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PWAPromptProps } from '@/lib/types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAPrompt({ onInstall, onDismiss }: PWAPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not dismissed
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    // Check if already installed
    const installed = localStorage.getItem('pwa-installed');
    if (installed) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      onInstall?.();
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    onDismiss?.();
  };

  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-text-primary">
                    Install App
                  </h3>
                  <p className="text-xs text-text-muted">
                    Get the full experience
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-8 w-8 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-text-secondary mb-4">
              Install Prompt Enhancer for quick access, offline support, and a native app experience.
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleInstall}
                className="flex-1 h-10"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Install
              </Button>
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="h-10 px-4"
                size="sm"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
