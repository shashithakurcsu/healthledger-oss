import type {
  ExpenseCategory,
  PlanType,
  Relationship,
  SubscriptionTier,
  SubscriptionStatus,
} from '@/constants';

// Database types that match the Supabase schema

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  profile_id: string;
  name: string;
  relationship: Relationship | null;
  date_of_birth: string | null;
  created_at: string;
}

export interface InsurancePlan {
  id: string;
  profile_id: string;
  plan_name: string;
  plan_type: PlanType | null;
  plan_year: number;
  individual_deductible: number;
  family_deductible: number;
  individual_oop_max: number;
  family_oop_max: number;
  hsa_eligible: boolean;
  fsa_eligible: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  profile_id: string;
  family_member_id: string | null;
  insurance_plan_id: string | null;
  date: string;
  provider_name: string;
  description: string | null;
  category: ExpenseCategory | null;
  billed_amount: number;
  insurance_paid: number;
  you_paid: number;
  hsa_fsa_eligible: boolean;
  paid_with_hsa_fsa: boolean;
  reimbursed: boolean;
  reimbursement_date: string | null;
  counts_toward_deductible: boolean;
  counts_toward_oop_max: boolean;
  notes: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

// Input types for creating/updating records

export interface CreateProfileInput {
  id: string;
  email: string;
  full_name?: string | null;
}

export interface UpdateProfileInput {
  full_name?: string | null;
  subscription_tier?: SubscriptionTier;
  subscription_status?: SubscriptionStatus;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
}

export interface CreateFamilyMemberInput {
  profile_id: string;
  name: string;
  relationship?: Relationship | null;
  date_of_birth?: string | null;
}

export interface UpdateFamilyMemberInput {
  name?: string;
  relationship?: Relationship | null;
  date_of_birth?: string | null;
}

export interface CreateInsurancePlanInput {
  profile_id: string;
  plan_name: string;
  plan_type?: PlanType | null;
  plan_year: number;
  individual_deductible?: number;
  family_deductible?: number;
  individual_oop_max?: number;
  family_oop_max?: number;
  hsa_eligible?: boolean;
  fsa_eligible?: boolean;
}

export interface UpdateInsurancePlanInput {
  plan_name?: string;
  plan_type?: PlanType | null;
  plan_year?: number;
  individual_deductible?: number;
  family_deductible?: number;
  individual_oop_max?: number;
  family_oop_max?: number;
  hsa_eligible?: boolean;
  fsa_eligible?: boolean;
  is_active?: boolean;
}

export interface CreateExpenseInput {
  profile_id: string;
  family_member_id?: string | null;
  insurance_plan_id?: string | null;
  date: string;
  provider_name: string;
  description?: string | null;
  category?: ExpenseCategory | null;
  billed_amount: number;
  insurance_paid?: number;
  you_paid: number;
  hsa_fsa_eligible?: boolean;
  paid_with_hsa_fsa?: boolean;
  reimbursed?: boolean;
  reimbursement_date?: string | null;
  counts_toward_deductible?: boolean;
  counts_toward_oop_max?: boolean;
  notes?: string | null;
  receipt_url?: string | null;
}

export interface UpdateExpenseInput {
  family_member_id?: string | null;
  insurance_plan_id?: string | null;
  date?: string;
  provider_name?: string;
  description?: string | null;
  category?: ExpenseCategory | null;
  billed_amount?: number;
  insurance_paid?: number;
  you_paid?: number;
  hsa_fsa_eligible?: boolean;
  paid_with_hsa_fsa?: boolean;
  reimbursed?: boolean;
  reimbursement_date?: string | null;
  counts_toward_deductible?: boolean;
  counts_toward_oop_max?: boolean;
  notes?: string | null;
  receipt_url?: string | null;
}

// Utility types

export interface DeductibleProgress {
  current: number;
  max: number;
  percentage: number;
  isMet: boolean;
}

export interface YearToDateSummary {
  totalBilled: number;
  totalPaid: number;
  totalInsurancePaid: number;
  totalHsaFsaEligible: number;
  totalReimbursed: number;
  expenseCount: number;
}
