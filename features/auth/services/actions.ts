'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  type LoginInput,
  type SignupInput,
  type ForgotPasswordInput,
} from '../types';
import { ROUTES } from '@/constants';
import { getAppUrl } from '@/lib/env';

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function login(data: LoginInput): Promise<AuthResult> {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect(ROUTES.dashboard);
}

export async function signup(data: SignupInput): Promise<AuthResult> {
  const validation = signupSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName || null,
      },
      emailRedirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect(ROUTES.login);
}

export async function forgotPassword(
  data: ForgotPasswordInput
): Promise<AuthResult> {
  const validation = forgotPasswordSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input',
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${getAppUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getAppUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.url) {
    redirect(data.url);
  }
}
