import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import Button from '@/shared/components/ui/Button';
import { useChangeUserRole, useAdminCategoryOptions } from '@/features/admin/hooks/useRoleManagement';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { MemberPicker } from '@/shared/components/ui/MemberPicker';

const addAdminSchema = z.object({
  memberId: z.string().min(1, 'Please select a member'),
  category: z.string().min(1, 'Please select an admin category'),
});

type AddAdminFormValues = z.infer<typeof addAdminSchema>;

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  excludeMemberIds?: string[]; // memberIds already admin, hidden from the picker
}

export function AddAdminModal({ isOpen, onClose, excludeMemberIds = [] }: AddAdminModalProps) {
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);

  const { data: categoryOptions = [], isLoading: isLoadingCategories } = useAdminCategoryOptions();
  const changeUserRole = useChangeUserRole();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddAdminFormValues>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: { memberId: '', category: '' },
  });

  // Reset the whole form (including the picked alumni, which RHF doesn't
  // own) every time the modal opens fresh
  useEffect(() => {
    if (isOpen) {
      reset({ memberId: '', category: '' });
      setSelectedAlumni(null);
    }
  }, [isOpen, reset]);

  const isBusy = changeUserRole.isPending;

  const onSubmit = async (values: AddAdminFormValues) => {
    try {
      await changeUserRole.mutateAsync({
        userId: values.memberId,
        newRole: values.category,
      });
      onClose();
    } catch (error) {
      // Error toast shown by the mutation's onError
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Admin">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Controller
          name="memberId"
          control={control}
          render={({ field }) => (
            <MemberPicker
              value={field.value || null}
              onChange={(memberId, alumni) => {
                field.onChange(memberId);
                setSelectedAlumni(memberId ? alumni : null);
              }}
              excludeIds={excludeMemberIds}
              error={errors.memberId?.message}
            />
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Admin Category"
              placeholder={isLoadingCategories ? 'Loading categories...' : 'Select the admin category'}
              options={categoryOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={isLoadingCategories}
              error={errors.category?.message}
            />
          )}
        />

        <div className="flex justify-center pt-2">
          <Button type="submit" disabled={isBusy} className="min-w-[140px]">
            {isBusy ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                Adding...
              </span>
            ) : (
              'Add'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}