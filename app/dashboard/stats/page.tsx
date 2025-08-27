'use client';

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useSavedPrompts } from '@/lib/hooks/useSavedPrompts';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Star,
  FileText,
  Calendar,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card p-6 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text-primary">{value}</p>
          {subtitle && (
            <p className="text-sm text-text-muted">{subtitle}</p>
          )}
        </div>
      </div>
      <h3 className="text-text-secondary font-medium">{title}</h3>
    </motion.div>
  );
}

export default function StatsPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { prompts, loading: promptsLoading } = useSavedPrompts();

  if (authLoading || promptsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-primary" />
          <p className="text-text-secondary">Loading your statistics...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="w-16 h-16 mx-auto text-text-muted" />
          <h2 className="text-xl font-semibold text-text-primary">Authentication Required</h2>
          <p className="text-text-secondary">Please sign in to view your usage statistics.</p>
        </div>
      </div>
    );
  }



  // Calculate stats from prompts
  const totalPrompts = prompts.length;
  const favoritePrompts = prompts.filter(p => p.isFavorite).length;

  // Calculate technique usage
  const techniqueUsage = prompts.reduce((acc, prompt) => {
    acc[prompt.technique] = (acc[prompt.technique] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTechnique = Object.entries(techniqueUsage).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Usage Statistics</h1>
            <p className="text-text-secondary">Track your prompt enhancement activity and usage</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-text-primary">
              Statistics
            </span>
          </div>
        </motion.div>



        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Saved Prompts"
            value={totalPrompts}
            icon={FileText}
            color="bg-brand-primary"
            delay={0.2}
          />
          <StatCard
            title="Favorite Prompts"
            value={favoritePrompts}
            icon={Star}
            color="bg-warning"
            delay={0.3}
          />
          <StatCard
            title="Total Enhancements"
            value={totalPrompts}
            subtitle="created"
            icon={Zap}
            color="bg-success"
            delay={0.4}
          />
        </div>

        {/* Technique Usage */}
        {Object.keys(techniqueUsage).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card p-6"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4">Technique Usage</h2>
            <div className="space-y-4">
              {topTechnique && (
                <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Most Used Technique</p>
                    <p className="text-sm text-text-muted capitalize">{topTechnique[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-primary">{topTechnique[1]}</p>
                    <p className="text-sm text-text-muted">times used</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(techniqueUsage)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([technique, count], index) => (
                    <div key={technique} className="flex items-center justify-between p-3 bg-surface-secondary/50 rounded-lg">
                      <span className="text-text-secondary capitalize">{technique}</span>
                      <span className="font-medium text-text-primary">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard/workspace" className="flex-1">
            <Button className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              Create New Prompt
            </Button>
          </Link>
          <Link href="/dashboard/history" className="flex-1">
            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              View All Prompts
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
