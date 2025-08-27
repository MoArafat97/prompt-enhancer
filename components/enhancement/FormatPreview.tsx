"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { OutputFormat } from '@/lib/types';
import { OUTPUT_FORMATS } from '@/lib/constants';

interface FormatPreviewProps {
  value: OutputFormat;
}

export function FormatPreview({ value }: FormatPreviewProps) {
  const selectedFormat = OUTPUT_FORMATS.find(f => f.value === value);

  if (!selectedFormat) return null;

  return (
    <motion.div
      className="card-elevated tilt-effect w-full"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3, delay: 0.1 }}
      style={{ minHeight: '120px' }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-text-primary text-base">Format Preview:</span>
        <motion.div
          className="flex items-center gap-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-success rounded-full shadow-sm" />
          <span className="text-xs text-success font-medium">Active</span>
        </motion.div>
      </div>

      <div className="bg-surface-elevated/50 border border-border/30 rounded-lg p-4 text-sm backdrop-blur-sm overflow-x-auto min-h-[60px] flex items-center">
        {value === 'natural' && (
          <div className="text-text-primary leading-relaxed break-words w-full">
            Enhanced prompt will appear as clean, readable text that maintains natural language flow and readability. This format is perfect for direct use with AI models and provides the most human-friendly output.
          </div>
        )}
        {value === 'json' && (
          <div className="text-text-primary font-mono text-xs whitespace-pre w-full">
            <span className="text-blue-400">{`{`}</span><br />
            <span className="ml-2 text-green-400">&quot;enhanced_prompt&quot;</span>: <span className="text-yellow-400">&quot;Your enhanced prompt will appear here...&quot;</span>,<br />
            <span className="ml-2 text-green-400">&quot;metadata&quot;</span>: <span className="text-blue-400">{`{ \"format\": \"json\", \"generated_at\": \"timestamp\" }`}</span><br />
            <span className="text-blue-400">{`}`}</span>
          </div>
        )}
        {value === 'xml' && (
          <div className="text-text-primary font-mono text-xs whitespace-pre w-full">
            <span className="text-purple-400">{`<?xml version=\"1.0\" encoding=\"UTF-8\"?>`}</span><br />
            <span className="text-blue-400">{`<prompt>`}</span><br />
            <span className="ml-2 text-blue-400">{`<enhanced>`}</span><span className="text-text-primary">Your enhanced prompt will appear here...</span><span className="text-blue-400">{`</enhanced>`}</span><br />
            <span className="ml-2 text-blue-400">{`<metadata format=\"xml\" generated_at=\"timestamp\" />`}</span><br />
            <span className="text-blue-400">{`</prompt>`}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
