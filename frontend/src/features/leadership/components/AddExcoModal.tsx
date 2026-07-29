import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import Button from '@/shared/components/ui/Button';
import {
  useCreateLeadershipMember,
  useExcoPositionOptions,
} from '@/features/leadership/hooks/useLeadership';
import type { Alumni } from '@/features/alumni/types/alumni.types';
import { MemberPicker } from '@/shared/components/ui/MemberPicker';

const addExcoSchema = z.object({
  memberId: z.string().min(1, 'Please select a member'),
  role: z.string().min(1, 'Please select a position'),
});

type AddExcoFormValues = z.infer<typeof addExcoSchema>;

interface AddExcoModalProps {
  isOpen: boolean;
  onClose: () => void;
  excludeMemberIds?: string[]; // memberIds already Exco, hidden from the picker
}

export function AddExcoModal({ isOpen, onClose, excludeMemberIds = [] }: AddExcoModalProps) {
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  const { data: positionOptions = [], isLoading: isLoadingPositions } = useExcoPositionOptions();
  const createLeadershipMember = useCreateLeadershipMember();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddExcoFormValues>({
    resolver: zodResolver(addExcoSchema),
    defaultValues: { memberId: '', role: '' },
  });

  // Reset the whole form (including the parts RHF doesn't own: the
  // picked alumni and the image) every time the modal opens fresh
  useEffect(() => {
    if (isOpen) {
      reset({ memberId: '', role: '' });
      setSelectedAlumni(null);
      setImagePreviews([]);
      setImageError(null);
    }
  }, [isOpen, reset]);

  const isBusy = createLeadershipMember.isPending;

  const onSubmit = async (values: AddExcoFormValues) => {
    if (imagePreviews.length === 0) {
      setImageError('Please upload a photo for this member');
      return;
    }

    if (!selectedAlumni) return; // guarded by memberId validation above

    try {
      await createLeadershipMember.mutateAsync({
        memberId: values.memberId,
        name: selectedAlumni.name,
        role: values.role,
        image: imagePreviews[0],
      });
      onClose();
    } catch (error) {
      // Error toast shown by the mutation's onError
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exco">
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
          name="role"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Position"
              placeholder={isLoadingPositions ? 'Loading positions...' : 'Select the position'}
              options={positionOptions}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={isLoadingPositions}
              error={errors.role?.message}
            />
          )}
        />

        <ImageUpload
          label="Upload an Image of the Member"
          previews={imagePreviews}
          onChange={(_files, previews) => {
            setImagePreviews(previews);
            setImageError(null);
          }}
          multiple={false}
          error={imageError ?? undefined}
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