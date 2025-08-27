// Enhancement Techniques
export type EnhancementTechnique =
  | 'clarity'
  | 'chain-of-thought'
  | 'few-shot'
  | 'role-based'
  | 'creative';

// Output Formats
export type OutputFormat =
  | 'natural'
  | 'json'
  | 'xml';

// API Request/Response Types
export interface EnhanceRequest {
  prompt: string;
  technique: EnhancementTechnique;
  outputFormat: OutputFormat;
}

export interface EnhancementResult {
  original: string;
  enhanced: string;
  technique: EnhancementTechnique;
  format: OutputFormat;
  metadata: {
    processingTime: number;
    model: string;
    confidence: number;
    timestamp?: string;
    category?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

export interface TechniqueSelectorProps {
  value: EnhancementTechnique;
  onChange: (technique: EnhancementTechnique) => void;
  disabled?: boolean;
}

export interface OutputFormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

export interface EnhanceButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export interface ResultDisplayProps {
  result: EnhancementResult | null;
  isLoading: boolean;
  format: OutputFormat;
}

// Technique Configuration
export interface TechniqueConfig {
  value: EnhancementTechnique;
  label: string;
  icon: string;
  description: string;
}

export interface FormatConfig {
  value: OutputFormat;
  label: string;
  icon: string;
  description: string;
}

// Animation Props
export interface AnimatedBackgroundProps {
  className?: string;
}

export interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

// Layout Props
export interface HeaderProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

// PWA Types
export interface PWAPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Rate Limiting
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  plan?: 'free' | 'pro';
}

// Cache Types
export interface CacheConfig {
  ttl: number;
  maxSize?: number;
}

// Available Model Interface
export interface AvailableModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  free: boolean;
}

// Structured JSON Format Types (for JSON output format)
export interface StructuredPromptJSON {
  role: string;
  task: string;
  context: {
    target_audience: string;
    constraints: string[];
    background_info: string;
  };
  requirements: {
    length: string;
    tone: string;
    must_include: string[];
    avoid: string[];
  };
  output_format: {
    structure: string;
    format_type: string;
  };
  examples: {
    good_style: string | object;
    bad_style: string | object;
  };
}

// Environment Variables
export interface EnvConfig {
  OPENROUTER_API_KEY: string;
  UPSTASH_REDIS_URL?: string;
  UPSTASH_REDIS_TOKEN?: string;
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL?: string;

  // Square Payment Configuration
  SQUARE_APPLICATION_ID: string;
  SQUARE_ACCESS_TOKEN?: string;
  SQUARE_SANDBOX_ACCESS_TOKEN?: string;
  SQUARE_LOCATION_ID?: string;
  SQUARE_SANDBOX_LOCATION_ID?: string;
  SQUARE_WEBHOOK_SIGNATURE_KEY?: string;
  SQUARE_SANDBOX_WEBHOOK_SIGNATURE_KEY?: string;

  // Security
  CRON_SECRET?: string;
  ADMIN_SECRET?: string;
}
