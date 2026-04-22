// features/user/pages/EditProfilePage.tsx
// Route: /user/profile/edit  (ProtectedRoute)
// NEW: Dedicated page replacing the EditProfileModal.
// Mobile-first: each section is a collapsible card on mobile, full layout on desktop.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '../routes';
import { useCurrentUser, currentUserKeys } from '@/features/authentication/hooks/useCurrentUser';
import { userService } from '../services/user.service';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { toast } from '@/shared/components/ui/Toast';
import {
  employmentStatusOptions,
  industrySectorOptions,
  occupationOptions,
  yearsOfExperienceOptions,
  houseColorOptions,
} from '@/features/authentication/constants/profileOptions';
import {
  phoneCountryOptions,
  type SupportedPhoneCountry,
  parseStoredPhoneNumber,
  normalizePhoneNumberForCountry,
  formatOptionalPhoneNumberWithCountryCode,
} from '@/features/authentication/constants/phoneCountries';
import { NIGERIA_STATES } from '@/features/authentication/constants/nigerianStates';
import type { AuthSessionUser } from '@/features/authentication/types/auth.types';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Dashboard', href: USER_ROUTES.DASHBOARD },
  { label: 'My Profile', href: USER_ROUTES.PROFILE },
  { label: 'Edit' },
];

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  firstName: string;
  lastName: string;
  nameInSchool: string;
  nickName: string;
  whatsappPhoneCountry: SupportedPhoneCountry;
  whatsappPhone: string;
  alternativePhoneCountry: SupportedPhoneCountry;
  alternativePhone: string;
  birthDate: string;
  bio: string;
  houseColor: string;
  residentialAddress: string;
  area: string;
  city: string;
  state: string;
  employmentStatus: string;
  occupation: string;
  industrySector: string;
  yearsOfExperience: string;
  company: string;
  position: string;
  isVolunteer: boolean;
  linkedin: string;
  twitter: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

function resolveYearsOfExperience(years: number | undefined): string {
  if (years == null) return '';
  const match = [...yearsOfExperienceOptions].reverse().find((o) => o.value <= years);
  return match ? String(match.value) : String(yearsOfExperienceOptions[0].value);
}

function toFormState(user: AuthSessionUser | null | undefined): FormState {
  const whatsappPhone = parseStoredPhoneNumber(user?.whatsappPhone);
  const alternativePhone = parseStoredPhoneNumber(user?.alternativePhone);
  return {
    firstName: user?.otherNames ?? '',
    lastName: user?.surname ?? '',
    nameInSchool: user?.nameInSchool ?? '',
    nickName: user?.nickName ?? '',
    whatsappPhoneCountry: whatsappPhone.countryCode,
    whatsappPhone: whatsappPhone.nationalNumber,
    alternativePhoneCountry: alternativePhone.countryCode,
    alternativePhone: alternativePhone.nationalNumber,
    birthDate: user?.birthDate ?? '',
    bio: user?.bio ?? '',
    houseColor: user?.houseColor ?? '',
    residentialAddress: user?.residentialAddress ?? '',
    area: user?.area ?? '',
    city: user?.city ?? '',
    state: user?.state ?? '',
    employmentStatus: user?.employmentStatus ?? '',
    occupation: user?.occupations?.[0] ?? '',
    industrySector: user?.industrySectors?.[0] ?? '',
    yearsOfExperience: resolveYearsOfExperience(user?.yearsOfExperience),
    company: user?.company ?? '',
    position: user?.position ?? '',
    isVolunteer: user?.isVolunteer ?? false,
    linkedin: user?.linkedin ?? '',
    twitter: user?.twitter ?? '',
    instagram: user?.instagram ?? '',
    facebook: user?.facebook ?? '',
    tiktok: (user as any)?.tiktok ?? '',
  };
}

// ─── Field components ─────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-4 py-2.5 rounded-3xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 focus:bg-white transition-all disabled:opacity-60"
    />
  );
}

function Select({
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-3xl border border-gray-200 bg-gray-50 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 focus:bg-white transition-all"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        icon="mdi:chevron-down"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

// ─── Section card (collapsible on mobile) ─────────────────────────────────────

function SectionCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 sm:cursor-default"
      >
        <span className="text-sm font-bold text-gray-900">{title}</span>
        <Icon
          icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'}
          className="w-4 h-4 text-gray-400 sm:hidden"
        />
      </button>
      {open && <div className="px-5 sm:px-6 pb-6 pt-0">{children}</div>}
    </div>
  );
}

// ─── Photo upload ─────────────────────────────────────────────────────────────

