import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import {
  stripe,
  updateUserSubscription,
  resetUserToFreeTier,
} from '@/lib/stripe';

// Disable body parsing, we need the raw body for webhook verification
export const runtime = 'nodejs';

async function getRawBody(request: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error('No request body');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await getRawBody(request);
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;

        if (userId && session.subscription) {
          // Fetch the subscription details
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await updateUserSubscription(userId, subscription);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.paused': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          await updateUserSubscription(userId, subscription);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (userId) {
          await resetUserToFreeTier(userId);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle successful payment - could send confirmation email
        console.log('Payment succeeded for invoice:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle failed payment - could send notification email
        console.log('Payment failed for invoice:', invoice.id);

        // Update subscription status if we have the subscription
        // Use type assertion as invoice structure varies by API version
        const invoiceData = invoice as unknown as { subscription?: string | { id: string } | null };
        const subscriptionId = typeof invoiceData.subscription === 'string'
          ? invoiceData.subscription
          : invoiceData.subscription?.id;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.supabase_user_id;

          if (userId) {
            await updateUserSubscription(userId, subscription);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
