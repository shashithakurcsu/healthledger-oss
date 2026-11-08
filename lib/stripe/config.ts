import Stripe from 'stripe';
import { getStripeSecretKey, getStripePricePersonalMonthly, getStripePriceFamilyMonthly } from '@/lib/env';

// Server-side Stripe client (lazy initialization)
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(getStripeSecretKey(), {
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backward compatibility
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

// Subscription tier configuration
// Note: priceId uses getters to ensure env vars are read at runtime with automatic trimming
export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    description: 'For individuals just getting started',
    get priceId() { return null; },
    price: 0,
    interval: null,
    features: [
      'Track up to 25 expenses/month',
      'Basic expense categories',
      'Single insurance plan',
      'Manual data entry',
    ],
    limits: {
      expensesPerMonth: 25,
      familyMembers: 0,
      insurancePlans: 1,
      receiptStorage: false,
    },
  },
  personal: {
    name: 'Personal',
    description: 'For individuals who want full tracking',
    get priceId() { return getStripePricePersonalMonthly(); },
    price: 4.99,
    interval: 'month' as const,
    features: [
      'Unlimited expenses',
      'All expense categories',
      'Multiple insurance plans',
      'Receipt storage (up to 1GB)',
      'PDF/CSV exports',
      'Deductible tracking',
      'HSA/FSA optimization tips',
    ],
    limits: {
      expensesPerMonth: -1, // Unlimited
      familyMembers: 0,
      insurancePlans: 5,
      receiptStorage: true,
    },
  },
  family: {
    name: 'Family',
    description: 'For families tracking multiple members',
    get priceId() { return getStripePriceFamilyMonthly(); },
    price: 9.99,
    interval: 'month' as const,
    features: [
      'Everything in Personal',
      'Up to 6 family members',
      'Family deductible tracking',
      'Per-member spending reports',
      'Receipt storage (up to 5GB)',
      'Priority support',
    ],
    limits: {
      expensesPerMonth: -1, // Unlimited
      familyMembers: 6,
      insurancePlans: 10,
      receiptStorage: true,
    },
  },
};

export type SubscriptionTier = keyof typeof STRIPE_PLANS;

// Helper to get plan by price ID
export function getPlanByPriceId(priceId: string): SubscriptionTier | null {
  for (const [tier, plan] of Object.entries(STRIPE_PLANS)) {
    if (plan.priceId === priceId) {
      return tier as SubscriptionTier;
    }
  }
  return null;
}

// Helper to check if a tier is paid
export function isPaidTier(tier: SubscriptionTier): boolean {
  return tier !== 'free';
}
