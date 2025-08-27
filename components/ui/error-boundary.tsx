"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center space-y-4"
    >
      <motion.div
        className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertTriangle className="w-8 h-8 text-error" />
      </motion.div>
      
      <div className="space-y-2">
        <h3 className="font-heading text-lg font-semibold text-text-primary">
          Something went wrong
        </h3>
        <p className="text-sm text-text-secondary max-w-md">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
      
      <Button
        onClick={resetError}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </Button>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="text-xs text-text-muted cursor-pointer">
            Error Details (Development)
          </summary>
          <pre className="mt-2 text-xs text-text-muted bg-surface p-2 rounded overflow-auto max-w-md">
            {error.stack}
          </pre>
        </details>
      )}
    </motion.div>
  );
}
