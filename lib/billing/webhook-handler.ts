import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { GoCardlessWebhookPayload, GoCardlessWebhookEvent, BillingError } from './types';
import { getGoCardlessConfig, BILLING_ERROR_MESSAGES } from './config';
import { getAdminDb } from '@/lib/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export class GoCardlessWebhookHandler {
  private config: ReturnType<typeof getGoCardlessConfig> | null;
  private db: FirebaseFirestore.Firestore | null;

  constructor() {
    this.config = getGoCardlessConfig();
    this.db = getAdminDb();
  }

  /**
   * Verify webhook signature from GoCardless
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!this.config) {
      console.warn('GoCardless config not available, skipping webhook verification');
      return false;
    }

    try {
      const webhookSecret = this.config.webhookEndpointSecret;

      // Skip verification if no webhook secret is configured (for testing)
      if (!webhookSecret) {
        console.warn('Webhook signature verification skipped - no webhook secret configured');
        return true;
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload, 'utf8')
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Process incoming webhook from GoCardless
   */
  async processWebhook(request: NextRequest): Promise<{ success: boolean; message?: string }> {
    try {
      const body = await request.text();
      const signature = request.headers.get('webhook-signature') || '';

      // Verify webhook signature
      if (!this.verifyWebhookSignature(body, signature)) {
        throw new Error(BILLING_ERROR_MESSAGES.WEBHOOK_VERIFICATION_FAILED);
      }

      const webhookPayload: GoCardlessWebhookPayload = JSON.parse(body);

      // Process the webhook events
      for (const event of webhookPayload.events) {
        await this.handleWebhookEvent(event);
      }

      return { success: true };
    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown webhook error'
      };
    }
  }

  /**
   * Handle specific webhook events
   */
  private async handleWebhookEvent(event: any): Promise<void> {
    console.log(`Processing webhook event: ${event.resource_type}.${event.action}`);

    const eventType = `${event.resource_type}.${event.action}`;

    switch (eventType) {
      case 'subscriptions.created':
        await this.handleSubscriptionCreated(event);
        break;

      case 'subscriptions.cancelled':
        await this.handleSubscriptionCancelled(event);
        break;

      case 'subscriptions.finished':
        await this.handleSubscriptionFinished(event);
        break;

      case 'payments.confirmed':
        await this.handlePaymentConfirmed(event);
        break;

      case 'payments.failed':
        await this.handlePaymentFailed(event);
        break;

      case 'payments.cancelled':
        await this.handlePaymentCancelled(event);
        break;

      case 'mandates.active':
        await this.handleMandateActive(event);
        break;

      case 'mandates.cancelled':
        await this.handleMandateCancelled(event);
        break;

      case 'customers.created':
        await this.handleCustomerCreated(event);
        break;

      case 'customers.updated':
        await this.handleCustomerUpdated(event);
        break;

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }
  }

  /**
   * Handle subscription created event
   */
  private async handleSubscriptionCreated(event: any): Promise<void> {
    if (!this.db) {
      console.error('Database not available, cannot handle subscription created event');
      return;
    }

    try {
      const subscriptionId = event.links.subscription;

      // Find user by subscription ID in metadata or mandate
      const userQuery = await this.db.collection('users')
        .where('billing.subscriptionId', '==', subscriptionId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`User not found for subscription ID: ${subscriptionId}`);
        return;
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Update user's billing information
      await this.db.collection('users').doc(userId).update({
        'billing.status': 'active',
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Subscription created for user ${userId}: ${subscriptionId}`);
    } catch (error) {
      console.error('Error handling subscription created:', error);
      throw error;
    }
  }

  /**
   * Handle subscription cancelled event
   */
  private async handleSubscriptionCancelled(event: any): Promise<void> {
    if (!this.db) {
      console.error('Database not available, cannot handle subscription cancelled event');
      return;
    }

    try {
      const subscriptionId = event.links.subscription;

      // Find user by subscription ID
      const userQuery = await this.db.collection('users')
        .where('billing.subscriptionId', '==', subscriptionId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`User not found for subscription ID: ${subscriptionId}`);
        return;
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Update user's billing information
      await this.db.collection('users').doc(userId).update({
        'billing.status': 'cancelled',
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Subscription cancelled for user ${userId}: ${subscriptionId}`);
    } catch (error) {
      console.error('Error handling subscription cancelled:', error);
      throw error;
    }
  }

  /**
   * Handle subscription finished event
   */
  private async handleSubscriptionFinished(event: any): Promise<void> {
    if (!this.db) {
      console.error('Database not available, cannot handle subscription finished event');
      return;
    }

    try {
      const subscriptionId = event.links.subscription;

      // Find user by subscription ID
      const userQuery = await this.db.collection('users')
        .where('billing.subscriptionId', '==', subscriptionId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`User not found for subscription ID: ${subscriptionId}`);
        return;
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Update user's billing information
      await this.db.collection('users').doc(userId).update({
        'billing.status': 'finished',
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Subscription finished for user ${userId}: ${subscriptionId}`);
    } catch (error) {
      console.error('Error handling subscription finished:', error);
      throw error;
    }
  }

  /**
   * Handle payment confirmed event
   */
  private async handlePaymentConfirmed(event: any): Promise<void> {
    if (!this.db) {
      console.error('Database not available, cannot handle payment confirmed event');
      return;
    }

    try {
      const paymentId = event.links.payment;
      const subscriptionId = event.links.subscription;

      if (!subscriptionId) {
        console.log('Payment confirmed for non-subscription payment');
        return;
      }

      // Find user by subscription ID
      const userQuery = await this.db.collection('users')
        .where('billing.subscriptionId', '==', subscriptionId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`User not found for subscription ID: ${subscriptionId}`);
        return;
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Reset usage for the new billing period
      await this.db.collection('users').doc(userId).update({
        'billing.status': 'active',
        'billing.usage.promptsUsed': 0,
        'billing.usage.resetDate': FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Payment confirmed for user ${userId}, usage reset`);
    } catch (error) {
      console.error('Error handling payment confirmed:', error);
      throw error;
    }
  }

  /**
   * Handle payment failed event
   */
  private async handlePaymentFailed(event: any): Promise<void> {
    if (!this.db) {
      console.error('Database not available, cannot handle payment failed event');
      return;
    }

    try {
      const paymentId = event.links.payment;
      const subscriptionId = event.links.subscription;

      if (!subscriptionId) {
        console.log('Payment failed for non-subscription payment');
        return;
      }

      // Find user by subscription ID
      const userQuery = await this.db.collection('users')
        .where('billing.subscriptionId', '==', subscriptionId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`User not found for subscription ID: ${subscriptionId}`);
        return;
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Update user's billing status
      await this.db.collection('users').doc(userId).update({
        'billing.status': 'cancelled', // GoCardless typically cancels failed subscriptions
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Payment failed for user ${userId}, subscription cancelled`);
    } catch (error) {
      console.error('Error handling payment failed:', error);
      throw error;
    }
  }

  /**
   * Handle payment cancelled event
   */
  private async handlePaymentCancelled(event: any): Promise<void> {
    console.log(`Payment cancelled: ${event.links.payment}`);
    // Additional payment cancellation logic can be added here
  }

  /**
   * Handle mandate active event
   */
  private async handleMandateActive(event: any): Promise<void> {
    if (!this.db) {
      console.error('Database not available, cannot handle mandate active event');
      return;
    }

    try {
      const mandateId = event.links.mandate;

      // Find user by mandate ID
      const userQuery = await this.db.collection('users')
        .where('billing.mandateId', '==', mandateId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`User not found for mandate ID: ${mandateId}`);
        return;
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Update user's billing information
      await this.db.collection('users').doc(userId).update({
        'billing.status': 'active',
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Mandate activated for user ${userId}: ${mandateId}`);
    } catch (error) {
      console.error('Error handling mandate active:', error);
      throw error;
    }
  }

  /**
   * Handle mandate cancelled event
   */
  private async handleMandateCancelled(event: any): Promise<void> {
    if (!this.db) {
      console.error('Database not available, cannot handle mandate cancelled event');
      return;
    }

    try {
      const mandateId = event.links.mandate;

      // Find user by mandate ID
      const userQuery = await this.db.collection('users')
        .where('billing.mandateId', '==', mandateId)
        .limit(1)
        .get();

      if (userQuery.empty) {
        console.error(`User not found for mandate ID: ${mandateId}`);
        return;
      }

      const userDoc = userQuery.docs[0];
      const userId = userDoc.id;

      // Update user's billing information
      await this.db.collection('users').doc(userId).update({
        'billing.status': 'cancelled',
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`Mandate cancelled for user ${userId}: ${mandateId}`);
    } catch (error) {
      console.error('Error handling mandate cancelled:', error);
      throw error;
    }
  }

  /**
   * Handle customer created event
   */
  private async handleCustomerCreated(event: any): Promise<void> {
    console.log(`Customer created: ${event.links.customer}`);
    // Additional customer creation logic can be added here
  }

  /**
   * Handle customer updated event
   */
  private async handleCustomerUpdated(event: any): Promise<void> {
    console.log(`Customer updated: ${event.links.customer}`);
    // Additional customer update logic can be added here
  }
}
