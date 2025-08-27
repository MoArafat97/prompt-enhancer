'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { PricingPlans } from './PricingPlans';

interface SubscriptionData {
  subscription: {
    id: string;
    status: string;
    planId: string;
    plan: {
      id: string;
      name: string;
      price: number;
      interval: string;
      features: string[];
    };
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    trialEnd?: string;
  };
  usage: {
    promptsUsed: number;
    monthlyLimit: number;
    resetDate: string;
  };
  customer: {
    id: string;
  };
}

export function SubscriptionManager() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showPricingPlans, setShowPricingPlans] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/billing/subscriptions');
      const data = await response.json();
      
      if (data.success) {
        setSubscriptionData(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch subscription data');
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load subscription information',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (cancelAtPeriodEnd: boolean = true) => {
    if (!subscriptionData?.subscription.id) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/billing/subscriptions/${subscriptionData.subscription.id}?cancelAtPeriodEnd=${cancelAtPeriodEnd}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      
      if (data.success) {
        addToast({
          title: 'Subscription Canceled',
          description: data.data.message,
          type: 'success',
        });
        await fetchSubscriptionData();
      } else {
        throw new Error(data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel subscription',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscriptionData?.subscription.id) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/billing/subscriptions/${subscriptionData.subscription.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelAtPeriodEnd: false }),
      });
      const data = await response.json();
      
      if (data.success) {
        addToast({
          title: 'Subscription Reactivated',
          description: 'Your subscription will continue at the end of the current period',
          type: 'success',
        });
        await fetchSubscriptionData();
      } else {
        throw new Error(data.message || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      addToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reactivate subscription',
        type: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd && status === 'active') {
      return <Badge variant="destructive">Canceling</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'trialing':
        return <Badge variant="secondary">Trial</Badge>;
      case 'canceled':
        return <Badge variant="destructive">Canceled</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'free':
        return <Badge variant="outline">Free</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUsagePercentage = () => {
    if (!subscriptionData?.usage) return 0;
    const { promptsUsed, monthlyLimit } = subscriptionData.usage;
    if (monthlyLimit === -1) return 0; // Unlimited
    return Math.min((promptsUsed / monthlyLimit) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPricingPlans) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <Button variant="outline" onClick={() => setShowPricingPlans(false)}>
            Back to Subscription
          </Button>
        </div>
        <PricingPlans 
          currentPlanId={subscriptionData?.subscription.planId}
          onSelectPlan={(planId) => {
            // Handle plan selection logic here
            console.log('Selected plan:', planId);
            setShowPricingPlans(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Current Subscription</span>
              </CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </div>
            {getStatusBadge(
              subscriptionData?.subscription.status || 'free',
              subscriptionData?.subscription.cancelAtPeriodEnd || false
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Plan Details</h4>
              <p className="text-sm text-gray-600">
                <strong>Plan:</strong> {subscriptionData?.subscription.plan.name || 'Free'}
              </p>
              {subscriptionData?.subscription.plan.price && subscriptionData.subscription.plan.price > 0 && (
                <p className="text-sm text-gray-600">
                  <strong>Price:</strong> ${(subscriptionData.subscription.plan.price / 100).toFixed(2)}/
                  {subscriptionData.subscription.plan.interval === 'YEARLY' ? 'year' : 'month'}
                </p>
              )}
            </div>
            
            {subscriptionData?.subscription.currentPeriodEnd && (
              <div>
                <h4 className="font-medium mb-2">Billing Period</h4>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Renews on {formatDate(subscriptionData.subscription.currentPeriodEnd)}
                </p>
              </div>
            )}
          </div>

          {/* Usage Information */}
          {subscriptionData?.usage && (
            <div>
              <h4 className="font-medium mb-2">Usage This Month</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prompts Used</span>
                  <span>
                    {subscriptionData.usage.promptsUsed}
                    {subscriptionData.usage.monthlyLimit === -1 
                      ? ' (Unlimited)' 
                      : ` / ${subscriptionData.usage.monthlyLimit}`
                    }
                  </span>
                </div>
                {subscriptionData.usage.monthlyLimit !== -1 && (
                  <Progress value={getUsagePercentage()} className="h-2" />
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={() => setShowPricingPlans(true)}>
              {subscriptionData?.subscription.planId === 'free' ? 'Upgrade Plan' : 'Change Plan'}
            </Button>
            
            {subscriptionData?.subscription.status === 'active' && (
              <>
                {subscriptionData.subscription.cancelAtPeriodEnd ? (
                  <Button 
                    variant="outline" 
                    onClick={handleReactivateSubscription}
                    disabled={actionLoading}
                  >
                    Reactivate Subscription
                  </Button>
                ) : (
                  <Button 
                    variant="destructive" 
                    onClick={() => handleCancelSubscription(true)}
                    disabled={actionLoading}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Cancellation Notice */}
          {subscriptionData?.subscription.cancelAtPeriodEnd && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Subscription Canceling</p>
                <p className="text-yellow-700">
                  Your subscription will end on {formatDate(subscriptionData.subscription.currentPeriodEnd)}.
                  You&apos;ll still have access to all features until then.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
