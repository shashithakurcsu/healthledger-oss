import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
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
import { ROUTES, RELATIONSHIPS } from '@/constants';
import type { Relationship } from '@/constants';

export const metadata: Metadata = {
  title: 'Family Members | HealthLedger',
  description: 'Manage family members for expense tracking.',
};

export default async function FamilyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check subscription tier
  interface ProfileData {
    subscription_tier: string;
  }
  interface MemberData {
    id: string;
    name: string;
    relationship: string | null;
    date_of_birth: string | null;
  }
  let profile: ProfileData | null = null;
  let members: MemberData[] | null = null;

  if (user) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();
    profile = profileData as ProfileData | null;

    const { data: membersData } = await supabase
      .from('family_members')
      .select('*')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: true });
    members = membersData as MemberData[] | null;
  }

  const isFamilyPlan = profile?.subscription_tier === 'family';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Members</h1>
          <p className="text-gray-500">
            Track expenses for each family member separately
          </p>
        </div>
        {isFamilyPlan && (
          <Link href={ROUTES.newFamilyMember}>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </Link>
        )}
      </div>

      {!isFamilyPlan ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">
                Family Plan Required
              </h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                Track expenses for up to 5 family members with the Family plan.
                Upgrade to unlock this feature.
              </p>
              <Link href={ROUTES.billing}>
                <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                  Upgrade to Family Plan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : members && members.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link key={member.id} href={`${ROUTES.family}/${member.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    {member.relationship && (
                      <Badge variant="secondary">
                        {RELATIONSHIPS[member.relationship as Relationship]}
                      </Badge>
                    )}
                  </div>
                  {member.date_of_birth && (
                    <CardDescription>
                      Born:{' '}
                      {new Date(member.date_of_birth).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to view details and edit
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No family members</h3>
              <p className="mt-2 text-muted-foreground">
                Add family members to track their medical expenses separately.
              </p>
              <Link href={ROUTES.newFamilyMember}>
                <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first family member
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
