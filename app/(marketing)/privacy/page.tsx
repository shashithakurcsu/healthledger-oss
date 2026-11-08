import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | HealthLedger',
  description: 'HealthLedger privacy policy - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 21, 2026</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              HealthLedger (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our medical expense tracking application.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Email address and name when you create an account</li>
              <li>Payment information when you subscribe to a paid plan (processed securely by Stripe)</li>
              <li>Medical expense data you choose to enter, including dates, amounts, and categories</li>
              <li>Receipt images you upload</li>
              <li>Family member information you add to your account</li>
            </ul>
            <h3 className="text-xl font-medium text-gray-800 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Device information and browser type</li>
              <li>IP address and general location</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and manage your subscription</li>
              <li>Send you important notifications about your account</li>
              <li>Generate expense reports and summaries at your request</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-600 mb-4">
              Your data is stored securely using industry-standard encryption. We use Supabase for
              database storage, which provides enterprise-grade security including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Encryption at rest and in transit (TLS 1.3)</li>
              <li>Regular security audits and monitoring</li>
              <li>Row-level security policies to ensure data isolation</li>
              <li>Secure, private storage for receipt images</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information. We may share your information only in the
              following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> With third parties who assist us in operating our service (e.g., Stripe for payments, Supabase for data storage)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Access and download your data at any time</li>
              <li>Correct or update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Export your expense data in standard formats (CSV, PDF)</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain your data for as long as your account is active or as needed to provide you
              services. If you delete your account, we will delete your personal data within 30 days,
              except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our service is not intended for children under 13. We do not knowingly collect personal
              information from children under 13. If you believe we have collected such information,
              please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong>{' '}
              <a href="mailto:support@healthledger.app" className="text-teal-600 hover:text-teal-700">
                support@healthledger.app
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
