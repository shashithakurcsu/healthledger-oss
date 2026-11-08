import { Metadata } from 'next';
import { Check, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/server';
import { STRIPE_PLANS, type SubscriptionTier } from '@/lib/stripe';
import { CheckoutButton, ManageSubscriptionButton } from '@/components/billing';

export const metadata: Metadata = {
  title: 'Billing | HealthLedger',
  description: 'Manage your subscription and billing.',
};

interface ProfileData {
  subscription_tier: string;
  subscription_status: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
}

interface BillingPageProps {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: ProfileData | null = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, stripe_subscription_id, stripe_customer_id')
      .eq('id', user.id)
      .single();
    profile = data as ProfileData | null;
  }

  const currentTier = (profile?.subscription_tier ?? 'free') as SubscriptionTier;
  const currentPlan = STRIPE_PLANS[currentTier];
  const subscriptionStatus = profile?.subscription_status ?? 'active';
  const hasActiveSubscription = profile?.stripe_subscription_id && subscriptionStatus === 'active';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Success/Cancel alerts */}
      {params.success === 'true' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Subscription Successful!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your subscription has been activated. Thank you for subscribing!
          </AlertDescription>
        </Alert>
      )}

      {params.canceled === 'true' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Checkout Canceled</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your checkout was canceled. No charges were made.
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription status alerts */}
      {subscriptionStatus === 'past_due' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Past Due</AlertTitle>
          <AlertDescription>
            Your payment is past due. Please update your payment method to continue your subscription.
          </AlertDescription>
        </Alert>
      )}

      {subscriptionStatus === 'canceled' && currentTier !== 'free' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Subscription Ending</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your subscription is set to cancel at the end of the billing period.
          </AlertDescription>
        </Alert>
      )}

      {/* Current plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the {currentPlan.name} plan
              </CardDescription>
            </div>
            <Badge
              className={
                currentTier !== 'free'
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : ''
              }
            >
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {hasActiveSubscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">
                      Manage your subscription and payment details
                    </p>
                  </div>
                </div>
                <ManageSubscriptionButton />
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Plan:</strong> {currentPlan.name} - ${currentPlan.price}/month</p>
                <p><strong>Status:</strong> {subscriptionStatus === 'active' ? 'Active' : subscriptionStatus}</p>
              </div>
            </div>
          ) : profile?.stripe_customer_id && currentTier !== 'free' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Billing History</p>
                    <p className="text-sm text-muted-foreground">
                      View past invoices and payment history
                    </p>
                  </div>
                </div>
                <ManageSubscriptionButton />
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {currentTier === 'free'
                ? 'Upgrade to a paid plan to unlock all features.'
                : 'No active subscription found.'}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pricing plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {(Object.entries(STRIPE_PLANS) as [SubscriptionTier, typeof STRIPE_PLANS[SubscriptionTier]][]).map(
            ([tier, plan]) => {
              const isPopular = tier === 'personal';
              const isCurrent = tier === currentTier;

              return (
                <Card
                  key={tier}
                  className={
                    isPopular
                      ? 'border-teal-600 border-2 relative'
                      : isCurrent
                      ? 'border-gray-300 border-2'
                      : ''
                  }
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-teal-600">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground">
                          /{plan.interval || 'forever'}
                        </span>
                      </div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <CheckoutButton
                      tier={tier}
                      currentTier={currentTier}
                      isPopular={isPopular}
                    />
                  </CardFooter>
                </Card>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
