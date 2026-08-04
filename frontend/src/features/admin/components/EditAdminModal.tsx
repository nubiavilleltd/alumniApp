import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import Button from '@/shared/components/ui/Button';
import { useChangeUserRole, useAdminCategoryOptions } from '@/features/admin/hooks/useRoleManagement';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { eventFormFieldLabelClassName, eventFormSelectClassName, eventFormSelectControlClassName } from '@/features/events/constants/eventFormStyles';
import { toast } from '@/shared/components/ui/Toast';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { isSuperAdmin } from '@/shared/permissions/base';

const editAdminSchema = z.object({
  category: z.string().min(1, 'Please select an admin category'),
});

type EditAdminFormValues = z.infer<typeof editAdminSchema>;

interface EditAdminModalProps {
  admin: Alumni;
  isOpen: boolean;
  onClose: () => void;
}

export function EditAdminModal({ admin, isOpen, onClose }: EditAdminModalProps) {


  const { data: currentUser } = useCurrentUser();

const { data: categoryOptions = [], isLoading: isLoadingCategories } = useAdminCategoryOptions();

const visibleCategoryOptions = currentUser && isSuperAdmin(currentUser)
  ? categoryOptions
  : categoryOptions.filter((opt) => opt.value !== 'super admin');
  const changeUserRole = useChangeUserRole();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditAdminFormValues>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: { category: admin.role ?? '' },
  });

  // Re-seed the form with this admin's current category every time the
  // modal opens — handles switching between editing different rows
  // without a stale form carrying over.
  useEffect(() => {
    if (isOpen) {
      reset({ category: admin.role ?? '' });
    }
  }, [isOpen, admin, reset]);

  const isBusy = changeUserRole.isPending;

  const onSubmit = async (values: EditAdminFormValues) => {
    try {
      await changeUserRole.mutateAsync({
        userId: admin.memberId,
        newRole: values.category,
      });
      toast.success(`User role changed to ${values.category.toUpperCase()}`);
      onClose();
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error('Failed to change user role. Please try again.');
      // Error toast shown by the mutation's onError
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Admin Role">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Member is fixed here — same reasoning as EditLeadershipModal */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700">Member</label>
          <div className="w-full rounded-3xl bg-[#F8F7F4] border border-gray-200 px-4 py-2.5 text-sm text-gray-700">
            {admin.name}
          </div>
        </div>

        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Admin Category"
              placeholder={isLoadingCategories ? 'Loading categories...' : 'Select the admin category'}
              options={visibleCategoryOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={isLoadingCategories}
              error={errors.category?.message}
              labelClassName={eventFormFieldLabelClassName}
              className={eventFormSelectClassName}
              controlClassName={eventFormSelectControlClassName}
            />
          )}
        />

        <div className="flex justify-center pt-2">
          <Button type="submit" disabled={isBusy} className="min-w-[140px]">
            {isBusy ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:loading" className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}