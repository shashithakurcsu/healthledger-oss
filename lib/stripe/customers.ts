import { stripe } from './config';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const supabase = await createAdminClient();

  // Check if user already has a Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      supabase_user_id: userId,
    },
  });

  // Save the customer ID to the user's profile
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}

/**
 * Get Stripe customer by ID
 */
export async function getStripeCustomer(customerId: string) {
  return stripe.customers.retrieve(customerId);
}

/**
 * Update Stripe customer email
 */
export async function updateStripeCustomerEmail(
  customerId: string,
  email: string
) {
  return stripe.customers.update(customerId, { email });
}

/**
 * Delete Stripe customer (for account deletion)
 */
export async function deleteStripeCustomer(customerId: string) {
  return stripe.customers.del(customerId);
}
