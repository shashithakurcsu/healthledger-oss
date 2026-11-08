import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Trim to prevent whitespace issues from env var copy-paste
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://healthledger.app').trim();

export const metadata: Metadata = {
  title: {
    default: 'HealthLedger - HSA & Medical Expense Tracker',
    template: '%s | HealthLedger',
  },
  description:
    'Track medical expenses, store receipts, and maximize HSA/FSA tax savings. Stay audit-ready with simple expense tracking.',
  keywords: [
    'HSA expense tracker',
    'HSA receipt tracker',
    'FSA expense tracker',
    'medical expense tracker app',
    'track medical expenses for taxes',
    'HSA tax documentation',
    'medical deductible tracker',
    'healthcare expense management',
  ],
  authors: [{ name: 'HealthLedger contributors', url: 'https://github.com/shashithakurcsu/healthledger-oss' }],
  creator: 'HealthLedger',
  publisher: 'HealthLedger',
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HealthLedger - HSA & Medical Expense Tracker',
    description:
      'Track medical expenses, store receipts, and maximize HSA/FSA tax savings. Stay audit-ready with simple expense tracking.',
    url: APP_URL,
    siteName: 'HealthLedger',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HealthLedger - Track Medical Expenses & Maximize HSA Savings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthLedger - HSA & Medical Expense Tracker',
    description:
      'Track medical expenses, store receipts, and maximize HSA/FSA tax savings.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    // Add your verification codes when ready
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
