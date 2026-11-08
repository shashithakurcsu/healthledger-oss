import { Metadata } from 'next';
import Link from 'next/link';
import { Download, User, Lock, AlertTriangle, CreditCard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/constants';
import { STRIPE_PLANS, type SubscriptionTier } from '@/lib/stripe';
import { ProfileForm, PasswordForm, DeleteAccountButton } from '@/features/settings';

export const metadata: Metadata = {
  title: 'Settings | HealthLedger',
  description: 'Manage your account settings.',
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  interface ProfileData {
    full_name: string | null;
    email: string;
    subscription_tier: string;
    subscription_status: string | null;
  }
  let profile: ProfileData | null = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, email, subscription_tier, subscription_status')
      .eq('id', user.id)
      .single();
    profile = data as ProfileData | null;
  }

  const subscriptionTier = (profile?.subscription_tier || 'free') as SubscriptionTier;
  const plan = STRIPE_PLANS[subscriptionTier];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      {/* Account Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-teal-600" />
              <CardTitle>Account Overview</CardTitle>
            </div>
            <Badge
              className={
                subscriptionTier !== 'free'
                  ? 'bg-teal-600 hover:bg-teal-700'
                  : ''
              }
            >
              {plan.name} Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile?.email || user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.full_name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subscription</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{plan.name}</p>
                {subscriptionTier === 'free' && (
                  <Link href={ROUTES.billing}>
                    <Button variant="link" className="h-auto p-0 text-teal-600">
                      Upgrade
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm
            initialData={{
              fullName: profile?.full_name || '',
              email: profile?.email || user?.email || '',
            }}
          />
        </CardContent>
      </Card>

      {/* Password settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your subscription and billing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{plan.name} Plan</p>
              <p className="text-sm text-muted-foreground">
                {subscriptionTier === 'free'
                  ? 'Free forever'
                  : `$${plan.price}/month`}
              </p>
            </div>
            <Link href={ROUTES.billing}>
              <Button variant="outline">
                {subscriptionTier === 'free' ? 'View Plans' : 'Manage Subscription'}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Export Data</h4>
              <p className="text-sm text-muted-foreground">
                Download all your data in a portable format
              </p>
            </div>
            <Button variant="outline" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-600">Delete Account</h4>
              <p className="text-sm text-red-500">
                Permanently delete your account and all data
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
