'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { familyMemberSchema, type FamilyMemberFormData } from '../types';
import { ROUTES } from '@/constants';
import type { InsertTables, UpdateTables } from '@/types/database';

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function createFamilyMember(
  formData: FamilyMemberFormData
): Promise<ActionResult> {
  const validation = familyMemberSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to add a family member',
    };
  }

  const insertData: InsertTables<'family_members'> = {
    profile_id: user.id,
    name: formData.name,
    relationship: formData.relationship as InsertTables<'family_members'>['relationship'],
    date_of_birth: formData.date_of_birth || null,
  };

  const { error } = await supabase.from('family_members').insert(insertData);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.family);
  revalidatePath(ROUTES.dashboard);
  redirect(ROUTES.family);
}

export async function updateFamilyMember(
  id: string,
  formData: FamilyMemberFormData
): Promise<ActionResult> {
  const validation = familyMemberSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to update a family member',
    };
  }

  const updateData: UpdateTables<'family_members'> = {
    name: formData.name,
    relationship: formData.relationship as UpdateTables<'family_members'>['relationship'],
    date_of_birth: formData.date_of_birth || null,
  };

  const { error } = await supabase
    .from('family_members')
    .update(updateData)
    .eq('id', id)
    .eq('profile_id', user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.family);
  revalidatePath(`${ROUTES.family}/${id}`);
  revalidatePath(ROUTES.dashboard);
  redirect(ROUTES.family);
}

export async function deleteFamilyMember(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to delete a family member',
    };
  }

  // Check if any expenses are linked to this family member
  const { count } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('family_member_id', id);

  if (count && count > 0) {
    return {
      success: false,
      error: `Cannot delete family member: ${count} expense(s) are linked to them. Remove the family member from those expenses first.`,
    };
  }

  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id)
    .eq('profile_id', user.id);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath(ROUTES.family);
  revalidatePath(ROUTES.dashboard);

  return {
    success: true,
  };
}
