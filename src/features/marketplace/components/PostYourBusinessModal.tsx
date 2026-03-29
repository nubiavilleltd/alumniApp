// // features/marketplace/components/PostYourBusinessModal.tsx

// import { useEffect, useState } from 'react';
// import { Modal } from '@/shared/components/ui/Modal';
// import { SelectInput } from '@/shared/components/ui/SelectInput';
// import { ImageUpload } from '@/shared/components/ui/ImageUpload';
// import { Button } from '@/shared/components/ui/Button';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
// import { categories } from '@/data/site-data';
// import type { Business } from '../types/marketplace.types';

// // ─── Form state ───────────────────────────────────────────────────────────────
// interface PostBusinessForm {
//   name: string;
//   category: string;
//   description: string;
//   location: string;
//   phone: string;
//   website: string;
//   images: File[]; // new uploads
// }

// const defaultForm: PostBusinessForm = {
//   name: '',
//   category: '',
//   description: '',
//   location: '',
//   phone: '',
//   website: '',
//   images: [],
// };

// // ─── Props ────────────────────────────────────────────────────────────────────
// interface PostBusinessModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   editData?: Business | null; // when provided → edit mode
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function toFormState(data: Business | null | undefined): PostBusinessForm {
//   if (!data) return defaultForm;
//   return {
//     name: data.name,
//     category: data.category,
//     description: data.description,
//     location: data.location,
//     phone: data.phone,
//     website: data.website ?? '',
//     images: [], // existing images are URLs, not File objects
//   };
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// export function PostBusinessModal({ isOpen, onClose, editData }: PostBusinessModalProps) {
//   const isEditing = !!editData;

//   const [form, setForm] = useState<PostBusinessForm>(() => toFormState(editData));
//   const [previews, setPreviews] = useState<string[]>(() => editData?.images ?? []);
//   const [loading, setLoading] = useState(false);

//   // Re-sync when editData changes (e.g. switching between different business edits)
//   useEffect(() => {
//     setForm(toFormState(editData));
//     setPreviews(editData?.images ?? []);
//   }, [editData]);

//   // Reset to blank when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setForm(defaultForm);
//       setPreviews([]);
//     }
//   }, [isOpen]);

//   const set = (field: keyof PostBusinessForm) => (value: string) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const handleImages = (files: File[], urls: string[]) => {
//     if (files.length > 0) {
//       // New files selected — append to existing previews
//       setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
//       setPreviews((prev) => [...prev, ...urls]);
//     } else {
//       // A preview was removed — urls is the remaining previews after removal
//       setPreviews(urls);
//       // Also clear corresponding File entries — since we can't match 1:1 easily,
//       // reset new file uploads when a preview is removed
//       setForm((prev) => ({ ...prev, images: [] }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     if (isEditing) {
//       // 🔴 TODO: call updateBusiness mutation
//       // await updateBusiness(editData.businessId, {
//       //   ...form,
//       //   existingImages: previews.filter(p => !p.startsWith('blob:')),
//       //   newImages: form.images,
//       // });
//       console.log('Updating business:', editData?.businessId, form);
//     } else {
//       // 🔴 TODO: call createBusiness mutation
//       // await createBusiness({ ...form, images: form.images });
//       console.log('Creating business:', form);
//     }

//     await new Promise((r) => setTimeout(r, 800));
//     setLoading(false);
//     onClose();
//   };

//   const categoryOptions = categories.map((cat) => ({ label: cat, value: cat }));

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={isEditing ? 'Edit Your Business' : 'Post Your Business'}
//     >
//       <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//         <FormInput
//           label="Business Name"
//           name="name"
//           required
//           placeholder="Enter business name"
//           value={form.name}
//           onValueChange={set('name')}
//         />

//         <SelectInput
//           label="Category"
//           name="category"
//           required
//           placeholder="Select a category"
//           options={categoryOptions}
//           value={form.category}
//           onChange={(e) => set('category')(e.target.value)}
//         />

//         <TextareaInput
//           label="Description"
//           name="description"
//           required
//           rows={5}
//           placeholder="Describe your business..."
//           value={form.description}
//           onChange={(e) => set('description')(e.target.value)}
//         />

//         <FormInput
//           label="Location"
//           name="location"
//           required
//           placeholder="Enter location"
//           icon="mdi:map-marker-outline"
//           value={form.location}
//           onValueChange={set('location')}
//         />

//         <FormInput
//           label="Phone"
//           name="phone"
//           type="tel"
//           required
//           placeholder="Enter phone number"
//           icon="mdi:phone-outline"
//           value={form.phone}
//           onValueChange={set('phone')}
//         />

//         <FormInput
//           label="Website URL"
//           name="website"
//           type="url"
//           placeholder="https://yourbusiness.com"
//           icon="mdi:web"
//           hint="Optional"
//           value={form.website}
//           onValueChange={set('website')}
//         />

//         <ImageUpload
//           label={isEditing ? 'Business Images' : 'Upload Images'}
//           hint={
//             isEditing
//               ? 'Existing images shown below. Upload new ones to add more.'
//               : 'PNG or JPG (max 800×400px)'
//           }
//           previews={previews}
//           onChange={handleImages}
//         />

//         <Button type="submit" fullWidth loading={loading}>
//           {isEditing ? 'Update Business' : 'Post Business'}
//         </Button>
//       </form>
//     </Modal>
//   );
// }

// // features/marketplace/components/PostYourBusinessModal.tsx

// import { useEffect, useState } from 'react';
// import { Modal } from '@/shared/components/ui/Modal';
// import { SelectInput } from '@/shared/components/ui/SelectInput';
// import { ImageUpload } from '@/shared/components/ui/ImageUpload';
// import { Button } from '@/shared/components/ui/Button';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import {
//   useCreateListing,
//   useUpdateListing,
//   useMarketplaceCategories,
// } from '../hooks/useMarketplace';
// import {
//   mapBusinessToCreatePayload,
//   mapBusinessToUpdatePayload,
// } from '../api/adapters/marketplace.adapter';
// import type { Business } from '../types/marketplace.types';

// // ─── Form state ───────────────────────────────────────────────────────────────
// interface PostBusinessForm {
//   name: string;
//   category: string;
//   description: string;
//   location: string;
//   phone: string;
//   website: string;
//   images: File[]; // new uploads
// }

// const defaultForm: PostBusinessForm = {
//   name: '',
//   category: '',
//   description: '',
//   location: '',
//   phone: '',
//   website: '',
//   images: [],
// };

// // ─── Props ────────────────────────────────────────────────────────────────────
// interface PostBusinessModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   editData?: Business | null; // when provided → edit mode
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function toFormState(data: Business | null | undefined): PostBusinessForm {
//   if (!data) return defaultForm;
//   return {
//     name: data.name,
//     category: data.category,
//     description: data.description,
//     location: data.location,
//     phone: data.phone,
//     website: data.website ?? '',
//     images: [], // existing images are URLs, not File objects
//   };
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// export function PostBusinessModal({ isOpen, onClose, editData }: PostBusinessModalProps) {
//   const isEditing = !!editData;
//   const currentUser = useAuthStore((state) => state.user);

//   const [form, setForm] = useState<PostBusinessForm>(() => toFormState(editData));
//   const [previews, setPreviews] = useState<string[]>(() => editData?.images ?? []);
//   const [error, setError] = useState<string | null>(null);

//   // Mutations
//   const createMutation = useCreateListing();
//   const updateMutation = useUpdateListing();
//   const { data: categoriesList = [] } = useMarketplaceCategories();

//   // Re-sync when editData changes (e.g. switching between different business edits)
//   useEffect(() => {
//     setForm(toFormState(editData));
//     setPreviews(editData?.images ?? []);
//   }, [editData]);

//   // Reset to blank when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setForm(defaultForm);
//       setPreviews([]);
//       setError(null);
//     }
//   }, [isOpen]);

//   const set = (field: keyof PostBusinessForm) => (value: string) =>
//     setForm((prev) => ({ ...prev, [field]: value }));

//   const handleImages = (files: File[], urls: string[]) => {
//     if (files.length > 0) {
//       // New files selected — append to existing previews
//       setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
//       setPreviews((prev) => [...prev, ...urls]);
//     } else {
//       // A preview was removed — urls is the remaining previews after removal
//       setPreviews(urls);
//       // Also clear corresponding File entries — since we can't match 1:1 easily,
//       // reset new file uploads when a preview is removed
//       setForm((prev) => ({ ...prev, images: [] }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);

//     // Validation
//     if (!form.name.trim()) {
//       setError('Business name is required');
//       return;
//     }
//     if (!form.category) {
//       setError('Please select a category');
//       return;
//     }
//     if (!form.description.trim()) {
//       setError('Description is required');
//       return;
//     }
//     if (!form.location.trim()) {
//       setError('Location is required');
//       return;
//     }
//     if (!form.phone.trim()) {
//       setError('Phone number is required');
//       return;
//     }

//     if (isEditing) {
//       // Update existing business
//       if (!editData?.businessId) {
//         setError('Missing business ID');
//         return;
//       }

//       const payload = mapBusinessToUpdatePayload(
//         editData.businessId,
//         form,
//         previews.filter((p) => !p.startsWith('blob:')),
//       );

//       updateMutation.mutate(
//         { id: editData.businessId, payload },
//         {
//           onSuccess: () => {
//             onClose();
//           },
//           onError: (err: any) => {
//             setError(err?.message || 'Failed to update business. Please try again.');
//           },
//         },
//       );
//     } else {
//       // Create new business
//       if (!currentUser?.memberId) {
//         setError('You must be logged in to post a business');
//         return;
//       }

//       const payload = mapBusinessToCreatePayload(form, currentUser.memberId, currentUser.chapterId);

//       createMutation.mutate(payload, {
//         onSuccess: () => {
//           onClose();
//         },
//         onError: (err: any) => {
//           setError(err?.message || 'Failed to create business. Please try again.');
//         },
//       });
//     }
//   };

//   const isLoading = createMutation.isPending || updateMutation.isPending;
//   const categoryOptions = categoriesList.map((cat) => ({ label: cat, value: cat }));

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={isEditing ? 'Edit Your Business' : 'Post Your Business'}
//     >
//       <form onSubmit={handleSubmit} className="flex flex-col gap-5">
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         <FormInput
//           label="Business Name"
//           name="name"
//           required
//           placeholder="Enter business name"
//           value={form.name}
//           onValueChange={set('name')}
//         />

//         <SelectInput
//           label="Category"
//           name="category"
//           required
//           placeholder="Select a category"
//           options={categoryOptions}
//           value={form.category}
//           onChange={(e) => set('category')(e.target.value)}
//         />

//         <TextareaInput
//           label="Description"
//           name="description"
//           required
//           rows={5}
//           placeholder="Describe your business..."
//           value={form.description}
//           onChange={(e) => set('description')(e.target.value)}
//         />

//         <FormInput
//           label="Location"
//           name="location"
//           required
//           placeholder="Enter location"
//           icon="mdi:map-marker-outline"
//           value={form.location}
//           onValueChange={set('location')}
//         />

//         <FormInput
//           label="Phone"
//           name="phone"
//           type="tel"
//           required
//           placeholder="Enter phone number"
//           icon="mdi:phone-outline"
//           value={form.phone}
//           onValueChange={set('phone')}
//         />

//         <FormInput
//           label="Website URL"
//           name="website"
//           type="url"
//           placeholder="https://yourbusiness.com"
//           icon="mdi:web"
//           hint="Optional"
//           value={form.website}
//           onValueChange={set('website')}
//         />

//         <ImageUpload
//           label={isEditing ? 'Business Images' : 'Upload Images'}
//           hint={
//             isEditing
//               ? 'Existing images shown below. Upload new ones to add more.'
//               : 'PNG or JPG (max 800×400px)'
//           }
//           previews={previews}
//           onChange={handleImages}
//         />

//         <Button type="submit" fullWidth loading={isLoading}>
//           {isEditing ? 'Update Business' : 'Post Business'}
//         </Button>
//       </form>
//     </Modal>
//   );
// }

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
import type { CreateListingFormData } from '../api/adapters/marketplace.adapter';
import type { Business } from '../types/marketplace.types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostBusinessForm {
  name: string;
  category: string;
  description: string;
  location: string;
  phone: string;
  website: string;
  images: File[];
}

const defaultForm: PostBusinessForm = {
  name: '',
  category: '',
  description: '',
  location: '',
  phone: '',
  website: '',
  images: [],
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
    images: [],
  };
}

