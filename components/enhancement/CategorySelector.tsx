"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type TechniqueCategory = 'all' | 'general' | 'writing' | 'coding';

interface CategorySelectorProps {
  value: TechniqueCategory;
  onChange: (value: TechniqueCategory) => void;
  disabled?: boolean;
}

const CATEGORIES = [
  {
    value: 'all' as const,
    label: 'All Categories',
    icon: '🎯',
    description: 'Show all available enhancement techniques',
    color: 'from-blue-500 to-purple-600'
  },
  {
    value: 'general' as const,
    label: 'General Purpose',
    icon: '⚡',
    description: 'Core techniques and business frameworks',
    color: 'from-green-500 to-blue-500'
  },
  {
    value: 'writing' as const,
    label: 'Creative Writing',
    icon: '✍️',
    description: 'Storytelling and content creation techniques',
    color: 'from-purple-500 to-pink-500'
  },
  {
    value: 'coding' as const,
    label: 'Coding/Technical',
    icon: '🔧',
    description: 'Technical analysis and system design frameworks',
    color: 'from-orange-500 to-red-500'
  }
];

export function CategorySelector({
  value,
  onChange,
  disabled = false
}: CategorySelectorProps) {
  const selectedCategory = CATEGORIES.find(c => c.value === value);

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
    >
      {/* Label */}
      <Label className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-brand-primary" />
        <span>Category Filter</span>
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
            {selectedCategory && (
              <motion.div
                className="flex items-center gap-3 py-2 sm:gap-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${selectedCategory.color} rounded-lg shadow-md`}
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-lg text-white">
                    {selectedCategory.icon}
                  </span>
                </motion.div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-text-primary text-base">
                    {selectedCategory.label}
                  </div>
                </div>
              </motion.div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="selector-content">
          {CATEGORIES.map((category, index) => (
            <SelectItem
              key={category.value}
              value={category.value}
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
                  className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${category.color} rounded-lg shadow-sm flex-shrink-0 mt-0.5`}
                  whileHover={{
                    scale: 1.15,
                    rotate: 10
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="text-sm text-white">
                    {category.icon}
                  </span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-text-primary break-words">
                    {category.label}
                  </div>
                  <div className="text-xs text-text-secondary mt-1 leading-relaxed break-words">
                    {category.description}
                  </div>
                </div>
              </motion.div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Enhanced Description */}
      {selectedCategory && (
        <motion.div
          className="card-elevated"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start space-x-3">
            <motion.div
              className={`w-3 h-3 bg-gradient-to-r ${selectedCategory.color} rounded-full mt-1 flex-shrink-0 shadow-sm`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary leading-relaxed break-words">
                <span className="font-semibold text-text-primary">{selectedCategory.label}:</span>{' '}
                {selectedCategory.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
