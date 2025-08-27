'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import { SubscriptionPlan } from '@/lib/billing/types';

interface PricingPlansProps {
  onSelectPlan?: (planId: string) => void;
  currentPlanId?: string;
  showCurrentPlan?: boolean;
}

export function PricingPlans({ onSelectPlan, currentPlanId, showCurrentPlan = true }: PricingPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/billing/plans');
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.data.plans);
      } else {
        throw new Error(data.message || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load pricing plans',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      addToast({
        title: 'Authentication Required',
        description: 'Please sign in to select a plan',
        type: 'error',
      });
      return;
    }

    setSelectedPlan(planId);
    onSelectPlan?.(planId);
  };

  const formatPrice = (price: number, interval: string) => {
    const formattedPrice = (price / 100).toFixed(2);
    return interval === 'YEARLY' ? `$${formattedPrice}/year` : `$${formattedPrice}/month`;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Star className="h-6 w-6" />;
      case 'pro':
        return <Zap className="h-6 w-6" />;
      case 'pro-yearly':
        return <Crown className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-gray-500 to-gray-600';
      case 'pro':
        return 'from-blue-500 to-blue-600';
      case 'pro-yearly':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const isCurrentPlan = (planId: string) => {
    return showCurrentPlan && currentPlanId === planId;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="h-10 bg-gray-300 rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card 
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              isCurrentPlan(plan.id) ? 'ring-2 ring-blue-500' : ''
            } ${
              plan.id === 'pro' ? 'border-blue-500 shadow-blue-500/20' : ''
            }`}
          >
            {plan.id === 'pro' && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                Popular
              </div>
            )}
            
            {plan.id === 'pro-yearly' && (
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                Save 17%
              </div>
            )}

            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlanColor(plan.id)} text-white`}>
                  {getPlanIcon(plan.id)}
                </div>
                <div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {isCurrentPlan(plan.id) && (
                    <Badge variant="secondary" className="mt-1">
                      Current Plan
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className="text-3xl font-bold">Free</div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">
                      ${(plan.price / 100).toFixed(0)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{plan.interval === 'YEARLY' ? 'year' : 'month'}
                    </span>
                  </div>
                )}
                {plan.interval === 'YEARLY' && plan.price > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ${((1999 * 12 - plan.price) / 100).toFixed(0)} per year
                  </div>
                )}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={plan.id === 'pro' ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrentPlan(plan.id) || selectedPlan === plan.id}
              >
                {isCurrentPlan(plan.id) 
                  ? 'Current Plan' 
                  : selectedPlan === plan.id 
                    ? 'Processing...' 
                    : plan.price === 0 
                      ? 'Get Started' 
                      : 'Upgrade Now'
                }
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
