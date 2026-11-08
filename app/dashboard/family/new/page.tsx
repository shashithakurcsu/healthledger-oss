import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FamilyMemberForm } from '@/features/family';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Add Family Member | HealthLedger',
  description: 'Add a new family member.',
};

export default function NewFamilyMemberPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.family}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Family Members
        </Link>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Add Family Member</CardTitle>
          <CardDescription>
            Add a family member to track their medical expenses separately
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="max-w-2xl">
        <FamilyMemberForm />
      </div>
    </div>
  );
}
