import { z } from 'zod';
import { PLAN_TYPES } from '@/constants';

// Get plan type keys for validation
const planTypeKeys = Object.keys(PLAN_TYPES) as [string, ...string[]];

// Insurance plan form schema
export const insurancePlanSchema = z.object({
  plan_name: z
    .string()
    .min(1, 'Plan name is required')
    .max(100, 'Plan name must be less than 100 characters'),
  plan_type: z.enum(planTypeKeys).optional(),
  plan_year: z
    .number()
    .min(2000, 'Invalid plan year')
    .max(2100, 'Invalid plan year'),
  individual_deductible: z
    .number()
    .min(0, 'Deductible cannot be negative')
    .max(100000, 'Deductible seems too high'),
  family_deductible: z
    .number()
    .min(0, 'Deductible cannot be negative')
    .max(200000, 'Deductible seems too high'),
  individual_oop_max: z
    .number()
    .min(0, 'OOP max cannot be negative')
    .max(200000, 'OOP max seems too high'),
  family_oop_max: z
    .number()
    .min(0, 'OOP max cannot be negative')
    .max(400000, 'OOP max seems too high'),
  hsa_eligible: z.boolean(),
  fsa_eligible: z.boolean(),
  is_active: z.boolean(),
}).refine(
  (data) => data.individual_deductible <= data.family_deductible,
  {
    message: 'Individual deductible cannot exceed family deductible',
    path: ['individual_deductible'],
  }
).refine(
  (data) => data.individual_oop_max <= data.family_oop_max,
  {
    message: 'Individual OOP max cannot exceed family OOP max',
    path: ['individual_oop_max'],
  }
).refine(
  (data) => data.individual_deductible <= data.individual_oop_max,
  {
    message: 'Deductible cannot exceed out-of-pocket maximum',
    path: ['individual_deductible'],
  }
);

export type InsurancePlanFormData = z.infer<typeof insurancePlanSchema>;

// Insurance plan with all fields from database
export interface InsurancePlan {
  id: string;
  profile_id: string;
  plan_name: string;
  plan_type: string | null;
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

// For creating a new insurance plan
export interface CreateInsurancePlanInput extends InsurancePlanFormData {
  profile_id: string;
}

// For updating an insurance plan
export type UpdateInsurancePlanInput = Partial<InsurancePlanFormData>;