function PhotoUpload({
  currentPhoto,
  preview,
  fullName,
  onChange,
}: {
  currentPhoto?: string;
  preview: string | null;
  fullName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const initials = fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const displaySrc = preview ?? currentPhoto;

  return (
    <div className="flex items-center gap-5 mb-6">
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-white shadow-md bg-primary-50 flex items-center justify-center">
          {displaySrc ? (
            <img src={displaySrc} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary-400">{initials || '?'}</span>
          )}
        </div>
        <label
          htmlFor="photo-upload"
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors shadow"
        >
          <Icon icon="mdi:pencil" className="w-3.5 h-3.5" />
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={onChange}
          className="sr-only"
        />
      </div>
      {/* <div>
        <p className="text-sm font-semibold text-gray-800">{fullName || 'Your Name'}</p>
        <p className="text-xs text-gray-400 mt-0.5">Click the pencil to change your photo</p>
        <p className="text-xs text-gray-300 mt-0.5">JPG or PNG, max 2 MB</p>
      </div> */}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const stateOptions = NIGERIA_STATES.map((s) => ({ label: s, value: s }));
const employmentOptions = employmentStatusOptions.map((o) => ({ label: o.label, value: o.value }));
const occupationOpts = occupationOptions.map((o) => ({ label: o.label, value: o.value }));
const industrySectorOpts = industrySectorOptions.map((o) => ({ label: o.label, value: o.value }));
const yearsExpOpts = yearsOfExperienceOptions.map((o) => ({
  label: o.label,
  value: String(o.value),
}));
const houseColorOpts = houseColorOptions.map((o) => ({ label: o.label, value: o.value }));
const phoneCountryOpts = phoneCountryOptions.map((o) => ({
  label: `${o.dialCode} (${o.label})`,
  value: o.code,
}));

export default function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateUser = useIdentityStore((state) => state.updateUser);
  const { data: currentUser, isLoading } = useCurrentUser();

  const [form, setForm] = useState<FormState>(() => toFormState(currentUser));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when data arrives
  useEffect(() => {
    if (currentUser) {
      setForm(toFormState(currentUser));
    }
  }, [currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be under 2 MB');
      return;
    }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;
    setIsSaving(true);

    const updates: Partial<AuthSessionUser> = {
      otherNames: form.firstName.trim(),
      surname: form.lastName.trim(),
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      nameInSchool: form.nameInSchool.trim() || undefined,
      nickName: form.nickName.trim() || undefined,
      whatsappPhone:
        formatOptionalPhoneNumberWithCountryCode(form.whatsappPhoneCountry, form.whatsappPhone) ||
        '',
      alternativePhone:
        formatOptionalPhoneNumberWithCountryCode(
          form.alternativePhoneCountry,
          form.alternativePhone,
        ) || undefined,
      birthDate: form.birthDate || undefined,
      bio: form.bio.trim() || undefined,
      houseColor: form.houseColor || undefined,
      residentialAddress: form.residentialAddress.trim() || undefined,
      area: form.area || undefined,
      city: form.city.trim() || undefined,
      state: form.state || undefined,
      employmentStatus: form.employmentStatus || undefined,
      occupations: form.occupation ? [form.occupation] : undefined,
      industrySectors: form.industrySector ? [form.industrySector] : undefined,
      yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
      company: form.company.trim() || undefined,
      position: form.position.trim() || undefined,
      isVolunteer: form.isVolunteer,
      linkedin: form.linkedin.trim() || undefined,
      twitter: form.twitter.trim() || undefined,
      instagram: form.instagram.trim() || undefined,
      facebook: form.facebook.trim() || undefined,
    };

    try {
      const saved = await userService.updateProfile({
        userId: currentUser.id,
        updates,
        photoFile: photoFile ?? undefined,
      });
      updateUser(saved);
      await queryClient.invalidateQueries({ queryKey: currentUserKeys.all });
      toast.success('Profile updated successfully!');
      navigate(USER_ROUTES.PROFILE);
    } catch (err: any) {
      toast.fromError(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <SEO title="Edit Profile" />
        <Breadcrumbs items={breadcrumbItems} />
        <section className="section py-8">
          <div className="container-custom max-w-3xl animate-pulse space-y-4">
            <div className="h-24 bg-white rounded-2xl" />
            <div className="h-64 bg-white rounded-2xl" />
            <div className="h-48 bg-white rounded-2xl" />
          </div>
        </section>
      </>
    );
  }

  const fullName = `${form.firstName} ${form.lastName}`.trim();

  return (
    <>
      <SEO title="Edit Profile" description="Edit your alumni profile." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section bg-gray-100 py-8">
        <div className="container-custom max-w-3xl">
          <div className="space-y-5">
            {/* ── Photo ───────────────────────────────────────────────── */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 sm:px-6 py-5">
              <PhotoUpload
                currentPhoto={currentUser?.photo}
                preview={photoPreview}
                fullName={fullName || currentUser?.fullName || ''}
                onChange={handlePhotoChange}
              />
            </div> */}
            <PhotoUpload
              currentPhoto={currentUser?.photo}
              preview={photoPreview}
              fullName={fullName || currentUser?.fullName || ''}
              onChange={handlePhotoChange}
            />

            {/* ── Bio ─────────────────────────────────────────────────── */}
            <SectionCard title="Bio">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <Label>Maiden Name</Label>
                  <Input
                    name="nameInSchool"
                    value={form.nameInSchool}
                    onChange={handleChange}
                    placeholder="Name in school"
                  />
                </div>
                <div>
                  <Label>Nickname in School</Label>
                  <Input
                    name="nickName"
                    value={form.nickName}
                    onChange={handleChange}
                    placeholder="Nickname"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    name="email"
                    value={currentUser?.email ?? ''}
                    onChange={() => {}}
                    placeholder="Email"
                    disabled
                  />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <div className="flex gap-2">
                    <div className="w-28 flex-shrink-0">
                      <Select
                        name="whatsappPhoneCountry"
                        value={form.whatsappPhoneCountry}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            whatsappPhoneCountry: e.target.value as SupportedPhoneCountry,
                            whatsappPhone: normalizePhoneNumberForCountry(
                              e.target.value as SupportedPhoneCountry,
                              p.whatsappPhone,
                            ),
                          }))
                        }
                        options={phoneCountryOpts}
                      />
                    </div>
                    <Input
                      name="whatsappPhone"
                      value={form.whatsappPhone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label>Alt. Phone</Label>
                  <div className="flex gap-2">
                    <div className="w-28 flex-shrink-0">
                      <Select
                        name="alternativePhoneCountry"
                        value={form.alternativePhoneCountry}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            alternativePhoneCountry: e.target.value as SupportedPhoneCountry,
                            alternativePhone: normalizePhoneNumberForCountry(
                              e.target.value as SupportedPhoneCountry,
                              p.alternativePhone,
                            ),
                          }))
                        }
                        options={phoneCountryOpts}
                      />
                    </div>
                    <Input
                      name="alternativePhone"
                      value={form.alternativePhone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── About Me ────────────────────────────────────────────── */}
            <SectionCard title="About Me">
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Tell other alumni about yourself..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 focus:bg-white transition-all resize-none"
              />
            </SectionCard>

            {/* ── Professional Info ────────────────────────────────────── */}
            <SectionCard title="Professional Info" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Employment Status</Label>
                  <Select
                    name="employmentStatus"
                    value={form.employmentStatus}
                    onChange={handleChange}
                    options={employmentOptions}
                    placeholder="Select status"
                  />
                </div>
                <div>
                  <Label>Occupation</Label>
                  <Input
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <Label>Industry Sector</Label>
                  <Select
                    name="industrySector"
                    value={form.industrySector}
                    onChange={handleChange}
                    options={industrySectorOpts}
                    placeholder="Select sector"
                  />
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Select
                    name="yearsOfExperience"
                    value={form.yearsOfExperience}
                    onChange={handleChange}
                    options={yearsExpOpts}
                    placeholder="Select range"
                  />
                </div>
                <div>
                  <Label>Current Company</Label>
                  <Input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label>Current Position</Label>
                  <Input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="Job title"
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── Address ─────────────────────────────────────────────── */}
            <SectionCard title="Address" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <Label>Street Number and Name</Label>
                  <Input
                    name="residentialAddress"
                    value={form.residentialAddress}
                    onChange={handleChange}
                    placeholder="e.g. 23A Dolphin Estate"
                  />
                </div>
                {/* <div>
                  <Label>Area</Label>
                  <Select name="area" value={form.area} onChange={handleChange} options={[]} placeholder="Select area" />
                </div> */}
                <div>
                  <Label>State</Label>
                  <Select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    options={stateOptions}
                    placeholder="Select State"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                </div>
                <div>
                  <Label>Current Position</Label>
                  <Input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="Job title"
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── Socials ─────────────────────────────────────────────── */}
            <SectionCard title="Socials" defaultOpen={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: 'instagram',
                    label: 'Instagram',
                    placeholder: 'https://www.instagram.com/your_handle',
                  },
                  {
                    name: 'facebook',
                    label: 'Facebook',
                    placeholder: 'https://www.facebook.com/your_profile',
                  },
                  {
                    name: 'linkedin',
                    label: 'LinkedIn',
                    placeholder: 'Enter your LinkedIn profile link',
                  },
                  { name: 'twitter', label: 'X', placeholder: 'https://www.x.com/your_handle' },
                  {
                    name: 'tiktok',
                    label: 'TikTok',
                    placeholder: 'https://www.tiktok.com/@your_handle',
                  },
                ].map(({ name, label, placeholder }) => (
                  <div key={name}>
                    <Label>{label}</Label>
                    <Input
                      name={name}
                      value={(form as any)[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Volunteer ────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 sm:px-6 py-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isVolunteer}
                  onChange={(e) => setForm((p) => ({ ...p, isVolunteer: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Would you like to volunteer for events and projects?
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Yes, I am interested</p>
                </div>
              </label>
            </div>

            {/* ── Save / Cancel ────────────────────────────────────────── */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 pb-6">
              <button
                type="button"
                onClick={() => navigate(USER_ROUTES.PROFILE)}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
