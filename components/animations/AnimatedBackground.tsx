"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FloatingParticles } from './FloatingParticles';
import { AnimatedBackgroundProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Gradient Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-secondary rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-accent rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      
      {/* Additional smaller orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-primary rounded-full opacity-15 blur-2xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-accent rounded-full opacity-15 blur-2xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />
      
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-5"
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-transparent to-background/30" />
    </div>
  );
}
