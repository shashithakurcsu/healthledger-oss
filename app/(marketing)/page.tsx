import { Metadata } from 'next';
import Link from 'next/link';
import {
  Receipt,
  Shield,
  DollarSign,
  FileText,
  Users,
  Clock,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ROUTES } from '@/constants';

export const metadata: Metadata = {
  title: 'HealthLedger - HSA & Medical Expense Tracker | Never Miss a Tax Deduction',
  description:
    'Track medical expenses, store receipts, and maximize HSA/FSA tax savings. Stay audit-ready with HealthLedger\'s simple expense tracking.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HealthLedger - HSA & Medical Expense Tracker',
    description:
      'Track medical expenses, store receipts, and maximize HSA/FSA tax savings. Stay audit-ready with simple expense tracking.',
    type: 'website',
  },
};

const features = [
  {
    icon: Receipt,
    title: 'Receipt Storage',
    description:
      'Upload and store receipt images indefinitely. Never lose proof of a medical expense again.',
  },
  {
    icon: Shield,
    title: 'Audit Protection',
    description:
      'Keep IRS-compliant records for 7+ years. Be prepared if the IRS ever questions your HSA withdrawals.',
  },
  {
    icon: DollarSign,
    title: 'Tax Maximization',
    description:
      'Know exactly which expenses qualify for HSA/FSA. Never miss a tax-free withdrawal opportunity.',
  },
  {
    icon: FileText,
    title: 'Easy Exports',
    description:
      'Generate annual tax summaries in PDF or CSV. Perfect for tax season or accountants.',
  },
  {
    icon: Users,
    title: 'Family Tracking',
    description:
      'Track expenses for your whole family. See individual or combined totals at a glance.',
  },
  {
    icon: Clock,
    title: 'Deductible Tracking',
    description:
      'Visual progress toward your deductible and out-of-pocket max. Know exactly where you stand.',
  },
];

const stats = [
  { value: '40M+', label: 'HSA accounts in the US' },
  { value: '$159B', label: 'in HSA assets' },
  { value: '20%', label: 'penalty for unqualified withdrawals' },
  { value: '7+ years', label: 'IRS can audit HSA usage' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <section className="relative bg-gradient-to-b from-teal-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Your HSA receipts,{' '}
              <span className="text-teal-600">organized forever.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              Track medical expenses, store receipts, and maximize your HSA/FSA
              tax savings. Stay audit-ready with simple expense tracking that
              saves you money.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.signup}>
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-lg px-8"
                >
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={ROUTES.pricing}>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required. Track up to 25 expenses/month free.
            </p>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-teal-400">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              The IRS can audit your HSA usage going back 7+ years
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              If you can&apos;t prove your HSA withdrawals were for qualified
              medical expenses, you face a{' '}
              <span className="font-semibold text-red-600">20% penalty</span>{' '}
              plus income tax on the full amount. Lost receipts can cost you
              thousands.
            </p>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              HealthLedger makes medical expense tracking simple and stress-free.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in minutes. Stay organized for years.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Track expenses',
                description:
                  'Add medical expenses as they happen. Snap a photo of your receipt right at the pharmacy or doctor&apos;s office.',
              },
              {
                step: '2',
                title: 'Stay organized',
                description:
                  'See your deductible progress, HSA-eligible totals, and unreimbursed expenses at a glance.',
              },
              {
                step: '3',
                title: 'Export at tax time',
                description:
                  'Generate annual summaries for your tax preparer or personal records. Always audit-ready.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-20 bg-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-teal-100">
            Start free. Upgrade when you need more.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-teal-100">25 expenses/month</div>
            </div>
            <div className="bg-white/20 rounded-lg p-6 ring-2 ring-white">
              <div className="text-2xl font-bold">$4.99/month</div>
              <div className="text-teal-100">Unlimited + receipts</div>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-2xl font-bold">$9.99/month</div>
              <div className="text-teal-100">Family plan (6 members)</div>
            </div>
          </div>
          <Link href={ROUTES.pricing}>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 bg-white text-teal-600 hover:bg-gray-100"
            >
              View full pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'Why do I need to keep HSA receipts?',
                a: 'The IRS requires you to keep records proving your HSA withdrawals were for qualified medical expenses. They can audit your HSA usage going back 7+ years. Without proof, you face a 20% penalty plus income tax.',
              },
              {
                q: 'What expenses are HSA/FSA eligible?',
                a: 'Most medical expenses are eligible: doctor visits, prescriptions, dental, vision, mental health, and more. Since 2020, OTC medications are also eligible. HealthLedger shows you which expenses qualify.',
              },
              {
                q: 'Is my data secure?',
                a: 'Yes. We use industry-standard encryption for all data in transit and at rest. Your receipt images are stored in private, secure storage with access controls. We follow healthcare data best practices.',
              },
              {
                q: 'Can I export my data?',
                a: 'Yes! Personal and Family plan users can export annual summaries in PDF and CSV format. Perfect for tax season or if you ever need to prove your expenses to the IRS.',
              },
              {
                q: 'What if I cancel my subscription?',
                a: 'Your data remains accessible in read-only mode on the Free plan. You can always export your data before canceling. We never delete your records.',
              },
            ].map((faq) => (
              <Card key={faq.q}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Start tracking your medical expenses today
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of HSA holders who never worry about lost receipts.
            Free to start, upgrade when you&apos;re ready.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.signup}>
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-lg px-8"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal-600" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal-600" />
              25 free expenses/month
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-teal-600" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
