import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Expenses | HealthLedger',
  description: 'View and manage your medical expenses.',
};

export default async function ExpensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  interface ExpenseData {
    id: string;
    provider_name: string;
    description: string | null;
    category: string | null;
    date: string;
    you_paid: number;
    hsa_fsa_eligible: boolean;
    receipt_url: string | null;
  }
  let expenses: ExpenseData[] | null = null;
  if (user) {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', user.id)
      .order('date', { ascending: false });
    expenses = data as ExpenseData[] | null;
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500">
            Track and manage your medical expenses
          </p>
        </div>
        <Link href={ROUTES.newExpense}>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Expenses</CardTitle>
          <CardDescription>
            {expenses?.length || 0} total expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses && expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <Link
                  key={expense.id}
                  href={`${ROUTES.expenses}/${expense.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium">{expense.provider_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.description || expense.category || 'No description'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(Number(expense.you_paid))}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {expense.hsa_fsa_eligible && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            HSA Eligible
                          </span>
                        )}
                        {!expense.receipt_url && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            No Receipt
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No expenses yet</h3>
              <p className="mt-2 text-muted-foreground">
                Start tracking your medical expenses to see them here.
              </p>
              <Link href={ROUTES.newExpense}>
                <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first expense
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
