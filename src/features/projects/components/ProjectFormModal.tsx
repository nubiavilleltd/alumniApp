// features/projects/components/ProjectFormModal.tsx

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import Button from '@/shared/components/ui/Button';
import { useCreateProject, useUpdateProject } from '../hooks/useProjects';
import { useImageManager } from '@/shared/hooks/useImageManager';
import type { Project } from '../types/project.types';

// ─── Validation schema ────────────────────────────────────────────────────────

const projectFormSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetAmount: z
    .number({ error: 'Please enter a valid amount' })
    .min(0, 'Amount must be 0 or more')
    .optional(),
  amountRaised: z
    .number({ error: 'Please enter a valid amount' })
    .min(0, 'Amount must be 0 or more')
    .default(0),
  status: z.enum(['active', 'completed']),
  sortOrder: z.number({ error: 'Please enter a whole number' }).int().min(0).optional(),
  isFeatured: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// ─── Main component ───────────────────────────────────────────────────────────

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Project | null;
}

export function ProjectFormModal({ isOpen, onClose, editData }: ProjectFormModalProps) {
  const isEditing = !!editData;

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const {
    allPreviews,
    newFiles,
    removedImages,
    handleImages,
    reset: resetImages,
  } = useImageManager();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      status: 'active',
      targetAmount: undefined,
      amountRaised: 0,
      sortOrder: undefined,
      isFeatured: false,
    },
  });

  // Sync form + images when edit data changes
  useEffect(() => {
    if (isOpen && editData) {
      reset({
        title: editData.title,
        description: editData.description,
        status: editData.status,
        targetAmount: editData.targetAmount,
        amountRaised: editData.amountRaised,
        sortOrder: editData.sortOrder,
        isFeatured: Boolean(editData.isFeatured),
      });
      resetImages(editData.images ?? []);
    } else {
      reset({ title: '', description: '', status: 'active', amountRaised: 0, isFeatured: false });
      resetImages();
    }
  }, [isOpen, editData, reset, resetImages]);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const onSubmit = async (values: ProjectFormValues) => {
    if (isEditing && editData) {
      updateMutation.mutate(
        {
          id: editData.id,
          formData: {
            ...values,
            images: newFiles,
            removeImages: removedImages.length ? removedImages : undefined,
            imageAction: newFiles.length > 0 ? 'add' : undefined,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate({ ...values, images: newFiles }, { onSuccess: onClose });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Project' : 'Create Project'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput
          label="Project Title"
          id="title"
          required
          placeholder="e.g. Computer Donation 2025"
          error={errors.title?.message}
          {...register('title')}
        />

        <TextareaInput
          label="Description"
          id="description"
          required
          rows={4}
          placeholder="Describe the project..."
          error={errors.description?.message}
          {...register('description')}
        />

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Target Amount (₦)"
            id="targetAmount"
            type="number"
            placeholder="e.g. 1000000"
            hint="Optional — enter 0 if no target"
            error={errors.targetAmount?.message}
            {...register('targetAmount', { valueAsNumber: true })}
          />
          <FormInput
            label="Amount Raised (₦)"
            id="amountRaised"
            required
            type="number"
            placeholder="e.g. 500000"
            error={errors.amountRaised?.message}
            {...register('amountRaised', { valueAsNumber: true })}
          />
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectInput
            label="Status"
            id="status"
            required
            options={statusOptions}
            placeholder="Select status"
            error={errors.status?.message}
            {...register('status')}
          />
          {/* <FormInput
            label="Sort Order"
            id="sortOrder"
            type="number"
            placeholder="e.g. 1"
            hint="Lower = shown first"
            error={errors.sortOrder?.message}
            {...register('sortOrder', { valueAsNumber: true })}
          /> */}
        </div>

        {/* <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
            {...register('isFeatured')}
          />
          <span className="text-sm font-medium text-gray-700">Featured project</span>
        </label> */}

        <ImageUpload
          label="Images"
          hint="jpg, png, gif, webp — max 5 MB each"
          previews={allPreviews}
          onChange={handleImages}
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple
        />

        {isEditing && (removedImages.length > 0 || newFiles.length > 0) && (
          <p className="text-xs text-primary-600 -mt-3">
            {removedImages.length > 0 && `${removedImages.length} image(s) will be removed. `}
            {newFiles.length > 0 && `${newFiles.length} new image(s) will be added.`}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                {isEditing ? 'Saving...' : 'Creating...'}
              </span>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create Project'
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
