"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Sparkles,
  Edit3,
  Settings,
  Download,
  Copy
} from 'lucide-react';
import { ENHANCEMENT_TECHNIQUES } from '@/lib/constants';

interface QuickDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickDemo({ isOpen, onClose }: QuickDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const demoSteps = [
    {
      title: "Enter Your Prompt",
      description: "Watch as we input a sample prompt",
      icon: Edit3,
      content: "Write a blog post about artificial intelligence",
      duration: 2000,
    },
    {
      title: "Choose Enhancement Method",
      description: "Select the clarity enhancement technique",
      icon: Settings,
      content: "Clarity Enhancement - Make prompts more specific and actionable",
      duration: 1500,
    },
    {
      title: "AI Processing",
      description: "Our AI analyzes and enhances your prompt",
      icon: Sparkles,
      content: "Processing with advanced AI algorithms...",
      duration: 3000,
    },
    {
      title: "Enhanced Result",
      description: "Get your improved, detailed prompt",
      icon: CheckCircle,
      content: `As an expert technology writer with 10+ years of experience covering artificial intelligence developments, create a comprehensive 1,500-word blog post about artificial intelligence that:

1. **Introduction & Hook**: Start with a compelling statistic or recent AI breakthrough
2. **Core Content Structure**:
   - Define AI in accessible terms for general readers
   - Explain current applications (healthcare, finance, transportation)
   - Discuss recent breakthroughs and their implications
   - Address common misconceptions and concerns
3. **Expert Analysis**: Include insights on future trends and potential societal impact
4. **Conclusion**: End with actionable takeaways for readers

**Tone**: Professional yet accessible, optimistic but balanced
**Target Audience**: Tech-curious professionals and general readers
**SEO Focus**: Include relevant keywords naturally throughout`,
      duration: 2000,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < demoSteps.length) {
      interval = setTimeout(() => {
        if (currentStep === demoSteps.length - 1) {
          setIsComplete(true);
          setIsPlaying(false);
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, demoSteps[currentStep].duration);
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [isPlaying, currentStep, demoSteps]);

  const handlePlay = () => {
    if (isComplete) {
      // Reset demo
      setCurrentStep(0);
      setIsComplete(false);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsComplete(false);
  };

  const handleStepClick = (stepIndex: number) => {
    if (!isPlaying) {
      setCurrentStep(stepIndex);
      setIsComplete(stepIndex === demoSteps.length - 1);
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 glass-elevated rounded-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">
                  Quick Demo
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  See how prompt enhancement works in action
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Demo Controls */}
                <motion.button
                  onClick={handlePlay}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isComplete ? 'Replay' : isPlaying ? 'Pause' : 'Play'}
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={handleReset}
                  className="p-2 bg-surface/50 border border-border/30 rounded-lg hover:border-brand-primary/30 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw className="w-4 h-4 text-text-primary" />
                </motion.button>
                
                <motion.button
                  onClick={onClose}
                  className="p-2 bg-surface/50 border border-border/30 rounded-lg hover:border-error/30 hover:text-error transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                {/* Steps Sidebar */}
                <div className="lg:border-r border-border/30 p-6 space-y-4 bg-surface/20">
                  <h3 className="font-heading font-semibold text-text-primary mb-4">
                    Demo Steps
                  </h3>
                  
                  {demoSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep || isComplete;
                    
                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleStepClick(index)}
                        className={`
                          w-full text-left p-3 rounded-lg border transition-all duration-200
                          ${isActive 
                            ? 'border-brand-primary/50 bg-brand-primary/10' 
                            : isCompleted
                            ? 'border-success/30 bg-success/5'
                            : 'border-border/30 bg-background/30 hover:border-brand-primary/30'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            ${isActive 
                              ? 'bg-brand-primary text-white' 
                              : isCompleted
                              ? 'bg-success text-white'
                              : 'bg-surface/50 text-text-muted'
                            }
                          `}>
                            {isCompleted && !isActive ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="font-medium text-sm text-text-primary">
                              {step.title}
                            </div>
                            <div className="text-xs text-text-secondary">
                              {step.description}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        {isActive && isPlaying && (
                          <motion.div
                            className="mt-2 h-1 bg-surface/50 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className="h-full bg-brand-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: step.duration / 1000, ease: "linear" }}
                            />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Demo Content */}
                <div className="lg:col-span-2 p-6 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Step Header */}
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                          {React.createElement(demoSteps[currentStep].icon, {
                            className: "w-8 h-8 text-white"
                          })}
                        </div>
                        <h3 className="font-heading text-xl font-semibold text-text-primary">
                          {demoSteps[currentStep].title}
                        </h3>
                        <p className="text-text-secondary">
                          {demoSteps[currentStep].description}
                        </p>
                      </div>

                      {/* Step Content */}
                      <div className="bg-background/50 border border-border/30 rounded-lg p-4">
                        {currentStep === 2 && isPlaying ? (
                          // Processing animation
                          <div className="text-center space-y-4">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full mx-auto"
                            />
                            <p className="text-text-secondary">
                              {demoSteps[currentStep].content}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {currentStep === 0 && (
                              <div className="text-sm text-text-muted mb-2">Original Prompt:</div>
                            )}
                            {currentStep === 3 && (
                              <div className="text-sm text-text-muted mb-2">Enhanced Prompt:</div>
                            )}
                            
                            <div className="font-mono text-sm text-text-secondary bg-surface/50 rounded p-3 whitespace-pre-line">
                              {demoSteps[currentStep].content}
                            </div>
                            
                            {currentStep === 3 && (
                              <div className="flex items-center space-x-2 pt-3">
                                <motion.button
                                  className="flex items-center space-x-2 px-3 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Copy className="w-4 h-4" />
                                  <span className="text-sm">Copy Result</span>
                                </motion.button>
                                
                                <motion.button
                                  className="flex items-center space-x-2 px-3 py-2 bg-surface/50 border border-border/30 rounded-lg hover:border-brand-primary/30 transition-colors duration-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Download className="w-4 h-4 text-text-primary" />
                                  <span className="text-sm text-text-primary">Download</span>
                                </motion.button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
