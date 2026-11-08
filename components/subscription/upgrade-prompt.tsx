'use client';

import { useState } from 'react';
import { Loader2, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { STRIPE_PLANS, type SubscriptionTier } from '@/lib/stripe';

interface UpgradePromptProps {
  feature: string;
  message: string;
  recommendedTier?: SubscriptionTier;
  currentLimit?: number;
  compact?: boolean;
}

export function UpgradePrompt({
  feature,
  message,
  recommendedTier = 'personal',
  currentLimit,
  compact = false,
}: UpgradePromptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const plan = STRIPE_PLANS[recommendedTier];

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: recommendedTier }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data);
        alert(data.details || data.error || 'Failed to start checkout. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-full">
            <Lock className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <p className="font-medium text-teal-900">{message}</p>
            {currentLimit !== undefined && currentLimit > 0 && (
              <p className="text-sm text-teal-700">
                Current limit: {currentLimit}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          className="bg-teal-600 hover:bg-teal-700"
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1" />
              Upgrade
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-100 rounded-full">
            <Lock className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <CardTitle className="text-teal-900">Upgrade Required</CardTitle>
            <CardDescription className="text-teal-700">
              {message}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/70 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900">{plan.name} Plan</h4>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            ${plan.price}
            <span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <ul className="mt-3 space-y-1">
            {plan.features.slice(0, 3).map((feature) => (
              <li key={feature} className="text-sm text-gray-600 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-teal-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700"
          onClick={handleUpgrade}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade to {plan.name}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
