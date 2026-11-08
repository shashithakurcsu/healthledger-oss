import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants';
import { STRIPE_PLANS } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Simple, transparent pricing for HSA and medical expense tracking. Start free, upgrade when you need more.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing - HealthLedger',
    description:
      'Simple, transparent pricing for HSA and medical expense tracking. Free plan available.',
    type: 'website',
  },
};

// Feature comparison data
const featureComparison = {
  free: [
    { text: 'Track up to 25 expenses per month', included: true },
    { text: 'Basic expense categories', included: true },
    { text: 'Single insurance plan', included: true },
    { text: 'Single user', included: true },
    { text: 'Receipt image storage', included: false },
    { text: 'Export to PDF/CSV', included: false },
    { text: 'Family members', included: false },
    { text: 'Multiple insurance plans', included: false },
  ],
  personal: [
    { text: 'Unlimited expense tracking', included: true },
    { text: 'Receipt image upload & storage', included: true },
    { text: 'Deductible + OOP max tracking', included: true },
    { text: 'HSA/FSA eligibility indicators', included: true },
    { text: 'Annual tax summary export (PDF + CSV)', included: true },
    { text: 'Multiple insurance plans (up to 5)', included: true },
    { text: 'HSA/FSA optimization tips', included: true },
    { text: 'Family members', included: false },
  ],
  family: [
    { text: 'Everything in Personal', included: true },
    { text: 'Up to 6 family members', included: true },
    { text: 'Multiple insurance plans (up to 10)', included: true },
    { text: 'Per-member spending reports', included: true },
    { text: 'Family deductible tracking', included: true },
    { text: 'Receipt storage (up to 5GB)', included: true },
    { text: 'Priority support', included: true },
  ],
} as const;

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel at any time from your billing dashboard.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your data remains accessible in read-only mode on the Free plan. You can export all your data before canceling. We never delete your records.',
  },
  {
    q: 'Do you offer refunds?',
    a: "Yes. If you're not satisfied within the first 30 days, we'll give you a full refund, no questions asked.",
  },
];

export default function PricingPage() {
  const plans = [
    { key: 'free' as const, cta: 'Get Started', ctaVariant: 'outline' as const },
    { key: 'personal' as const, cta: 'Start Free Trial', ctaVariant: 'default' as const, popular: true },
    { key: 'family' as const, cta: 'Start Free Trial', ctaVariant: 'outline' as const },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Choose the plan that fits your needs. Start free, upgrade when you
            need more features.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((planConfig) => {
            const plan = STRIPE_PLANS[planConfig.key];
            const features = featureComparison[planConfig.key];

            return (
              <Card
                key={planConfig.key}
                className={
                  planConfig.popular
                    ? 'border-teal-600 border-2 relative shadow-lg'
                    : ''
                }
              >
                {planConfig.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-teal-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-6">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.interval || 'forever'}</span>
                  </div>
                  <CardDescription className="mt-4">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included ? 'text-gray-700' : 'text-gray-400'
                          }
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={ROUTES.signup} className="w-full">
                    <Button
                      className={`w-full ${
                        planConfig.popular ? 'bg-teal-600 hover:bg-teal-700' : ''
                      }`}
                      variant={planConfig.ctaVariant}
                      size="lg"
                    >
                      {planConfig.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Feature comparison note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>All plans include: Secure data encryption, automatic backups, email support</p>
        </div>

        {/* FAQ section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Pricing FAQ
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b pb-6">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to get started?
          </h2>
          <p className="mt-4 text-gray-600">
            Join thousands of HSA holders who never worry about lost receipts.
          </p>
          <Link href={ROUTES.signup}>
            <Button
              size="lg"
              className="mt-8 bg-teal-600 hover:bg-teal-700 text-lg px-8"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
