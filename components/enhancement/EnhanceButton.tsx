"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/animations/LoadingSpinner';
import { EnhanceButtonProps } from '@/lib/types';

export function EnhanceButton({ 
  onClick, 
  isLoading, 
  disabled 
}: EnhanceButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.div
      className="flex flex-col space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Button
        onClick={onClick}
        disabled={isDisabled}
        aria-label={isLoading ? "Enhancing prompt, please wait" : "Enhance your prompt with AI"}
        aria-describedby="enhance-status"
        className={`
          button-primary h-14 w-full relative overflow-hidden group text-base font-semibold
          ${isLoading ? 'cursor-wait' : ''}
          ${isDisabled ? 'opacity-50' : ''}
        `}
        asChild={false}
      >
        <motion.div
          className="flex items-center justify-center gap-2 relative z-10"
          whileHover={!isDisabled ? { scale: 1.02 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold"
              >
                Enhancing...
              </motion.span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="font-semibold">Enhance Prompt</span>
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Zap className="w-4 h-4" />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Animated Background Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
          animate={!isDisabled ? {
            background: [
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Shimmer Effect */}
        {!isLoading && !isDisabled && (
          <motion.div
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        )}
      </Button>

      {/* Progress Indicator */}
      {isLoading && (
        <motion.div
          className="progress-indicator mt-2"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="progress-bar"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      )}

      {/* Status Text */}
      <motion.div
        id="enhance-status"
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        aria-live="polite"
      >
        {isLoading ? (
          <motion.p
            className="text-xs text-text-muted"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Processing your prompt with AI...
          </motion.p>
        ) : isDisabled ? (
          <p className="text-xs text-text-muted">
            Enter a prompt to get started
          </p>
        ) : (
          <motion.p
            className="text-xs text-text-secondary"
            whileHover={{ scale: 1.05 }}
          >
            Click to enhance your prompt with AI
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
