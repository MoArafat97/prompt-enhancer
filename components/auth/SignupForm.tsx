'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';

interface SignupFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export function SignupForm({ onSuccess, onLoginClick }: SignupFormProps) {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      onSuccess();
      // Redirect to dashboard after successful sign-up
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect');
        window.location.href = redirectTo || '/dashboard/workspace';
      }
    } catch (err: any) {
      // Error is already handled by the auth context
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display Name Input */}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={loading}
            className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                     text-text-primary placeholder-text-muted
                     focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                     text-text-primary placeholder-text-muted
                     focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            minLength={6}
            className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                     text-text-primary placeholder-text-muted
                     focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          />
        </div>
        <p className="text-xs text-text-muted">Must be at least 6 characters</p>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                     text-text-primary placeholder-text-muted
                     focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Google Sign In - Temporarily disabled until OAuth is configured */}
      {false && (
        <>
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-tertiary"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-surface-primary text-text-muted">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <GoogleAuthButton onSuccess={onSuccess} />
        </>
      )}

      {/* Sign In Link */}
      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}