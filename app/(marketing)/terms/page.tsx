import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | HealthLedger',
  description: 'HealthLedger terms of service - the rules and guidelines for using our service.',
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 21, 2026</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using HealthLedger (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 mb-4">
              HealthLedger is a medical expense tracking application that helps users:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Track medical expenses and store receipts</li>
              <li>Monitor HSA/FSA eligible expenses</li>
              <li>Track progress toward insurance deductibles</li>
              <li>Generate expense reports for tax purposes</li>
              <li>Manage family member medical expenses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription and Payments</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">Free Plan</h3>
            <p className="text-gray-600 mb-4">
              The Free plan allows up to 25 expense entries per month with basic features.
            </p>
            <h3 className="text-xl font-medium text-gray-800 mb-3">Paid Plans</h3>
            <p className="text-gray-600 mb-4">
              Paid subscriptions are billed monthly or annually. By subscribing, you authorize us to
              charge your payment method on a recurring basis. You may cancel at any time, and your
              subscription will remain active until the end of the current billing period.
            </p>
            <h3 className="text-xl font-medium text-gray-800 mb-3">Refunds</h3>
            <p className="text-gray-600 mb-4">
              We offer a 30-day money-back guarantee for new subscribers. After 30 days, refunds are
              provided at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Responsibilities</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Upload malicious content or malware</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service to store content unrelated to medical expenses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Accuracy Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              <strong>Important:</strong> HealthLedger is a tool to help you organize and track medical
              expenses. We do not provide tax, legal, or medical advice. The determination of whether
              an expense qualifies for HSA/FSA reimbursement or tax deduction is your responsibility.
            </p>
            <p className="text-gray-600 mb-4">
              We recommend consulting with a qualified tax professional or financial advisor for
              guidance on HSA/FSA rules and tax deductions. HealthLedger is not responsible for any
              tax penalties or issues arising from incorrect expense categorization.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service, including its design, features, and content, is owned by HealthLedger and
              protected by intellectual property laws. You may not copy, modify, distribute, or create
              derivative works without our written permission.
            </p>
            <p className="text-gray-600 mb-4">
              You retain ownership of all data and content you upload to the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, HealthLedger shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Loss of data or corruption of files</li>
              <li>Tax penalties or audit issues</li>
              <li>Service interruptions or downtime</li>
              <li>Unauthorized access to your account</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Our total liability shall not exceed the amount you paid for the Service in the 12 months
              preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Service Availability</h2>
            <p className="text-gray-600 mb-4">
              We strive to maintain high availability but do not guarantee uninterrupted access. We may
              perform maintenance, updates, or experience outages. We will make reasonable efforts to
              notify users of planned maintenance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may suspend or terminate your account if you violate these Terms. You may close your
              account at any time through your account settings. Upon termination:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>You may export your data before closing your account</li>
              <li>Your data will be deleted within 30 days of account closure</li>
              <li>Any remaining subscription period is non-refundable (except within the 30-day guarantee)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We may modify these Terms at any time. Material changes will be communicated via email
              or prominent notice on the Service. Continued use after changes constitutes acceptance
              of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the
              United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms, please contact us at:
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
