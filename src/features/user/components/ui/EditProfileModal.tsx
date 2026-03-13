import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { TextareaInput } from '@/shared/components/ui/input/TextareaInput';
import Button from '@/shared/components/ui/Button';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

interface ProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
  position?: string;
  company?: string;
  location?: string;
  bio?: string;
  photo?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: ProfileData | null;
}

export default function EditProfileModal({ isOpen, onClose, currentUser }: Props) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving]         = useState(false);

  const [form, setForm] = useState({
    fullName:        currentUser?.fullName  ?? '',
    email:           currentUser?.email    ?? '',
    phone:           currentUser?.phone    ?? '',
    position:        currentUser?.position ?? '',
    company:         currentUser?.company  ?? '',
    location:        currentUser?.location ?? '',
    bio:             currentUser?.bio      ?? '',
    linkedin:        currentUser?.social?.linkedin ?? '',
    twitter:         currentUser?.social?.twitter  ?? '',
    github:          currentUser?.social?.github   ?? '',
  });

  // Sync form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setForm({
        fullName:  currentUser.fullName  ?? '',
        email:     currentUser.email    ?? '',
        phone:     currentUser.phone    ?? '',
        position:  currentUser.position ?? '',
        company:   currentUser.company  ?? '',
        location:  currentUser.location ?? '',
        bio:       currentUser.bio      ?? '',
        linkedin:  currentUser.social?.linkedin ?? '',
        twitter:   currentUser.social?.twitter  ?? '',
        github:    currentUser.social?.github   ?? '',
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // 🔴 TODO: call updateProfile mutation
    // await updateProfile({ ...form, photo: photoPreview ?? currentUser?.photo });
    console.log('Saving profile:', form);
    await new Promise((r) => setTimeout(r, 800)); // remove when API is ready
    setIsSaving(false);
    onClose();
  };

  const handleClose = () => {
    setPhotoPreview(null);
    onClose();
  };

  const initials = form.fullName
    .split(' ')
    .map((s) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
      <div className="flex flex-col gap-6">

        {/* ── Photo ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center flex-shrink-0">
              {photoPreview || currentUser?.photo ? (
                <img
                  src={photoPreview ?? currentUser?.photo}
                  alt={form.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-primary-400">{initials}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer shadow transition-colors">
              <Icon icon="mdi:camera" className="w-3.5 h-3.5 text-white" />
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">{form.fullName || 'Your Name'}</p>
            <p className="text-xs text-gray-400">{form.email}</p>
            <p className="text-xs text-primary-400 mt-1 cursor-pointer hover:underline">
              Change photo
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Basic Info ─────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Basic Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <FormInput
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              type="email"
            />
            <FormInput
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+234 000 000 0000"
            />
            <FormInput
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
            <FormInput
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
            />
            <FormInput
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="e.g. Google"
            />
          </div>
        </div>

        {/* ── Bio ────────────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            About Me
          </p>
          <TextareaInput
            label="Bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell your fellow alumnae about yourself..."
            rows={3}
          />
        </div>

        {/* ── Social Links ───────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Social Links
          </p>
          <div className="flex flex-col gap-3">
            <FormInput
              label="LinkedIn"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourname"
            />
            <FormInput
              label="Twitter / X"
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/yourhandle"
            />
            <FormInput
              label="GitHub"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/yourhandle"
            />
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <Button
            variant="primary"
            className="flex-1 py-2.5"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 py-2.5"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>

      </div>
    </Modal>
  );
}