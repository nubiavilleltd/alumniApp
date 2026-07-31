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
  useUpdateLeadershipMember,
  useExcoPositionOptions,
} from '@/features/leadership/hooks/useLeadership';
import type { LeadershipMember } from '@/features/leadership/types/leadership.types';
import { CloudUpload } from 'lucide-react';
import { eventFormFieldLabelClassName, eventFormSelectClassName, eventFormSelectControlClassName, eventFormUploadDropzoneClassName } from '@/features/events/constants/eventFormStyles';

const editLeadershipSchema = z.object({
  role: z.string().min(1, 'Please select a position'),
});

type EditLeadershipFormValues = z.infer<typeof editLeadershipSchema>;

interface EditLeadershipModalProps {
  leader: LeadershipMember;
  isOpen: boolean;
  onClose: () => void;
}

export function EditLeadershipModal({ leader, isOpen, onClose }: EditLeadershipModalProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [imageError, setImageError] = useState<string | null>(null);

  const { data: positionOptions = [], isLoading: isLoadingPositions } = useExcoPositionOptions();
  const updateLeadershipMember = useUpdateLeadershipMember();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditLeadershipFormValues>({
    resolver: zodResolver(editLeadershipSchema),
    defaultValues: { role: leader.role },
  });

  // Re-seed the form (and the image preview) with this leader's current
  // data every time the modal opens — handles switching between editing
  // different rows without a stale form carrying over.
  useEffect(() => {
    if (isOpen) {
      reset({ role: leader.role });
      setImagePreviews(leader.image ? [leader.image] : []);
      setImageError(null);
    }
  }, [isOpen, leader, reset]);

  const isBusy = updateLeadershipMember.isPending;

  //   const onSubmit = async (values: EditLeadershipFormValues) => {
  //     if (imagePreviews.length === 0) {
  //       setImageError("Please keep or upload a photo for this member");
  //       return;
  //     }

  //     try {
  //       await updateLeadershipMember.mutateAsync({
  //         id: leader.id,
  //         payload: {
  //           memberId: leader.memberId,
  //           name: leader.name,
  //           role: values.role,
  //           image: imagePreviews[0],
  //         },
  //       });
  //       onClose();
  //     } catch (error) {
  //       // Error toast shown by the mutation's onError
  //     }
  //   };

  const onSubmit = async (values: EditLeadershipFormValues) => {
    const newPhotoFile = imageFiles[0];
    const photoRemoved = !newPhotoFile && imagePreviews.length === 0 && Boolean(leader.image);

    try {
      await updateLeadershipMember.mutateAsync({
        id: leader.id,
        payload: { memberId: leader.memberId, role: values.role, photoFile: newPhotoFile },
        photoRemoved,
      });
      onClose();
    } catch (error) {
      // Error toast shown by the mutation's onError
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Leadership Role">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Member is fixed here — changing who holds a position is a
            remove-and-re-add, not an edit, so this field is read-only. */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700">Member</label>
          <div className="w-full rounded-3xl bg-[#F8F7F4] border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
            {leader.name}
          </div>
        </div>

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
                  labelClassName={eventFormFieldLabelClassName}
                            className={eventFormSelectClassName}
                            controlClassName={eventFormSelectControlClassName}
            />
          )}
        />

        <ImageUpload
          label="Upload an Image of the Member"
          previews={imagePreviews}
          idleIcon={<CloudUpload/>}
          onChange={(files, previews) => {
            setImageFiles(files);
            setImagePreviews(previews);
            setImageError(null);
          }}
          multiple={false}
          error={imageError ?? undefined}
          dropzoneClassName={eventFormUploadDropzoneClassName}
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