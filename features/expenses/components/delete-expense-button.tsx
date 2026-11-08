'use client';

import { useRouter } from 'next/navigation';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { deleteExpense } from '../services/actions';
import { ROUTES } from '@/constants';

interface DeleteExpenseButtonProps {
  expenseId: string;
  providerName: string;
}

export function DeleteExpenseButton({ expenseId, providerName }: DeleteExpenseButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    return await deleteExpense(expenseId);
  };

  const handleSuccess = () => {
    router.push(ROUTES.expenses);
  };

  return (
    <DeleteConfirmationDialog
      title="Delete Expense"
      description={`Are you sure you want to delete the expense from "${providerName}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      onSuccess={handleSuccess}
    />
  );
}
