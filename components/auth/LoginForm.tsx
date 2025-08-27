'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { isFirebaseConfigured } from '@/lib/firebase/config';

interface LoginFormProps {
  onSuccess: () => void;
  onSignupClick: () => void;
  onResetClick: () => void;
}

export function LoginForm({ onSuccess, onSignupClick, onResetClick }: LoginFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onSuccess();
      // Redirect to dashboard after successful sign-in
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect');
        window.location.href = redirectTo || '/dashboard/workspace';
      }
    } catch (err: any) {
      // Error is already handled by the auth context
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            onClick={onResetClick}
            className="text-xs text-brand-primary hover:text-brand-secondary transition-colors"
          >
            Forgot password?
          </button>
        </div>
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
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Social Sign In */}
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

      {/* Sign Up Link */}
      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSignupClick}
          className="text-brand-primary hover:text-brand-secondary font-medium transition-colors"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}