function toCreateListingFormData(form: PostBusinessForm): CreateListingFormData {
  return {
    name: form.name,
    category: form.category,
    description: form.description,
    location: form.location,
    phone: form.phone,
    website: form.website || undefined,
    images: form.images,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PostBusinessModal({ isOpen, onClose, editData }: PostBusinessModalProps) {
  const isEditing = !!editData;

  const [form, setForm] = useState<PostBusinessForm>(() => toFormState(editData));
  const [previews, setPreviews] = useState<string[]>(() => editData?.images ?? []);
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateListing();
  const updateMutation = useUpdateListing();
  const { data: categoriesList = [] } = useMarketplaceCategories();

  // Re-sync when editData changes
  useEffect(() => {
    setForm(toFormState(editData));
    setPreviews(editData?.images ?? []);
  }, [editData]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setForm(defaultForm);
      setPreviews([]);
      setError(null);
    }
  }, [isOpen]);

  const set = (field: keyof PostBusinessForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImages = (files: File[], urls: string[]) => {
    if (files.length > 0) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...files] }));
      setPreviews((prev) => [...prev, ...urls]);
    } else {
      setPreviews(urls);
      setForm((prev) => ({ ...prev, images: [] }));
    }
  };

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

    const listingFormData = toCreateListingFormData(form);

    if (isEditing) {
      if (!editData?.businessId) {
        setError('Missing business ID');
        return;
      }

      updateMutation.mutate(
        { id: editData.businessId, formData: listingFormData },
        {
          onSuccess: onClose,
          onError: (err: any) => setError(err?.message ?? 'Failed to update. Please try again.'),
        },
      );
    } else {
      // userId and chapterId are read from the auth store inside useCreateListing
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
          previews={previews}
          onChange={handleImages}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          {isEditing ? 'Update Business' : 'Post Business'}
        </Button>
      </form>
    </Modal>
  );
}
