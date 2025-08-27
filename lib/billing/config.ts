import { GoCardlessConfig } from './types';

// GoCardless Configuration
export const getGoCardlessConfig = (): GoCardlessConfig => {
  const environment = process.env.GOCARDLESS_ENVIRONMENT === 'live' ? 'live' : 'sandbox';

  const config: GoCardlessConfig = {
    accessToken: environment === 'live'
      ? process.env.GOCARDLESS_ACCESS_TOKEN || ''
      : process.env.GOCARDLESS_SANDBOX_ACCESS_TOKEN || '',
    environment,
    webhookEndpointSecret: environment === 'live'
      ? process.env.GOCARDLESS_WEBHOOK_ENDPOINT_SECRET || ''
      : process.env.GOCARDLESS_SANDBOX_WEBHOOK_ENDPOINT_SECRET || '',
  };

  // Validate required configuration - but don't throw in production if billing is disabled
  if (!config.accessToken) {
    const tokenVar = environment === 'live'
      ? 'GOCARDLESS_ACCESS_TOKEN'
      : 'GOCARDLESS_SANDBOX_ACCESS_TOKEN';

    // Only warn in production, don't throw error to allow app to start
    console.warn(`${tokenVar} environment variable is missing - billing features will be disabled`);

    // In development, still throw to help developers notice missing config
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`${tokenVar} environment variable is required for development`);
    }
  }

  if (!config.webhookEndpointSecret) {
    const keyVar = environment === 'live'
      ? 'GOCARDLESS_WEBHOOK_ENDPOINT_SECRET'
      : 'GOCARDLESS_SANDBOX_WEBHOOK_ENDPOINT_SECRET';
    console.warn(`${keyVar} environment variable is missing - webhooks will be disabled`);
    // Don't throw error for now to allow testing without webhooks
    // throw new Error(`${keyVar} environment variable is required`);
  }

  return config;
};

// GoCardless API URLs
export const GOCARDLESS_API_URLS = {
  sandbox: 'https://api-sandbox.gocardless.com',
  live: 'https://api.gocardless.com',
};

// Billing Configuration
export const BILLING_CONFIG = {
  // Trial period in days
  DEFAULT_TRIAL_DAYS: 14,
  
  // Grace period for failed payments (in days)
  GRACE_PERIOD_DAYS: 3,
  
  // How often to sync subscription status (in minutes)
  SYNC_INTERVAL_MINUTES: 60,
  
  // Webhook retry configuration
  WEBHOOK_RETRY_ATTEMPTS: 3,
  WEBHOOK_RETRY_DELAY_MS: 1000,
  
  // Usage tracking
  USAGE_SYNC_INTERVAL_HOURS: 24,
  
  // Customer portal session expiry (in hours)
  PORTAL_SESSION_EXPIRY_HOURS: 24,
  
  // Supported currencies
  SUPPORTED_CURRENCIES: ['USD'] as const,
  
  // Tax configuration
  TAX_INCLUSIVE: false,
  
  // Invoice configuration
  INVOICE_DUE_DAYS: 7,
  
  // Subscription configuration
  PRORATION_BEHAVIOR: 'create_prorations' as const,
  
  // Payment method types
  SUPPORTED_PAYMENT_METHODS: ['card'] as const,
};

// Error Messages
export const BILLING_ERROR_MESSAGES = {
  INVALID_PLAN: 'Invalid subscription plan selected',
  CUSTOMER_NOT_FOUND: 'Customer not found',
  SUBSCRIPTION_NOT_FOUND: 'Subscription not found',
  PAYMENT_FAILED: 'Payment processing failed',
  WEBHOOK_VERIFICATION_FAILED: 'Webhook signature verification failed',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this operation',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded for billing operations',
  INVALID_PAYMENT_METHOD: 'Invalid payment method provided',
  SUBSCRIPTION_ALREADY_CANCELED: 'Subscription is already canceled',
  MANDATE_REQUIRED: 'Direct debit mandate is required for this plan',
  INVALID_CUSTOMER_DATA: 'Invalid customer data provided',
  GOCARDLESS_API_ERROR: 'GoCardless API error occurred',
  WEBHOOK_PROCESSING_ERROR: 'Error processing webhook event',
  USAGE_LIMIT_EXCEEDED: 'Usage limit exceeded for current plan',
  SUBSCRIPTION_EXPIRED: 'Subscription has expired',
  MANDATE_APPROVAL_REQUIRED: 'Customer approval required for direct debit mandate',
  INVALID_BANK_DETAILS: 'Invalid bank account details provided',
} as const;

// Feature Flags
export const BILLING_FEATURES = {
  ENABLE_TRIALS: true,
  ENABLE_PRORATION: true,
  ENABLE_USAGE_TRACKING: true,
  ENABLE_CUSTOMER_PORTAL: true,
  ENABLE_INVOICE_GENERATION: true,
  ENABLE_WEBHOOK_RETRIES: true,
  ENABLE_AUTOMATIC_TAX: false,
  ENABLE_METERED_BILLING: false,
} as const;

// Plan Limits
export const PLAN_LIMITS = {
  free: {
    promptsPerMonth: 50,
    apiCallsPerMinute: 10,
    savedPrompts: 10,
    prioritySupport: false,
    apiAccess: false,
    advancedAnalytics: false,
  },
  pro: {
    promptsPerMonth: -1, // unlimited
    apiCallsPerMinute: 50,
    savedPrompts: -1, // unlimited
    prioritySupport: true,
    apiAccess: true,
    advancedAnalytics: true,
  },
} as const;

// Webhook Event Priorities
export const WEBHOOK_PRIORITIES = {
  'subscriptions.created': 'high',
  'subscriptions.cancelled': 'high',
  'subscriptions.finished': 'high',
  'payments.confirmed': 'high',
  'payments.failed': 'high',
  'payments.cancelled': 'high',
  'mandates.active': 'high',
  'mandates.cancelled': 'medium',
  'customers.created': 'medium',
  'customers.updated': 'low',
} as const;

// Cache TTL values (in seconds)
export const CACHE_TTL = {
  CUSTOMER_DATA: 300, // 5 minutes
  SUBSCRIPTION_DATA: 300, // 5 minutes
  PLAN_DATA: 3600, // 1 hour
  USAGE_DATA: 60, // 1 minute
  INVOICE_DATA: 600, // 10 minutes
} as const;

// Rate limiting for billing operations
export const BILLING_RATE_LIMITS = {
  CREATE_SUBSCRIPTION: {
    requests: 5,
    window: 60 * 1000, // 1 minute
  },
  UPDATE_SUBSCRIPTION: {
    requests: 10,
    window: 60 * 1000, // 1 minute
  },
  CANCEL_SUBSCRIPTION: {
    requests: 3,
    window: 60 * 1000, // 1 minute
  },
  CREATE_CUSTOMER: {
    requests: 10,
    window: 60 * 1000, // 1 minute
  },
  WEBHOOK_PROCESSING: {
    requests: 100,
    window: 60 * 1000, // 1 minute
  },
} as const;

// Default metadata for Square objects
export const DEFAULT_METADATA = {
  source: 'prompt-enhancer',
  version: '1.0.0',
} as const;
