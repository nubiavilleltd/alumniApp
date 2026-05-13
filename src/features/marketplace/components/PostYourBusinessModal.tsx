// // features/marketplace/components/PostYourBusinessModal.tsx

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Search,
  Upload,
  X,
  Camera,
} from 'lucide-react';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { Button } from '@/shared/components/ui/Button';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { PhoneNumberInput } from '@/shared/components/ui/input/PhoneNumberInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { toTitleCase } from '@/shared/utils/textHelpers';
import {
  useCreateListing,
  useUpdateListing,
  useMarketplaceCategories,
} from '../hooks/useMarketplace';
import { useImageManager } from '@/shared/hooks/useImageManager';
import type { Business, CreateListingFormData } from '../types/marketplace.types';
import {
  formatOptionalNigerianPhoneNumber,
  NIGERIAN_PHONE_PLACEHOLDER,
  parseStoredNigerianPhoneNumber,
  validateNigerianPhoneNumber,
} from '@/shared/utils/nigerianPhoneNumber';

// ─── Zod Schema ────────────────────────────────────────────────────────────────

// const postBusinessSchema = z.object({
//   name: z.string().min(1, 'Business name is required'),
//   category: z.string().min(1, 'Please select a category'),
//   description: z.string().min(1, 'Description is required'),
//   location: z.string().min(1, 'Location is required'),
//   phone: z.string().min(1, 'Phone number is required'),
//   website: z.string().optional(),
// });

const postBusinessSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Business name is required')
      .min(2, 'Business name must be at least 2 characters')
      .max(100, 'Business name is too long'),

    category: z.string().min(1, 'Please select a category'),

    description: z
      .string()
      .min(1, 'Description is required')
      .min(20, 'Please provide at least 20 characters')
      .max(5000, 'Description is too long'),

    location: z.string().min(1, 'Location is required').min(2, 'Please provide a valid location'),

    phone: z.string().trim().min(1, 'Phone number is required'),
    website: z.string().optional(),
    messagePrompt: z.string().max(750, 'Message prompt must be 750 characters or fewer').optional(),

    // website: z
    //   .string()
    //   .optional()
    //   .refine(
    //     (val) => {
    //       if (!val) return true;
    //       return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val);
    //     },
    //     { message: 'Enter a valid URL (e.g., example.com)' },
    //   ),
  })
  .superRefine((data, ctx) => {
    const phoneError = validateNigerianPhoneNumber(data.phone);
    if (phoneError) {
      ctx.addIssue({ code: 'custom', path: ['phone'], message: phoneError });
    }
  });

type PostBusinessFormValues = z.infer<typeof postBusinessSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Business | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toFormState(data: Business | null | undefined): PostBusinessFormValues {
  if (!data) {
    return {
      name: '',
      category: '',
      description: '',
      location: '',
      phone: '',
      website: '',
      messagePrompt: '',
    };
  }

  return {
    name: data.name,
    category: data.category,
    description: data.description,
    location: data.location,
    phone: parseStoredNigerianPhoneNumber(data.phone),
    website: data.website ?? '',
    messagePrompt: data.messagePrompt ?? '',
  };
}

