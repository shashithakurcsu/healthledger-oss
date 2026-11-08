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
import { FamilyMemberForm, type FamilyMember } from '@/features/family';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'Edit Family Member | HealthLedger',
  description: 'Edit family member details.',
};

interface EditFamilyMemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFamilyMemberPage({ params }: EditFamilyMemberPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('id', id)
    .eq('profile_id', user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const member = data as FamilyMember;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`${ROUTES.family}/${id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Member
        </Link>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Family Member</CardTitle>
          <CardDescription>
            Update the details for {member.name}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="max-w-2xl">
        <FamilyMemberForm member={member} />
      </div>
    </div>
  );
}
