'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { PasswordResetForm } from './PasswordResetForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);

  const handleClose = () => {
    onClose();
    // Reset to login mode after closing
    setTimeout(() => setMode('login'), 300);
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Welcome Back';
      case 'signup':
        return 'Create Account';
      case 'reset':
        return 'Reset Password';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login':
        return 'Sign in to save and manage your enhanced prompts';
      case 'signup':
        return 'Join to unlock the full potential of prompt enhancement';
      case 'reset':
        return 'Enter your email to receive password reset instructions';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="card-elevated p-6 relative">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  {getTitle()}
                </h2>
                <p className="text-text-secondary text-sm">
                  {getDescription()}
                </p>
              </div>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {mode === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LoginForm
                      onSuccess={handleClose}
                      onSignupClick={() => setMode('signup')}
                      onResetClick={() => setMode('reset')}
                    />
                  </motion.div>
                )}

                {mode === 'signup' && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SignupForm
                      onSuccess={handleClose}
                      onLoginClick={() => setMode('login')}
                    />
                  </motion.div>
                )}

                {mode === 'reset' && (
                  <motion.div
                    key="reset"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PasswordResetForm
                      onSuccess={() => setMode('login')}
                      onBackClick={() => setMode('login')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}