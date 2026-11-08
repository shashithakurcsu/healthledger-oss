import { NextResponse, type NextRequest } from 'next/server';
import { PROTECTED_ROUTES, AUTH_ROUTES, ROUTES } from '@/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route needs authentication check
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Skip middleware for public routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Only import Supabase when needed (for protected/auth routes)
  try {
    const { updateSession } = await import('@/lib/supabase/middleware');
    const { supabaseResponse, user } = await updateSession(request);

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL(ROUTES.login, request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated and trying to access auth routes
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow the request to continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Only match dashboard and auth routes
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
};
