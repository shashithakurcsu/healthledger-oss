import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Pencil, User, Calendar, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { DeleteFamilyMemberButton } from '@/features/family';
import { ROUTES, RELATIONSHIPS } from '@/constants';
import type { Relationship } from '@/constants';

export const metadata: Metadata = {
  title: 'Family Member Details | HealthLedger',
  description: 'View and edit family member details.',
};

interface FamilyMemberPageProps {
  params: Promise<{ id: string }>;
}

interface MemberData {
  id: string;
  name: string;
  relationship: string | null;
  date_of_birth: string | null;
  created_at: string;
}

export default async function FamilyMemberDetailPage({ params }: FamilyMemberPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const member = data as MemberData;

  const relationshipLabel = member.relationship
    ? RELATIONSHIPS[member.relationship as Relationship] || member.relationship
    : 'Not specified';

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Calculate age if date of birth is available
  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={ROUTES.family}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Family Members
        </Link>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`${ROUTES.family}/${id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <DeleteFamilyMemberButton
            memberId={member.id}
            memberName={member.name}
          />
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">{member.name}</CardTitle>
              <CardDescription className="mt-1">
                {relationshipLabel}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date of Birth */}
          {member.date_of_birth && (
            <>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {formatDate(member.date_of_birth)}
                    <span className="text-muted-foreground ml-2">
                      ({calculateAge(member.date_of_birth)} years old)
                    </span>
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Relationship */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Relationship</p>
              <p className="font-medium">{relationshipLabel}</p>
            </div>
          </div>

          <Separator />

          {/* Created Date */}
          <div className="text-sm text-muted-foreground">
            Added on {formatDate(member.created_at)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
