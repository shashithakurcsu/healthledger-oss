import { Metadata } from 'next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/features/auth';

export const metadata: Metadata = {
  title: 'Sign In | HealthLedger',
  description: 'Sign in to your HealthLedger account to track medical expenses.',
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue tracking your medical expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
