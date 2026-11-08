import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/constants';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect logged-in users to dashboard
  // Use try-catch to handle cases where Supabase client fails
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(ROUTES.dashboard);
    }
  } catch (error) {
    // If Supabase fails, just continue to render the auth page
    // This allows users to attempt login/signup even if there's a temporary issue
    console.error('Auth layout: Failed to check user session:', error);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header with logo */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-semibold text-xl text-gray-900">
              HealthLedger
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Simple footer */}
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} HealthLedger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
