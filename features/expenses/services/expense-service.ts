import { createClient } from '@/lib/supabase/client';
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '../types';
import type { InsertTables, UpdateTables } from '@/types/database';

class ExpenseServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'ExpenseServiceError';
  }
}

export const expenseService = {
  async getAll(profileId: string): Promise<Expense[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', profileId)
      .order('date', { ascending: false });

    if (error) {
      throw new ExpenseServiceError('Failed to fetch expenses', error);
    }
    return data as Expense[];
  },

  async getByYear(profileId: string, year: number): Promise<Expense[]> {
    const supabase = createClient();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', profileId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      throw new ExpenseServiceError('Failed to fetch expenses for year', error);
    }
    return data as Expense[];
  },

  async getById(id: string): Promise<Expense | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new ExpenseServiceError('Failed to fetch expense', error);
    }
    return data as Expense;
  },

  async create(input: CreateExpenseInput): Promise<Expense> {
    const supabase = createClient();
    const insertData: InsertTables<'expenses'> = {
      profile_id: input.profile_id,
      date: input.date,
      provider_name: input.provider_name,
      description: input.description || null,
      category: input.category as InsertTables<'expenses'>['category'],
      billed_amount: input.billed_amount,
      insurance_paid: input.insurance_paid || 0,
      you_paid: input.you_paid,
      hsa_fsa_eligible: input.hsa_fsa_eligible ?? true,
      paid_with_hsa_fsa: input.paid_with_hsa_fsa ?? false,
      reimbursed: input.reimbursed ?? false,
      reimbursement_date: input.reimbursement_date || null,
      counts_toward_deductible: input.counts_toward_deductible ?? true,
      counts_toward_oop_max: input.counts_toward_oop_max ?? true,
      notes: input.notes || null,
      family_member_id: input.family_member_id || null,
      insurance_plan_id: input.insurance_plan_id || null,
      receipt_url: input.receipt_url || null,
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new ExpenseServiceError('Failed to create expense', error);
    }
    return data as Expense;
  },

  async update(id: string, input: UpdateExpenseInput): Promise<Expense> {
    const supabase = createClient();

    // Build update object, only including defined fields
    const updateData: UpdateTables<'expenses'> = {};

    if (input.date !== undefined) updateData.date = input.date;
    if (input.provider_name !== undefined) updateData.provider_name = input.provider_name;
    if (input.description !== undefined) updateData.description = input.description || null;
    if (input.category !== undefined) updateData.category = input.category as UpdateTables<'expenses'>['category'];
    if (input.billed_amount !== undefined) updateData.billed_amount = input.billed_amount;
    if (input.insurance_paid !== undefined) updateData.insurance_paid = input.insurance_paid;
    if (input.you_paid !== undefined) updateData.you_paid = input.you_paid;
    if (input.hsa_fsa_eligible !== undefined) updateData.hsa_fsa_eligible = input.hsa_fsa_eligible;
    if (input.paid_with_hsa_fsa !== undefined) updateData.paid_with_hsa_fsa = input.paid_with_hsa_fsa;
    if (input.reimbursed !== undefined) updateData.reimbursed = input.reimbursed;
    if (input.reimbursement_date !== undefined) updateData.reimbursement_date = input.reimbursement_date || null;
    if (input.counts_toward_deductible !== undefined) updateData.counts_toward_deductible = input.counts_toward_deductible;
    if (input.counts_toward_oop_max !== undefined) updateData.counts_toward_oop_max = input.counts_toward_oop_max;
    if (input.notes !== undefined) updateData.notes = input.notes || null;
    if (input.family_member_id !== undefined) updateData.family_member_id = input.family_member_id || null;
    if (input.insurance_plan_id !== undefined) updateData.insurance_plan_id = input.insurance_plan_id || null;
    if (input.receipt_url !== undefined) updateData.receipt_url = input.receipt_url || null;

    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new ExpenseServiceError('Failed to update expense', error);
    }
    return data as Expense;
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new ExpenseServiceError('Failed to delete expense', error);
    }
  },

  async uploadReceipt(
    file: File,
    userId: string,
    expenseId: string
  ): Promise<string> {
    const supabase = createClient();

    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${expenseId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new ExpenseServiceError('Failed to upload receipt', uploadError);
    }

    // Get the public URL (or signed URL for private bucket)
    const { data } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteReceipt(receiptUrl: string): Promise<void> {
    const supabase = createClient();

    // Extract file path from URL
    const urlParts = receiptUrl.split('/receipts/');
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('receipts')
      .remove([filePath]);

    if (error) {
      throw new ExpenseServiceError('Failed to delete receipt', error);
    }
  },
};
