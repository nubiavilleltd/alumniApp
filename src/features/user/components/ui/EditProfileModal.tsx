// features/user/components/ui/EditProfileModal.tsx

import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import Button from '@/shared/components/ui/Button';
import { toast } from '@/shared/components/ui/Toast';
import type {
  AuthSessionUser,
  PrivacySettings,
  FieldVisibility,
} from '@/features/authentication/types/auth.types';
import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { userService } from '@/features/user/services/user.service';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { FieldWithPrivacy } from './FieldWithPrivacy';
import { PrivacyToggle } from './PrivacyToggle';
import {
  areaOptions,
  employmentStatusOptions,
  industrySectorOptions,
  occupationOptions,
  yearsOfExperienceOptions,
} from '@/features/authentication/constants/profileOptions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthSessionUser | null;
}

interface FormState {
  alternativePhone: string;
  birthDate: string;
  residentialAddress: string;
  area: string;
  city: string;
  employmentStatus: string;
  occupation: string;
  industrySector: string;
  yearsOfExperience: string;
  isVolunteer: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

function resolveYearsOfExperience(years: number | undefined): string {
  if (years == null) return '';
  const match = [...yearsOfExperienceOptions].reverse().find((o) => o.value <= years);
  return match ? String(match.value) : String(yearsOfExperienceOptions[0].value);
}

function toFormState(user: AuthSessionUser | null): FormState {
  return {
    alternativePhone: user?.alternativePhone ?? '',
    birthDate: user?.birthDate ?? '',
    residentialAddress: user?.residentialAddress ?? '',
    area: user?.area ?? '',
    city: user?.city ?? '',
    employmentStatus: user?.employmentStatus ?? '',
    occupation: user?.occupations?.[0] ?? '',
    industrySector: user?.industrySectors?.[0] ?? '',
    yearsOfExperience: resolveYearsOfExperience(user?.yearsOfExperience),
    isVolunteer: user?.isVolunteer === true ? 'yes' : user?.isVolunteer === false ? 'no' : '',
    linkedin: user?.linkedin ?? '',
    twitter: user?.twitter ?? '',
    instagram: user?.instagram ?? '',
    // NOTE: photo is NOT in FormState — it's handled separately via photoFile
    // to avoid sending a base64 data URL to the backend as a JSON field.
  };
}

const yearsOfExperienceSelectOptions = yearsOfExperienceOptions.map((o) => ({
  label: o.label,
  value: String(o.value),
}));

export default function EditProfileModal({ isOpen, onClose, currentUser }: Props) {
  const updateUser = useAuthStore((state) => state.updateUser);

  const [form, setForm] = useState<FormState>(() => toFormState(currentUser));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [privacy, setPrivacy] = useState<PrivacySettings>(() => ({
    ...defaultPrivacySettings,
    ...currentUser?.privacy,
  }));

  const updatePrivacy = (field: keyof PrivacySettings, value: FieldVisibility) =>
    setPrivacy((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    setForm(toFormState(currentUser));
    setPhotoFile(null);
    setPhotoPreview(null);
    setPrivacy({ ...defaultPrivacySettings, ...currentUser?.privacy });
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;
    setIsSaving(true);

    // Build profile field updates — photo is intentionally excluded here.
    // If a new photo was chosen, photoFile is passed separately to the service
    // and sent as a File via FormData. The base64 preview is only for local display.
    const updates: Partial<AuthSessionUser> = {
      alternativePhone: form.alternativePhone || undefined,
      birthDate: form.birthDate || undefined,
      residentialAddress: form.residentialAddress || undefined,
      area: form.area || undefined,
      city: form.city || undefined,
      employmentStatus: form.employmentStatus || undefined,
      occupations: form.occupation ? [form.occupation] : undefined,
      industrySectors: form.industrySector ? [form.industrySector] : undefined,
      yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
      isVolunteer:
        form.isVolunteer === 'yes' ? true : form.isVolunteer === 'no' ? false : undefined,
      linkedin: form.linkedin || undefined,
      twitter: form.twitter || undefined,
      instagram: form.instagram || undefined,
      // privacy is applied locally below — never sent to backend
    };

    try {
      const updatedFromBackend = await userService.updateProfile({
        userId: currentUser.id,
        updates,
        photoFile: photoFile ?? undefined,
      });

      // updateUser does a defined-only merge (see useAuthStore):
      // - Fields from the backend response overwrite existing values
      // - undefined fields in the response are ignored (photo stays intact)
      // - If a new photo was uploaded, the backend returns the new URL in `photo`
      // - If no photo was uploaded, `photo` is undefined in the response → kept as-is
      // - Privacy is applied locally and merged by updateUser
      updateUser({ ...updatedFromBackend, privacy });

      // If user picked a new photo but backend didn't return a URL yet,
      // show the local preview so the UI doesn't go blank
      if (photoPreview && !updatedFromBackend.photo) {
        updateUser({ photo: photoPreview });
      }

      toast.success('Your profile has been updated.');
      onClose();
    } catch (error: any) {
      toast.fromError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setForm(toFormState(currentUser));
    setPrivacy({ ...defaultPrivacySettings, ...currentUser?.privacy });
    onClose();
  };

  // Display priority: new local preview > existing stored photo > initials
  const displayPhoto = photoPreview ?? currentUser?.photo ?? null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
      <div className="flex flex-col gap-6">
        {/* ── Photo ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt={currentUser?.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary-400">
                    {currentUser?.avatarInitials}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer shadow transition-colors">
                <Icon icon="mdi:camera" className="w-3.5 h-3.5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{currentUser?.fullName}</p>
              <p className="text-xs text-gray-400">{currentUser?.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">Class of {currentUser?.graduationYear}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">Photo visibility</p>
            <PrivacyToggle value={privacy.photo} onChange={(v) => updatePrivacy('photo', v)} />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* ── Contact ────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Contact
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWithPrivacy
              field="alternativePhone"
              label="Alternative Phone"
              privacy={privacy}
              onPrivacyChange={updatePrivacy}
            >
              <FormInput
                name="alternativePhone"
                value={form.alternativePhone}
                onChange={handleChange}
                placeholder="+234 000 000 0000"
              />
            </FieldWithPrivacy>
            <FieldWithPrivacy
              field="birthDate"
              label="Date of Birth"
              privacy={privacy}
              onPrivacyChange={updatePrivacy}
            >
              <FormInput
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
              />
            </FieldWithPrivacy>
          </div>
        </div>

        {/* ── Address ────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Address
          </p>
          <div className="flex flex-col gap-4">
            <FieldWithPrivacy
              field="residentialAddress"
              label="Residential Address"
              privacy={privacy}
              onPrivacyChange={updatePrivacy}
            >
              <FormInput
                name="residentialAddress"
                value={form.residentialAddress}
                onChange={handleChange}
                placeholder="Street address"
              />
            </FieldWithPrivacy>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldWithPrivacy
                field="area"
                label="Area"
                privacy={privacy}
                onPrivacyChange={updatePrivacy}
              >
                <SelectInput
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  options={areaOptions}
                  placeholder="Select area"
                />
              </FieldWithPrivacy>
              <FieldWithPrivacy
                field="city"
                label="City"
                privacy={privacy}
                onPrivacyChange={updatePrivacy}
              >
                <FormInput
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Lagos"
                />
              </FieldWithPrivacy>
            </div>
          </div>
        </div>

        {/* ── Work ───────────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Work</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWithPrivacy
              field="employmentStatus"
              label="Employment Status"
              privacy={privacy}
              onPrivacyChange={updatePrivacy}
            >
              <SelectInput
                name="employmentStatus"
                value={form.employmentStatus}
                onChange={handleChange}
                options={employmentStatusOptions}
                placeholder="Select status"
              />
            </FieldWithPrivacy>
            <FieldWithPrivacy
              field="occupations"
              label="Occupation"
              privacy={privacy}
              onPrivacyChange={updatePrivacy}
            >
              <SelectInput
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                options={occupationOptions}
                placeholder="Select occupation"
              />
            </FieldWithPrivacy>
            <FieldWithPrivacy
              field="industrySectors"
              label="Industry Sector"
              privacy={privacy}
              onPrivacyChange={updatePrivacy}
            >
              <SelectInput
                name="industrySector"
                value={form.industrySector}
                onChange={handleChange}
                options={industrySectorOptions}
                placeholder="Select sector"
              />
            </FieldWithPrivacy>
            <FieldWithPrivacy
              field="yearsOfExperience"
              label="Years of Experience"
              privacy={privacy}
              onPrivacyChange={updatePrivacy}
            >
              <SelectInput
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleChange}
                options={yearsOfExperienceSelectOptions}
                placeholder="Select range"
              />
            </FieldWithPrivacy>
            <SelectInput
              label="Volunteer Interest"
              name="isVolunteer"
              value={form.isVolunteer}
              onChange={handleChange}
              options={[
                { label: 'Yes, I am interested', value: 'yes' },
                { label: 'No, not at this time', value: 'no' },
              ]}
              placeholder="Are you a volunteer?"
            />
          </div>
        </div>

        {/* ── Social Links ───────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Social Links
          </p>
          <div className="space-y-3">
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
              label="Instagram"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button variant="outline" onClick={handleClose} disabled={isSaving} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
