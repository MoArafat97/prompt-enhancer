"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileType } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { OutputFormatSelectorProps } from '@/lib/types';
import { OUTPUT_FORMATS } from '@/lib/constants';

export function OutputFormatSelector({ 
  value, 
  onChange, 
  disabled 
}: OutputFormatSelectorProps) {
  const selectedFormat = OUTPUT_FORMATS.find(f => f.value === value);

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Label */}
      <Label className="flex items-center space-x-2">
        <FileType className="w-4 h-4 text-brand-primary" />
        <span>Output Format</span>
      </Label>

      {/* Select Component */}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className={`
          selector-trigger min-h-[64px] w-full py-3
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
          <SelectValue>
            {selectedFormat && (
              <motion.div
                className="flex items-center gap-3 py-2 sm:gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex items-center justify-center w-10 h-10 bg-gradient-accent rounded-lg shadow-md icon-pulse"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="text-sm font-mono font-bold text-white icon-rotate">
                    {selectedFormat.icon}
                  </span>
                </motion.div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-text-primary text-base">
                    {selectedFormat.label}
                  </div>
                </div>
              </motion.div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="selector-content">
          {OUTPUT_FORMATS.map((format, index) => (
            <SelectItem
              key={format.value}
              value={format.value}
              className="selector-item py-3 px-4"
            >
              <motion.div
                className="flex items-start gap-4 py-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ x: 3 }}
              >
                <motion.div
                  className="flex items-center justify-center w-8 h-8 bg-gradient-accent rounded-lg shadow-sm flex-shrink-0 mt-0.5"
                  whileHover={{
                    scale: 1.15,
                    backgroundColor: 'rgba(79, 172, 254, 0.8)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="text-xs font-mono font-bold text-white icon-rotate">
                    {format.icon}
                  </span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary break-words">
                    {format.label}
                  </div>
                  <div className="text-xs text-text-secondary mt-1 leading-relaxed break-words">
                    {format.description}
                  </div>
                </div>
              </motion.div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Enhanced Description */}
      {selectedFormat && (
        <motion.div
          className="card-elevated"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            <motion.div
              className="w-3 h-3 bg-gradient-accent rounded-full mt-1 flex-shrink-0 shadow-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary leading-relaxed break-words">
                <span className="font-semibold text-text-primary">{selectedFormat.label}:</span>{' '}
                {selectedFormat.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}


    </motion.div>
  );
}
