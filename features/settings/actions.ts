'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface UpdateProfileData {
  fullName: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateProfile(data: UpdateProfileData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.fullName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/settings');
  return { success: true };
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // First verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { success: false, error: 'Current password is incorrect' };
  }

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteAccount(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Delete all user data first (due to foreign key constraints)
  // Delete expenses
  await supabase.from('expenses').delete().eq('profile_id', user.id);

  // Delete family members
  await supabase.from('family_members').delete().eq('profile_id', user.id);

  // Delete insurance plans
  await supabase.from('insurance_plans').delete().eq('profile_id', user.id);

  // Delete profile
  await supabase.from('profiles').delete().eq('id', user.id);

  // Sign out
  await supabase.auth.signOut();

  return { success: true };
}
