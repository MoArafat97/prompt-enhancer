import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';
import { SUBSCRIPTION_PLANS } from '@/lib/billing/types';

// GET /api/billing/plans - Get available subscription plans
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        plans: SUBSCRIPTION_PLANS,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch subscription plans',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
