'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReceiptUpload } from './receipt-upload';

interface ExpenseReceiptSectionProps {
  expenseId: string;
  userId: string;
  currentReceiptUrl: string | null;
}

export function ExpenseReceiptSection({
  expenseId,
  userId,
  currentReceiptUrl,
}: ExpenseReceiptSectionProps) {
  const router = useRouter();

  const handleUploadComplete = () => {
    router.refresh();
  };

  const handleDeleteComplete = () => {
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <ReceiptUpload
          expenseId={expenseId}
          userId={userId}
          currentReceiptUrl={currentReceiptUrl}
          onUploadComplete={handleUploadComplete}
          onDeleteComplete={handleDeleteComplete}
        />
      </CardContent>
    </Card>
  );
}
