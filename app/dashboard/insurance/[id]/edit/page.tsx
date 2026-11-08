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
import { InsurancePlanForm, type InsurancePlan } from '@/features/insurance';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Edit Insurance Plan | HealthLedger',
  description: 'Edit your insurance plan.',
};

interface EditInsurancePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInsurancePage({ params }: EditInsurancePageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data, error } = await supabase
    .from('insurance_plans')
    .select('*')
    .eq('id', id)
    .eq('profile_id', user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const plan = data as InsurancePlan;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`${ROUTES.insurance}/${id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plan
        </Link>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Insurance Plan</CardTitle>
          <CardDescription>
            Update the details for {plan.plan_name}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="max-w-3xl">
        <InsurancePlanForm plan={plan} />
      </div>
    </div>
  );
}
