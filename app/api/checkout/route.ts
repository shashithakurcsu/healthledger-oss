import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getOrCreateStripeCustomer,
  createCheckoutSession,
  STRIPE_PLANS,
  type SubscriptionTier,
} from '@/lib/stripe';
import { getAppUrl } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier } = body as { tier: SubscriptionTier };

    // Validate tier
    if (!tier || !STRIPE_PLANS[tier]) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    const plan = STRIPE_PLANS[tier];

    // Check if this is a paid tier with configured price
    if (!plan.priceId) {
      return NextResponse.json(
        { error: 'Price not configured for this tier' },
        { status: 400 }
      );
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      user.id,
      user.email!,
      profile?.full_name
    );

    // Create checkout session - getAppUrl() automatically trims whitespace
    const baseUrl = getAppUrl();
    const session = await createCheckoutSession(
      customerId,
      plan.priceId,
      user.id,
      `${baseUrl}/dashboard/billing?success=true`,
      `${baseUrl}/dashboard/billing?canceled=true`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
