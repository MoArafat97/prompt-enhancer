"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, ChevronUp, Zap, TestTube, CheckCircle, XCircle, Clock, Gauge, Star } from 'lucide-react';
import { AVAILABLE_MODELS, DEFAULT_MODEL } from '@/lib/constants';
import { Tooltip, PerformanceBadge } from '@/components/ui/tooltip';

export function ModelInfo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const testModels = async () => {
    setIsTesting(true);
    setTestResults(null);

    try {
      const response = await fetch('/api/test-models');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      setTestResults({
        success: false,
        error: 'Test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsTesting(false);
    }
  };

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
        className="w-full flex items-center justify-between text-left hover:bg-surface/50 rounded-lg p-2 transition-colors duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
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
                AI Models
              </h3>
              <PerformanceBadge type="free" />
            </div>
            <p className="text-sm text-text-muted">
              Currently using: {DEFAULT_MODEL.name} • Active
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
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-text-secondary">
                All models are completely free through OpenRouter:
              </div>
              <motion.button
                onClick={testModels}
                disabled={isTesting}
                className="flex items-center space-x-2 text-xs bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TestTube className="w-3 h-3" />
                <span>{isTesting ? 'Testing...' : 'Test Models'}</span>
              </motion.button>
            </div>

            {testResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="text-sm font-medium text-text-primary mb-2">
                  Test Results
                </div>

                {testResults.summary && (
                  <div className="text-xs text-text-secondary mb-2">
                    {testResults.summary.working}/{testResults.summary.total} models working
                  </div>
                )}

                {testResults.recommendation && (
                  <div className="text-xs text-text-secondary">
                    💡 {testResults.recommendation}
                  </div>
                )}

                {!testResults.success && (
                  <div className="text-xs text-error">
                    {testResults.message}
                  </div>
                )}
              </motion.div>
            )}
            
            {AVAILABLE_MODELS.map((model, index) => {
              const modelResult = testResults?.results?.find((r: any) => r.id === model.id);
              
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

              return (
                <Tooltip key={model.id} content={tooltipContent} side="right">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`
                      p-3 rounded-lg border transition-all duration-200 cursor-pointer
                      hover:border-brand-primary/30 hover:bg-brand-primary/5
                      ${model.id === DEFAULT_MODEL.id
                        ? 'border-brand-primary/50 bg-brand-primary/5'
                        : 'border-border/30 bg-background/50'
                      }
                    `}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-text-primary text-sm">
                            {model.name.split(' ')[0]} {model.name.split(' ')[1]}
                          </h4>
                          {model.id === DEFAULT_MODEL.id && (
                            <motion.span 
                              className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Active
                            </motion.span>
                          )}
                          {modelResult && (
                            <motion.span 
                              className={`text-xs px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                                modelResult.status === 'working'
                                  ? 'bg-success/20 text-success'
                                  : 'bg-error/20 text-error'
                              }`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              {modelResult.status === 'working' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>{modelResult.status === 'working' ? 'Working' : 'Failed'}</span>
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
                    Why OpenRouter?
                  </p>
                  <p>
                    OpenRouter provides free access to multiple state-of-the-art AI models 
                    from different providers, giving you the best results without any cost.
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
