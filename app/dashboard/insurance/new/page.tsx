import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InsurancePlanForm } from '@/features/insurance';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Add Insurance Plan | HealthLedger',
  description: 'Add a new insurance plan.',
};

export default function NewInsurancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.insurance}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Insurance Plans
        </Link>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Add Insurance Plan</CardTitle>
          <CardDescription>
            Add your health insurance plan to track deductibles and out-of-pocket expenses
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="max-w-3xl">
        <InsurancePlanForm />
      </div>
    </div>
  );
}
