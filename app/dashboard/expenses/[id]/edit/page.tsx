import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { ExpenseForm, type Expense } from '@/features/expenses';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Edit Expense | HealthLedger',
  description: 'Edit your medical expense.',
};

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

interface FamilyMember {
  id: string;
  name: string;
}

interface InsurancePlan {
  id: string;
  plan_name: string;
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch expense, family members, and insurance plans in parallel
  const [expenseResult, familyMembersResult, insurancePlansResult] = await Promise.all([
    supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .eq('profile_id', user.id)
      .single(),
    supabase
      .from('family_members')
      .select('id, name')
      .eq('profile_id', user.id)
      .order('name'),
    supabase
      .from('insurance_plans')
      .select('id, plan_name')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .order('plan_name'),
  ]);

  const expenseData = expenseResult.data;
  if (expenseResult.error || !expenseData) {
    notFound();
  }

  const expense = expenseData as Expense;
  const familyMembers = (familyMembersResult.data || []) as FamilyMember[];
  const insurancePlans = (insurancePlansResult.data || []) as InsurancePlan[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`${ROUTES.expenses}/${id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Expense
        </Link>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
          <CardDescription>
            Update the details for your expense at {expense.provider_name}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="max-w-3xl">
        <ExpenseForm
          expense={expense}
          familyMembers={familyMembers}
          insurancePlans={insurancePlans}
        />
      </div>
    </div>
  );
}
