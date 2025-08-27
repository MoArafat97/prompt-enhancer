"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  Clock,
  Sparkles,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingPulse } from '@/components/animations/LoadingSpinner';
import { ResultDisplayProps } from '@/lib/types';
import { copyToClipboard, formatProcessingTime, formatDisplayText } from '@/lib/utils';
import { DEFAULT_MODEL } from '@/lib/constants';
import { useToast } from '@/components/ui/toast';
import { SavePromptButton } from './SavePromptButton';
import { AuthModal } from '@/components/auth/AuthModal';

export function ResultDisplay({
  result,
  isLoading,
  format,
  technique
}: ResultDisplayProps & { technique?: string }) {
  const [copied, setCopied] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleCopy = async () => {
    if (!result) return;

    const success = await copyToClipboard(result.enhanced);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      addToast({
        type: 'success',
        title: 'Copied to Clipboard!',
        description: 'Enhanced prompt has been copied to your clipboard.',
        duration: 3000
      });
    } else {
      addToast({
        type: 'error',
        title: 'Copy Failed',
        description: 'Unable to copy to clipboard. Please try again.',
        duration: 4000
      });
    }
  };

  const handleDownload = () => {
    if (!result) return;

    try {
      const blob = new Blob([result.enhanced], { type: 'text/plain' });
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
        title: 'Download Started!',
        description: 'Enhanced prompt has been downloaded as a text file.',
        duration: 3000
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Download Failed',
        description: 'Unable to download the file. Please try again.',
        duration: 4000
      });
    }
  };

  if (!isLoading && !result) {
    return null;
  }

  // Additional safety check
  if (!isLoading && result && (!result.enhanced || typeof result.enhanced !== 'string')) {
    console.error('Invalid result structure:', result);
    return (
      <div className="text-center p-8">
        <p className="text-error">Invalid response format. Please try again.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Results Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <div>
            <h2 className="font-heading text-xl font-semibold text-text-primary">
              Enhanced Result
            </h2>
            <p className="text-sm text-text-muted">
              {isLoading ? 'Processing...' : `Ready to use • ${DEFAULT_MODEL.name}`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {result && !isLoading && (
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SavePromptButton
              result={result}
              onAuthRequired={() => setAuthModalOpen(true)}
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center space-x-2"
            >
              <motion.div
                animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </motion.div>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Main Result Card */}
      <Card className={`card tilt-effect overflow-hidden ${technique ? `technique-${technique}` : ''}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-brand-primary" />
              <span>Enhanced Prompt</span>
            </div>
            
            {result && (
              <motion.div
                className="flex items-center space-x-4 text-xs text-text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {result.metadata?.processingTime
                      ? formatProcessingTime(result.metadata.processingTime)
                      : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3" />
                  <span>{result.technique || 'Unknown'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>{result.format || 'Unknown'}</span>
                </div>
              </motion.div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <LoadingPulse />
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="skeleton h-4"
                      style={{ width: `${100 - i * 10}%` }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Enhanced Text */}
                <div className="relative">
                  <pre className="whitespace-pre-wrap font-body text-sm text-text-primary bg-background rounded-lg p-4 border border-border/50 overflow-x-auto max-h-[500px] overflow-y-auto">
                    {formatDisplayText(result.enhanced)}
                  </pre>
                  
                  {/* Gradient Overlay for Long Text */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                </div>

                {/* Metadata */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="text-xs text-text-muted mb-1">Technique</div>
                    <div className="text-sm font-medium text-text-primary capitalize">
                      {result.technique ? result.technique.replace('-', ' ') : 'Unknown'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-text-muted mb-1">Format</div>
                    <div className="text-sm font-medium text-text-primary uppercase">
                      {result.format || 'Unknown'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-text-muted mb-1">Confidence</div>
                    <div className="text-sm font-medium text-success">
                      {result.metadata?.confidence
                        ? Math.round(result.metadata.confidence * 100) + '%'
                        : 'N/A'
                      }
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </motion.div>
  );
}
