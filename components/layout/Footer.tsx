"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check } from 'lucide-react';
import { FooterProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SUPPORT_EMAIL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { copyToClipboard } from '@/lib/utils';

// Back to Top and Newsletter removed per request

export function Footer({ className }: FooterProps) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyToClipboard(SUPPORT_EMAIL);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      addToast({
        type: 'success',
        title: 'Email copied',
        description: 'Support email copied to clipboard.',
        duration: 2500,
      });
    } else {
      addToast({
        type: 'error',
        title: 'Copy failed',
        description: 'Could not copy the email. Please try again.',
        duration: 3000,
      });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("mt-12", className)}
    >
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden glass-elevated rounded-2xl p-6 md:p-8 border border-border/40">
          {/* Soft gradient accents */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-gradient-primary rounded-full blur-3xl opacity-10" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-secondary rounded-full blur-3xl opacity-10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center shadow-glow">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-base md:text-lg font-semibold text-text-primary">Need help?</div>
                <div className="text-sm text-text-muted">Reach our support team anytime.</div>
              </div>
            </div>

            {/* Right: Email + Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="px-3 py-2 rounded-lg border border-border/50 bg-background/70 text-text-primary text-sm">
                {SUPPORT_EMAIL}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyEmail} className="flex items-center gap-2">
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Mail className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy email'}</span>
                </Button>
                <Button size="sm" asChild>
                  <a href={`mailto:${SUPPORT_EMAIL}`}>Email us</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
