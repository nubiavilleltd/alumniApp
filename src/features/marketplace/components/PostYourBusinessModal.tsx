import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Modal } from '@/shared/components/ui/Modal';
import { categories } from '@/data/site-data';



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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof PostBusinessForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setForm((prev) => ({ ...prev, images: files }));
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: wire up to your API
    console.log('Submitting business:', form);
    setForm(defaultForm);
    setPreviews([]);
    onClose();
  };

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-primary-400 transition-colors';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Your Business">
      <div className="flex flex-col gap-5">

        {/* Business Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Business Name</label>
          <input
            type="text"
            placeholder="Enter business name"
            value={form.name}
            onChange={set('name')}
            className={inputClass}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Category</label>
          <div className="relative">
            <select
              value={form.category}
              onChange={set('category')}
              className={`${inputClass} appearance-none pr-9 cursor-pointer`}
            >
              <option value="">Food &amp; Beverage</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Icon
              icon="mdi:chevron-down"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Description</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={set('description')}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Location</label>
          <input
            type="text"
            placeholder="Enter location"
            value={form.location}
            onChange={set('location')}
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone</label>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={set('phone')}
            className={inputClass}
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Website URL <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            placeholder=""
            value={form.website}
            onChange={set('website')}
            className={inputClass}
          />
        </div>

        {/* Upload Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Upload Images</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center gap-2 hover:border-primary-400 transition-colors group"
          >
            <Icon
              icon="mdi:camera-outline"
              className="w-8 h-8 text-gray-400 group-hover:text-primary-400 transition-colors"
            />
            <span className="text-primary-500 text-sm font-medium">Click to upload image</span>
            <span className="text-gray-400 text-xs">PNG or JPG (max 800×400px)</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
            onChange={handleImages}
          />

          {/* Previews */}
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Post Business
        </button>

      </div>
    </Modal>
  );
}