import { stripe, STRIPE_PLANS, getPlanByPriceId, type SubscriptionTier } from './config';
import { createAdminClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        supabase_user_id: userId,
      },
    },
    metadata: {
      supabase_user_id: userId,
    },
  });

  return session;
}

/**
 * Create a customer portal session for managing subscriptions
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get active subscription for a customer
 */
export async function getActiveSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  return subscriptions.data[0] || null;
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a canceled subscription
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Update user's subscription status in database
 */
export async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const supabase = await createAdminClient();

  // Determine tier from price ID
  const priceId = subscription.items.data[0]?.price.id;
  const tier = priceId ? getPlanByPriceId(priceId) : 'free';

  // Map Stripe status to our status
  let status: 'active' | 'canceled' | 'past_due' | 'trialing';
  switch (subscription.status) {
    case 'active':
      status = subscription.cancel_at_period_end ? 'canceled' : 'active';
      break;
    case 'trialing':
      status = 'trialing';
      break;
    case 'past_due':
      status = 'past_due';
      break;
    case 'paused':
      // Paused subscriptions should not have access to paid features
      status = 'canceled';
      break;
    case 'canceled':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
    default:
      status = 'canceled';
  }

  await supabase
    .from('profiles')
    .update({
      subscription_tier: tier || 'free',
      subscription_status: status,
      stripe_subscription_id: subscription.id,
    })
    .eq('id', userId);
}

/**
 * Reset user to free tier
 */
export async function resetUserToFreeTier(userId: string): Promise<void> {
  const supabase = await createAdminClient();

  await supabase
    .from('profiles')
    .update({
      subscription_tier: 'free',
      subscription_status: 'active',
      stripe_subscription_id: null,
    })
    .eq('id', userId);
}

/**
 * Get user's subscription details from database
 */
export async function getUserSubscription(userId: string) {
  const supabase = await createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id')
    .eq('id', userId)
    .single();

  if (!profile) {
    return null;
  }

  const tier = (profile.subscription_tier || 'free') as SubscriptionTier;
  const plan = STRIPE_PLANS[tier];

  return {
    tier,
    status: profile.subscription_status,
    customerId: profile.stripe_customer_id,
    subscriptionId: profile.stripe_subscription_id,
    plan,
  };
}
