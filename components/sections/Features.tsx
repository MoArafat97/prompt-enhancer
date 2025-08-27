"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  FileText, 
  Download, 
  Clock, 
  Shield,
  Sparkles,
  Target,
  Layers,
  Wand2
} from 'lucide-react';
import {
  GradientMeshBackground,
  AnimatedSection,
  StaggeredAnimation
} from '@/components/animations/ParallaxBackground';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, color, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className="relative group h-full"
    >
      <motion.div
        className="glass-card p-6 h-full min-h-[280px] sm:min-h-[300px] transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-lg flex flex-col"
        whileHover={{
          y: -4,
          boxShadow: "0 25px 50px -12px rgba(102, 126, 234, 0.25), 0 0 30px rgba(102, 126, 234, 0.3)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex flex-col items-center text-center space-y-4 flex-1">
          {/* Icon */}
          <motion.div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${color}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>

          {/* Content */}
          <div className="space-y-4 flex-1 flex flex-col justify-center px-2">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary leading-tight min-h-[3rem] flex items-center justify-center text-center">
              {title}
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm max-w-[280px] mx-auto line-clamp-3 overflow-hidden text-center">
              {description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Features() {
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-white" />,
      title: "Smart Enhancement Techniques",
      description: "Transform prompts with clarity, chain-of-thought, and role-based methods for better AI responses.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Instant Results",
      description: "Get immediate prompt improvements with our optimized processing. No waiting, just results.",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Precision Analysis",
      description: "Receive targeted improvements for clarity, specificity, and effectiveness in every prompt.",
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      icon: <FileText className="w-8 h-8 text-white" />,
      title: "Flexible Export Options",
      description: "Export in natural language, JSON, or XML formats to fit seamlessly into your workflow.",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Privacy First",
      description: "Your prompts are processed securely and never stored. Complete privacy guaranteed.",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      title: "Unlimited Usage",
      description: "Enhance as many prompts as you need without restrictions. Perfect for teams and power users.",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-visible" id="features-section">
      {/* Background */}
      <GradientMeshBackground />

      <div className="space-y-16">
        <AnimatedSection animation="fadeIn" delay={0.2}>
        <div className="text-center space-y-8 relative z-10 mb-16 max-w-6xl mx-auto px-4">
          <AnimatedSection animation="slideUp" delay={0.3}>
            <motion.h2
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
              whileInView={{ scale: [0.95, 1.02, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                transform: 'none',
                willChange: 'auto'
              }}
            >
              Powerful Features
            </motion.h2>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={0.5}>
            <motion.p
              className="text-text-secondary max-w-3xl mx-auto text-xl leading-relaxed font-light"
              whileInView={{ opacity: [0, 1], y: [20, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                transform: 'none',
                willChange: 'auto',
                lineHeight: '1.7'
              }}
            >
              Discover the essential tools that make Prompt Enhancer
              the ultimate solution for improving your AI interactions
            </motion.p>
          </AnimatedSection>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 mb-16">
          <StaggeredAnimation staggerDelay={0.1} childAnimation="slideUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </StaggeredAnimation>
        </div>

        {/* Call to Action - Relocated to bottom center */}
        <AnimatedSection animation="slideUp" delay={0.8}>
          <div className="text-center relative z-10 pt-8">
            <motion.button
              onClick={() => {
                const element = document.querySelector('#prompt-enhancer-interface');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="button-primary px-10 py-4 text-lg font-semibold shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:ring-offset-2 focus:ring-offset-background"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Navigate to prompt enhancer interface to try the tool"
            >
              <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
              Try It Now
            </motion.button>
          </div>
        </AnimatedSection>
        </AnimatedSection>
      </div>
    </section>
  );
}