function toCreateListingFormData(
  form: PostBusinessFormValues,
  images: File[],
): CreateListingFormData {
  return {
    name: form.name,
    category: form.category,
    description: form.description,
    location: form.location,
    phone: formatOptionalNigerianPhoneNumber(form.phone),
    website: form.website || undefined,
    messagePrompt: form.messagePrompt?.trim() || undefined,
    images,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PostBusinessModal({ isOpen, onClose, editData }: PostBusinessModalProps) {
  const isEditing = !!editData;

  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();

  const {
    allPreviews,
    newFiles,
    removedImages,
    handleImages,
    reset: resetImages,
  } = useImageManager();

  const { data: categoriesList = [] } = useMarketplaceCategories();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<PostBusinessFormValues>({
    resolver: zodResolver(postBusinessSchema),
    defaultValues: toFormState(editData),
    mode: 'onChange',
  });

  // Re-sync when editData changes
  useEffect(() => {
    reset(toFormState(editData));
    resetImages(editData?.images ?? []);
  }, [editData, reset, resetImages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      reset({
        name: '',
        category: '',
        description: '',
        location: '',
        phone: '',
        website: '',
        messagePrompt: '',
      });
      resetImages();
      setFormError('root', { message: '' });
    }
  }, [isOpen, reset, resetImages, setFormError]);

  const onSubmit = async (formData: PostBusinessFormValues) => {
    const listingFormData = toCreateListingFormData(formData, newFiles);

    if (isEditing) {
      if (!editData?.businessId) {
        setFormError('root', { message: 'Missing business ID' });
        return;
      }

      updateMutation.mutate(
        {
          id: editData.businessId,
          formData: {
            ...listingFormData,
            removeImages: removedImages.length ? removedImages : undefined,
            imageAction: newFiles.length > 0 ? 'add' : undefined,
          },
        },
        {
          onSuccess: onClose,
          onError: (err: any) =>
            setFormError('root', {
              message: err?.message ?? 'Failed to update. Please try again.',
            }),
        },
      );
    } else {
      createMutation.mutate(listingFormData, {
        onSuccess: onClose,
        onError: (err: any) =>
          setFormError('root', { message: err?.message ?? 'Failed to create. Please try again.' }),
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;
  const categoryOptions = categoriesList.map((cat) => ({ label: toTitleCase(cat), value: cat }));
  const categoryValue = watch('category') ?? '';

  if (!isOpen) return null;

  const fieldLabelClassName = 'font-medium text-gray-500';
  const fieldControlClassName =
    '!border-transparent !bg-[#fbf8f3] !shadow-none focus-within:!border-primary-100 focus-within:!ring-2 focus-within:!ring-primary-100';
  const fieldInputClassName = 'placeholder:text-gray-400';
  const textareaClassName =
    '!border-transparent !bg-[#fbf8f3] !shadow-none placeholder:text-gray-400 focus:!border-primary-100 focus:!ring-2 focus:!ring-primary-100';
  const compactUploadLabelClassName = 'font-medium text-gray-500';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/35 px-4 py-6 backdrop-blur-[1.5px]"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start justify-center lg:items-center">
        <section
          className="relative my-auto w-full max-w-[62rem] overflow-y-auto rounded-[2rem] bg-white shadow-[0_28px_72px_rgba(15,23,42,0.16)] max-h-[82vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-business-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-primary-50 md:right-6 md:top-6"
            aria-label="Close modal"
          >
            <X className="h-7 w-7" />
          </button>

          <div className="px-5 pb-6 pt-9 sm:px-8 md:px-10 md:pb-8 md:pt-10">
            <h2 id="post-business-title" className="sr-only">
              {isEditing ? 'Edit Your Business' : 'Post Your Business'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {errors.root?.message && (
                <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errors.root.message}
                </div>
              )}

              <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
                <FormInput
                  label="Business Name"
                  labelClassName={fieldLabelClassName}
                  controlClassName={fieldControlClassName}
                  inputClassName={fieldInputClassName}
                  id="name"
                  required
                  placeholder="Enter your business name"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <SelectInput
                  label="Category"
                  labelClassName={fieldLabelClassName}
                  controlClassName={fieldControlClassName}
                  id="category"
                  required
                  placeholder="Select a category"
                  options={categoryOptions}
                  value={categoryValue}
                  error={errors.category?.message}
                  chevronDownIcon={ChevronDown}
                  chevronUpIcon={ChevronUp}
                  searchIcon={Search}
                  selectedIcon={Check}
                  errorIcon={CircleAlert}
                  {...register('category')}
                />

                <TextareaInput
                  label="Description"
                  labelClassName={fieldLabelClassName}
                  textareaClassName={textareaClassName}
                  className="md:col-span-2"
                  id="description"
                  required
                  rows={5}
                  placeholder="Write a short description of your business"
                  error={errors.description?.message}
                  {...register('description')}
                />

                <PhoneNumberInput
                  label="Phone Number"
                  labelClassName={fieldLabelClassName}
                  controlClassName={fieldControlClassName}
                  inputClassName={fieldInputClassName}
                  id="phone"
                  required
                  placeholder={NIGERIAN_PHONE_PLACEHOLDER}
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <FormInput
                  label="Location"
                  labelClassName={fieldLabelClassName}
                  controlClassName={fieldControlClassName}
                  inputClassName={fieldInputClassName}
                  id="location"
                  required
                  placeholder="Enter the address of your business"
                  error={errors.location?.message}
                  {...register('location')}
                />

                <FormInput
                  label="Website"
                  labelClassName={fieldLabelClassName}
                  controlClassName={fieldControlClassName}
                  inputClassName={fieldInputClassName}
                  className="md:col-span-2"
                  id="website"
                  type="url"
                  placeholder="Enter the web address of your business"
                  error={errors.website?.message}
                  {...register('website')}
                />

                <TextareaInput
                  label="Message Prompt"
                  labelClassName={fieldLabelClassName}
                  textareaClassName={textareaClassName}
                  className="md:col-span-2"
                  id="messagePrompt"
                  rows={4}
                  placeholder="Enter the message you want buyers to see when they contact you"
                  hint="Optional. This suggested message will prefill when someone clicks Send Message."
                  error={errors.messagePrompt?.message}
                  {...register('messagePrompt')}
                />
              </div>

              <ImageUpload
                label={isEditing ? 'Business Images' : 'Upload Images'}
                labelClassName={compactUploadLabelClassName}
                dropzoneClassName="py-5"
                hint={
                  isEditing
                    ? 'Existing images shown below. Upload new ones to add more.'
                    : 'PNG or JPG (max 800×400px)'
                }
                previews={allPreviews}
                onChange={handleImages}
                idleIcon={Camera}
                activeIcon={Upload}
                removeIcon={X}
                errorIcon={CircleAlert}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  loading={isLoading}
                  className="min-w-[11rem] px-8 shadow-none"
                >
                  {isEditing ? 'Update Business' : 'Post Business'}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
