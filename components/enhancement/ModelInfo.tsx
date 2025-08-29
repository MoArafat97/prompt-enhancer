"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp, Zap, CheckCircle, XCircle, Clock, Gauge, Star } from 'lucide-react';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '@/lib/constants';
import { Tooltip, PerformanceBadge } from '@/components/ui/tooltip';

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel) || DEFAULT_MODEL;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="glass-card p-4 tilt-effect"
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between text-left hover:bg-surface/50 rounded-lg p-2 transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        whileHover={disabled ? {} : { scale: 1.01 }}
        whileTap={disabled ? {} : { scale: 0.99 }}
        disabled={disabled}
      >
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
            {/* Pulsing Status Indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-heading font-semibold text-text-primary">
                AI Model
              </h3>
              <PerformanceBadge type="free" />
            </div>
            <p className="text-sm text-text-muted">
              Currently using: {currentModel.name}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            <div className="mb-3">
              <div className="text-sm text-text-secondary">
                Choose your preferred free AI model:
              </div>
            </div>
            
            {AVAILABLE_MODELS.map((model, index) => {
              // Determine performance characteristics
              const getPerformanceBadges = (model: any) => {
                const badges = [];
                if (model.free) badges.push('free');
                if (model.name.includes('3B') || model.name.includes('Mini')) badges.push('fast');
                if (model.name.includes('8B') || model.name.includes('9B')) badges.push('quality');
                return badges;
              };

              const tooltipContent = (
                <div className="space-y-2">
                  <div className="font-medium text-text-primary">{model.name}</div>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>Max Tokens: {model.maxTokens.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gauge className="w-3 h-3" />
                      <span>Provider: {model.provider}</span>
                    </div>
                    <div className="text-text-secondary">{model.description}</div>
                  </div>
                </div>
              );

              const isSelected = model.id === selectedModel;

              return (
                <Tooltip key={model.id} content={tooltipContent} side="right">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`
                      p-3 rounded-lg border transition-all duration-200 cursor-pointer
                      hover:border-brand-primary/30 hover:bg-brand-primary/5
                      ${isSelected
                        ? 'border-brand-primary/50 bg-brand-primary/5'
                        : 'border-border/30 bg-background/50'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!disabled && onModelChange) {
                        try {
                          console.log('Model selected:', model.id);
                          onModelChange(model.id);
                        } catch (error) {
                          console.error('Error in model selection:', error);
                        }
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-text-primary text-sm">
                            {model.name.split(' ')[0]} {model.name.split(' ')[1]}
                          </h4>
                          {isSelected && (
                            <motion.span
                              className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Selected
                            </motion.span>
                          )}
                        </div>
                        
                        {/* Performance Badges */}
                        <div className="flex items-center space-x-1 mb-2">
                          {getPerformanceBadges(model).map((badge) => (
                            <PerformanceBadge key={badge} type={badge as any} />
                          ))}
                        </div>
                        
                        <p className="text-xs text-text-muted mb-2">
                          {model.description}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-xs text-text-muted">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{model.maxTokens.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Gauge className="w-3 h-3" />
                            <span>{model.provider}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Tooltip>
              );
            })}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 p-3 bg-brand-primary/5 border border-brand-primary/20 rounded-lg"
            >
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-brand-primary mt-0.5 flex-shrink-0" />
                <div className="text-xs text-text-secondary">
                  <p className="font-medium text-brand-primary mb-1">
                    All Models Free
                  </p>
                  <p>
                    All models are completely free through OpenRouter. Choose the one that works best for your needs.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Backward compatibility - export as ModelInfo for existing usage
export const ModelInfo = ModelSelector;
