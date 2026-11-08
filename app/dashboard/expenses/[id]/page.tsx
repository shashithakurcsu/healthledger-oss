import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Pencil, CheckCircle2, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { ExpenseReceiptSection, DeleteExpenseButton } from '@/features/expenses';
import { ROUTES, EXPENSE_CATEGORIES } from '@/constants';
import type { ExpenseCategory } from '@/constants';

export const metadata: Metadata = {
  title: 'Expense Details | HealthLedger',
  description: 'View and edit expense details.',
};

interface ExpensePageProps {
  params: Promise<{ id: string }>;
}

interface ExpenseData {
  id: string;
  profile_id: string;
  provider_name: string;
  description: string | null;
  category: string | null;
  date: string;
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
  family_member?: { name: string } | null;
  insurance_plan?: { plan_name: string } | null;
}

export default async function ExpenseDetailPage({ params }: ExpensePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      family_member:family_members(name),
      insurance_plan:insurance_plans(plan_name)
    `)
    .eq('id', id)
    .eq('profile_id', user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const expense = data as ExpenseData;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const categoryLabel = expense.category
    ? EXPENSE_CATEGORIES[expense.category as ExpenseCategory]?.label
    : 'Uncategorized';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.expenses}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Expenses
        </Link>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`${ROUTES.expenses}/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Expense
            </Link>
          </Button>
          <DeleteExpenseButton
            expenseId={expense.id}
            providerName={expense.provider_name}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Expense Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{expense.provider_name}</CardTitle>
                <CardDescription className="mt-1">
                  {formatDate(expense.date)}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {expense.hsa_fsa_eligible && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    HSA Eligible
                  </Badge>
                )}
                {expense.paid_with_hsa_fsa && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Paid with HSA/FSA
                  </Badge>
                )}
                {expense.reimbursed && (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                    Reimbursed
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description & Category */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p className="mt-1 font-medium">{categoryLabel}</p>
              </div>
              {expense.family_member && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Family Member</h4>
                  <p className="mt-1">{expense.family_member.name}</p>
                </div>
              )}
            </div>

            {expense.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1">{expense.description}</p>
              </div>
            )}

            <Separator />

            {/* Amounts */}
            <div>
              <h3 className="font-medium mb-4">Amounts</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-500">Billed Amount</h4>
                  <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(Number(expense.billed_amount))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-500">Insurance Paid</h4>
                  <p className="mt-1 text-xl font-semibold">
                    {formatCurrency(Number(expense.insurance_paid))}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-teal-50">
                  <h4 className="text-sm font-medium text-teal-700">You Paid</h4>
                  <p className="mt-1 text-xl font-semibold text-teal-600">
                    {formatCurrency(Number(expense.you_paid))}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tracking */}
            <div>
              <h3 className="font-medium mb-4">Insurance Tracking</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {expense.counts_toward_deductible ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className={expense.counts_toward_deductible ? '' : 'text-gray-500'}>
                    Counts toward deductible
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {expense.counts_toward_oop_max ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className={expense.counts_toward_oop_max ? '' : 'text-gray-500'}>
                    Counts toward out-of-pocket max
                  </span>
                </div>
              </div>
            </div>

            {/* Insurance Plan */}
            {expense.insurance_plan && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Insurance Plan</h4>
                  <p className="mt-1">{expense.insurance_plan.plan_name}</p>
                </div>
              </>
            )}

            {/* Reimbursement */}
            {expense.reimbursed && expense.reimbursement_date && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Reimbursement Date</h4>
                  <p className="mt-1">{formatDate(expense.reimbursement_date)}</p>
                </div>
              </>
            )}

            {/* Notes */}
            {expense.notes && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="mt-1 text-gray-700 whitespace-pre-wrap">{expense.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Receipt Section */}
        <div className="lg:col-span-1">
          <ExpenseReceiptSection
            expenseId={expense.id}
            userId={user.id}
            currentReceiptUrl={expense.receipt_url}
          />
        </div>
      </div>
    </div>
  );
}
