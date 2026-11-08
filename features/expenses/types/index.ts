import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '@/constants';

// Get category keys for validation
const categoryKeys = Object.keys(EXPENSE_CATEGORIES) as [string, ...string[]];

// Expense form schema - used for validation
export const expenseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  provider_name: z
    .string()
    .min(1, 'Provider name is required')
    .max(100, 'Provider name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  category: z.enum(categoryKeys).optional(),
  billed_amount: z
    .number()
    .min(0.01, 'Billed amount must be greater than 0')
    .max(1000000, 'Amount seems too high, please verify'),
  insurance_paid: z
    .number()
    .min(0, 'Insurance paid cannot be negative'),
  you_paid: z
    .number()
    .min(0, 'Amount paid cannot be negative'),
  hsa_fsa_eligible: z.boolean(),
  paid_with_hsa_fsa: z.boolean(),
  reimbursed: z.boolean(),
  reimbursement_date: z.string().optional().nullable(),
  counts_toward_deductible: z.boolean(),
  counts_toward_oop_max: z.boolean(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  family_member_id: z.string().uuid().optional().nullable(),
  insurance_plan_id: z.string().uuid().optional().nullable(),
}).refine(
  (data) => data.you_paid <= data.billed_amount,
  {
    message: "Amount you paid can't exceed billed amount",
    path: ['you_paid'],
  }
);

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// Expense with all fields from database
export interface Expense {
  id: string;
  profile_id: string;
  family_member_id: string | null;
  insurance_plan_id: string | null;
  date: string;
  provider_name: string;
  description: string | null;
  category: string | null;
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

// For creating a new expense
export interface CreateExpenseInput extends ExpenseFormData {
  profile_id: string;
  receipt_url?: string | null;
}

// For updating an expense
export interface UpdateExpenseInput extends Partial<ExpenseFormData> {
  receipt_url?: string | null;
}
