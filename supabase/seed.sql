-- HealthLedger Seed Data
-- This file is for development and testing purposes only
-- DO NOT run in production

-- Note: You'll need to create a test user first via Supabase Auth
-- Then update the UUID below with the actual user ID

-- Example data for a test user (replace 'YOUR-USER-UUID' with actual UUID)
-- Uncomment and modify as needed after creating a test user

/*
-- Insert a test insurance plan
INSERT INTO public.insurance_plans (
  profile_id,
  plan_name,
  plan_type,
  plan_year,
  individual_deductible,
  family_deductible,
  individual_oop_max,
  family_oop_max,
  hsa_eligible,
  fsa_eligible
) VALUES (
  'YOUR-USER-UUID',
  'Blue Cross PPO 2025',
  'ppo',
  2025,
  1500.00,
  3000.00,
  5000.00,
  10000.00,
  true,
  false
);

-- Insert a family member (self)
INSERT INTO public.family_members (
  profile_id,
  name,
  relationship
) VALUES (
  'YOUR-USER-UUID',
  'John Doe',
  'self'
);

-- Insert sample expenses
INSERT INTO public.expenses (
  profile_id,
  date,
  provider_name,
  description,
  category,
  billed_amount,
  insurance_paid,
  you_paid,
  hsa_fsa_eligible,
  counts_toward_deductible,
  counts_toward_oop_max
) VALUES
  (
    'YOUR-USER-UUID',
    '2025-01-15',
    'City Medical Center',
    'Annual physical exam',
    'doctor_visit',
    250.00,
    200.00,
    50.00,
    true,
    true,
    true
  ),
  (
    'YOUR-USER-UUID',
    '2025-01-10',
    'CVS Pharmacy',
    'Prescription medication',
    'prescription',
    45.00,
    30.00,
    15.00,
    true,
    true,
    true
  ),
  (
    'YOUR-USER-UUID',
    '2025-01-05',
    'Vision Care Associates',
    'Eye exam and new glasses',
    'vision',
    350.00,
    150.00,
    200.00,
    true,
    false,
    false
  );
*/
