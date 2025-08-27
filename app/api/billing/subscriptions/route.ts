import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { GoCardlessService } from '@/lib/billing/gocardless-service';
import { getAdminDb } from '@/lib/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { ApiResponse } from '@/lib/types';
import { SUBSCRIPTION_PLANS } from '@/lib/billing/types';

const goCardlessService = new GoCardlessService();
const db = getAdminDb();

// GET /api/billing/subscriptions - Get user's subscription info
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to view subscription information',
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Get user's billing information from Firestore
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database unavailable',
          message: 'Database connection failed',
        } as ApiResponse,
        { status: 503 }
      );
    }

    const userDoc = await db.collection('users').doc(authResult.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User profile not found',
        } as ApiResponse,
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const billing = userData?.billing || {
      status: 'free',
      planId: 'free',
      usage: {
        promptsUsed: 0,
        monthlyLimit: 50,
        resetDate: new Date(),
      },
    };

    // Get plan details
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === (billing.planId || 'free'));

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: billing.subscriptionId,
          status: billing.status,
          planId: billing.planId || 'free',
          plan: plan,
          currentPeriodStart: billing.currentPeriodStart,
          currentPeriodEnd: billing.currentPeriodEnd,
          cancelAtPeriodEnd: billing.cancelAtPeriodEnd || false,
          trialEnd: billing.trialEnd,
        },
        usage: billing.usage,
        customer: {
          id: billing.goCardlessCustomerId,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch subscription information',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// POST /api/billing/subscriptions - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to create a subscription',
        } as ApiResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, paymentMethodId, trialDays } = body;

    // Validate plan
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid plan',
          message: 'The selected plan is not valid',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Get user data
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database unavailable',
          message: 'Database connection failed',
        } as ApiResponse,
        { status: 503 }
      );
    }

    const userDoc = await db.collection('users').doc(authResult.userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'User profile not found',
        } as ApiResponse,
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    let customerId = userData?.billing?.goCardlessCustomerId;

    // Create GoCardless customer if doesn't exist
    if (!customerId) {
      const customer = await goCardlessService.createCustomer({
        email: userData?.email,
        givenName: userData?.displayName?.split(' ')[0],
        familyName: userData?.displayName?.split(' ').slice(1).join(' '),
      });
      customerId = customer.id;

      // Update user with customer ID
      await db.collection('users').doc(authResult.userId).update({
        'billing.goCardlessCustomerId': customerId,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Create subscription
    const subscriptionResult = await goCardlessService.createSubscription({
      customerId,
      planId,
      mandateId: paymentMethodId, // GoCardless uses mandateId instead of paymentMethodId
      metadata: {
        userId: authResult.userId,
        userEmail: userData?.email,
        trialDays: trialDays?.toString() || '0',
      },
    });

    // Update user's billing information
    const now = new Date();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    await db.collection('users').doc(authResult.userId).update({
      'billing.subscriptionId': subscriptionResult.subscription.id,
      'billing.planId': planId,
      'billing.status': subscriptionResult.subscription.status.toLowerCase(),
      'billing.currentPeriodStart': subscriptionResult.subscription.startDate,
      'billing.currentPeriodEnd': subscriptionResult.subscription.endDate,
      'billing.cancelAtPeriodEnd': subscriptionResult.subscription.cancelAtPeriodEnd || false,
      'billing.usage.monthlyLimit': plan.limits.promptsPerMonth,
      'billing.usage.resetDate': FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: {
        subscription: subscriptionResult.subscription,
        redirectFlow: subscriptionResult.redirectFlow,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Subscription creation failed',
        message: error instanceof Error ? error.message : 'Failed to create subscription',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
