import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { createClient } from '@/lib/supabase/server';
import { EXPENSE_CATEGORIES, ROUTES } from '@/constants';
import type { Expense, InsurancePlan } from '@/types/database';

export const metadata: Metadata = {
  title: 'Reports | HealthLedger',
  description: 'View and export your expense reports.',
};

interface YearSummary {
  year: number;
  totalPaid: number;
  totalBilled: number;
  insurancePaid: number;
  hsaEligible: number;
  expenseCount: number;
  topCategories: { category: string; label: string; amount: number }[];
}

function getYearSummary(expenses: Expense[], year: number): YearSummary {
  const yearExpenses = expenses.filter((e) => {
    const expenseYear = new Date(e.date).getFullYear();
    return expenseYear === year;
  });

  // Calculate totals
  const totalPaid = yearExpenses.reduce((sum, e) => sum + Number(e.you_paid), 0);
  const totalBilled = yearExpenses.reduce((sum, e) => sum + Number(e.billed_amount), 0);
  const insurancePaid = yearExpenses.reduce((sum, e) => sum + Number(e.insurance_paid), 0);
  const hsaEligible = yearExpenses
    .filter((e) => e.hsa_fsa_eligible && !e.reimbursed)
    .reduce((sum, e) => sum + Number(e.you_paid), 0);

  // Get top categories
  const categoryTotals: Record<string, number> = {};
  yearExpenses.forEach((e) => {
    const cat = e.category || 'other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.you_paid);
  });

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      label: EXPENSE_CATEGORIES[category as keyof typeof EXPENSE_CATEGORIES]?.label || category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    year,
    totalPaid,
    totalBilled,
    insurancePaid,
    hsaEligible,
    expenseCount: yearExpenses.length,
    topCategories,
  };
}

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  interface ProfileData {
    subscription_tier: string;
  }
  let profile: ProfileData | null = null;
  let allExpenses: Expense[] = [];
  let insurancePlan: InsurancePlan | null = null;

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();
    profile = profileData as ProfileData | null;

    // Fetch all expenses
    const { data: expensesData } = await supabase
      .from('expenses')
      .select('*')
      .eq('profile_id', user.id)
      .order('date', { ascending: false });
    allExpenses = (expensesData || []) as Expense[];

    // Fetch active insurance plan
    const { data: planData } = await supabase
      .from('insurance_plans')
      .select('*')
      .eq('profile_id', user.id)
      .eq('is_active', true)
      .single();
    insurancePlan = planData as InsurancePlan | null;
  }

  const canExport =
    profile?.subscription_tier === 'personal' ||
    profile?.subscription_tier === 'family';

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const yearSummaries = years.map((year) => getYearSummary(allExpenses, year));

  // Current year calculations
  const currentYearSummary = yearSummaries[0];
  const deductibleProgress = insurancePlan
    ? Math.min((currentYearSummary.totalPaid / Number(insurancePlan.individual_deductible)) * 100, 100)
    : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">
            View summaries and export your expense data
          </p>
        </div>
      </div>

      {/* Current Year Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid ({currentYear})</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentYearSummary.totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {currentYearSummary.expenseCount} expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insurance Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(currentYearSummary.insurancePaid)}
            </div>
            <p className="text-xs text-muted-foreground">Covered by insurance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HSA/FSA Eligible</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(currentYearSummary.hsaEligible)}
            </div>
            <p className="text-xs text-muted-foreground">Tax-advantaged spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deductible Progress</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deductibleProgress.toFixed(0)}%</div>
            <Progress value={deductibleProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Year summaries */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Annual Summaries</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {yearSummaries.map((summary) => (
            <Card key={summary.year}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{summary.year}</CardTitle>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardDescription>
                  {summary.expenseCount} expenses tracked
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary.expenseCount > 0 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You Paid</span>
                        <span className="font-medium">{formatCurrency(summary.totalPaid)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Insurance Paid</span>
                        <span className="font-medium">{formatCurrency(summary.insurancePaid)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">HSA/FSA Eligible</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(summary.hsaEligible)}
                        </span>
                      </div>
                    </div>

                    {summary.topCategories.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Top Categories</p>
                        {summary.topCategories.slice(0, 3).map((cat) => (
                          <div key={cat.category} className="flex justify-between text-xs mb-1">
                            <span>{cat.label}</span>
                            <span className="text-muted-foreground">{formatCurrency(cat.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {canExport ? (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled
                        >
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled
                        >
                          <Download className="mr-2 h-4 w-4" />
                          CSV
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        <Link href={ROUTES.billing} className="text-teal-600 hover:underline">
                          Upgrade
                        </Link>{' '}
                        to export reports
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Receipt className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm">No expenses recorded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tax summary card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            <CardTitle>Tax Summary - {currentYear}</CardTitle>
          </div>
          <CardDescription>
            HSA/FSA eligible expenses for tax documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentYearSummary.hsaEligible > 0 ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">HSA/FSA Eligible Expenses</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {formatCurrency(currentYearSummary.hsaEligible)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Unreimbursed, tax-advantaged expenses
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">Total Medical Expenses</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatCurrency(currentYearSummary.totalPaid)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Total out-of-pocket costs in {currentYear}
                  </p>
                </div>
              </div>

              {currentYearSummary.topCategories.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Expense Breakdown by Category</h4>
                  <div className="space-y-2">
                    {currentYearSummary.topCategories.map((cat) => {
                      const percentage = (cat.amount / currentYearSummary.totalPaid) * 100;
                      return (
                        <div key={cat.category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{cat.label}</span>
                            <span className="text-muted-foreground">
                              {formatCurrency(cat.amount)} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {canExport && (
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Export Tax Summary (PDF)
                  </Button>
                  <Button variant="outline" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Export All Expenses (CSV)
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No tax-eligible expenses yet</h3>
              <p className="mt-2 max-w-md mx-auto">
                Start tracking your medical expenses to see your HSA/FSA eligible spending.
              </p>
              <Link href={ROUTES.newExpense}>
                <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                  Add Your First Expense
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
