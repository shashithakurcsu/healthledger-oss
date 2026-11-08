-- HealthLedger Initial Database Schema
-- This migration creates all tables, indexes, RLS policies, and triggers

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'personal', 'family')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Family Members (for family plan)
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT CHECK (relationship IN ('self', 'spouse', 'child', 'dependent')),
  date_of_birth DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Insurance Plans
CREATE TABLE public.insurance_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('hdhp', 'ppo', 'hmo', 'epo', 'other')),
  plan_year INTEGER NOT NULL,
  individual_deductible DECIMAL(10,2) DEFAULT 0 NOT NULL,
  family_deductible DECIMAL(10,2) DEFAULT 0 NOT NULL,
  individual_oop_max DECIMAL(10,2) DEFAULT 0 NOT NULL,
  family_oop_max DECIMAL(10,2) DEFAULT 0 NOT NULL,
  hsa_eligible BOOLEAN DEFAULT FALSE NOT NULL,
  fsa_eligible BOOLEAN DEFAULT FALSE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Expenses
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  family_member_id UUID REFERENCES public.family_members(id) ON DELETE SET NULL,
  insurance_plan_id UUID REFERENCES public.insurance_plans(id) ON DELETE SET NULL,

  -- Expense Details
  date DATE NOT NULL,
  provider_name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN (
    'doctor_visit', 'specialist', 'hospital', 'emergency',
    'prescription', 'otc_medicine', 'dental', 'vision',
    'mental_health', 'lab_test', 'imaging', 'therapy',
    'medical_equipment', 'other'
  )),

  -- Amounts
  billed_amount DECIMAL(10,2) NOT NULL CHECK (billed_amount >= 0),
  insurance_paid DECIMAL(10,2) DEFAULT 0 NOT NULL CHECK (insurance_paid >= 0),
  you_paid DECIMAL(10,2) NOT NULL CHECK (you_paid >= 0),

  -- HSA/FSA Tracking
  hsa_fsa_eligible BOOLEAN DEFAULT TRUE NOT NULL,
  paid_with_hsa_fsa BOOLEAN DEFAULT FALSE NOT NULL,
  reimbursed BOOLEAN DEFAULT FALSE NOT NULL,
  reimbursement_date DATE,

  -- Deductible Tracking
  counts_toward_deductible BOOLEAN DEFAULT TRUE NOT NULL,
  counts_toward_oop_max BOOLEAN DEFAULT TRUE NOT NULL,

  -- Notes & Metadata
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Family members indexes
CREATE INDEX idx_family_members_profile ON public.family_members(profile_id);

-- Insurance plans indexes
CREATE INDEX idx_insurance_plans_profile ON public.insurance_plans(profile_id);
CREATE INDEX idx_insurance_plans_year ON public.insurance_plans(plan_year);
CREATE INDEX idx_insurance_plans_active ON public.insurance_plans(profile_id) WHERE is_active = TRUE;

-- Expenses indexes
CREATE INDEX idx_expenses_profile ON public.expenses(profile_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_family_member ON public.expenses(family_member_id) WHERE family_member_id IS NOT NULL;
CREATE INDEX idx_expenses_insurance_plan ON public.expenses(insurance_plan_id) WHERE insurance_plan_id IS NOT NULL;
CREATE INDEX idx_expenses_profile_date ON public.expenses(profile_id, date DESC);
CREATE INDEX idx_expenses_hsa_fsa ON public.expenses(profile_id) WHERE hsa_fsa_eligible = TRUE AND reimbursed = FALSE;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Family members policies
CREATE POLICY "Users can view own family members"
  ON public.family_members FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own family members"
  ON public.family_members FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own family members"
  ON public.family_members FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own family members"
  ON public.family_members FOR DELETE
  USING (auth.uid() = profile_id);

-- Insurance plans policies
CREATE POLICY "Users can view own insurance plans"
  ON public.insurance_plans FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own insurance plans"
  ON public.insurance_plans FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own insurance plans"
  ON public.insurance_plans FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own insurance plans"
  ON public.insurance_plans FOR DELETE
  USING (auth.uid() = profile_id);

-- Expenses policies
CREATE POLICY "Users can view own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = profile_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for expenses table
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage bucket for receipts (run in Supabase dashboard or via API)
-- Note: This SQL might not work directly, use Supabase Dashboard to create bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);

-- Storage policies for receipts bucket (apply via Supabase Dashboard)
-- Users can upload to their own folder: {user_id}/*
-- Users can only view their own files
