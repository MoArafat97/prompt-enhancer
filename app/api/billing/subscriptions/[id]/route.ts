import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { GoCardlessService } from '@/lib/billing/gocardless-service';
import { getAdminDb } from '@/lib/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { ApiResponse } from '@/lib/types';
import { SUBSCRIPTION_PLANS } from '@/lib/billing/types';

const goCardlessService = new GoCardlessService();
const db = getAdminDb();

// PUT /api/billing/subscriptions/[id] - Update subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to update subscription',
        } as ApiResponse,
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const subscriptionId = resolvedParams.id;
    const body = await request.json();
    const { planId, cancelAtPeriodEnd } = body;

    // Verify user owns this subscription
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
    if (userData?.billing?.subscriptionId !== subscriptionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You can only update your own subscription',
        } as ApiResponse,
        { status: 403 }
      );
    }

    // Validate new plan if provided
    let plan;
    if (planId) {
      plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
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
    }

    // Update subscription with GoCardless
    const updatedSubscription = await goCardlessService.updateSubscription({
      subscriptionId,
      planId,
      cancelAtPeriodEnd,
    });

    // Update user's billing information in Firestore
    const updateData: any = {
      'billing.status': updatedSubscription.status.toLowerCase(),
      'billing.cancelAtPeriodEnd': updatedSubscription.cancelAtPeriodEnd,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (planId && plan) {
      updateData['billing.planId'] = planId;
      updateData['billing.usage.monthlyLimit'] = plan.limits.promptsPerMonth;
    }

    await db.collection('users').doc(authResult.userId).update(updateData);

    return NextResponse.json({
      success: true,
      data: {
        subscription: updatedSubscription,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Subscription update failed',
        message: error instanceof Error ? error.message : 'Failed to update subscription',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// DELETE /api/billing/subscriptions/[id] - Cancel subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: 'You must be logged in to cancel subscription',
        } as ApiResponse,
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const subscriptionId = resolvedParams.id;
    const url = new URL(request.url);
    const cancelAtPeriodEnd = url.searchParams.get('cancelAtPeriodEnd') !== 'false';

    // Verify user owns this subscription
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
    if (userData?.billing?.subscriptionId !== subscriptionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'You can only cancel your own subscription',
        } as ApiResponse,
        { status: 403 }
      );
    }

    // Cancel subscription with GoCardless
    const canceledSubscription = await goCardlessService.cancelSubscription(subscriptionId);

    // Update user's billing information in Firestore
    const updateData: any = {
      'billing.status': canceledSubscription.status.toLowerCase(),
      'billing.cancelAtPeriodEnd': canceledSubscription.cancelAtPeriodEnd,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (canceledSubscription.endDate) {
      updateData['billing.endDate'] = canceledSubscription.endDate;
    }

    // If canceling immediately, revert to free plan
    if (!cancelAtPeriodEnd) {
      updateData['billing.planId'] = 'free';
      updateData['billing.usage.monthlyLimit'] = 50;
    }

    await db.collection('users').doc(authResult.userId).update(updateData);

    return NextResponse.json({
      success: true,
      data: {
        subscription: canceledSubscription,
        message: cancelAtPeriodEnd 
          ? 'Subscription will be canceled at the end of the current billing period'
          : 'Subscription has been canceled immediately',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Subscription cancellation failed',
        message: error instanceof Error ? error.message : 'Failed to cancel subscription',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
