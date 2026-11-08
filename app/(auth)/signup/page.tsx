import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignupForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign Up | HealthLedger',
  description:
    'Create your HealthLedger account and start tracking medical expenses.',
};

export default function SignupPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          Create an account
        </CardTitle>
        <CardDescription>
          Start tracking your medical expenses and maximize your HSA/FSA savings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignupForm />
      </CardContent>
    </Card>
  );
}
