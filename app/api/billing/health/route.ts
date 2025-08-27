import { NextRequest, NextResponse } from 'next/server';
import { GoCardlessService } from '@/lib/billing/gocardless-service';
import { ApiResponse } from '@/lib/types';

// GET /api/billing/health - Test GoCardless API connection
export async function GET(request: NextRequest) {
  try {
    const gocardlessService = new GoCardlessService();
    const detailed = await gocardlessService.healthCheckDetailed();

    return NextResponse.json({
      success: true,
      data: {
        gocardless: {
          connected: detailed.ok,
          statusCode: detailed.statusCode,
          errors: detailed.errors,
          endpoint: detailed.endpoint,
          environment: process.env.GOCARDLESS_ENVIRONMENT === 'live' ? 'live' : 'sandbox',
          timestamp: new Date().toISOString(),
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: {
          gocardless: {
            connected: false,
            environment: process.env.GOCARDLESS_ENVIRONMENT === 'live' ? 'live' : 'sandbox',
            timestamp: new Date().toISOString(),
          },
        },
      } as ApiResponse,
      { status: 500 }
    );
  }
}
