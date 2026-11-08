'use server';

import { createClient } from '@/lib/supabase/server';
import { type SubscriptionTier } from '@/lib/stripe';
import {
  canAddExpense,
  canAddFamilyMember,
  canAddInsurancePlan,
  canUploadReceipts,
  getUpgradeMessage,
} from './feature-gating';

interface FeatureCheckResult {
  allowed: boolean;
  limit?: number;
  remaining?: number;
  message?: string;
}

/**
 * Check if the current user can add a new expense
 */
export async function checkCanAddExpense(): Promise<FeatureCheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, message: 'Please sign in to add expenses.' };
  }

  // Get user's subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const tier = (profile?.subscription_tier || 'free') as SubscriptionTier;

  // Count expenses this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString());

  const result = canAddExpense(tier, count || 0);

  if (!result.allowed) {
    return {
      allowed: false,
      limit: result.limit,
      remaining: result.remaining,
      message: getUpgradeMessage('expenses'),
    };
  }

  return {
    allowed: true,
    limit: result.limit,
    remaining: result.remaining,
  };
}

/**
 * Check if the current user can add a new family member
 */
export async function checkCanAddFamilyMember(): Promise<FeatureCheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, message: 'Please sign in to add family members.' };
  }

  // Get user's subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const tier = (profile?.subscription_tier || 'free') as SubscriptionTier;

  // Count current family members
  const { count } = await supabase
    .from('family_members')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const result = canAddFamilyMember(tier, count || 0);

  if (!result.allowed) {
    return {
      allowed: false,
      limit: result.limit,
      remaining: result.remaining,
      message: getUpgradeMessage('familyMembers'),
    };
  }

  return {
    allowed: true,
    limit: result.limit,
    remaining: result.remaining,
  };
}

/**
 * Check if the current user can add a new insurance plan
 */
export async function checkCanAddInsurancePlan(): Promise<FeatureCheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, message: 'Please sign in to add insurance plans.' };
  }

  // Get user's subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const tier = (profile?.subscription_tier || 'free') as SubscriptionTier;

  // Count current insurance plans
  const { count } = await supabase
    .from('insurance_plans')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const result = canAddInsurancePlan(tier, count || 0);

  if (!result.allowed) {
    return {
      allowed: false,
      limit: result.limit,
      remaining: result.remaining,
      message: getUpgradeMessage('insurancePlans'),
    };
  }

  return {
    allowed: true,
    limit: result.limit,
    remaining: result.remaining,
  };
}

/**
 * Check if the current user can upload receipts
 */
export async function checkCanUploadReceipts(): Promise<FeatureCheckResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, message: 'Please sign in to upload receipts.' };
  }

  // Get user's subscription tier
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  const tier = (profile?.subscription_tier || 'free') as SubscriptionTier;

  const allowed = canUploadReceipts(tier);

  if (!allowed) {
    return {
      allowed: false,
      message: getUpgradeMessage('receiptStorage'),
    };
  }

  return { allowed: true };
}

/**
 * Get the user's current subscription info
 */
export async function getUserSubscriptionInfo() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_status')
    .eq('id', user.id)
    .single();

  return {
    tier: (profile?.subscription_tier || 'free') as SubscriptionTier,
    status: profile?.subscription_status || 'active',
  };
}
