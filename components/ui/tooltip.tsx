"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Gauge, Star, CheckCircle } from 'lucide-react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
  disabled?: boolean;
}

interface TooltipPosition {
  x: number;
  y: number;
  side: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  className = '',
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ x: 0, y: 0, side });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = (): TooltipPosition => {
    if (!triggerRef.current) return { x: 0, y: 0, side };

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 200, height: 40 };
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    
    let x = 0;
    let y = 0;
    let finalSide = side;

    // Calculate base position
    switch (side) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        if (y < 0) {
          finalSide = 'bottom';
          y = triggerRect.bottom + 8;
        }
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.bottom + 8;
        if (y + tooltipRect.height > viewport.height) {
          finalSide = 'top';
          y = triggerRect.top - tooltipRect.height - 8;
        }
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2;
        if (x < 0) {
          finalSide = 'right';
          x = triggerRect.right + 8;
        }
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2;
        if (x + tooltipRect.width > viewport.width) {
          finalSide = 'left';
          x = triggerRect.left - tooltipRect.width - 8;
        }
        break;
    }

    // Adjust for alignment
    if (finalSide === 'top' || finalSide === 'bottom') {
      switch (align) {
        case 'start':
          x = triggerRect.left;
          break;
        case 'end':
          x = triggerRect.right - tooltipRect.width;
          break;
        case 'center':
        default:
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
      }
      // Keep within viewport
      x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8));
    } else {
      switch (align) {
        case 'start':
          y = triggerRect.top;
          break;
        case 'end':
          y = triggerRect.bottom - tooltipRect.height;
          break;
        case 'center':
        default:
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }
      // Keep within viewport
      y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8));
    }

    return { x, y, side: finalSide };
  };

  const showTooltip = () => {
    if (disabled) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after showing to get accurate measurements
      setTimeout(() => {
        setPosition(calculatePosition());
      }, 0);
    }, delayDuration);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getAnimationProps = () => {
    const baseProps = {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.15, ease: "easeOut" }
    };

    switch (position.side) {
      case 'top':
        return { ...baseProps, initial: { ...baseProps.initial, y: 5 }, animate: { ...baseProps.animate, y: 0 }, exit: { ...baseProps.exit, y: 5 } };
      case 'bottom':
        return { ...baseProps, initial: { ...baseProps.initial, y: -5 }, animate: { ...baseProps.animate, y: 0 }, exit: { ...baseProps.exit, y: -5 } };
      case 'left':
        return { ...baseProps, initial: { ...baseProps.initial, x: 5 }, animate: { ...baseProps.animate, x: 0 }, exit: { ...baseProps.exit, x: 5 } };
      case 'right':
        return { ...baseProps, initial: { ...baseProps.initial, x: -5 }, animate: { ...baseProps.animate, x: 0 }, exit: { ...baseProps.exit, x: -5 } };
      default:
        return baseProps;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              {...getAnimationProps()}
              style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 9999,
              }}
              className={`
                glass-elevated px-3 py-2 text-sm text-text-primary max-w-xs
                pointer-events-none select-none
                ${className}
              `}
            >
              {content}
              
              {/* Arrow */}
              <div
                className={`
                  absolute w-2 h-2 bg-surface-elevated border border-border/40 rotate-45
                  ${position.side === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0' : ''}
                  ${position.side === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0' : ''}
                  ${position.side === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-l-0 border-b-0' : ''}
                  ${position.side === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-r-0 border-t-0' : ''}
                `}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// Performance Badge Component
interface PerformanceBadgeProps {
  type: 'fast' | 'free' | 'quality';
  className?: string;
}

export function PerformanceBadge({ type, className = '' }: PerformanceBadgeProps) {
  const badgeConfig = {
    fast: {
      label: 'Fast',
      icon: Gauge,
      className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    },
    free: {
      label: 'Free',
      icon: Star,
      className: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/20',
    },
    quality: {
      label: 'High Quality',
      icon: CheckCircle,
      className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
    },
  };

  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      className={`
        inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
        border transition-all duration-200 cursor-default
        ${config.className} ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </motion.div>
  );
}
