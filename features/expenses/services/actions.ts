'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { expenseSchema, type ExpenseFormData } from '../types';
import { ROUTES } from '@/constants';
import type { InsertTables, UpdateTables } from '@/types/database';

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function createExpense(formData: ExpenseFormData): Promise<ActionResult> {
  const validation = expenseSchema.safeParse(formData);
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
      error: 'You must be logged in to create an expense',
    };
  }

  const insertData: InsertTables<'expenses'> = {
    profile_id: user.id,
    date: formData.date,
    provider_name: formData.provider_name,
    description: formData.description || null,
    category: formData.category as InsertTables<'expenses'>['category'],
    billed_amount: formData.billed_amount,
    insurance_paid: formData.insurance_paid || 0,
    you_paid: formData.you_paid,
    hsa_fsa_eligible: formData.hsa_fsa_eligible ?? true,
    paid_with_hsa_fsa: formData.paid_with_hsa_fsa ?? false,
    reimbursed: formData.reimbursed ?? false,
    reimbursement_date: formData.reimbursement_date || null,
    counts_toward_deductible: formData.counts_toward_deductible ?? true,
    counts_toward_oop_max: formData.counts_toward_oop_max ?? true,
    notes: formData.notes || null,
    family_member_id: formData.family_member_id || null,
    insurance_plan_id: formData.insurance_plan_id || null,
  };

  const { error } = await supabase.from('expenses').insert(insertData);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.expenses);
  revalidatePath(ROUTES.dashboard);
  redirect(ROUTES.expenses);
}

export async function updateExpense(
  id: string,
  formData: ExpenseFormData
): Promise<ActionResult> {
  const validation = expenseSchema.safeParse(formData);
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
      error: 'You must be logged in to update an expense',
    };
  }

  const updateData: UpdateTables<'expenses'> = {
    date: formData.date,
    provider_name: formData.provider_name,
    description: formData.description || null,
    category: formData.category as UpdateTables<'expenses'>['category'],
    billed_amount: formData.billed_amount,
    insurance_paid: formData.insurance_paid || 0,
    you_paid: formData.you_paid,
    hsa_fsa_eligible: formData.hsa_fsa_eligible ?? true,
    paid_with_hsa_fsa: formData.paid_with_hsa_fsa ?? false,
    reimbursed: formData.reimbursed ?? false,
    reimbursement_date: formData.reimbursement_date || null,
    counts_toward_deductible: formData.counts_toward_deductible ?? true,
    counts_toward_oop_max: formData.counts_toward_oop_max ?? true,
    notes: formData.notes || null,
    family_member_id: formData.family_member_id || null,
    insurance_plan_id: formData.insurance_plan_id || null,
  };

  const { error } = await supabase
    .from('expenses')
    .update(updateData)
    .eq('id', id)
    .eq('profile_id', user.id); // Ensure user owns the expense

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.expenses);
  revalidatePath(`${ROUTES.expenses}/${id}`);
  revalidatePath(ROUTES.dashboard);
  redirect(ROUTES.expenses);
}

export async function deleteExpense(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete an expense',
    };
  }

  // First, get the expense to check for receipt
  const { data: expense } = await supabase
    .from('expenses')
    .select('receipt_url')
    .eq('id', id)
    .eq('profile_id', user.id)
    .single();

  // Delete receipt from storage if exists
  if (expense?.receipt_url) {
    const urlParts = expense.receipt_url.split('/receipts/');
    if (urlParts.length >= 2) {
      await supabase.storage.from('receipts').remove([urlParts[1]]);
    }
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.expenses);
  revalidatePath(ROUTES.dashboard);

  return {
    success: true,
  };
}

export async function updateExpenseReceipt(
  expenseId: string,
  receiptUrl: string | null
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in',
    };
  }

  const { error } = await supabase
    .from('expenses')
    .update({ receipt_url: receiptUrl })
    .eq('id', expenseId)
    .eq('profile_id', user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(`${ROUTES.expenses}/${expenseId}`);
  return { success: true };
}
