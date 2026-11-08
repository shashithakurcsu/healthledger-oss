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
import { DeleteInsuranceButton } from '@/features/insurance';
import { ROUTES, PLAN_TYPES } from '@/constants';
import type { PlanType } from '@/constants';

export const metadata: Metadata = {
  title: 'Insurance Plan Details | HealthLedger',
  description: 'View and edit insurance plan details.',
};

interface InsurancePageProps {
  params: Promise<{ id: string }>;
}

interface PlanData {
  id: string;
  plan_name: string;
  plan_type: string | null;
  plan_year: number;
  individual_deductible: number;
  family_deductible: number;
  individual_oop_max: number;
  family_oop_max: number;
  hsa_eligible: boolean;
  fsa_eligible: boolean;
  is_active: boolean;
  created_at: string;
}

export default async function InsuranceDetailPage({ params }: InsurancePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('insurance_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const plan = data as PlanData;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const planTypeLabel = plan.plan_type
    ? PLAN_TYPES[plan.plan_type as PlanType] || plan.plan_type
    : 'Not specified';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.insurance}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Insurance Plans
        </Link>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`${ROUTES.insurance}/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Plan
            </Link>
          </Button>
          <DeleteInsuranceButton
            planId={plan.id}
            planName={plan.plan_name}
          />
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{plan.plan_name}</CardTitle>
              <CardDescription className="mt-1">
                {planTypeLabel} - Plan Year {plan.plan_year}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {plan.is_active ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  Inactive
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deductibles */}
          <div>
            <h3 className="font-medium mb-4">Deductibles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Individual</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(Number(plan.individual_deductible))}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-muted-foreground">Family</p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(Number(plan.family_deductible))}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Out-of-Pocket Maximums */}
          <div>
            <h3 className="font-medium mb-4">Out-of-Pocket Maximum</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-teal-700">Individual</p>
                <p className="text-2xl font-semibold text-teal-600">
                  {formatCurrency(Number(plan.individual_oop_max))}
                </p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-teal-700">Family</p>
                <p className="text-2xl font-semibold text-teal-600">
                  {formatCurrency(Number(plan.family_oop_max))}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Eligibility */}
          <div>
            <h3 className="font-medium mb-4">Tax-Advantaged Account Eligibility</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {plan.hsa_eligible ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className={plan.hsa_eligible ? '' : 'text-gray-500'}>
                  HSA Eligible
                </span>
              </div>
              <div className="flex items-center gap-2">
                {plan.fsa_eligible ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className={plan.fsa_eligible ? '' : 'text-gray-500'}>
                  FSA Eligible
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Created Date */}
          <div className="text-sm text-muted-foreground">
            Added on {new Date(plan.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
