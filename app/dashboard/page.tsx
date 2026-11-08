import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Receipt,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  Users,
  Shield,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ROUTES, EXPENSE_CATEGORIES } from '@/constants';
import { SpendingChart, CategoryChart } from '@/components/dashboard';
import type { Expense, InsurancePlan } from '@/types/database';

export const metadata: Metadata = {
  title: 'Dashboard | HealthLedger',
  description: 'Track your medical expenses and HSA/FSA savings.',
};

function getMonthlySpending(expenses: Expense[]) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const currentYear = new Date().getFullYear();

  const monthlyData = months.map((month, index) => ({
    month,
    youPaid: 0,
    insurancePaid: 0,
  }));

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    if (date.getFullYear() === currentYear) {
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].youPaid += Number(expense.you_paid);
      monthlyData[monthIndex].insurancePaid += Number(expense.insurance_paid);
    }
  });

  // Return only months up to current month
  const currentMonth = new Date().getMonth();
  return monthlyData.slice(0, currentMonth + 1);
}

function getCategoryBreakdown(expenses: Expense[]) {
  const categoryTotals: Record<string, number> = {};

  expenses.forEach((expense) => {
    const category = expense.category || 'other';
    categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.you_paid);
  });

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      label: EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]?.label || category,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8); // Top 8 categories
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentYear = new Date().getFullYear();
  let expenses: Expense[] = [];
  let allYearExpenses: Expense[] = [];
  let insurancePlan: InsurancePlan | null = null;
  let familyMemberCount = 0;
  let insurancePlanCount = 0;

  if (user) {
    // Fetch all expenses for the current year (for charts)
    const { data: allExpensesData } = await supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', user.id)
      .gte('date', `${currentYear}-01-01`)
      .order('date', { ascending: false });

    allYearExpenses = (allExpensesData || []) as Expense[];
    expenses = allYearExpenses.slice(0, 5); // Recent 5 for list

    // Fetch active insurance plan
    const { data: planData } = await supabase
      .from('insurance_plans')
      .select('*')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .single();
    insurancePlan = planData as InsurancePlan | null;

    // Count family members
    const { count: familyCount } = await supabase
      .from('family_members')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id);
    familyMemberCount = familyCount || 0;

    // Count insurance plans
    const { count: planCount } = await supabase
      .from('insurance_plans')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user.id);
    insurancePlanCount = planCount || 0;
  }

  // Calculate totals
  const totalPaid = allYearExpenses.reduce((sum, e) => sum + Number(e.you_paid), 0);
  const totalBilled = allYearExpenses.reduce((sum, e) => sum + Number(e.billed_amount), 0);
  const totalInsurancePaid = allYearExpenses.reduce((sum, e) => sum + Number(e.insurance_paid), 0);
  const totalHsaEligible = allYearExpenses
    .filter((e) => e.hsa_fsa_eligible && !e.reimbursed)
    .reduce((sum, e) => sum + Number(e.you_paid), 0);
  const expensesMissingReceipts = allYearExpenses.filter((e) => !e.receipt_url).length;

  // Calculate current month expenses
  const currentMonthExpenses = allYearExpenses.filter((e) => {
    const expenseDate = new Date(e.date);
    const now = new Date();
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });
  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, e) => sum + Number(e.you_paid),
    0
  );

  // Calculate deductible progress
  const deductibleProgress = insurancePlan
    ? Math.min(
        (totalPaid / Number(insurancePlan.individual_deductible)) * 100,
        100
      )
    : 0;

  const oopProgress = insurancePlan
    ? Math.min(
        (totalPaid / Number(insurancePlan.individual_oop_max)) * 100,
        100
      )
    : 0;

  // Chart data
  const monthlySpending = getMonthlySpending(allYearExpenses);
  const categoryBreakdown = getCategoryBreakdown(allYearExpenses);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Track your medical expenses and savings at a glance
          </p>
        </div>
        <Link href={ROUTES.newExpense}>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Year-to-Date Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {allYearExpenses.length} expenses in {currentYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              HSA-Eligible (Unreimbursed)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalHsaEligible)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available for tax-free withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {currentMonthExpenses.length} expenses this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Insurance Savings
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalInsurancePaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              Covered by insurance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>
              Your out-of-pocket vs insurance payments in {currentYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allYearExpenses.length > 0 ? (
              <SpendingChart data={monthlySpending} />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No expenses to display</p>
                  <Link href={ROUTES.newExpense}>
                    <Button variant="link" className="text-teal-600">
                      Add your first expense
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Where your healthcare dollars go
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allYearExpenses.length > 0 ? (
              <CategoryChart data={categoryBreakdown} />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-center">
                  <Receipt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No category data to display</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deductible & OOP Progress */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Deductible Progress</CardTitle>
            <CardDescription>
              {insurancePlan
                ? `${insurancePlan.plan_name} - ${currentYear}`
                : 'No active insurance plan'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insurancePlan ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Individual Deductible</span>
                  <span className="font-medium">
                    {formatCurrency(totalPaid)} /{' '}
                    {formatCurrency(Number(insurancePlan.individual_deductible))}
                  </span>
                </div>
                <Progress value={deductibleProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {deductibleProgress >= 100
                    ? 'Deductible met! Insurance now covers more.'
                    : `${formatCurrency(
                        Number(insurancePlan.individual_deductible) - totalPaid
                      )} remaining until deductible is met`}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <Shield className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-muted-foreground mb-4">
                  Add an insurance plan to track your deductible progress
                </p>
                <Link href={ROUTES.newInsurance}>
                  <Button variant="outline" size="sm">
                    Add Insurance Plan
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Out-of-Pocket Maximum</CardTitle>
            <CardDescription>
              Maximum you&apos;ll pay in a plan year
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insurancePlan ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Individual OOP Max</span>
                  <span className="font-medium">
                    {formatCurrency(totalPaid)} /{' '}
                    {formatCurrency(Number(insurancePlan.individual_oop_max))}
                  </span>
                </div>
                <Progress value={oopProgress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {oopProgress >= 100
                    ? 'OOP Max reached! Insurance covers 100% of eligible expenses.'
                    : `${formatCurrency(
                        Number(insurancePlan.individual_oop_max) - totalPaid
                      )} remaining until maximum`}
                </p>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Add an insurance plan to track OOP progress
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familyMemberCount}</div>
            <Link href={ROUTES.family}>
              <Button variant="link" className="p-0 h-auto text-xs text-teal-600">
                Manage family members
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Plans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insurancePlanCount}</div>
            <Link href={ROUTES.insurance}>
              <Button variant="link" className="p-0 h-auto text-xs text-teal-600">
                Manage insurance plans
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expensesMissingReceipts}</div>
            <p className="text-xs text-muted-foreground">
              Expenses missing receipts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest tracked expenses</CardDescription>
          </div>
          <Link href={ROUTES.expenses}>
            <Button variant="ghost" size="sm">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {expenses && expenses.length > 0 ? (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <Link
                  key={expense.id}
                  href={`${ROUTES.expenses}/${expense.id}`}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{expense.provider_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.description ||
                        EXPENSE_CATEGORIES[expense.category as keyof typeof EXPENSE_CATEGORIES]?.label ||
                        'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(Number(expense.you_paid))}
                    </p>
                    <div className="flex gap-1 justify-end mt-1">
                      {expense.hsa_fsa_eligible && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          HSA
                        </span>
                      )}
                      {!expense.receipt_url && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          No receipt
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-4 text-muted-foreground">
                No expenses tracked yet
              </p>
              <Link href={ROUTES.newExpense}>
                <Button className="mt-4" variant="outline">
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
