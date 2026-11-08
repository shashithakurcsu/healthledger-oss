'use client';

import { useRouter } from 'next/navigation';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { deleteFamilyMember } from '../services/actions';
import { ROUTES } from '@/constants';

interface DeleteFamilyMemberButtonProps {
  memberId: string;
  memberName: string;
}

export function DeleteFamilyMemberButton({ memberId, memberName }: DeleteFamilyMemberButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    return await deleteFamilyMember(memberId);
  };

  const handleSuccess = () => {
    router.push(ROUTES.family);
  };

  return (
    <DeleteConfirmationDialog
      title="Delete Family Member"
      description={`Are you sure you want to delete "${memberName}"? This action cannot be undone. Note: You cannot delete a family member if any expenses are linked to them.`}
      onConfirm={handleDelete}
      onSuccess={handleSuccess}
    />
  );
}
