"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TechniqueSelectorProps } from '@/lib/types';
import { ALL_TECHNIQUES, GENERAL_TECHNIQUES, WRITING_TECHNIQUES, CODING_TECHNIQUES } from '@/lib/techniques';
import { TechniqueCategory } from './CategorySelector';

interface ExtendedTechniqueSelectorProps extends TechniqueSelectorProps {
  category?: TechniqueCategory;
}

export function TechniqueSelector({
  value,
  onChange,
  disabled,
  category = 'all'
}: ExtendedTechniqueSelectorProps) {
  // Filter techniques based on selected category
  const filteredTechniques = useMemo(() => {
    switch (category) {
      case 'general':
        return GENERAL_TECHNIQUES;
      case 'writing':
        return WRITING_TECHNIQUES;
      case 'coding':
        return CODING_TECHNIQUES;
      case 'all':
      default:
        return ALL_TECHNIQUES;
    }
  }, [category]);

  // Convert to the format expected by the UI
  const enhancementTechniques = useMemo(() =>
    filteredTechniques.map(t => ({
      value: t.value,
      label: t.label,
      icon: t.icon,
      description: t.description,
      category: t.category
    })), [filteredTechniques]
  );

  const selectedTechnique = enhancementTechniques.find(t => t.value === value);

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Label */}
      <Label className="flex items-center space-x-2">
        <Zap className="w-4 h-4 text-brand-primary" />
        <span>Enhancement Technique</span>
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
            {selectedTechnique && (
              <motion.div
                className="flex items-center gap-3 py-2 sm:gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex items-center justify-center w-10 h-10 bg-gradient-primary rounded-lg shadow-md icon-pulse"
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-lg text-white icon-rotate">
                    {selectedTechnique.icon}
                  </span>
                </motion.div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-text-primary text-base">
                    {selectedTechnique.label}
                  </div>
                </div>
              </motion.div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="selector-content">
          {enhancementTechniques.map((technique, index) => (
            <SelectItem
              key={technique.value}
              value={technique.value}
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
                  className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg shadow-sm flex-shrink-0 mt-0.5"
                  whileHover={{
                    scale: 1.15,
                    rotate: 10
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="text-sm text-white icon-rotate">
                    {technique.icon}
                  </span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary break-words">
                    {technique.label}
                  </div>
                  <div className="text-xs text-text-secondary mt-1 leading-relaxed break-words">
                    {technique.description}
                  </div>
                </div>
              </motion.div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Enhanced Description */}
      {selectedTechnique && (
        <motion.div
          className="card-elevated"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            <motion.div
              className="w-3 h-3 bg-gradient-primary rounded-full mt-1 flex-shrink-0 shadow-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary leading-relaxed break-words">
                <span className="font-semibold text-text-primary">{selectedTechnique.label}:</span>{' '}
                {selectedTechnique.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
