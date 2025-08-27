"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Edit3,
  Settings,
  CheckCircle,
  ArrowDown,
  ExternalLink
} from 'lucide-react';
import {
  GradientMeshBackground,
  AnimatedSection,
  StaggeredAnimation
} from '@/components/animations/ParallaxBackground';
import { navigateToSection } from '@/lib/navigation';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  ctaText?: string;
  ctaAction?: () => void;
}

function StepCard({ step, title, description, icon, delay = 0, ctaText, ctaAction }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      {/* Enhanced Connecting Line with Arrow */}
      {step < 3 && (
        <motion.div
          className="absolute top-7 left-7 flex flex-col items-center z-0"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.5 }}
        >
          <div className="w-1 h-16 bg-gradient-to-b from-brand-primary via-brand-secondary to-transparent" />
          <motion.div
            className="mt-1"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-6 h-6 text-brand-primary" />
          </motion.div>
        </motion.div>
      )}

      <motion.div
        className="glass-card p-5 transition-all duration-300 relative z-10 min-h-[140px] sm:min-h-[150px] flex flex-col justify-center hover:scale-[1.02] hover:shadow-glow-lg"
        whileHover={{
          y: -2,
          boxShadow: "0 25px 50px -12px rgba(102, 126, 234, 0.35), 0 0 40px rgba(102, 126, 234, 0.4)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-center space-x-5">
          {/* Enhanced Step Number Circle */}
          <motion.div
            className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="font-bold text-white text-3xl">{step}</span>
          </motion.div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary leading-tight">
                  {title}
                </h3>
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {icon}
                </motion.div>
              </div>
            </div>

            <p className="text-text-secondary leading-relaxed text-base">
              {description}
            </p>

            {/* Call-to-Action Link */}
            {ctaText && (
              <motion.button
                onClick={ctaAction}
                className="inline-flex items-center space-x-2 text-brand-primary hover:text-brand-secondary transition-colors duration-200 text-sm font-medium group"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span>{ctaText}</span>
                <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main HowItWorks Component
export function HowItWorks() {
  const handleStepAction = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        // Scroll to prompt input and focus the textarea
        navigateToSection('prompt-input');
        break;
      case 2:
        // Scroll to technique selector and highlight it
        navigateToSection('technique-selector');
        break;
      case 3:
        // Scroll to results section or interface if no results
        const resultsElement = document.querySelector('#results-section');
        if (resultsElement) {
          navigateToSection('results');
        } else {
          navigateToSection('interface');
        }
        break;
      default:
        navigateToSection('interface');
    }
  };

  const steps = [
    {
      title: "Enter Your Prompt",
      description: "Type or paste your original prompt to get started with enhancement. Our interface supports prompts of any length and complexity.",
      icon: <Edit3 className="w-8 h-8 text-blue-400" />,
      ctaText: "Try entering a prompt",
      ctaAction: () => handleStepAction(1)
    },
    {
      title: "Choose Your Method",
      description: "Select from multiple enhancement techniques including clarity, chain-of-thought, few-shot, role-based, and creative approaches.",
      icon: <Settings className="w-8 h-8 text-purple-400" />,
      ctaText: "Explore techniques",
      ctaAction: () => handleStepAction(2)
    },
    {
      title: "Get Enhanced Results",
      description: "Receive your improved prompt with detailed explanations, formatting options, and actionable improvements for better AI responses.",
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      ctaText: "See example results",
      ctaAction: () => handleStepAction(3)
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-visible">
      {/* Parallax Background */}
      <GradientMeshBackground />
      {/* Soft overlay to improve contrast and avoid blocky clipping */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/80 via-background/40 to-transparent z-[5]" />

      <AnimatedSection animation="fadeIn" delay={0.2}>
        <div className="text-center space-y-8 relative z-10 mb-16 max-w-6xl mx-auto px-4">
            <AnimatedSection animation="slideUp" delay={0.3}>
              <motion.h2
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
                whileInView={{ scale: [0.95, 1.02, 1] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                style={{ position: 'relative', transform: 'none', willChange: 'auto' }}
              >
                How it works
              </motion.h2>
            </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={0.5}>
            <motion.p
              className="text-text-secondary max-w-3xl mx-auto text-xl leading-relaxed font-light"
              whileInView={{ opacity: [0, 1], y: [20, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ position: 'relative', transform: 'none', willChange: 'auto', lineHeight: '1.7' }}
            >
              Transform your prompts in three simple steps with our interactive enhancement process
            </motion.p>
          </AnimatedSection>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <StaggeredAnimation staggerDelay={0.2} childAnimation="slideUp">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <StepCard
                    step={index + 1}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                    ctaText={step.ctaText}
                    ctaAction={step.ctaAction}
                    delay={0}
                  />
                </motion.div>
              ))}
            </div>
          </StaggeredAnimation>
        </div>
      </AnimatedSection>
    </section>
  );
}
