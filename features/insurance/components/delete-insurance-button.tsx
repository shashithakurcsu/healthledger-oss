'use client';

import { useRouter } from 'next/navigation';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { deleteInsurancePlan } from '../services/actions';
import { ROUTES } from '@/constants';

interface DeleteInsuranceButtonProps {
  planId: string;
  planName: string;
}

export function DeleteInsuranceButton({ planId, planName }: DeleteInsuranceButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    return await deleteInsurancePlan(planId);
  };

  const handleSuccess = () => {
    router.push(ROUTES.insurance);
  };

  return (
    <DeleteConfirmationDialog
      title="Delete Insurance Plan"
      description={`Are you sure you want to delete "${planName}"? This action cannot be undone. Note: You cannot delete a plan if any expenses are linked to it.`}
      onConfirm={handleDelete}
      onSuccess={handleSuccess}
    />
  );
}
