import type { Expense } from '@/features/expenses';
import type { InsurancePlan } from '@/features/insurance';
import type { FamilyMember } from '@/features/family';

export interface DeductibleProgress {
  individual: {
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
    met: boolean;
  };
  family: {
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
    met: boolean;
  };
}

export interface OopMaxProgress {
  individual: {
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
    met: boolean;
  };
  family: {
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
    met: boolean;
  };
}

export interface MemberSpending {
  memberId: string | null;
  memberName: string;
  deductibleSpent: number;
  oopSpent: number;
}

export interface YearlySpendingSummary {
  totalBilled: number;
  totalInsurancePaid: number;
  totalYouPaid: number;
  hsaFsaEligibleAmount: number;
  hsaFsaPaidAmount: number;
  unreimbursedAmount: number;
  deductibleProgress: DeductibleProgress;
  oopMaxProgress: OopMaxProgress;
  byCategory: Record<string, number>;
  byMember: MemberSpending[];
  expenseCount: number;
}

/**
 * Calculate deductible progress for an insurance plan based on expenses
 */
export function calculateDeductibleProgress(
  expenses: Expense[],
  plan: InsurancePlan,
  familyMembers: FamilyMember[]
): DeductibleProgress {
  // Filter expenses that count toward deductible and match the plan year
  const relevantExpenses = expenses.filter(
    (exp) =>
      exp.counts_toward_deductible &&
      exp.insurance_plan_id === plan.id &&
      new Date(exp.date).getFullYear() === plan.plan_year
  );

  // Calculate individual spending (self only, or if no family members)
  const selfExpenses = relevantExpenses.filter((exp) => !exp.family_member_id);
  const individualSpent = selfExpenses.reduce((sum, exp) => sum + Number(exp.you_paid), 0);

  // Calculate family spending (all expenses toward this plan)
  const familySpent = relevantExpenses.reduce((sum, exp) => sum + Number(exp.you_paid), 0);

  // Calculate remaining and percentage
  const individualRemaining = Math.max(0, plan.individual_deductible - individualSpent);
  const familyRemaining = Math.max(0, plan.family_deductible - familySpent);

  const individualPercentage =
    plan.individual_deductible > 0
      ? Math.min(100, (individualSpent / plan.individual_deductible) * 100)
      : 0;
  const familyPercentage =
    plan.family_deductible > 0
      ? Math.min(100, (familySpent / plan.family_deductible) * 100)
      : 0;

  return {
    individual: {
      spent: individualSpent,
      limit: plan.individual_deductible,
      remaining: individualRemaining,
      percentage: Math.round(individualPercentage * 10) / 10,
      met: individualSpent >= plan.individual_deductible,
    },
    family: {
      spent: familySpent,
      limit: plan.family_deductible,
      remaining: familyRemaining,
      percentage: Math.round(familyPercentage * 10) / 10,
      met: familySpent >= plan.family_deductible,
    },
  };
}

/**
 * Calculate out-of-pocket maximum progress for an insurance plan based on expenses
 */
export function calculateOopMaxProgress(
  expenses: Expense[],
  plan: InsurancePlan,
  familyMembers: FamilyMember[]
): OopMaxProgress {
  // Filter expenses that count toward OOP max and match the plan year
  const relevantExpenses = expenses.filter(
    (exp) =>
      exp.counts_toward_oop_max &&
      exp.insurance_plan_id === plan.id &&
      new Date(exp.date).getFullYear() === plan.plan_year
  );

  // Calculate individual spending (self only)
  const selfExpenses = relevantExpenses.filter((exp) => !exp.family_member_id);
  const individualSpent = selfExpenses.reduce((sum, exp) => sum + Number(exp.you_paid), 0);

  // Calculate family spending (all expenses)
  const familySpent = relevantExpenses.reduce((sum, exp) => sum + Number(exp.you_paid), 0);

  // Calculate remaining and percentage
  const individualRemaining = Math.max(0, plan.individual_oop_max - individualSpent);
  const familyRemaining = Math.max(0, plan.family_oop_max - familySpent);

  const individualPercentage =
    plan.individual_oop_max > 0
      ? Math.min(100, (individualSpent / plan.individual_oop_max) * 100)
      : 0;
  const familyPercentage =
    plan.family_oop_max > 0 ? Math.min(100, (familySpent / plan.family_oop_max) * 100) : 0;

  return {
    individual: {
      spent: individualSpent,
      limit: plan.individual_oop_max,
      remaining: individualRemaining,
      percentage: Math.round(individualPercentage * 10) / 10,
      met: individualSpent >= plan.individual_oop_max,
    },
    family: {
      spent: familySpent,
      limit: plan.family_oop_max,
      remaining: familyRemaining,
      percentage: Math.round(familyPercentage * 10) / 10,
      met: familySpent >= plan.family_oop_max,
    },
  };
}

