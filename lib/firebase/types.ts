import { Timestamp } from 'firebase/firestore';
import { EnhancementTechnique, OutputFormat } from '@/lib/types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences: {
    defaultTechnique: EnhancementTechnique;
    defaultFormat: OutputFormat;
    emailNotifications: boolean;
    apiKeys?: {
      openrouter?: string; // user's personal OpenRouter API key (optional)
    };
  };
  billing?: {
    squareCustomerId?: string;
    subscriptionId?: string;
    planId?: string;
    status: 'free' | 'active' | 'canceled' | 'past_due' | 'trialing';
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
    trialEnd?: string;
    usage: {
      promptsUsed: number;
      monthlyLimit: number;
      resetDate: Timestamp;
    };
  };
}

export interface SavedPrompt {
  id: string;
  userId: string;
  title: string;
  description?: string;
  originalPrompt: string;
  enhancedPrompt: string;
  technique: EnhancementTechnique;
  format: OutputFormat;
  metadata: {
    model: string;
    processingTime: number;
    confidence: number;
    category?: string;
  };
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EnhancementHistory {
  id: string;
  userId: string;
  promptId?: string;
  original: string;
  enhanced: string;
  technique: EnhancementTechnique;
  format: OutputFormat;
  metadata: {
    model: string;
    processingTime: number;
    confidence: number;
    timestamp: Timestamp;
    category?: string;
  };
  createdAt: Timestamp;
}

export interface AuthError {
  code: string;
  message: string;
}

