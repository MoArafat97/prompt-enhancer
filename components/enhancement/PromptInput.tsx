"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PromptInputProps } from '@/lib/types';
import { validatePrompt, debounce } from '@/lib/utils';
import { UI_CONFIG } from '@/lib/constants';

export function PromptInput({ 
  value, 
  onChange, 
  placeholder, 
  disabled 
}: PromptInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const resizeTextarea = () => {
      if (textareaRef.current) {
        // Reset height to auto to calculate the correct scrollHeight
        textareaRef.current.style.height = 'auto';
        // Set height to scrollHeight to fit content, with a max of 400px
        const newHeight = Math.min(textareaRef.current.scrollHeight, 400);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    };

    // Use requestAnimationFrame for smoother resizing
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(resizeTextarea);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Debounced validation
  const debouncedValidation = useCallback(
    debounce((text: string) => {
      const validation = validatePrompt(text);
      setError(validation.isValid ? null : validation.error || null);
    }, UI_CONFIG.DEBOUNCE_DELAY),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedValidation(newValue);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const characterCount = value.length;
  const maxLength = 10000;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <div className="flex items-center justify-between">
        <Label htmlFor="prompt-input" className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-brand-primary" aria-hidden="true" />
          <span>Your Prompt</span>
        </Label>
        
        {/* Character Count */}
        <motion.div
          className={`text-xs ${
            isOverLimit
              ? 'char-count-danger'
              : isNearLimit
                ? 'char-count-warning'
                : 'char-count-safe'
          }`}
          animate={{
            scale: isOverLimit ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 0.3,
            repeat: isOverLimit ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {characterCount.toLocaleString()} / {maxLength.toLocaleString()}
        </motion.div>
      </div>

      {/* Input Container */}
      <motion.div
        className="relative tilt-effect"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Textarea
          ref={textareaRef}
          id="prompt-input"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Enter your prompt to enhance"
          aria-describedby={error ? "prompt-error" : "prompt-help"}
          aria-invalid={!!error}
          className={`
            w-full transition-all duration-200
            ${isFocused ? 'shadow-glow' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          maxLength={maxLength}
        />
        
        {/* Focus Ring Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-brand-primary/20 pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            id="prompt-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2 text-sm text-error"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      {!error && (
        <motion.p
          id="prompt-help"
          className="text-xs text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Describe what you want the AI to do. Be specific for better results.
        </motion.p>
      )}
    </motion.div>
  );
}