/**
 * Calculate spending breakdown by family member
 */
export function calculateMemberSpending(
  expenses: Expense[],
  familyMembers: FamilyMember[]
): MemberSpending[] {
  // Create a map of member IDs to names
  const memberMap = new Map<string, string>();
  familyMembers.forEach((member) => {
    memberMap.set(member.id, member.name);
  });

  // Group expenses by family member
  const spendingByMember = new Map<string | null, { deductible: number; oop: number }>();

  expenses.forEach((expense) => {
    const memberId = expense.family_member_id;
    const current = spendingByMember.get(memberId) || { deductible: 0, oop: 0 };

    if (expense.counts_toward_deductible) {
      current.deductible += Number(expense.you_paid);
    }
    if (expense.counts_toward_oop_max) {
      current.oop += Number(expense.you_paid);
    }

    spendingByMember.set(memberId, current);
  });

  // Convert to array format
  const result: MemberSpending[] = [];

  // Add "Self" (null family member) first
  const selfSpending = spendingByMember.get(null);
  if (selfSpending) {
    result.push({
      memberId: null,
      memberName: 'Self',
      deductibleSpent: selfSpending.deductible,
      oopSpent: selfSpending.oop,
    });
  }

  // Add family members
  spendingByMember.forEach((spending, memberId) => {
    if (memberId !== null) {
      result.push({
        memberId,
        memberName: memberMap.get(memberId) || 'Unknown',
        deductibleSpent: spending.deductible,
        oopSpent: spending.oop,
      });
    }
  });

  return result.sort((a, b) => b.oopSpent - a.oopSpent);
}

/**
 * Calculate yearly spending summary for a given year
 */
export function calculateYearlySpendingSummary(
  expenses: Expense[],
  plan: InsurancePlan | null,
  familyMembers: FamilyMember[],
  year: number
): YearlySpendingSummary {
  // Filter expenses for the given year
  const yearExpenses = expenses.filter(
    (exp) => new Date(exp.date).getFullYear() === year
  );

  // Calculate totals
  const totalBilled = yearExpenses.reduce((sum, exp) => sum + Number(exp.billed_amount), 0);
  const totalInsurancePaid = yearExpenses.reduce(
    (sum, exp) => sum + Number(exp.insurance_paid),
    0
  );
  const totalYouPaid = yearExpenses.reduce((sum, exp) => sum + Number(exp.you_paid), 0);

  // HSA/FSA calculations
  const hsaFsaEligibleExpenses = yearExpenses.filter((exp) => exp.hsa_fsa_eligible);
  const hsaFsaEligibleAmount = hsaFsaEligibleExpenses.reduce(
    (sum, exp) => sum + Number(exp.you_paid),
    0
  );
  const hsaFsaPaidAmount = yearExpenses
    .filter((exp) => exp.paid_with_hsa_fsa)
    .reduce((sum, exp) => sum + Number(exp.you_paid), 0);

  // Unreimbursed amount (eligible but not paid with HSA/FSA and not reimbursed)
  const unreimbursedAmount = hsaFsaEligibleExpenses
    .filter((exp) => !exp.paid_with_hsa_fsa && !exp.reimbursed)
    .reduce((sum, exp) => sum + Number(exp.you_paid), 0);

  // Calculate by category
  const byCategory: Record<string, number> = {};
  yearExpenses.forEach((exp) => {
    const category = exp.category || 'uncategorized';
    byCategory[category] = (byCategory[category] || 0) + Number(exp.you_paid);
  });

  // Calculate deductible and OOP progress if plan is provided
  const deductibleProgress = plan
    ? calculateDeductibleProgress(yearExpenses, plan, familyMembers)
    : {
        individual: { spent: 0, limit: 0, remaining: 0, percentage: 0, met: false },
        family: { spent: 0, limit: 0, remaining: 0, percentage: 0, met: false },
      };

  const oopMaxProgress = plan
    ? calculateOopMaxProgress(yearExpenses, plan, familyMembers)
    : {
        individual: { spent: 0, limit: 0, remaining: 0, percentage: 0, met: false },
        family: { spent: 0, limit: 0, remaining: 0, percentage: 0, met: false },
      };

  // Calculate by member
  const byMember = calculateMemberSpending(yearExpenses, familyMembers);

  return {
    totalBilled,
    totalInsurancePaid,
    totalYouPaid,
    hsaFsaEligibleAmount,
    hsaFsaPaidAmount,
    unreimbursedAmount,
    deductibleProgress,
    oopMaxProgress,
    byCategory,
    byMember,
    expenseCount: yearExpenses.length,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
  return `${Math.round(percentage)}%`;
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 75) return 'bg-amber-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-teal-500';
}
