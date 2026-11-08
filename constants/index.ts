// Expense categories with HSA/FSA eligibility
export const EXPENSE_CATEGORIES = {
  doctor_visit: { label: 'Doctor Visit', hsa: true, fsa: true },
  specialist: { label: 'Specialist', hsa: true, fsa: true },
  hospital: { label: 'Hospital', hsa: true, fsa: true },
  emergency: { label: 'Emergency', hsa: true, fsa: true },
  prescription: { label: 'Prescription', hsa: true, fsa: true },
  otc_medicine: { label: 'OTC Medicine', hsa: true, fsa: true },
  dental: { label: 'Dental', hsa: true, fsa: true },
  vision: { label: 'Vision', hsa: true, fsa: true },
  mental_health: { label: 'Mental Health', hsa: true, fsa: true },
  lab_test: { label: 'Lab Test', hsa: true, fsa: true },
  imaging: { label: 'Imaging', hsa: true, fsa: true },
  therapy: { label: 'Therapy', hsa: true, fsa: true },
  medical_equipment: { label: 'Medical Equipment', hsa: true, fsa: true },
  other: { label: 'Other', hsa: 'verify', fsa: 'verify' },
} as const;

export type ExpenseCategory = keyof typeof EXPENSE_CATEGORIES;

// Insurance plan types
export const PLAN_TYPES = {
  hdhp: 'High Deductible Health Plan (HDHP)',
  ppo: 'Preferred Provider Organization (PPO)',
  hmo: 'Health Maintenance Organization (HMO)',
  epo: 'Exclusive Provider Organization (EPO)',
  other: 'Other',
} as const;

export type PlanType = keyof typeof PLAN_TYPES;

// Family member relationships
export const RELATIONSHIPS = {
  self: 'Self',
  spouse: 'Spouse',
  child: 'Child',
  dependent: 'Dependent',
} as const;

export type Relationship = keyof typeof RELATIONSHIPS;

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    maxExpenses: 10,
    receiptStorage: false,
    familyMembers: 1,
    multiplePlans: false,
    exportEnabled: false,
  },
  personal: {
    name: 'Personal',
    maxExpenses: Infinity,
    receiptStorage: true,
    familyMembers: 1,
    multiplePlans: false,
    exportEnabled: true,
    priceMonthly: 7,
    priceYearly: 70,
  },
  family: {
    name: 'Family',
    maxExpenses: Infinity,
    receiptStorage: true,
    familyMembers: 5,
    multiplePlans: true,
    exportEnabled: true,
    priceMonthly: 12,
    priceYearly: 120,
  },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// Subscription statuses
export const SUBSCRIPTION_STATUSES = ['active', 'canceled', 'past_due', 'trialing'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

// App routes
export const ROUTES = {
  home: '/',
  pricing: '/pricing',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  dashboard: '/dashboard',
  expenses: '/dashboard/expenses',
  newExpense: '/dashboard/expenses/new',
  insurance: '/dashboard/insurance',
  newInsurance: '/dashboard/insurance/new',
  family: '/dashboard/family',
  newFamilyMember: '/dashboard/family/new',
  reports: '/dashboard/reports',
  settings: '/dashboard/settings',
  billing: '/dashboard/billing',
} as const;

// Protected routes that require authentication
export const PROTECTED_ROUTES = ['/dashboard'];

// Public routes that don't require authentication
export const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];
