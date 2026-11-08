import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { ExpenseForm } from '@/features/expenses';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Add Expense | HealthLedger',
  description: 'Add a new medical expense.',
};

interface FamilyMember {
  id: string;
  name: string;
}

interface InsurancePlan {
  id: string;
  plan_name: string;
}

export default async function NewExpensePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch family members and insurance plans for dropdowns
  const [familyMembersResult, insurancePlansResult] = await Promise.all([
    supabase
      .from('family_members')
      .select('id, name')
      .eq('profile_id', user?.id || '')
      .order('name'),
    supabase
      .from('insurance_plans')
      .select('id, plan_name')
      .eq('profile_id', user?.id || '')
      .eq('is_active', true)
      .order('plan_name'),
  ]);

  const familyMembers = (familyMembersResult.data || []) as FamilyMember[];
  const insurancePlans = (insurancePlansResult.data || []) as InsurancePlan[];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.expenses}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Expenses
        </Link>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
          <CardDescription>
            Track a new medical expense and keep your records organized
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="max-w-3xl">
        <ExpenseForm
          familyMembers={familyMembers}
          insurancePlans={insurancePlans}
        />
      </div>
    </div>
  );
}
