import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Marketing header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-semibold text-xl text-gray-900">
                HealthLedger
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href={ROUTES.pricing}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                FAQ
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href={ROUTES.login}>
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href={ROUTES.signup}>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Marketing footer */}
      <footer className="border-t bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="font-semibold text-xl text-gray-900">
                  HealthLedger
                </span>
              </Link>
              <p className="mt-4 text-sm text-gray-500">
                Track medical expenses. Maximize tax savings. Stay audit-ready.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Product</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/#features"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.pricing}
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#faq"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">Support</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="mailto:support@healthledger.app"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-sm text-gray-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p>
                &copy; {new Date().getFullYear()} HealthLedger contributors.
              </p>
              <p>
                <a
                  href="https://github.com/shashithakurcsu/healthledger-oss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Open source on GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
