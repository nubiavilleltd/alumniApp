// features/marketplace/components/PostYourBusinessModal.tsx

import { useEffect, useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { Button } from '@/shared/components/ui/Button';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import {
  useCreateListing,
  useUpdateListing,
  useMarketplaceCategories,
} from '../hooks/useMarketplace';
import { useImageManager } from '@/shared/hooks/useImageManager';
import type { Business, CreateListingFormData } from '../types/marketplace.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostBusinessForm {
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  website: string;
}

const defaultForm: PostBusinessForm = {
  name: '',
  category: '',
  description: '',
  location: '',
  phone: '',
  website: '',
};

interface PostBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Business | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toFormState(data: Business | null | undefined): PostBusinessForm {
  if (!data) return defaultForm;
  return {
    name: data.name,
    category: data.category,
    description: data.description,
    location: data.location,
    phone: data.phone,
    website: data.website ?? '',
  };
}

function toCreateListingFormData(form: PostBusinessForm, images: File[]): CreateListingFormData {
  return {
    name: form.name,
    category: form.category,
    description: form.description,
    location: form.location,
    phone: form.phone,
    website: form.website || undefined,
    images,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PostBusinessModal({ isOpen, onClose, editData }: PostBusinessModalProps) {
  const isEditing = !!editData;

  const [form, setForm] = useState<PostBusinessForm>(() => toFormState(editData));
  const [error, setError] = useState<string | null>(null);

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

  // Re-sync when editData changes
  useEffect(() => {
    setForm(toFormState(editData));
    resetImages(editData?.images ?? []);
  }, [editData]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setForm(defaultForm);
      resetImages();
      setError(null);
    }
  }, [isOpen]);

  const set = (field: keyof PostBusinessForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Business name is required';
    if (!form.category) return 'Please select a category';
    if (!form.description.trim()) return 'Description is required';
    if (!form.location.trim()) return 'Location is required';
    if (!form.phone.trim()) return 'Phone number is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const listingFormData = toCreateListingFormData(form, newFiles);

    if (isEditing) {
      if (!editData?.businessId) {
        setError('Missing business ID');
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
          onError: (err: any) => setError(err?.message ?? 'Failed to update. Please try again.'),
        },
      );
    } else {
      createMutation.mutate(listingFormData, {
        onSuccess: onClose,
        onError: (err: any) => setError(err?.message ?? 'Failed to create. Please try again.'),
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const categoryOptions = categoriesList.map((cat) => ({ label: cat, value: cat }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Your Business' : 'Post Your Business'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <FormInput
          label="Business Name"
          name="name"
          required
          placeholder="Enter business name"
          value={form.name}
          onValueChange={set('name')}
        />

        <SelectInput
          label="Category"
          name="category"
          required
          placeholder="Select a category"
          options={categoryOptions}
          value={form.category}
          onChange={(e) => set('category')(e.target.value)}
        />

        <TextareaInput
          label="Description"
          name="description"
          required
          rows={5}
          placeholder="Describe your business..."
          value={form.description}
          onChange={(e) => set('description')(e.target.value)}
        />

        <FormInput
          label="Location"
          name="location"
          required
          placeholder="Enter location"
          icon="mdi:map-marker-outline"
          value={form.location}
          onValueChange={set('location')}
        />

        <FormInput
          label="Phone"
          name="phone"
          type="tel"
          required
          placeholder="Enter phone number"
          icon="mdi:phone-outline"
          value={form.phone}
          onValueChange={set('phone')}
        />

        <FormInput
          label="Website URL"
          name="website"
          type="url"
          placeholder="https://yourbusiness.com"
          icon="mdi:web"
          hint="Optional"
          value={form.website}
          onValueChange={set('website')}
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
