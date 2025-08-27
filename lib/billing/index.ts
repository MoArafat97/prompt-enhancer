// GoCardless Payment Integration - Main Export File

// Types and Interfaces
export * from './types';
export * from './config';

// Core Services
export { GoCardlessService } from './gocardless-service';
export { GoCardlessWebhookHandler } from './webhook-handler';
export { BillingMigration } from './migration';

// Utilities
export { BillingLogger, billingLogger } from './logger';
export { 
  BillingErrorHandler,
  handleBillingError,
  createBillingError,
  validateSubscriptionData,
  validateCustomerData,
  withRetry
} from './error-handler';

// Re-export commonly used types for convenience
export type {
  GoCardlessConfig,
  SubscriptionPlan,
  GoCardlessCustomer,
  GoCardlessSubscription,
  PaymentMethod,
  Payment,
  GoCardlessWebhookEvent,
  GoCardlessWebhookPayload,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  UpdateSubscriptionRequest,
  CreateCustomerRequest,
  BillingError,
  UserProfileWithBilling,
} from './types';

// Re-export configuration constants
export {
  getGoCardlessConfig,
  BILLING_CONFIG,
  BILLING_ERROR_MESSAGES,
  BILLING_FEATURES,
  PLAN_LIMITS,
  WEBHOOK_PRIORITIES,
  CACHE_TTL,
  BILLING_RATE_LIMITS,
} from './config';
