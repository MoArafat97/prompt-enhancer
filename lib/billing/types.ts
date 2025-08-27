// GoCardless Payment Integration Types

export interface GoCardlessConfig {
  accessToken: string;
  environment: 'sandbox' | 'live';
  webhookEndpointSecret: string;
}

// Subscription Plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  currency: 'USD';
  interval: 'MONTHLY' | 'YEARLY';
  features: string[];
  limits: {
    promptsPerMonth: number;
    apiCallsPerMinute: number;
    savedPrompts: number;
    prioritySupport: boolean;
  };
  gocardlessPlanId?: string; // GoCardless subscription plan ID
}

// Customer Information
export interface GoCardlessCustomer {
  id: string; // GoCardless customer ID
  email: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
  createdAt: string;
}

// Subscription Information
export interface GoCardlessSubscription {
  id: string; // GoCardless subscription ID
  customerId: string; // GoCardless customer ID
  planId: string; // Our internal plan ID
  gocardlessPlanId?: string; // GoCardless subscription plan ID
  mandateId: string; // GoCardless mandate ID for direct debit
  status: 'pending_customer_approval' | 'customer_approval_denied' | 'active' | 'finished' | 'cancelled' | 'paused';
  startDate: string;
  endDate?: string;
  nextPossibleChargeDate?: string;
  cancelAtPeriodEnd?: boolean;
  upcomingPayments?: Array<{
    chargeDate: string;
    amount: number;
  }>;
  metadata?: Record<string, string>;
}

// Payment Method (Direct Debit Mandate)
export interface PaymentMethod {
  id: string; // GoCardless mandate ID
  type: 'MANDATE';
  mandate: {
    status: 'pending_customer_approval' | 'pending_submission' | 'submitted' | 'active' | 'failed' | 'cancelled' | 'expired';
    scheme: 'bacs' | 'sepa_core' | 'sepa_cor1' | 'ach' | 'faster_payments' | 'pay_to';
    nextPossibleChargeDate?: string;
    paymentsRequireApproval?: boolean;
  };
  customerBankAccount: {
    id: string;
    accountHolderName: string;
    accountNumberEnding: string;
    bankName?: string;
    countryCode: string;
  };
  isDefault: boolean;
}

// Payment Information (GoCardless uses payments instead of invoices)
export interface Payment {
  id: string;
  subscriptionId?: string;
  mandateId: string;
  amount: number; // in pence/cents
  currency: string;
  status: 'pending_customer_approval' | 'pending_submission' | 'submitted' | 'confirmed' | 'paid_out' | 'cancelled' | 'customer_approval_denied' | 'failed' | 'charged_back';
  chargeDate: string;
  createdAt: string;
  description?: string;
  reference?: string;
}

// Webhook Event Types
export type GoCardlessWebhookEvent =
  | 'subscriptions'
  | 'payments'
  | 'mandates'
  | 'customers'
  | 'payouts'
  | 'refunds'
  | 'instalment_schedules'
  | 'creditor_bank_accounts';

export interface GoCardlessWebhookPayload {
  events: Array<{
    id: string;
    created_at: string;
    resource_type: GoCardlessWebhookEvent;
    action: string;
    links: {
      [key: string]: string;
    };
    details?: {
      origin: string;
      cause: string;
      description: string;
    };
    metadata?: Record<string, string>;
  }>;
}

// Billing Portal Session
export interface BillingPortalSession {
  id: string;
  customerId: string;
  url: string;
  expiresAt: string;
}

// Usage Tracking
export interface UsageRecord {
  id: string;
  userId: string;
  subscriptionId: string;
  period: string; // YYYY-MM format
  promptsUsed: number;
  apiCallsMade: number;
  createdAt: string;
  updatedAt: string;
}

// Redirect Flow for mandate setup
export interface RedirectFlow {
  id: string;
  description: string;
  sessionToken: string;
  successRedirectUrl: string;
  redirectUrl: string;
  createdAt: string;
}

// Error Types
export interface GoCardlessError {
  type: string;
  code: number;
  message: string;
  documentation_url?: string;
  request_id?: string;
  errors?: Array<{
    field: string;
    message: string;
    request_pointer: string;
  }>;
}

export interface BillingError extends Error {
  type: 'GOCARDLESS_API_ERROR' | 'VALIDATION_ERROR' | 'WEBHOOK_ERROR' | 'SUBSCRIPTION_ERROR';
  gocardlessErrors?: GoCardlessError[];
  statusCode?: number;
}

// API Response Types
export interface CreateSubscriptionRequest {
  customerId: string;
  planId: string;
  mandateId: string;
  startDate?: string;
  metadata?: Record<string, string>;
}

export interface CreateSubscriptionResponse {
  subscription: GoCardlessSubscription;
  redirectFlow?: RedirectFlow;
}

export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  planId?: string;
  pauseAction?: 'pause' | 'resume';
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, string>;
}

export interface CreateCustomerRequest {
  email: string;
  givenName?: string;
  familyName?: string;
  phoneNumber?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
  metadata?: Record<string, string>;
}

// Extended User Profile for GoCardless Integration
export interface UserProfileWithBilling {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any; // Timestamp
  updatedAt: any; // Timestamp
  preferences: {
    defaultTechnique: string;
    defaultFormat: string;
    emailNotifications: boolean;
    apiKeys?: {
      openrouter?: string;
    };
  };
  billing?: {
    gocardlessCustomerId?: string;
    subscriptionId?: string;
    mandateId?: string;
    planId?: string;
    status: 'free' | 'pending_customer_approval' | 'active' | 'cancelled' | 'finished' | 'paused';
    nextPossibleChargeDate?: string;
    usage: {
      promptsUsed: number;
      monthlyLimit: number;
      resetDate: any; // Timestamp
    };
  };
}

// Constants
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    currency: 'USD',
    interval: 'MONTHLY',
    features: [
      '50 prompts per month',
      'Basic enhancement techniques',
      'Standard support',
      'Save up to 10 prompts'
    ],
    limits: {
      promptsPerMonth: 50,
      apiCallsPerMinute: 10,
      savedPrompts: 10,
      prioritySupport: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and professionals',
    price: 1999, // $19.99
    currency: 'USD',
    interval: 'MONTHLY',
    features: [
      'Unlimited prompts',
      'All enhancement techniques',
      'Priority support',
      'Unlimited saved prompts',
      'API access',
      'Advanced analytics'
    ],
    limits: {
      promptsPerMonth: -1, // unlimited
      apiCallsPerMinute: 50,
      savedPrompts: -1, // unlimited
      prioritySupport: true,
    },
  },
  {
    id: 'pro-yearly',
    name: 'Pro (Yearly)',
    description: 'Pro plan with 2 months free',
    price: 19999, // $199.99 (save $39.89)
    currency: 'USD',
    interval: 'YEARLY',
    features: [
      'Everything in Pro',
      '2 months free',
      'Priority onboarding',
      'Custom integrations'
    ],
    limits: {
      promptsPerMonth: -1, // unlimited
      apiCallsPerMinute: 50,
      savedPrompts: -1, // unlimited
      prioritySupport: true,
    },
  },
];

export const GOCARDLESS_WEBHOOK_EVENTS: GoCardlessWebhookEvent[] = [
  'subscriptions',
  'payments',
  'mandates',
  'customers',
  'payouts',
  'refunds',
  'instalment_schedules',
  'creditor_bank_accounts',
];
