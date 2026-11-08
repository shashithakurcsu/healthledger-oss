import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import { ROUTES, PLAN_TYPES } from '@/constants';
import type { PlanType } from '@/constants';

export const metadata: Metadata = {
  title: 'Insurance Plans | HealthLedger',
  description: 'Manage your insurance plans.',
};

export default async function InsurancePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  }
  let plans: PlanData[] | null = null;
  if (user) {
    const { data } = await supabase
      .from('insurance_plans')
      .select('*')
      .eq('profile_id', user.id)
      .order('plan_year', { ascending: false });
    plans = data as PlanData[] | null;
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
          <h1 className="text-2xl font-bold text-gray-900">Insurance Plans</h1>
          <p className="text-gray-500">
            Manage your health insurance plans and track deductibles
          </p>
        </div>
        <Link href={ROUTES.newInsurance}>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </Link>
      </div>

      {plans && plans.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <Link key={plan.id} href={`${ROUTES.insurance}/${plan.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.plan_name}</CardTitle>
                      <CardDescription>
                        {plan.plan_type
                          ? PLAN_TYPES[plan.plan_type as PlanType]
                          : 'Unknown Type'}{' '}
                        - {plan.plan_year}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {plan.is_active && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Active
                        </Badge>
                      )}
                      {plan.hsa_eligible && (
                        <Badge variant="secondary">HSA</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Individual Deductible</p>
                      <p className="font-medium">
                        {formatCurrency(Number(plan.individual_deductible))}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Family Deductible</p>
                      <p className="font-medium">
                        {formatCurrency(Number(plan.family_deductible))}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Individual OOP Max</p>
                      <p className="font-medium">
                        {formatCurrency(Number(plan.individual_oop_max))}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Family OOP Max</p>
                      <p className="font-medium">
                        {formatCurrency(Number(plan.family_oop_max))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No insurance plans</h3>
              <p className="mt-2 text-muted-foreground">
                Add your insurance plan to track deductibles and out-of-pocket expenses.
              </p>
              <Link href={ROUTES.newInsurance}>
                <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
