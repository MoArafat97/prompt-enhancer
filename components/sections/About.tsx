"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Lightbulb, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  GradientMeshBackground,
  AnimatedSection,
  StaggeredAnimation,
  ParallaxText
} from '@/components/animations/ParallaxBackground';

interface StatCardProps {
  number: string;
  label: string;
  delay?: number;
}

function StatCard({ number, label, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>

        {/* Stat number */}
        <motion.div
          className="relative text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-4"
          whileInView={{ scale: [0.8, 1.1, 1] }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          viewport={{ once: true }}
        >
          {number}
        </motion.div>
      </motion.div>

      {/* Stat label */}
      <div className="text-text-secondary font-semibold text-lg group-hover:text-text-primary transition-colors duration-300">
        {label}
      </div>
    </motion.div>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function BenefitCard({ icon, title, description, delay = 0 }: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, margin: "-50px" }}
      className="flex items-start space-x-5 group"
    >
      <motion.div
        className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-glow"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
      <div className="flex-1">
        <h3 className="font-heading text-xl font-semibold text-text-primary mb-3 group-hover:text-brand-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-text-secondary leading-relaxed text-base">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function About() {
  const stats = [
    { number: "5+", label: "Enhancement Techniques" },
    { number: "3", label: "Output Formats" },
    { number: "∞", label: "Usage Limits" },
    { number: "100%", label: "Privacy Focused" }
  ];

  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Improved AI Responses",
      description: "Get more accurate, relevant, and useful responses from AI models by crafting better prompts."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Increased Productivity",
      description: "Save time and effort by generating effective prompts quickly instead of trial and error."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: "Learn Best Practices",
      description: "Understand prompt engineering principles through our enhancement suggestions and explanations."
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "For Everyone",
      description: "Whether you're a beginner or expert, our tool adapts to your skill level and needs."
    }
  ];

  const useCases = [
    {
      icon: "🎨",
      title: "Content Creators",
      description: "Generate better AI content for blogs, social media, and marketing materials"
    },
    {
      icon: "👨‍💻",
      title: "Developers",
      description: "Build more effective AI-powered applications and integrations"
    },
    {
      icon: "🔬",
      title: "Researchers",
      description: "Conduct better experiments and analysis with language models"
    },
    {
      icon: "🎓",
      title: "Students",
      description: "Learn prompt engineering principles and AI interaction best practices"
    },
    {
      icon: "💼",
      title: "Business Professionals",
      description: "Maximize productivity with AI tools in daily workflows"
    },
    {
      icon: "🌟",
      title: "AI Enthusiasts",
      description: "Explore the full potential of AI through better prompt crafting"
    }
  ];

  return (
    <section className="relative overflow-hidden py-24 space-y-24" id="about-section">
      {/* Background */}
      <GradientMeshBackground />

      {/* Section Transition Spacer */}
      <div className="h-20"></div>

      <div className="space-y-24">
        <AnimatedSection animation="fadeIn" delay={0.2}>
          {/* Header */}
          <div className="text-center space-y-6 relative z-10 max-w-6xl mx-auto px-4">
            <AnimatedSection animation="slideUp" delay={0.3}>
              <motion.h2
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight"
                whileInView={{ scale: [0.95, 1.02, 1] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                About Prompt Enhancer
              </motion.h2>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.5}>
              <motion.p
                className="text-text-secondary max-w-4xl mx-auto text-xl leading-relaxed font-light"
                whileInView={{ opacity: [0, 1], y: [20, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ lineHeight: '1.8' }}
              >
                Prompt Enhancer is a powerful, free tool designed to help you create better prompts for AI models.
                Our mission is to democratize access to effective prompt engineering techniques, making AI more
                accessible and useful for everyone.
              </motion.p>
            </AnimatedSection>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.7}>
          {/* Stats Section */}
          <div className="max-w-6xl mx-auto relative z-10 px-4">
            <div className="space-y-16">
              <h3 className="text-center font-heading text-2xl md:text-3xl font-bold text-text-primary">
                Trusted by Thousands
              </h3>

              <StaggeredAnimation staggerDelay={0.1} childAnimation="slideUp">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
                  {stats.map((stat, index) => (
                    <StatCard
                      key={index}
                      number={stat.number}
                      label={stat.label}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </StaggeredAnimation>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.9}>
          {/* Main Content */}
          <div className="max-w-7xl mx-auto relative z-10 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              {/* Benefits */}
              <div className="space-y-8">
                <h3 className="font-heading text-3xl font-bold text-text-primary leading-tight">
                  Why Use Prompt Enhancer?
                </h3>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <BenefitCard
                      key={index}
                      icon={benefit.icon}
                      title={benefit.title}
                      description={benefit.description}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="space-y-8">
                <h3 className="font-heading text-3xl font-bold text-text-primary leading-tight">
                  Perfect For
                </h3>
                <div className="space-y-6">
                  {useCases.map((useCase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4 group"
                    >
                      <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center flex-shrink-0 text-xl group-hover:scale-110 transition-transform duration-300">
                        {useCase.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading text-lg font-semibold text-text-primary mb-2 group-hover:text-brand-primary transition-colors duration-300 leading-tight">
                          {useCase.title}
                        </h4>
                        <p className="text-text-secondary text-base leading-relaxed" style={{ lineHeight: '1.6' }}>
                          {useCase.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={1.1}>
          {/* Call to Action */}
          <div className="text-center relative z-10 max-w-4xl mx-auto px-4">
            <div className="glass-card p-12 space-y-8">
              <div className="space-y-6">
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                  Transform Your AI Interactions Today
                </h3>
                <p className="text-text-secondary text-xl leading-relaxed font-light max-w-3xl mx-auto" style={{ lineHeight: '1.7' }}>
                  Join thousands of creators, developers, and professionals who are already achieving
                  better results with AI through enhanced prompts. Start your journey to more effective
                  AI communication now.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  onClick={() => {
                    const element = document.querySelector('#prompt-enhancer-interface');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="button-primary px-8 py-4 text-lg font-semibold inline-flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Start Enhancing Prompts</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <div className="flex items-center space-x-2 text-text-secondary text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free • No signup required • Instant results</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
