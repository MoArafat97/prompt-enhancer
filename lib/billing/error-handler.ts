import { NextResponse } from 'next/server';
import { BillingError, GoCardlessError } from './types';
import { BILLING_ERROR_MESSAGES } from './config';
import { billingLogger } from './logger';
import { ApiResponse } from '@/lib/types';

export class BillingErrorHandler {
  /**
   * Handle and format billing errors for API responses
   */
  static async handleError(
    error: any,
    context: {
      operation: string;
      userId?: string;
      customerId?: string;
      subscriptionId?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<NextResponse> {
    // Log the error
    await billingLogger.error(
      `billing.error.${context.operation}`,
      error,
      {
        ...context.metadata,
        customerId: context.customerId,
        subscriptionId: context.subscriptionId,
      },
      context.userId
    );

    // Handle different error types
    if (this.isGoCardlessError(error)) {
      return this.handleGoCardlessApiError(error);
    }

    if (this.isBillingError(error)) {
      return this.handleBillingError(error);
    }

    if (error.code === 'auth/invalid-user-token') {
      return this.createErrorResponse(
        'Authentication failed',
        'Your session has expired. Please sign in again.',
        401
      );
    }

    if (error.code === 'permission-denied') {
      return this.createErrorResponse(
        'Permission denied',
        'You do not have permission to perform this action.',
        403
      );
    }

    // Generic error handling
    return this.createErrorResponse(
      'Internal server error',
      'An unexpected error occurred. Please try again later.',
      500
    );
  }

  /**
   * Handle GoCardless API errors
   */
  private static handleGoCardlessApiError(error: any): NextResponse {
    const statusCode = error.status || error.statusCode || 500;
    const goCardlessErrors = error.errors || [];

    // Map common GoCardless errors to user-friendly messages
    const primaryError = goCardlessErrors[0] || error;
    let userMessage = 'Payment processing failed. Please try again.';
    let errorCode = 'GOCARDLESS_API_ERROR';

    if (primaryError) {
      switch (primaryError.type || primaryError.code) {
        case 'invalid_api_usage':
          userMessage = 'Invalid request. Please contact support.';
          errorCode = 'INVALID_REQUEST';
          break;
        case 'invalid_state':
          userMessage = 'Payment cannot be processed in current state.';
          errorCode = 'INVALID_STATE';
          break;
        case 'validation_failed':
          userMessage = 'Validation failed. Please check your details.';
          errorCode = 'VALIDATION_FAILED';
          break;
        case 'insufficient_permissions':
          userMessage = 'Insufficient permissions. Please contact support.';
          errorCode = 'INSUFFICIENT_PERMISSIONS';
          break;
        case 'rate_limit_exceeded':
          userMessage = 'Too many requests. Please wait a moment and try again.';
          errorCode = 'RATE_LIMITED';
          break;
        case 'resource_not_found':
          userMessage = 'The requested resource was not found.';
          errorCode = 'NOT_FOUND';
          break;
        default:
          userMessage = primaryError.message || primaryError.detail || userMessage;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorCode,
        message: userMessage,
        details: process.env.NODE_ENV === 'development' ? {
          goCardlessErrors,
          statusCode,
        } : undefined,
      } as ApiResponse,
      { status: statusCode }
    );
  }

  /**
   * Handle custom billing errors
   */
  private static handleBillingError(error: BillingError): NextResponse {
    let statusCode = 400;
    let userMessage = error.message;

    switch (error.type) {
      case 'VALIDATION_ERROR':
        statusCode = 400;
        break;
      case 'SUBSCRIPTION_ERROR':
        statusCode = 400;
        break;
      case 'WEBHOOK_ERROR':
        statusCode = 400;
        break;
      case 'GOCARDLESS_API_ERROR':
        statusCode = error.statusCode || 500;
        break;
      default:
        statusCode = 500;
        userMessage = 'An unexpected error occurred.';
    }

    return NextResponse.json(
      {
        success: false,
        error: error.type,
        message: userMessage,
        details: process.env.NODE_ENV === 'development' ? {
          gocardlessErrors: error.gocardlessErrors,
          stack: error.stack,
        } : undefined,
      } as ApiResponse,
      { status: statusCode }
    );
  }

  /**
   * Create a standardized error response
   */
  private static createErrorResponse(
    error: string,
    message: string,
    statusCode: number
  ): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error,
        message,
      } as ApiResponse,
      { status: statusCode }
    );
  }

  /**
   * Check if error is a GoCardless error
   */
  private static isGoCardlessError(error: any): boolean {
    return error && (
      error.type === 'gocardless_error' ||
      error.api_name === 'gocardless' ||
      (error.errors && Array.isArray(error.errors))
    );
  }

  /**
   * Check if error is a BillingError
   */
  private static isBillingError(error: any): error is BillingError {
    return error && typeof error.type === 'string' && error.type.includes('ERROR');
  }

  /**
   * Validate subscription data
   */
  static validateSubscriptionData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.planId) {
      errors.push('Plan ID is required');
    }

    if (data.planId && !['free', 'pro', 'pro-yearly'].includes(data.planId)) {
      errors.push('Invalid plan ID');
    }

    if (data.trialDays && (typeof data.trialDays !== 'number' || data.trialDays < 0)) {
      errors.push('Trial days must be a positive number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate customer data
   */
  static validateCustomerData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.phoneNumber && !this.isValidPhoneNumber(data.phoneNumber)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  private static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  /**
   * Create a billing error
   */
  static createBillingError(
    type: BillingError['type'],
    message: string,
    goCardlessErrors?: GoCardlessError[],
    statusCode?: number
  ): BillingError {
    const error = new Error(message) as BillingError;
    error.type = type;
    error.gocardlessErrors = goCardlessErrors;
    error.statusCode = statusCode;
    return error;
  }

  /**
   * Retry logic for transient errors
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on certain error types
        if (this.isGoCardlessError(error)) {
          const isRetryable = this.isRetryableGoCardlessError(error);
          if (!isRetryable || attempt === maxRetries) {
            throw error;
          }
        } else if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }

    throw lastError;
  }

  /**
   * Check if GoCardless error is retryable
   */
  private static isRetryableGoCardlessError(error: any): boolean {
    const retryableCodes = [
      'internal_error',
      'rate_limit_exceeded',
      'service_unavailable',
    ];

    return error.errors?.some((e: any) => retryableCodes.includes(e.type || e.code)) || false;
  }
}

// Convenience functions
export const handleBillingError = BillingErrorHandler.handleError;
export const createBillingError = BillingErrorHandler.createBillingError;
export const validateSubscriptionData = BillingErrorHandler.validateSubscriptionData;
export const validateCustomerData = BillingErrorHandler.validateCustomerData;
export const withRetry = BillingErrorHandler.withRetry;
