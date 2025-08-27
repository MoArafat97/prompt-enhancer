'use client';

import { PricingPlans } from '@/components/billing/PricingPlans';

export default function TestBillingPage() {
  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId);
    alert(`Selected plan: ${planId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Test Billing Integration
          </h1>
          <p className="text-xl text-gray-600">
            Testing Square payment integration without webhooks
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Pricing Plans Component
          </h2>
          <PricingPlans 
            onSelectPlan={handleSelectPlan}
            showCurrentPlan={false}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span>✅ Plans API endpoint working</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
              <span>⏳ Square credentials needed for full testing</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              <span>ℹ️ Webhooks disabled for testing</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Next Steps
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Get Square sandbox credentials from developer.squareup.com</li>
            <li>Add credentials to .env.local file</li>
            <li>Test subscription creation</li>
            <li>Add webhooks when ready for production</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
