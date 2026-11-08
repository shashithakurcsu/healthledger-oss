'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SubscriptionTier } from '@/lib/stripe';

interface CheckoutButtonProps {
  tier: SubscriptionTier;
  currentTier: SubscriptionTier;
  isPopular?: boolean;
}

export function CheckoutButton({ tier, currentTier, isPopular }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
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

  if (tier === currentTier) {
    return (
      <Button className="w-full" variant="outline" disabled>
        Current Plan
      </Button>
    );
  }

  if (tier === 'free') {
    return (
      <Button className="w-full" variant="outline" disabled>
        Free Plan
      </Button>
    );
  }

  const isUpgrade = currentTier === 'free' ||
    (currentTier === 'personal' && tier === 'family');

  return (
    <Button
      className={
        isPopular
          ? 'w-full bg-teal-600 hover:bg-teal-700'
          : 'w-full'
      }
      variant={isPopular ? 'default' : 'outline'}
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : isUpgrade ? (
        'Upgrade'
      ) : (
        'Switch Plan'
      )}
    </Button>
  );
}
