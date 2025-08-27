import { NextRequest, NextResponse } from 'next/server';
import { GoCardlessWebhookHandler } from '@/lib/billing/webhook-handler';
import { ApiResponse } from '@/lib/types';

// POST /api/webhooks/gocardless - Handle GoCardless webhook events
export async function POST(request: NextRequest) {
  try {
    const webhookHandler = new GoCardlessWebhookHandler();
    const result = await webhookHandler.processWebhook(request);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
      } as ApiResponse);
    } else {
      console.error('Webhook processing failed:', result.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Webhook processing failed',
          message: result.message,
        } as ApiResponse,
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Webhook endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// GET /api/webhooks/gocardless - Webhook endpoint info (for debugging)
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      endpoint: '/api/webhooks/gocardless',
      method: 'POST',
      description: 'GoCardless webhook endpoint for payment events',
      environment: process.env.GOCARDLESS_ENVIRONMENT === 'live' ? 'live' : 'sandbox',
    },
  } as ApiResponse);
}
