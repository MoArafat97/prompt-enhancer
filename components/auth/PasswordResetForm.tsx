'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

interface PasswordResetFormProps {
  onSuccess: () => void;
  onBackClick: () => void;
}

export function PasswordResetForm({ onSuccess, onBackClick }: PasswordResetFormProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      // Wait a bit before redirecting to login
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err: any) {
      // Error is already handled by the auth context
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">Check your email</h3>
          <p className="text-sm text-text-secondary">
            We&apos;ve sent password reset instructions to:
          </p>
          <p className="text-sm font-medium text-text-primary">{email}</p>
        </div>
        <p className="text-xs text-text-muted">
          Didn&apos;t receive the email? Check your spam folder or try again.
        </p>
        <Button
          onClick={onBackClick}
          variant="outline"
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBackClick}
        className="flex items-center text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Sign In
      </button>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            id="reset-email"
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
        <p className="text-xs text-text-muted">
          Enter the email address associated with your account
        </p>
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
        disabled={loading || !email}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending instructions...
          </>
        ) : (
          'Send Reset Instructions'
        )}
      </Button>

      {/* Additional Info */}
      <div className="p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-lg">
        <p className="text-xs text-text-secondary">
          <strong className="text-text-primary">Note:</strong> If an account exists with this email,
          you&apos;ll receive password reset instructions within a few minutes.
        </p>
      </div>
    </form>
  );
}