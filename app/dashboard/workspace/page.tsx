'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { PromptInput } from '@/components/enhancement/PromptInput';
import { TechniqueSelector } from '@/components/enhancement/TechniqueSelector';
import { CategorySelector, TechniqueCategory } from '@/components/enhancement/CategorySelector';
import { OutputFormatSelector } from '@/components/enhancement/OutputFormatSelector';
import { FormatPreview } from '@/components/enhancement/FormatPreview';
import { EnhanceButton } from '@/components/enhancement/EnhanceButton';
import { ResultDisplay } from '@/components/enhancement/ResultDisplay';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { EnhancementTechnique, OutputFormat, EnhancementResult } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { savePrompt } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function WorkspacePage() {
  const [prompt, setPrompt] = useState('');
  const [technique, setTechnique] = useState<EnhancementTechnique>('clarity');
  const [category, setCategory] = useState<TechniqueCategory>('all');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('natural');
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { user, userProfile } = useAuth();

  const handleEnhance = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      const userKey = userProfile?.preferences?.apiKeys?.openrouter;
      if (userKey) {
        headers['x-openrouter-key'] = userKey;
      }

      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, technique, outputFormat }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        addToast({
          type: 'success',
          title: 'Enhancement Complete!',
          description: `Your prompt has been enhanced using ${data.data.technique} technique.`,
          duration: 3000,
        });

        // Auto-save to Firestore if authenticated
        if (user) {
          try {
            console.log('Auto-saving prompt for user:', user.uid);
            const savedId = await savePrompt(user.uid, {
              title: prompt.slice(0, 60) || 'Untitled Prompt',
              description: '',
              originalPrompt: data.data.original,
              enhancedPrompt: data.data.enhanced,
              technique: data.data.technique,
              format: data.data.format,
              metadata: {
                model: data.data.metadata.model,
                processingTime: data.data.metadata.processingTime,
                confidence: data.data.metadata.confidence,
                category: category, // Include category in metadata
              },
              tags: [],
              isFavorite: false,
              isPublic: false,
              userId: user.uid,
            });
            console.log('Prompt auto-saved with ID:', savedId);
          } catch (e) {
            console.error('Auto-save failed:', e);
          }
        }
      } else {
        throw new Error(data.message || 'Enhancement failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Enhancement failed';
      addToast({
        type: 'error',
        title: 'Enhancement Failed',
        description: errorMessage,
        duration: 6000,
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved category from localStorage on mount
  useEffect(() => {
    const savedCategory = localStorage.getItem('prompt-enhancer-category') as TechniqueCategory;
    if (savedCategory && ['all', 'general', 'writing', 'coding'].includes(savedCategory)) {
      setCategory(savedCategory);
    }
  }, []);

  // Save category to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('prompt-enhancer-category', category);
  }, [category]);

  // Handle category change - reset technique to first available in new category
  useEffect(() => {
    // Import technique collections dynamically to avoid SSR issues
    import('@/lib/techniques').then(({ GENERAL_TECHNIQUES, WRITING_TECHNIQUES, CODING_TECHNIQUES, ALL_TECHNIQUES }) => {
      let availableTechniques;
      switch (category) {
        case 'general':
          availableTechniques = GENERAL_TECHNIQUES;
          break;
        case 'writing':
          availableTechniques = WRITING_TECHNIQUES;
          break;
        case 'coding':
          availableTechniques = CODING_TECHNIQUES;
          break;
        case 'all':
        default:
          availableTechniques = ALL_TECHNIQUES;
          break;
      }

      // Check if current technique is available in the new category
      const currentTechniqueAvailable = availableTechniques.some(t => t.value === technique);

      // If not available, switch to the first technique in the category
      if (!currentTechniqueAvailable && availableTechniques.length > 0) {
        setTechnique(availableTechniques[0].value as EnhancementTechnique);
      }
    });
  }, [category, technique]);

  const hasUserKey = Boolean(userProfile?.preferences?.apiKeys?.openrouter);
  const enhanceDisabled = !prompt.trim() || isLoading || !hasUserKey;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Setup banner if API key missing */}
        {!hasUserKey && (
          <div className="card p-4 border-warning/30 bg-warning/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-text-secondary">
                To use Prompt Enhancer, add your OpenRouter API key in Settings. This lets you use free or paid models under your own quota.
              </p>
              <a href="/settings" className="button-secondary px-3 py-2 rounded-md text-sm">Go to Settings</a>
            </div>
          </div>
        )}

        <div className="card p-6">
          <div className="space-y-6">
            <PromptInput value={prompt} onChange={setPrompt} placeholder="Enter your prompt..." disabled={isLoading} />

            {/* Unified Controls Row - All controls in single row */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Category Selector */}
                <div className="md:col-span-1">
                  <CategorySelector value={category} onChange={setCategory} disabled={isLoading} />
                </div>

                {/* Technique Selector */}
                <div className="md:col-span-1">
                  <TechniqueSelector value={technique} onChange={setTechnique} category={category} disabled={isLoading} />
                </div>

                {/* Output Format Selector */}
                <div className="md:col-span-1">
                  <OutputFormatSelector value={outputFormat} onChange={setOutputFormat} disabled={isLoading} />
                </div>

                {/* Enhance Button */}
                <div className="md:col-span-1">
                  <div className="space-y-3 h-full flex flex-col justify-start">
                    <div className="flex items-center space-x-2 opacity-0 pointer-events-none">
                      <span className="text-sm">‎</span>
                    </div>
                    <EnhanceButton onClick={handleEnhance} isLoading={isLoading} disabled={enhanceDisabled} />
                  </div>
                </div>
              </div>

              {!hasUserKey && (
                <p className="text-xs text-text-muted">Enhance is disabled until you add an OpenRouter API key in Settings.</p>
              )}

              {/* Format Preview Section */}
              <div className="xl:grid xl:grid-cols-4 xl:gap-4">
                <div className="xl:col-span-3">
                  <FormatPreview value={outputFormat} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {(result || isLoading) && (
          <ErrorBoundary>
            <ResultDisplay result={result} isLoading={isLoading} format={outputFormat} technique={technique} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

