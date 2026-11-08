/**
 * Safe environment variable utilities
 * Automatically trims whitespace/newlines to prevent issues with
 * env vars that have trailing characters from copy-paste or dashboard entry
 */

/**
 * Get an environment variable with automatic trimming
 * @param key - The environment variable name
 * @param defaultValue - Optional default value if not set
 * @returns The trimmed value or default
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  const value = process.env[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value.trim();
}

/**
 * Get a required environment variable with automatic trimming
 * Throws an error if the variable is not set
 * @param key - The environment variable name
 * @returns The trimmed value
 */
export function getRequiredEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Pre-defined getters for common env vars to ensure consistency

export function getAppUrl(): string {
  return getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000')!;
}

export function getSupabaseUrl(): string {
  return getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL');
}

export function getSupabaseAnonKey(): string {
  return getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export function getSupabaseServiceRoleKey(): string {
  return getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
}

export function getStripeSecretKey(): string {
  return getRequiredEnv('STRIPE_SECRET_KEY');
}

export function getStripePricePersonalMonthly(): string | undefined {
  return getEnv('STRIPE_PRICE_PERSONAL_MONTHLY');
}

export function getStripePriceFamilyMonthly(): string | undefined {
  return getEnv('STRIPE_PRICE_FAMILY_MONTHLY');
}
