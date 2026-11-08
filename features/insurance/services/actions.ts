'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { insurancePlanSchema, type InsurancePlanFormData } from '../types';
import { ROUTES } from '@/constants';
import type { InsertTables, UpdateTables } from '@/types/database';

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function createInsurancePlan(
  formData: InsurancePlanFormData
): Promise<ActionResult> {
  const validation = insurancePlanSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to create an insurance plan',
    };
  }

  const insertData: InsertTables<'insurance_plans'> = {
    profile_id: user.id,
    plan_name: formData.plan_name,
    plan_type: formData.plan_type as InsertTables<'insurance_plans'>['plan_type'],
    plan_year: formData.plan_year,
    individual_deductible: formData.individual_deductible,
    family_deductible: formData.family_deductible,
    individual_oop_max: formData.individual_oop_max,
    family_oop_max: formData.family_oop_max,
    hsa_eligible: formData.hsa_eligible,
    fsa_eligible: formData.fsa_eligible,
    is_active: formData.is_active,
  };

  const { error } = await supabase.from('insurance_plans').insert(insertData);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.insurance);
  revalidatePath(ROUTES.dashboard);
  redirect(ROUTES.insurance);
}

export async function updateInsurancePlan(
  id: string,
  formData: InsurancePlanFormData
): Promise<ActionResult> {
  const validation = insurancePlanSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to update an insurance plan',
    };
  }

  const updateData: UpdateTables<'insurance_plans'> = {
    plan_name: formData.plan_name,
    plan_type: formData.plan_type as UpdateTables<'insurance_plans'>['plan_type'],
    plan_year: formData.plan_year,
    individual_deductible: formData.individual_deductible,
    family_deductible: formData.family_deductible,
    individual_oop_max: formData.individual_oop_max,
    family_oop_max: formData.family_oop_max,
    hsa_eligible: formData.hsa_eligible,
    fsa_eligible: formData.fsa_eligible,
    is_active: formData.is_active,
  };

  const { error } = await supabase
    .from('insurance_plans')
    .update(updateData)
    .eq('id', id)
    .eq('profile_id', user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.insurance);
  revalidatePath(`${ROUTES.insurance}/${id}`);
  revalidatePath(ROUTES.dashboard);
  redirect(ROUTES.insurance);
}

export async function deleteInsurancePlan(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete an insurance plan',
    };
  }

  // Check if any expenses are linked to this plan
  const { count } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('insurance_plan_id', id);

  if (count && count > 0) {
    return {
      success: false,
      error: `Cannot delete plan: ${count} expense(s) are linked to it. Remove the plan from those expenses first.`,
    };
  }

  const { error } = await supabase
    .from('insurance_plans')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.insurance);
  revalidatePath(ROUTES.dashboard);

  return {
    success: true,
  };
}
