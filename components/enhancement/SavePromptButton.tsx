'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bookmark, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { savePrompt } from '@/lib/firebase/firestore';
import { useToast } from '@/components/ui/toast';
import { EnhancementResult } from '@/lib/types';

interface SavePromptButtonProps {
  result: EnhancementResult;
  onAuthRequired: () => void;
}

export function SavePromptButton({ result, onAuthRequired }: SavePromptButtonProps) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    if (!title.trim()) {
      addToast({
        title: 'Title required',
        description: 'Please enter a title for your prompt',
        type: 'error',
      });
      return;
    }

    setSaving(true);

    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await savePrompt(user.uid, {
        title: title.trim(),
        description: description.trim(),
        originalPrompt: result.original,
        enhancedPrompt: result.enhanced,
        technique: result.technique,
        format: result.format,
        metadata: {
          model: result.metadata.model,
          processingTime: result.metadata.processingTime,
          confidence: result.metadata.confidence,
        },
        tags: tagArray,
        isFavorite: false,
        isPublic: false,
        userId: user.uid,
      });

      addToast({
        title: 'Prompt saved!',
        description: 'Your enhanced prompt has been saved successfully',
        type: 'success',
      });

      setShowDialog(false);
      setTitle('');
      setDescription('');
      setTags('');
    } catch (error) {
      console.error('Error saving prompt:', error);
      addToast({
        title: 'Failed to save',
        description: 'There was an error saving your prompt. Please try again.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => user ? setShowDialog(true) : onAuthRequired()}
        size="sm"
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Bookmark className="w-4 h-4" />
        <span>Save</span>
      </Button>

      {/* Save Dialog */}
      <AnimatePresence>
        {showDialog && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setShowDialog(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Dialog */}
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
                  onClick={() => !saving && setShowDialog(false)}
                  disabled={saving}
                  className="absolute right-4 top-4 text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Save Enhanced Prompt
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Give your prompt a title and organize it with tags
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt-title">Title *</Label>
                    <input
                      id="prompt-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Product Description Generator"
                      disabled={saving}
                      className="w-full px-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                               text-text-primary placeholder-text-muted
                               focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt-description">Description (optional)</Label>
                    <textarea
                      id="prompt-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of what this prompt does..."
                      rows={3}
                      disabled={saving}
                      className="w-full px-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                               text-text-primary placeholder-text-muted resize-none
                               focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt-tags">Tags (optional)</Label>
                    <input
                      id="prompt-tags"
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="marketing, copywriting, seo (comma separated)"
                      disabled={saving}
                      className="w-full px-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                               text-text-primary placeholder-text-muted
                               focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200"
                    />
                  </div>

                  {/* Preview */}
                  <div className="p-3 bg-surface-secondary rounded-lg border border-surface-tertiary">
                    <p className="text-xs text-text-muted mb-1">Technique: {result.technique}</p>
                    <p className="text-xs text-text-muted">Format: {result.format}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !title.trim()}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save Prompt
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}