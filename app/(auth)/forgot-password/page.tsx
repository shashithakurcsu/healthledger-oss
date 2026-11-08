import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { ForgotPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Reset Password | HealthLedger',
  description: 'Reset your HealthLedger password.',
};

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
