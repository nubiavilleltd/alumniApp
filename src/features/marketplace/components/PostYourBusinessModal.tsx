// // features/marketplace/components/PostYourBusinessModal.tsx

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/components/ui/Modal';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { Button } from '@/shared/components/ui/Button';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import {
  defaultPhoneCountry,
  formatOptionalPhoneNumberWithCountryCode,
  getPhoneCountryOption,
  normalizePhoneNumberForCountry,
  parseStoredPhoneNumber,
  phoneCountryOptions,
  type SupportedPhoneCountry,
  validateNationalPhoneNumber,
} from '@/features/authentication/constants/phoneCountries';
import {
  useCreateListing,
  useUpdateListing,
  useMarketplaceCategories,
} from '../hooks/useMarketplace';
import { useImageManager } from '@/shared/hooks/useImageManager';
import type { Business, CreateListingFormData } from '../types/marketplace.types';

const supportedPhoneCountries = phoneCountryOptions.map((option) => option.code) as [
  SupportedPhoneCountry,
  ...SupportedPhoneCountry[],
];

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

    phoneCountry: z.enum(supportedPhoneCountries),

    phone: z.string().trim().min(1, 'Phone number is required'),
    website: z.string().optional(),

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
    const phoneError = validateNationalPhoneNumber(data.phoneCountry, data.phone);
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
      phoneCountry: defaultPhoneCountry,
      phone: '',
      website: '',
    };
  }

  const parsedPhone = parseStoredPhoneNumber(data.phone);

  return {
    name: data.name,
    category: data.category,
    description: data.description,
    location: data.location,
    phoneCountry: parsedPhone.countryCode,
    phone: parsedPhone.nationalNumber,
    website: data.website ?? '',
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
    phone: formatOptionalPhoneNumberWithCountryCode(form.phoneCountry, form.phone),
    website: form.website || undefined,
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
    setValue,
    trigger,
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

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      reset({
        name: '',
        category: '',
        description: '',
        location: '',
        phoneCountry: defaultPhoneCountry,
        phone: '',
        website: '',
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
  const categoryOptions = categoriesList.map((cat) => ({ label: cat, value: cat }));
  const phoneCountrySelectOptions = phoneCountryOptions.map((option) => ({
    label: `${option.dialCode} (${option.label})`,
    value: option.code,
  }));
  const phoneCountry = watch('phoneCountry') ?? defaultPhoneCountry;
  const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);
  const phoneCountryRegistration = register('phoneCountry', {
    onChange: (e) => {
      const nextCountry = e.target.value as SupportedPhoneCountry;
      setValue('phone', normalizePhoneNumberForCountry(nextCountry, watch('phone') ?? ''), {
        shouldDirty: true,
        shouldValidate: true,
      });
      void trigger('phone');
    },
  });
  const phoneRegistration = register('phone', {
    onChange: (e) => {
      e.target.value = normalizePhoneNumberForCountry(phoneCountry, e.target.value);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Your Business' : 'Post Your Business'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {errors.root?.message && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <FormInput
          label="Business Name"
          id="name"
          required
          placeholder="Enter business name"
          error={errors.name?.message}
          {...register('name')}
        />

        <SelectInput
          label="Category"
          id="category"
          required
          placeholder="Select a category"
          options={categoryOptions}
          error={errors.category?.message}
          {...register('category')}
        />

        <TextareaInput
          label="Description"
          id="description"
          required
          rows={5}
          placeholder="Describe your business..."
          error={errors.description?.message}
          {...register('description')}
        />

        <FormInput
          label="Location"
          id="location"
          required
          placeholder="Enter location"
          icon="mdi:map-marker-outline"
          error={errors.location?.message}
          {...register('location')}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <SelectInput
              id="phoneCountry"
              options={phoneCountrySelectOptions}
              placeholder="Country"
              error={undefined}
              {...phoneCountryRegistration}
            />
            <FormInput
              id="phone"
              type="tel"
              inputMode="numeric"
              required
              placeholder={selectedPhoneCountry.placeholder}
              icon="mdi:phone-outline"
              error={errors.phone?.message}
              {...phoneRegistration}
            />
          </div>
        </div>

        <FormInput
          label="Website URL"
          id="website"
          type="url"
          placeholder="https://yourbusiness.com"
          icon="mdi:web"
          hint="Optional"
          error={errors.website?.message}
          {...register('website')}
        />

        <ImageUpload
          label={isEditing ? 'Business Images' : 'Upload Images'}
          hint={
            isEditing
              ? 'Existing images shown below. Upload new ones to add more.'
              : 'PNG or JPG (max 800×400px)'
          }
          previews={allPreviews}
          onChange={handleImages}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          {isEditing ? 'Update Business' : 'Post Business'}
        </Button>
      </form>
    </Modal>
  );
}
