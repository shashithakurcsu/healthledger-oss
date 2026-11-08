import { STRIPE_PLANS, type SubscriptionTier } from '@/lib/stripe';

export interface FeatureLimits {
  expensesPerMonth: number;
  familyMembers: number;
  insurancePlans: number;
  receiptStorage: boolean;
}

/**
 * Get the feature limits for a subscription tier
 */
export function getFeatureLimits(tier: SubscriptionTier): FeatureLimits {
  return STRIPE_PLANS[tier].limits;
}

/**
 * Check if a feature is available for a given tier
 */
export function hasFeature(
  tier: SubscriptionTier,
  feature: keyof FeatureLimits
): boolean {
  const limits = getFeatureLimits(tier);
  const value = limits[feature];

  if (typeof value === 'boolean') {
    return value;
  }

  // For numeric limits, -1 means unlimited, 0 means disabled
  return value !== 0;
}

/**
 * Check if user can add more expenses this month
 */
export function canAddExpense(
  tier: SubscriptionTier,
  currentMonthExpenses: number
): { allowed: boolean; limit: number; remaining: number } {
  const limits = getFeatureLimits(tier);
  const limit = limits.expensesPerMonth;

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  const remaining = limit - currentMonthExpenses;
  return {
    allowed: currentMonthExpenses < limit,
    limit,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Check if user can add more family members
 */
export function canAddFamilyMember(
  tier: SubscriptionTier,
  currentFamilyMembers: number
): { allowed: boolean; limit: number; remaining: number } {
  const limits = getFeatureLimits(tier);
  const limit = limits.familyMembers;

  if (limit === 0) {
    return { allowed: false, limit: 0, remaining: 0 };
  }

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  const remaining = limit - currentFamilyMembers;
  return {
    allowed: currentFamilyMembers < limit,
    limit,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Check if user can add more insurance plans
 */
export function canAddInsurancePlan(
  tier: SubscriptionTier,
  currentPlans: number
): { allowed: boolean; limit: number; remaining: number } {
  const limits = getFeatureLimits(tier);
  const limit = limits.insurancePlans;

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1 };
  }

  const remaining = limit - currentPlans;
  return {
    allowed: currentPlans < limit,
    limit,
    remaining: Math.max(0, remaining),
  };
}

/**
 * Check if user can upload receipts
 */
export function canUploadReceipts(tier: SubscriptionTier): boolean {
  const limits = getFeatureLimits(tier);
  return limits.receiptStorage;
}

/**
 * Get upgrade message for a feature
 */
export function getUpgradeMessage(feature: string): string {
  const messages: Record<string, string> = {
    expenses: 'Upgrade to Personal or Family plan for unlimited expense tracking.',
    familyMembers: 'Upgrade to Family plan to add family members.',
    insurancePlans: 'Upgrade to Personal or Family plan to track more insurance plans.',
    receiptStorage: 'Upgrade to Personal or Family plan to upload and store receipts.',
  };
  return messages[feature] || 'Upgrade your plan to access this feature.';
}

/**
 * Get the recommended upgrade tier based on the feature needed
 */
export function getRecommendedUpgrade(
  currentTier: SubscriptionTier,
  featureNeeded: string
): SubscriptionTier | null {
  if (currentTier === 'family') {
    return null; // Already on highest tier
  }

  if (featureNeeded === 'familyMembers') {
    return 'family';
  }

  if (currentTier === 'free') {
    return 'personal';
  }

  return 'family';
}
