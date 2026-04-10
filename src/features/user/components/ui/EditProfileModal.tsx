// features/user/components/ui/EditProfileModal.tsx
import { Icon } from '@iconify/react';
import { useEffect, useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/shared/components/ui/Modal';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import Button from '@/shared/components/ui/Button';
import { toast } from '@/shared/components/ui/Toast';
import type { AuthSessionUser, PrivacySettings } from '@/features/authentication/types/auth.types';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { currentUserKeys } from '@/features/authentication/hooks/useCurrentUser';
import { userService } from '@/features/user/services/user.service';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { FieldWithPrivacy } from './FieldWithPrivacy';
import { usePrivacySettings } from '@/features/user/hooks/usePrivacySettings';
import {
  areaOptions,
  employmentStatusOptions,
  industrySectorOptions,
  occupationOptions,
  yearsOfExperienceOptions,
  houseColorOptions,
} from '@/features/authentication/constants/profileOptions';
import {
  formatOptionalPhoneNumberWithCountryCode,
  getPhoneCountryOption,
  parseStoredPhoneNumber,
  phoneCountryOptions,
  type SupportedPhoneCountry,
  validateNationalPhoneNumber,
  normalizePhoneNumberForCountry,
} from '@/features/authentication/constants/phoneCountries';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthSessionUser | null;
}

interface FormState {
  firstName: string;
  lastName: string;
  nameInSchool: string;
  whatsappPhoneCountry: SupportedPhoneCountry;
  whatsappPhone: string;
  alternativePhoneCountry: SupportedPhoneCountry;
  alternativePhone: string;
  birthDate: string;
  bio: string;

  graduationYear: string;
  houseColor: string;

  residentialAddress: string;
  area: string;
  city: string;

  employmentStatus: string;
  occupation: string;
  industrySector: string;
  yearsOfExperience: string;
  company: string;
  position: string;

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
  const whatsappPhone = parseStoredPhoneNumber(user?.whatsappPhone);
  const alternativePhone = parseStoredPhoneNumber(user?.alternativePhone);

  return {
    firstName: user?.otherNames ?? '',
    lastName: user?.surname ?? '',
    nameInSchool: user?.nameInSchool ?? '',
    whatsappPhoneCountry: whatsappPhone.countryCode,
    whatsappPhone: whatsappPhone.nationalNumber,
    alternativePhoneCountry: alternativePhone.countryCode,
    alternativePhone: alternativePhone.nationalNumber,
    birthDate: user?.birthDate ?? '',
    bio: user?.bio ?? '',

    graduationYear: user?.graduationYear ? String(user.graduationYear) : '',
    houseColor: user?.houseColor ?? '',

    residentialAddress: user?.residentialAddress ?? '',
    area: user?.area ?? '',
    city: user?.city ?? '',

    employmentStatus: user?.employmentStatus ?? '',
    occupation: user?.occupations?.[0] ?? '',
    industrySector: user?.industrySectors?.[0] ?? '',
    yearsOfExperience: resolveYearsOfExperience(user?.yearsOfExperience),
    company: user?.company ?? '',
    position: user?.position ?? '',

    isVolunteer: user?.isVolunteer === true ? 'yes' : user?.isVolunteer === false ? 'no' : '',

    linkedin: user?.linkedin ?? '',
    twitter: user?.twitter ?? '',
    instagram: user?.instagram ?? '',
  };
}

const yearsOfExperienceSelectOptions = yearsOfExperienceOptions.map((o) => ({
  label: o.label,
  value: String(o.value),
}));
const phoneCountrySelectOptions = phoneCountryOptions.map((option) => ({
  label: `${option.dialCode} (${option.label})`,
  value: option.code,
}));

