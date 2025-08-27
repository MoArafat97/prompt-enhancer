"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxBackground({ children, className = '', speed = 0.5 }: ParallaxBackgroundProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  return (
    <motion.div
      style={{ y }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Gradient Mesh Background Component
export function GradientMeshBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="absolute inset-0 overflow-visible pointer-events-none">
      {/* Soft radial mask to avoid blocky shapes behind content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,11,0.3)_60%,rgba(10,10,11,0.4)_100%)]" />

      {/* Primary gradient mesh */}
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-56 -left-56 w-[480px] h-[480px] bg-gradient-to-br from-brand-primary/15 via-brand-primary/8 to-transparent rounded-full blur-[90px] opacity-70"
      />

      {/* Secondary gradient mesh */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -right-56 w-[420px] h-[420px] bg-gradient-to-bl from-brand-secondary/15 via-brand-secondary/8 to-transparent rounded-full blur-[90px] opacity-70"
      />

      {/* Tertiary gradient mesh */}
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-success/12 via-success/6 to-transparent rounded-full blur-[80px] opacity-60"
      />

      {/* Floating particles - lighter so they don't read as dots behind text */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-brand-primary/20 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Intersection Observer Hook
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Animated Section Component with Intersection Observer
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
  duration?: number;
}

export function AnimatedSection({
  children,
  className = '',
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
}: AnimatedSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const getAnimationVariants = () => {
    switch (animation) {
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'fadeIn':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered Children Animation Component
interface StaggeredAnimationProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  childAnimation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
}

export function StaggeredAnimation({
  children,
  className = '',
  staggerDelay = 0.1,
  childAnimation = 'slideUp',
}: StaggeredAnimationProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const getChildVariants = () => {
    switch (childAnimation) {
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0 },
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0 },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      case 'fadeIn':
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const childVariants = getChildVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={childVariants}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Parallax Text Component
interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxText({ children, speed = 0.5, className = '' }: ParallaxTextProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);

  return (
    <motion.div
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
