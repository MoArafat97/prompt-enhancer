'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useSavedPrompts } from '@/lib/hooks/useSavedPrompts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid3X3,
  List,
  Plus,
  FileText,
  Star,
  Clock,
  Loader2,
  X,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PromptsDebug } from '@/components/debug/PromptsDebug';
import { useToast } from '@/components/ui/toast';
import { copyToClipboard } from '@/lib/utils';

export default function HistoryPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { prompts, loading: promptsLoading, toggleFavorite, removePrompt, searchPrompts } = useSavedPrompts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'favorites'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'general' | 'writing' | 'coding'>('all');
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);
  const [copiedEnhanced, setCopiedEnhanced] = useState(false);
  const { addToast } = useToast();

  // Filter prompts based on current filters
  const filteredPrompts = prompts.filter(prompt => {
    // Filter by favorites
    if (filterBy === 'favorites' && !prompt.isFavorite) return false;

    // Filter by category
    if (categoryFilter !== 'all') {
      const promptCategory = prompt.metadata?.category || 'general';
      if (promptCategory !== categoryFilter) return false;
    }

    return true;
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchPrompts(searchTerm);
    }
  };

  if (authLoading || promptsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-primary" />
          <p className="text-text-secondary">Loading your prompts...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            My Saved Prompts
          </h1>
          <p className="text-text-secondary">
            Manage and organize your enhanced prompts
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Prompts</p>
                <p className="text-2xl font-bold text-text-primary">{prompts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-brand-primary opacity-20" />
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Favorites</p>
                <p className="text-2xl font-bold text-text-primary">
                  {prompts.filter(p => p.isFavorite).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-warning opacity-20" />
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Created</p>
                <p className="text-2xl font-bold text-text-primary">
                  {prompts.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-success opacity-20" />
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
        >
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompts..."
                className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg 
                         text-text-primary placeholder-text-muted
                         focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                         transition-all duration-200"
              />
            </div>
          </form>

          {/* Filters and View Mode */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Type Filter */}
            <div className="flex items-center bg-surface-secondary rounded-lg border border-surface-tertiary">
              <button
                onClick={() => setFilterBy('all')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filterBy === 'all'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterBy('favorites')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filterBy === 'favorites'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Favorites
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center bg-surface-secondary rounded-lg border border-surface-tertiary">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setCategoryFilter('general')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  categoryFilter === 'general'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setCategoryFilter('writing')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  categoryFilter === 'writing'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Writing
              </button>
              <button
                onClick={() => setCategoryFilter('coding')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  categoryFilter === 'coding'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Coding
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-surface-secondary rounded-lg border border-surface-tertiary">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'text-text-primary bg-surface-tertiary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* New Prompt Button */}
            <Link href="/dashboard/workspace">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Prompt
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Prompts Grid/List */}
        {filteredPrompts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {filterBy === 'favorites' ? 'No favorite prompts yet' : 'No prompts saved yet'}
            </h3>
            <p className="text-text-secondary mb-6">
              {filterBy === 'favorites' 
                ? 'Mark prompts as favorites to see them here'
                : 'Start enhancing prompts and save them for later use'}
            </p>
            <Link href="/dashboard/workspace">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Prompt
              </Button>
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredPrompts.map((prompt, index) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    index={index}
                    onToggleFavorite={toggleFavorite}
                    onDelete={removePrompt}
                    onView={setSelectedPrompt}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {filteredPrompts.map((prompt, index) => (
                  <PromptListItem
                    key={prompt.id}
                    prompt={prompt}
                    index={index}
                    onToggleFavorite={toggleFavorite}
                    onDelete={removePrompt}
                    onView={setSelectedPrompt}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Debug Component - Remove after troubleshooting */}
      <PromptsDebug />

      {/* View Modal */}
      <AnimatePresence>
        {selectedPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-lg"
              onClick={() => setSelectedPrompt(null)}
            />
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative z-10 w-[95vw] max-w-3xl max-h-[85vh] overflow-auto glass-elevated p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="prompt-view-title"
            >
              <button
                onClick={() => setSelectedPrompt(null)}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 id="prompt-view-title" className="text-2xl font-semibold mb-2">
                {selectedPrompt.title}
              </h2>
              {selectedPrompt.description && (
                <p className="text-text-secondary mb-4">{selectedPrompt.description}</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const text = selectedPrompt.enhancedPrompt || '';
                    const success = await copyToClipboard(text);
                    if (success) {
                      setCopiedEnhanced(true);
                      setTimeout(() => setCopiedEnhanced(false), 1800);
                      addToast({
                        type: 'success',
                        title: 'Copied!',
                        description: 'Enhanced prompt copied to clipboard.',
                        duration: 2500,
                      });
                    } else {
                      addToast({
                        type: 'error',
                        title: 'Copy failed',
                        description: 'Unable to copy to clipboard. Please try again.',
                        duration: 3000,
                      });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  {copiedEnhanced ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedEnhanced ? 'Copied' : 'Copy Enhanced'}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    try {
                      const content = selectedPrompt.enhancedPrompt || '';
                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `enhanced-prompt-${Date.now()}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      addToast({
                        type: 'success',
                        title: 'Download started',
                        description: 'Saving enhanced prompt as a text file.',
                        duration: 2500,
                      });
                    } catch (e) {
                      addToast({
                        type: 'error',
                        title: 'Download failed',
                        description: 'Unable to download the file. Please try again.',
                        duration: 3000,
                      });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Original</h3>
                  <div className="relative p-3 bg-background/80 rounded border border-surface-tertiary text-sm whitespace-pre-wrap">
                    {selectedPrompt.originalPrompt}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Enhanced</h3>
                  <div className="relative p-3 bg-background/80 rounded border border-surface-tertiary text-sm whitespace-pre-wrap">
                    {selectedPrompt.enhancedPrompt}
                    {/* Inline copy button for Enhanced (appears on hover) */}
                    <button
                      onClick={async () => {
                        const text = selectedPrompt.enhancedPrompt || '';
                        const success = await copyToClipboard(text);
                        if (success) {
                          setCopiedEnhanced(true);
                          setTimeout(() => setCopiedEnhanced(false), 1800);
                          addToast({
                            type: 'success',
                            title: 'Copied!',
                            description: 'Enhanced prompt copied to clipboard.',
                            duration: 2500,
                          });
                        } else {
                          addToast({
                            type: 'error',
                            title: 'Copy failed',
                            description: 'Unable to copy to clipboard. Please try again.',
                            duration: 3000,
                          });
                        }
                      }}
                      className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border/40 bg-surface/70 hover:bg-surface-elevated/80 text-xs text-text-secondary hover:text-text-primary transition-colors"
                      aria-label="Copy enhanced prompt"
                    >
                      {copiedEnhanced ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedEnhanced ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-muted">
                {selectedPrompt.metadata?.category && (
                  <span>Category: <span className="capitalize">{selectedPrompt.metadata.category}</span></span>
                )}
                <span>Technique: <span className="capitalize">{selectedPrompt.technique}</span></span>
                <span>Format: {selectedPrompt.format}</span>
                {selectedPrompt.metadata?.model && (
                  <span>Model: {selectedPrompt.metadata.model}</span>
                )}
                {selectedPrompt.createdAt && (
                  <span>Saved: {new Date((selectedPrompt.createdAt as any).toDate()).toLocaleString()}</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Prompt Card Component
function PromptCard({
  prompt,
  index,
  onToggleFavorite,
  onDelete,
  onView,
}: {
  prompt: any;
  index: number;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
  onView: (prompt: any) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-4 hover:shadow-lg transition-all duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text-primary line-clamp-1">
          {prompt.title}
        </h3>
        <button
          onClick={() => onToggleFavorite(prompt.id, prompt.isFavorite)}
          className={`p-1 rounded transition-colors ${
            prompt.isFavorite 
              ? 'text-warning' 
              : 'text-text-muted hover:text-warning'
          }`}
        >
          <Star className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {prompt.description && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
          {prompt.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {/* Category Badge */}
        {prompt.metadata?.category && (
          <span
            className={`px-2 py-1 text-xs rounded font-medium ${
              prompt.metadata.category === 'general'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : prompt.metadata.category === 'writing'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : prompt.metadata.category === 'coding'
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                : 'bg-surface-secondary text-text-secondary'
            }`}
          >
            {prompt.metadata.category === 'general' ? '⚡ General' :
             prompt.metadata.category === 'writing' ? '✍️ Writing' :
             prompt.metadata.category === 'coding' ? '🔧 Coding' :
             prompt.metadata.category}
          </span>
        )}

        {prompt.tags.slice(0, 3).map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-surface-secondary text-text-secondary rounded"
          >
            {tag}
          </span>
        ))}
        {prompt.tags.length > 3 && (
          <span className="px-2 py-1 text-xs text-text-muted">
            +{prompt.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{prompt.technique}</span>
        <span>{new Date((prompt.createdAt as any).toDate()).toLocaleDateString()}</span>
      </div>

      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 pt-3 border-t border-surface-tertiary flex gap-2"
          >
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onView(prompt)}>
              View
            </Button>
            <Button
              size="sm" 
              variant="outline" 
              onClick={() => onDelete(prompt.id)}
              className="text-error hover:bg-error/10"
            >
              Delete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Prompt List Item Component
function PromptListItem({
  prompt,
  index,
  onToggleFavorite,
  onDelete,
  onView,
}: {
  prompt: any;
  index: number;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
  onView: (prompt: any) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-text-primary">
            {prompt.title}
          </h3>
          <button
            onClick={() => onToggleFavorite(prompt.id, prompt.isFavorite)}
            className={`p-1 rounded transition-colors ${
              prompt.isFavorite 
                ? 'text-warning' 
                : 'text-text-muted hover:text-warning'
            }`}
          >
            <Star className={`w-4 h-4 ${prompt.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {prompt.description && (
          <p className="text-sm text-text-secondary mb-2">
            {prompt.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-text-muted">
          {/* Category Badge */}
          {prompt.metadata?.category && (
            <span
              className={`px-2 py-1 text-xs rounded font-medium ${
                prompt.metadata.category === 'general'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : prompt.metadata.category === 'writing'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : prompt.metadata.category === 'coding'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'bg-surface-secondary text-text-secondary'
              }`}
            >
              {prompt.metadata.category === 'general' ? '⚡ General' :
               prompt.metadata.category === 'writing' ? '✍️ Writing' :
               prompt.metadata.category === 'coding' ? '🔧 Coding' :
               prompt.metadata.category}
            </span>
          )}

          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {prompt.tags.length} tags
          </span>
          <span>{prompt.technique}</span>
          <span>{prompt.format}</span>
          <span>{new Date((prompt.createdAt as any).toDate()).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <Button size="sm" variant="outline" onClick={() => onView(prompt)}>
          View
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(prompt.id)}
          className="text-error hover:bg-error/10"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}

