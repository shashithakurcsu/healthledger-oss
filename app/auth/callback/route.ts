import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ROUTES } from '@/constants';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? ROUTES.dashboard;

  const supabase = await createClient();

  // Handle PKCE flow (code-based)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectToDestination(request, origin, next);
    }
  }

  // Handle email OTP flow (token_hash-based) - used by email verification links
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return redirectToDestination(request, origin, next);
    }
  }

  // Return to login page with error if something went wrong
  return NextResponse.redirect(`${origin}${ROUTES.login}?error=auth_callback_error`);
}

function redirectToDestination(request: Request, origin: string, next: string) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
