

import { useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { ImageUpload } from '@/shared/components/ui/ImageUpload';
import { Button } from '@/shared/components/ui/Button';
import { categories } from '@/data/site-data';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

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
}

export function PostBusinessModal({ isOpen, onClose }: PostBusinessModalProps) {
  const [form, setForm] = useState<PostBusinessForm>(defaultForm);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof PostBusinessForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImages = (files: File[], urls: string[]) => {
    setForm((prev) => ({ ...prev, images: files }));
    setPreviews(urls);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up to API
    console.log('Submitting business:', form);
    await new Promise((r) => setTimeout(r, 800)); // remove when real API is wired
    setLoading(false);
    setForm(defaultForm);
    setPreviews([]);
    onClose();
  };

  const categoryOptions = categories.map((cat) => ({ label: cat, value: cat }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Your Business">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

        <ImageUpload label="Upload Images" previews={previews} onChange={handleImages} />

        <Button type="submit" fullWidth loading={loading}>
          Post Business
        </Button>
      </form>
    </Modal>
  );
}