export default function EditProfileModal({ isOpen, onClose, currentUser }: Props) {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  const { data: privacy, isLoading: privacyLoading } = usePrivacySettings();

  const [form, setForm] = useState<FormState>(() => toFormState(currentUser));
  const [initialForm, setInitialForm] = useState<FormState>(() => toFormState(currentUser));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const formState = toFormState(currentUser);
      setForm(formState);
      setInitialForm(formState);
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  }, [currentUser, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhoneCountryChange =
    (
      phoneField: 'whatsappPhone' | 'alternativePhone',
      countryField: 'whatsappPhoneCountry' | 'alternativePhoneCountry',
    ) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const nextCountry = e.target.value as SupportedPhoneCountry;
      setForm((prev) => ({
        ...prev,
        [countryField]: nextCountry,
        [phoneField]: normalizePhoneNumberForCountry(nextCountry, prev[phoneField]),
      }));
    };

  const handlePhoneInputChange =
    (
      phoneField: 'whatsappPhone' | 'alternativePhone',
      countryField: 'whatsappPhoneCountry' | 'alternativePhoneCountry',
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [phoneField]: normalizePhoneNumberForCountry(prev[countryField], e.target.value),
      }));
    };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ✅ CLEAN PARTIAL UPDATE: Only changed fields, no undefined
  // ═══════════════════════════════════════════════════════════════════════
  const changedFields = useMemo(() => {
    const changes: Partial<AuthSessionUser> = {};
    const currentWhatsappPhone = formatOptionalPhoneNumberWithCountryCode(
      form.whatsappPhoneCountry,
      form.whatsappPhone,
    );
    const initialWhatsappPhone = formatOptionalPhoneNumberWithCountryCode(
      initialForm.whatsappPhoneCountry,
      initialForm.whatsappPhone,
    );
    const currentAlternativePhone = formatOptionalPhoneNumberWithCountryCode(
      form.alternativePhoneCountry,
      form.alternativePhone,
    );
    const initialAlternativePhone = formatOptionalPhoneNumberWithCountryCode(
      initialForm.alternativePhoneCountry,
      initialForm.alternativePhone,
    );

    // Only add field if it changed AND has a value
    // Empty string = intentional clear, so we include it
    if (form.firstName !== initialForm.firstName) {
      changes.otherNames = form.firstName;
    }
    if (form.lastName !== initialForm.lastName) {
      changes.surname = form.lastName;
    }
    if (form.nameInSchool !== initialForm.nameInSchool) {
      changes.nameInSchool = form.nameInSchool;
    }
    if (currentWhatsappPhone !== initialWhatsappPhone) {
      changes.whatsappPhone = currentWhatsappPhone;
    }
    if (currentAlternativePhone !== initialAlternativePhone) {
      changes.alternativePhone = currentAlternativePhone;
    }
    if (form.birthDate !== initialForm.birthDate) {
      changes.birthDate = form.birthDate;
    }

    if (form.graduationYear !== initialForm.graduationYear) {
      changes.graduationYear = form.graduationYear ? Number(form.graduationYear) : undefined;
    }
    if (form.houseColor !== initialForm.houseColor) {
      changes.houseColor = form.houseColor;
    }

    if (form.residentialAddress !== initialForm.residentialAddress) {
      changes.residentialAddress = form.residentialAddress;
    }
    if (form.area !== initialForm.area) {
      changes.area = form.area;
    }
    if (form.city !== initialForm.city) {
      changes.city = form.city;
    }

    if (form.employmentStatus !== initialForm.employmentStatus) {
      changes.employmentStatus = form.employmentStatus;
    }
    if (form.occupation !== initialForm.occupation) {
      changes.occupations = form.occupation ? [form.occupation] : [];
    }
    if (form.industrySector !== initialForm.industrySector) {
      changes.industrySectors = form.industrySector ? [form.industrySector] : [];
    }
    if (form.yearsOfExperience !== initialForm.yearsOfExperience) {
      changes.yearsOfExperience = form.yearsOfExperience
        ? Number(form.yearsOfExperience)
        : undefined;
    }
    if (form.company !== initialForm.company) {
      changes.company = form.company;
    }
    if (form.position !== initialForm.position) {
      changes.position = form.position;
    }

    if (form.isVolunteer !== initialForm.isVolunteer) {
      changes.isVolunteer =
        form.isVolunteer === 'yes' ? true : form.isVolunteer === 'no' ? false : undefined;
    }

    if (form.linkedin !== initialForm.linkedin) {
      changes.linkedin = form.linkedin;
    }
    if (form.twitter !== initialForm.twitter) {
      changes.twitter = form.twitter;
    }
    if (form.instagram !== initialForm.instagram) {
      changes.instagram = form.instagram;
    }

    changes.bio = form.bio;
    changes.residentialAddress = form.residentialAddress;

    // ✅ Filter out undefined values completely
    const cleanedChanges: Partial<AuthSessionUser> = {};
    for (const [key, value] of Object.entries(changes)) {
      if (value !== undefined) {
        cleanedChanges[key as keyof AuthSessionUser] = value as any;
      }
    }

    return cleanedChanges;
  }, [form, initialForm]);

  const hasChanges = Object.keys(changedFields).length > 0 || photoFile !== null;
  const selectedWhatsappPhoneCountry = getPhoneCountryOption(form.whatsappPhoneCountry);
  const selectedAlternativePhoneCountry = getPhoneCountryOption(form.alternativePhoneCountry);
  const whatsappPhoneError = validateNationalPhoneNumber(
    form.whatsappPhoneCountry,
    form.whatsappPhone,
  );
  const alternativePhoneError = form.alternativePhone
    ? validateNationalPhoneNumber(form.alternativePhoneCountry, form.alternativePhone)
    : null;

  const handleSave = async () => {
    if (!currentUser?.id) return;

    if (whatsappPhoneError || alternativePhoneError) {
      toast.error(
        whatsappPhoneError ?? alternativePhoneError ?? 'Please correct the phone fields.',
      );
      return;
    }

    if (!hasChanges) {
      toast.info('No changes to save');
      return;
    }

    setIsSaving(true);

    try {
      const updatedFromBackend = await userService.updateProfile({
        userId: currentUser.id,
        updates: changedFields,
        photoFile: photoFile ?? undefined,
      });

      const mergedUpdate: Partial<AuthSessionUser> = {
        ...updatedFromBackend,
        privacy,
      };

      if (photoPreview && !updatedFromBackend.photo) {
        mergedUpdate.photo = photoPreview;
      }

      updateUser(mergedUpdate);

      if (currentUser) {
        const nextCurrentUser: AuthSessionUser = {
          ...currentUser,
          ...mergedUpdate,
        };

        queryClient.setQueryData(currentUserKeys.detail(currentUser.id), nextCurrentUser);
      }

      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast.success('Your profile has been updated.');

      setPhotoFile(null);
      setPhotoPreview(null);

      onClose();
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      toast.fromError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setForm(toFormState(currentUser));
    setInitialForm(toFormState(currentUser));
    onClose();
  };

  const displayPhoto = photoPreview ?? currentUser?.photo ?? null;

  if (privacyLoading) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
        <div className="py-12 flex items-center justify-center">
          <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
      <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Photo section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt={currentUser?.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-xl font-bold text-primary-400">${currentUser?.avatarInitials || 'U'}</span>`;
                      }
                    }}
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
              {photoPreview && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Icon icon="mdi:check-circle" className="w-3 h-3" />
                  New photo selected
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">Photo visibility</p>
            <FieldWithPrivacy
              field="photo"
              privacy={privacy!}
              onPrivacyChange={() => {}}
              hideLabel
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Basic Information */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Basic Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Name in School"
              name="nameInSchool"
              value={form.nameInSchool}
              onChange={handleChange}
              placeholder="If different from current name"
            />
            <FormInput
              label="Graduation Year"
              name="graduationYear"
              type="number"
              value={form.graduationYear}
              onChange={handleChange}
              required
            />
            <SelectInput
              label="House Color"
              name="houseColor"
              value={form.houseColor}
              onChange={handleChange}
              options={houseColorOptions}
              placeholder="Select house"
            />
          </div>
          <div className="mt-4">
            <TextareaInput
              label="Bio"
              name="bio"
              rows={5}
              placeholder="Tell us about yourself..."
              value={form.bio}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Contact
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWithPrivacy
              field="whatsappPhone"
              label="WhatsApp Phone"
              privacy={privacy!}
              onPrivacyChange={() => {}}
            >
              <div className="grid grid-cols-[10rem_1fr] gap-2">
                <SelectInput
                  name="whatsappPhoneCountry"
                  value={form.whatsappPhoneCountry}
                  onChange={handlePhoneCountryChange('whatsappPhone', 'whatsappPhoneCountry')}
                  options={phoneCountrySelectOptions}
                  placeholder="Country"
                />
                <FormInput
                  name="whatsappPhone"
                  type="tel"
                  inputMode="numeric"
                  value={form.whatsappPhone}
                  onChange={handlePhoneInputChange('whatsappPhone', 'whatsappPhoneCountry')}
                  placeholder={selectedWhatsappPhoneCountry.placeholder}
                  error={whatsappPhoneError ?? undefined}
                  required
                />
              </div>
            </FieldWithPrivacy>
            <FieldWithPrivacy
              field="alternativePhone"
              label="Alternative Phone"
              privacy={privacy!}
              onPrivacyChange={() => {}}
            >
              <div className="grid grid-cols-[10rem_1fr] gap-2">
                <SelectInput
                  name="alternativePhoneCountry"
                  value={form.alternativePhoneCountry}
                  onChange={handlePhoneCountryChange('alternativePhone', 'alternativePhoneCountry')}
                  options={phoneCountrySelectOptions}
                  placeholder="Country"
                />
                <FormInput
                  name="alternativePhone"
                  type="tel"
                  inputMode="numeric"
                  value={form.alternativePhone}
                  onChange={handlePhoneInputChange('alternativePhone', 'alternativePhoneCountry')}
                  placeholder={selectedAlternativePhoneCountry.placeholder}
                  error={alternativePhoneError ?? undefined}
                />
              </div>
            </FieldWithPrivacy>
            <FieldWithPrivacy
              field="birthDate"
              label="Date of Birth"
              privacy={privacy!}
              onPrivacyChange={() => {}}
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

        {/* Address */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Address
          </p>
          <div className="flex flex-col gap-4">
            <FieldWithPrivacy
              field="residentialAddress"
              label="Residential Address"
              privacy={privacy!}
              onPrivacyChange={() => {}}
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
                privacy={privacy!}
                onPrivacyChange={() => {}}
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
                privacy={privacy!}
                onPrivacyChange={() => {}}
              >
                <FormInput
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Ikeja"
                />
              </FieldWithPrivacy>
            </div>
          </div>
        </div>

        {/* Professional */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Professional Information
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWithPrivacy
              field="employmentStatus"
              label="Employment Status"
              privacy={privacy!}
              onPrivacyChange={() => {}}
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
              privacy={privacy!}
              onPrivacyChange={() => {}}
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
              privacy={privacy!}
              onPrivacyChange={() => {}}
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
              privacy={privacy!}
              onPrivacyChange={() => {}}
            >
              <SelectInput
                name="yearsOfExperience"
                value={form.yearsOfExperience}
                onChange={handleChange}
                options={yearsOfExperienceSelectOptions}
                placeholder="Select range"
              />
            </FieldWithPrivacy>
            <FormInput
              label="Current Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company name"
            />
            <FormInput
              label="Current Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Job title"
            />
            <SelectInput
              label="Volunteer Interest"
              name="isVolunteer"
              value={form.isVolunteer}
              onChange={handleChange}
              options={[
                { label: 'Yes, I am interested', value: 'yes' },
                { label: 'No, not at this time', value: 'no' },
              ]}
              placeholder="Would you like to volunteer for events/projects?"
            />
          </div>
        </div>

        {/* Social Links */}
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

        {/* Actions */}
        <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-2 border-t border-gray-100 mt-4">
          {/* <Button onClick={handleSave} disabled={isSaving || !hasChanges} className="flex-1"> */}
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
