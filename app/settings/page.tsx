'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function isValidOpenRouterKey(key: string) {
  // Basic validation: typically starts with 'sk-' and reasonable length
  return /^sk-[-A-Za-z0-9_]{20,}$/.test(key.trim());
}

export default function SettingsPage() {
  const { user, userProfile, updateUserProfile, loading } = useAuth();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/?auth=required&redirect=/settings');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (userProfile?.preferences?.apiKeys?.openrouter) {
      setApiKey(userProfile.preferences.apiKeys.openrouter);
    }
  }, [userProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmed = apiKey.trim();
    if (trimmed && !isValidOpenRouterKey(trimmed)) {
      setError('That API key does not look valid. It should start with sk- and be at least 20 characters.');
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile({
        preferences: {
          ...(userProfile?.preferences || { defaultTechnique: 'clarity', defaultFormat: 'natural', emailNotifications: true }),
          apiKeys: { ...(userProfile?.preferences?.apiKeys || {}), openrouter: trimmed || undefined },
        } as any,
      });
      setSuccess('API key saved securely to your account.');
    } catch (err: any) {
      setError(err.message || 'Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('Text');
    setApiKey(pastedText);
    e.preventDefault(); // Prevent default paste to avoid double-handling
  };

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
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-text-secondary mb-8">Manage your account and integrations</p>

          <div className="card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-2">OpenRouter API Key</h2>
            <p className="text-sm text-text-secondary mb-4">
              Use your own OpenRouter key to run enhancements under your quota. You can get a key from
              <a className="text-brand-primary hover:text-brand-secondary ml-1" href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">OpenRouter</a>.
            </p>
            <ol className="list-decimal ml-6 text-sm text-text-secondary mb-4 space-y-1">
              <li>Create an account at OpenRouter</li>
              <li>Visit the Keys page and generate a key</li>
              <li>Copy your key (starts with sk-)</li>
              <li>Paste it below and click Save</li>
            </ol>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                <input
                  id="openrouter-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                           text-black placeholder-text-muted
                           focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary"
                />
                <p className="text-xs text-text-muted">Stored securely in your Firestore profile. Only you can access it.</p>
              </div>

              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded text-error text-sm">{error}</div>
              )}
              {success && (
                <div className="p-3 bg-success/10 border border-success/20 rounded text-success text-sm">{success}</div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
                <Button type="button" variant="outline" onClick={() => setApiKey('')}>Clear</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

