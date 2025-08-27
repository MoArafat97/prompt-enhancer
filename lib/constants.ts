// Import from organized technique and format structure
import { ENHANCEMENT_TECHNIQUES, SYSTEM_PROMPTS } from './techniques';
import { OUTPUT_FORMATS } from './formats';

// Re-export for backward compatibility
export { ENHANCEMENT_TECHNIQUES, SYSTEM_PROMPTS, OUTPUT_FORMATS };

// Available Free Models on OpenRouter (Updated with current working models)
export const AVAILABLE_MODELS = [
  {
    id: 'meta-llama/llama-3.2-3b-instruct:free',
    name: 'Llama 3.2 3B Instruct (Free)',
    provider: 'Meta',
    description: 'Fast and capable model, good for most tasks',
    maxTokens: 8192,
    free: true,
  },
  {
    id: 'google/gemma-3n-e2b-it:free',
    name: 'Gemma 3n 2B (Free)',
    provider: 'Google',
    description: 'Google\'s latest efficient multimodal model',
    maxTokens: 8192,
    free: true,
  },
  {
    id: 'google/gemma-3n-e4b-it:free',
    name: 'Gemma 3n 4B (Free)',
    provider: 'Google',
    description: 'Google\'s larger efficient model with better performance',
    maxTokens: 8192,
    free: true,
  },
  {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek V3 (Free)',
    provider: 'DeepSeek',
    description: 'High-performance reasoning model, completely free',
    maxTokens: 32768,
    free: true,
  },
  {
    id: 'qwen/qwen-2.5-7b-instruct:free',
    name: 'Qwen 2.5 7B Instruct (Free)',
    provider: 'Alibaba',
    description: 'Multilingual model with strong reasoning capabilities',
    maxTokens: 32768,
    free: true,
  },
];

// Default model (best free option)
export const DEFAULT_MODEL = AVAILABLE_MODELS[0]; // Llama 3.1 8B Instruct

// API Configuration
export const API_CONFIG = {
  RATE_LIMIT: {
    requests: 10,
    window: 60 * 1000, // 1 minute
  },
  CACHE_TTL: 3600, // 1 hour
  MAX_PROMPT_LENGTH: 10000,
  OPENROUTER_CONFIG: {
    baseURL: 'https://openrouter.ai/api/v1',
    model: DEFAULT_MODEL.id,
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.9,
    frequency_penalty: 0.1,
    presence_penalty: 0.1,
  }
};

// Animation Configuration
export const ANIMATION_CONFIG = {
  FADE_IN_DURATION: 0.6,
  SLIDE_UP_DURATION: 0.6,
  STAGGER_DELAY: 0.1,
  PULSE_DURATION: 3,
  PARTICLE_COUNT: 20,
};

// UI Configuration
export const UI_CONFIG = {
  TEXTAREA_ROWS: 6,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT: 30000,
};

// PWA Configuration
export const PWA_CONFIG = {
  APP_NAME: 'Prompt Enhancer',
  SHORT_NAME: 'PromptPro',
  DESCRIPTION: 'AI-powered prompt enhancement tool',
  THEME_COLOR: '#667eea',
  BACKGROUND_COLOR: '#0a0a0b',
};

// Support email (backend-safe export)
export const SUPPORT_EMAIL = 'khotarafat@gmail.com';
