'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PromptInput } from '@/components/enhancement/PromptInput';
import { TechniqueSelector } from '@/components/enhancement/TechniqueSelector';
import { CategorySelector, TechniqueCategory } from '@/components/enhancement/CategorySelector';
import { OutputFormatSelector } from '@/components/enhancement/OutputFormatSelector';
import { FormatPreview } from '@/components/enhancement/FormatPreview';
import { EnhanceButton } from '@/components/enhancement/EnhanceButton';
import { ResultDisplay } from '@/components/enhancement/ResultDisplay';
import { ModelInfo } from '@/components/enhancement/ModelInfo';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Features } from '@/components/sections/Features';
import { About } from '@/components/sections/About';
import { AnimatedSection } from '@/components/animations/ParallaxBackground';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { EnhancementTechnique, OutputFormat, EnhancementResult } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/lib/contexts/AuthContext';
import { SimpleFirebaseStatus } from '@/components/debug/SimpleFirebaseStatus';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [technique, setTechnique] = useState<EnhancementTechnique>('clarity');
  const [category, setCategory] = useState<TechniqueCategory>('all');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('natural');
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  // Client-side guard: if authenticated, immediately redirect to dashboard workspace
  useEffect(() => {
    if (user) {
      router.replace('/dashboard/workspace');
    }
  }, [user, router]);

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

  const handleEnhance = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, technique, outputFormat }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      if (data.success && data.data) {
        console.log('Setting result:', data.data); // Debug log
        setResult(data.data);

        // Show success toast
        addToast({
          type: 'success',
          title: 'Enhancement Complete!',
          description: `Your prompt has been enhanced using ${data.data.technique} technique.`,
          duration: 4000
        });
      } else {
        throw new Error(data.message || 'Enhancement failed');
      }
    } catch (error) {
      console.error('Enhancement failed:', error);

      // Show error to user with toast notification
      const errorMessage = error instanceof Error ? error.message : 'Enhancement failed';
      addToast({
        type: 'error',
        title: 'Enhancement Failed',
        description: errorMessage,
        duration: 6000
      });

      // Clear any previous results
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <AnimatedSection animation="slideUp" delay={0.1} className="text-center space-y-6">
            <motion.h1
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold gradient-text"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              Prompt Enhancer
            </motion.h1>
            
            <motion.p
              className="font-body text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Transform your prompts with AI-powered enhancement techniques. 
              Get better results in JSON, XML, or natural language format.
            </motion.p>

            {/* Feature Pills */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { icon: '✨', text: 'AI-Powered' },
                { icon: '🚀', text: 'Instant Results' },
                { icon: '🎯', text: 'Multiple Techniques' },
                { icon: '📄', text: 'Various Formats' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center space-x-2 bg-surface/50 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(26, 26, 27, 0.8)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  <span className="text-lg">{feature.icon}</span>
                  <span className="text-sm font-medium text-text-secondary">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatedSection>

          {/* Main Interface */}
          <AnimatedSection
            animation="slideUp"
            delay={0.3}
            className={`card tilt-effect p-8 md:p-10 technique-${technique}`}
          >
            <div className="space-y-10" id="prompt-enhancer-interface">
              {/* Prompt Input */}
              <div id="prompt-input-section">
                <PromptInput
                  value={prompt}
                  onChange={setPrompt}
                  placeholder="Enter your prompt here... For example: 'Write a blog post about artificial intelligence'"
                  disabled={isLoading}
                />
              </div>

              {/* Controls Row - All controls in single row */}
              <div className="space-y-8">
                {/* Unified Controls Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* Category Selector */}
                  <div className="md:col-span-1">
                    <CategorySelector
                      value={category}
                      onChange={setCategory}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Technique Selector */}
                  <div className="md:col-span-1" id="technique-selector-section">
                    <TechniqueSelector
                      value={technique}
                      onChange={setTechnique}
                      category={category}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Output Format Selector */}
                  <div className="md:col-span-1">
                    <OutputFormatSelector
                      value={outputFormat}
                      onChange={setOutputFormat}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Enhance Button */}
                  <div className="md:col-span-1">
                    <div className="space-y-3 h-full flex flex-col justify-start">
                      <div className="flex items-center space-x-2 opacity-0 pointer-events-none">
                        <span className="text-sm">‎</span>
                      </div>
                      <EnhanceButton
                        onClick={handleEnhance}
                        isLoading={isLoading}
                        disabled={!prompt.trim()}
                      />
                    </div>
                  </div>
                </div>

                {/* Format Preview Section */}
                <div className="xl:grid xl:grid-cols-4 xl:gap-6">
                  <div className="xl:col-span-3">
                    <FormatPreview value={outputFormat} />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Results Section */}
          {(result || isLoading) && (
            <ErrorBoundary>
              <div id="results-section">
                <ResultDisplay
                  result={result}
                  isLoading={isLoading}
                  format={outputFormat}
                  technique={technique}
                />
              </div>
            </ErrorBoundary>
          )}

          {/* Model Info Section */}
          <ModelInfo />

          {/* Interactive How It Works Section */}
          {!result && !isLoading && (
            <div className="py-10">
              <HowItWorks />
            </div>
          )}

          {/* Section Divider */}
          {!result && !isLoading && (
            <div className="py-12 sm:py-20 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="w-3 h-3 bg-brand-primary rounded-full opacity-60"></div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Features Section */}
      <Features />

      {/* About Section */}
      <About />

      {/* Debug Component */}
      <SimpleFirebaseStatus />
    </div>
  );
}
