// // // // features/user/components/ui/EditProfileModal.tsx

// // // import { Icon } from '@iconify/react';
// // // import { useEffect, useState } from 'react';
// // // import { Modal } from '@/shared/components/ui/Modal';
// // // import { FormInput } from '@/shared/components/ui/input/FormInput';
// // // import Button from '@/shared/components/ui/Button';
// // // import { toast } from '@/shared/components/ui/Toast';
// // // import type {
// // //   AuthSessionUser,
// // //   PrivacySettings,
// // //   FieldVisibility,
// // // } from '@/features/authentication/types/auth.types';
// // // import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
// // // import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// // // import { userService } from '@/features/user/services/user.service';
// // // import { SelectInput } from '@/shared/components/ui/SelectInput';
// // // import { FieldWithPrivacy } from './FieldWithPrivacy';
// // // import { PrivacyToggle } from './PrivacyToggle';
// // // import {
// // //   areaOptions,
// // //   employmentStatusOptions,
// // //   industrySectorOptions,
// // //   occupationOptions,
// // //   yearsOfExperienceOptions,
// // // } from '@/features/authentication/constants/profileOptions';

// // // interface Props {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   currentUser: AuthSessionUser | null;
// // // }

// // // interface FormState {
// // //   alternativePhone: string;
// // //   birthDate: string;
// // //   residentialAddress: string;
// // //   area: string;
// // //   city: string;
// // //   employmentStatus: string;
// // //   occupation: string;
// // //   industrySector: string;
// // //   yearsOfExperience: string;
// // //   isVolunteer: string;
// // //   linkedin: string;
// // //   twitter: string;
// // //   instagram: string;
// // // }

// // // function resolveYearsOfExperience(years: number | undefined): string {
// // //   if (years == null) return '';
// // //   const match = [...yearsOfExperienceOptions].reverse().find((o) => o.value <= years);
// // //   return match ? String(match.value) : String(yearsOfExperienceOptions[0].value);
// // // }

// // // function toFormState(user: AuthSessionUser | null): FormState {
// // //   return {
// // //     alternativePhone: user?.alternativePhone ?? '',
// // //     birthDate: user?.birthDate ?? '',
// // //     residentialAddress: user?.residentialAddress ?? '',
// // //     area: user?.area ?? '',
// // //     city: user?.city ?? '',
// // //     employmentStatus: user?.employmentStatus ?? '',
// // //     occupation: user?.occupations?.[0] ?? '',
// // //     industrySector: user?.industrySectors?.[0] ?? '',
// // //     yearsOfExperience: resolveYearsOfExperience(user?.yearsOfExperience),
// // //     isVolunteer: user?.isVolunteer === true ? 'yes' : user?.isVolunteer === false ? 'no' : '',
// // //     linkedin: user?.linkedin ?? '',
// // //     twitter: user?.twitter ?? '',
// // //     instagram: user?.instagram ?? '',
// // //     // NOTE: photo is NOT in FormState — it's handled separately via photoFile
// // //     // to avoid sending a base64 data URL to the backend as a JSON field.
// // //   };
// // // }

// // // const yearsOfExperienceSelectOptions = yearsOfExperienceOptions.map((o) => ({
// // //   label: o.label,
// // //   value: String(o.value),
// // // }));

// // // export default function EditProfileModal({ isOpen, onClose, currentUser }: Props) {
// // //   const updateUser = useAuthStore((state) => state.updateUser);

// // //   const [form, setForm] = useState<FormState>(() => toFormState(currentUser));
// // //   const [photoFile, setPhotoFile] = useState<File | null>(null);
// // //   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
// // //   const [isSaving, setIsSaving] = useState(false);
// // //   const [privacy, setPrivacy] = useState<PrivacySettings>(() => ({
// // //     ...defaultPrivacySettings,
// // //     ...currentUser?.privacy,
// // //   }));

// // //   const updatePrivacy = (field: keyof PrivacySettings, value: FieldVisibility) =>
// // //     setPrivacy((prev) => ({ ...prev, [field]: value }));

// // //   useEffect(() => {
// // //     setForm(toFormState(currentUser));
// // //     setPhotoFile(null);
// // //     setPhotoPreview(null);
// // //     setPrivacy({ ...defaultPrivacySettings, ...currentUser?.privacy });
// // //   }, [currentUser]);

// // //   const handleChange = (
// // //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
// // //   ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

// // //   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = e.target.files?.[0];
// // //     if (!file) return;
// // //     setPhotoFile(file);
// // //     const reader = new FileReader();
// // //     reader.onload = () => setPhotoPreview(reader.result as string);
// // //     reader.readAsDataURL(file);
// // //   };

// // //   const handleSave = async () => {
// // //     if (!currentUser?.id) return;
// // //     setIsSaving(true);

// // //     // Build profile field updates — photo is intentionally excluded here.
// // //     // If a new photo was chosen, photoFile is passed separately to the service
// // //     // and sent as a File via FormData. The base64 preview is only for local display.
// // //     const updates: Partial<AuthSessionUser> = {
// // //       alternativePhone: form.alternativePhone || undefined,
// // //       birthDate: form.birthDate || undefined,
// // //       residentialAddress: form.residentialAddress || undefined,
// // //       area: form.area || undefined,
// // //       city: form.city || undefined,
// // //       employmentStatus: form.employmentStatus || undefined,
// // //       occupations: form.occupation ? [form.occupation] : undefined,
// // //       industrySectors: form.industrySector ? [form.industrySector] : undefined,
// // //       yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
// // //       isVolunteer:
// // //         form.isVolunteer === 'yes' ? true : form.isVolunteer === 'no' ? false : undefined,
// // //       linkedin: form.linkedin || undefined,
// // //       twitter: form.twitter || undefined,
// // //       instagram: form.instagram || undefined,
// // //       // privacy is applied locally below — never sent to backend
// // //     };

// // //     try {
// // //       const updatedFromBackend = await userService.updateProfile({
// // //         userId: currentUser.id,
// // //         updates,
// // //         photoFile: photoFile ?? undefined,
// // //       });

// // //       // updateUser does a defined-only merge (see useAuthStore):
// // //       // - Fields from the backend response overwrite existing values
// // //       // - undefined fields in the response are ignored (photo stays intact)
// // //       // - If a new photo was uploaded, the backend returns the new URL in `photo`
// // //       // - If no photo was uploaded, `photo` is undefined in the response → kept as-is
// // //       // - Privacy is applied locally and merged by updateUser
// // //       updateUser({ ...updatedFromBackend, privacy });

// // //       // If user picked a new photo but backend didn't return a URL yet,
// // //       // show the local preview so the UI doesn't go blank
// // //       if (photoPreview && !updatedFromBackend.photo) {
// // //         updateUser({ photo: photoPreview });
// // //       }

// // //       toast.success('Your profile has been updated.');
// // //       onClose();
// // //     } catch (error: any) {
// // //       toast.fromError(error);
// // //     } finally {
// // //       setIsSaving(false);
// // //     }
// // //   };

// // //   const handleClose = () => {
// // //     setPhotoFile(null);
// // //     setPhotoPreview(null);
// // //     setForm(toFormState(currentUser));
// // //     setPrivacy({ ...defaultPrivacySettings, ...currentUser?.privacy });
// // //     onClose();
// // //   };

// // //   // Display priority: new local preview > existing stored photo > initials
// // //   const displayPhoto = photoPreview ?? currentUser?.photo ?? null;

// // //   return (
// // //     <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
// // //       <div className="flex flex-col gap-6">
// // //         {/* ── Photo ──────────────────────────────────────────────────── */}
// // //         <div className="flex items-start justify-between gap-4">
// // //           <div className="flex items-center gap-4">
// // //             <div className="relative flex-shrink-0">
// // //               <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center">
// // //                 {displayPhoto ? (
// // //                   <img
// // //                     src={displayPhoto}
// // //                     alt={currentUser?.fullName}
// // //                     className="w-full h-full object-cover"
// // //                   />
// // //                 ) : (
// // //                   <span className="text-xl font-bold text-primary-400">
// // //                     {currentUser?.avatarInitials}
// // //                   </span>
// // //                 )}
// // //               </div>
// // //               <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer shadow transition-colors">
// // //                 <Icon icon="mdi:camera" className="w-3.5 h-3.5 text-white" />
// // //                 <input
// // //                   type="file"
// // //                   accept="image/*"
// // //                   onChange={handlePhotoChange}
// // //                   className="hidden"
// // //                 />
// // //               </label>
// // //             </div>
// // //             <div>
// // //               <p className="text-sm font-semibold text-gray-800">{currentUser?.fullName}</p>
// // //               <p className="text-xs text-gray-400">{currentUser?.email}</p>
// // //               <p className="text-xs text-gray-400 mt-0.5">Class of {currentUser?.graduationYear}</p>
// // //             </div>
// // //           </div>
// // //           <div className="flex flex-col gap-1">
// // //             <p className="text-xs text-gray-500">Photo visibility</p>
// // //             <PrivacyToggle value={privacy.photo} onChange={(v) => updatePrivacy('photo', v)} />
// // //           </div>
// // //         </div>

// // //         <hr className="border-gray-100" />

// // //         {/* ── Contact ────────────────────────────────────────────────── */}
// // //         <div>
// // //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// // //             Contact
// // //           </p>
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //             <FieldWithPrivacy
// // //               field="alternativePhone"
// // //               label="Alternative Phone"
// // //               privacy={privacy}
// // //               onPrivacyChange={updatePrivacy}
// // //             >
// // //               <FormInput
// // //                 name="alternativePhone"
// // //                 value={form.alternativePhone}
// // //                 onChange={handleChange}
// // //                 placeholder="+234 000 000 0000"
// // //               />
// // //             </FieldWithPrivacy>
// // //             <FieldWithPrivacy
// // //               field="birthDate"
// // //               label="Date of Birth"
// // //               privacy={privacy}
// // //               onPrivacyChange={updatePrivacy}
// // //             >
// // //               <FormInput
// // //                 name="birthDate"
// // //                 type="date"
// // //                 value={form.birthDate}
// // //                 onChange={handleChange}
// // //               />
// // //             </FieldWithPrivacy>
// // //           </div>
// // //         </div>

// // //         {/* ── Address ────────────────────────────────────────────────── */}
// // //         <div>
// // //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// // //             Address
// // //           </p>
// // //           <div className="flex flex-col gap-4">
// // //             <FieldWithPrivacy
// // //               field="residentialAddress"
// // //               label="Residential Address"
// // //               privacy={privacy}
// // //               onPrivacyChange={updatePrivacy}
// // //             >
// // //               <FormInput
// // //                 name="residentialAddress"
// // //                 value={form.residentialAddress}
// // //                 onChange={handleChange}
// // //                 placeholder="Street address"
// // //               />
// // //             </FieldWithPrivacy>
// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               <FieldWithPrivacy
// // //                 field="area"
// // //                 label="Area"
// // //                 privacy={privacy}
// // //                 onPrivacyChange={updatePrivacy}
// // //               >
// // //                 <SelectInput
// // //                   name="area"
// // //                   value={form.area}
// // //                   onChange={handleChange}
// // //                   options={areaOptions}
// // //                   placeholder="Select area"
// // //                 />
// // //               </FieldWithPrivacy>
// // //               <FieldWithPrivacy
// // //                 field="city"
// // //                 label="City"
// // //                 privacy={privacy}
// // //                 onPrivacyChange={updatePrivacy}
// // //               >
// // //                 <FormInput
// // //                   name="city"
// // //                   value={form.city}
// // //                   onChange={handleChange}
// // //                   placeholder="e.g. Lagos"
// // //                 />
// // //               </FieldWithPrivacy>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* ── Work ───────────────────────────────────────────────────── */}
// // //         <div>
// // //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Work</p>
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //             <FieldWithPrivacy
// // //               field="employmentStatus"
// // //               label="Employment Status"
// // //               privacy={privacy}
// // //               onPrivacyChange={updatePrivacy}
// // //             >
// // //               <SelectInput
// // //                 name="employmentStatus"
// // //                 value={form.employmentStatus}
// // //                 onChange={handleChange}
// // //                 options={employmentStatusOptions}
// // //                 placeholder="Select status"
// // //               />
// // //             </FieldWithPrivacy>
// // //             <FieldWithPrivacy
// // //               field="occupations"
// // //               label="Occupation"
// // //               privacy={privacy}
// // //               onPrivacyChange={updatePrivacy}
// // //             >
// // //               <SelectInput
// // //                 name="occupation"
// // //                 value={form.occupation}
// // //                 onChange={handleChange}
// // //                 options={occupationOptions}
// // //                 placeholder="Select occupation"
// // //               />
// // //             </FieldWithPrivacy>
// // //             <FieldWithPrivacy
// // //               field="industrySectors"
// // //               label="Industry Sector"
// // //               privacy={privacy}
// // //               onPrivacyChange={updatePrivacy}
// // //             >
// // //               <SelectInput
// // //                 name="industrySector"
// // //                 value={form.industrySector}
// // //                 onChange={handleChange}
// // //                 options={industrySectorOptions}
// // //                 placeholder="Select sector"
// // //               />
// // //             </FieldWithPrivacy>
// // //             <FieldWithPrivacy
// // //               field="yearsOfExperience"
// // //               label="Years of Experience"
// // //               privacy={privacy}
// // //               onPrivacyChange={updatePrivacy}
// // //             >
// // //               <SelectInput
// // //                 name="yearsOfExperience"
// // //                 value={form.yearsOfExperience}
// // //                 onChange={handleChange}
// // //                 options={yearsOfExperienceSelectOptions}
// // //                 placeholder="Select range"
// // //               />
// // //             </FieldWithPrivacy>
// // //             <SelectInput
// // //               label="Volunteer Interest"
// // //               name="isVolunteer"
// // //               value={form.isVolunteer}
// // //               onChange={handleChange}
// // //               options={[
// // //                 { label: 'Yes, I am interested', value: 'yes' },
// // //                 { label: 'No, not at this time', value: 'no' },
// // //               ]}
// // //               placeholder="Are you a volunteer?"
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* ── Social Links ───────────────────────────────────────────── */}
// // //         <div>
// // //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// // //             Social Links
// // //           </p>
// // //           <div className="space-y-3">
// // //             <FormInput
// // //               label="LinkedIn"
// // //               name="linkedin"
// // //               value={form.linkedin}
// // //               onChange={handleChange}
// // //               placeholder="https://linkedin.com/in/yourname"
// // //             />
// // //             <FormInput
// // //               label="Twitter / X"
// // //               name="twitter"
// // //               value={form.twitter}
// // //               onChange={handleChange}
// // //               placeholder="https://twitter.com/yourhandle"
// // //             />
// // //             <FormInput
// // //               label="Instagram"
// // //               name="instagram"
// // //               value={form.instagram}
// // //               onChange={handleChange}
// // //               placeholder="https://instagram.com/yourhandle"
// // //             />
// // //           </div>
// // //         </div>

// // //         {/* ── Actions ────────────────────────────────────────────────── */}
// // //         <div className="flex gap-3 pt-2">
// // //           <Button onClick={handleSave} disabled={isSaving} className="flex-1">
// // //             {isSaving ? (
// // //               <span className="flex items-center justify-center gap-2">
// // //                 <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
// // //                 Saving...
// // //               </span>
// // //             ) : (
// // //               'Save Changes'
// // //             )}
// // //           </Button>
// // //           <Button variant="outline" onClick={handleClose} disabled={isSaving} className="flex-1">
// // //             Cancel
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </Modal>
// // //   );
// // // }

// // // features/user/components/ui/EditProfileModal.tsx
// // //
// // // ✅ ENHANCED: Real-time app-wide profile sync via cache invalidation

// // import { Icon } from '@iconify/react';
// // import { useEffect, useState } from 'react';
// // import { useQueryClient } from '@tanstack/react-query';
// // import { Modal } from '@/shared/components/ui/Modal';
// // import { FormInput } from '@/shared/components/ui/input/FormInput';
// // import Button from '@/shared/components/ui/Button';
// // import { toast } from '@/shared/components/ui/Toast';
// // import type {
// //   AuthSessionUser,
// //   PrivacySettings,
// //   FieldVisibility,
// // } from '@/features/authentication/types/auth.types';
// // import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
// // import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// // import { userService } from '@/features/user/services/user.service';
// // import { SelectInput } from '@/shared/components/ui/SelectInput';
// // import { FieldWithPrivacy } from './FieldWithPrivacy';
// // import { PrivacyToggle } from './PrivacyToggle';
// // import {
// //   areaOptions,
// //   employmentStatusOptions,
// //   industrySectorOptions,
// //   occupationOptions,
// //   yearsOfExperienceOptions,
// // } from '@/features/authentication/constants/profileOptions';

// // interface Props {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   currentUser: AuthSessionUser | null;
// // }

// // interface FormState {
// //   alternativePhone: string;
// //   birthDate: string;
// //   residentialAddress: string;
// //   area: string;
// //   city: string;
// //   employmentStatus: string;
// //   occupation: string;
// //   industrySector: string;
// //   yearsOfExperience: string;
// //   isVolunteer: string;
// //   linkedin: string;
// //   twitter: string;
// //   instagram: string;
// // }

// // function resolveYearsOfExperience(years: number | undefined): string {
// //   if (years == null) return '';
// //   const match = [...yearsOfExperienceOptions].reverse().find((o) => o.value <= years);
// //   return match ? String(match.value) : String(yearsOfExperienceOptions[0].value);
// // }

// // function toFormState(user: AuthSessionUser | null): FormState {
// //   return {
// //     alternativePhone: user?.alternativePhone ?? '',
// //     birthDate: user?.birthDate ?? '',
// //     residentialAddress: user?.residentialAddress ?? '',
// //     area: user?.area ?? '',
// //     city: user?.city ?? '',
// //     employmentStatus: user?.employmentStatus ?? '',
// //     occupation: user?.occupations?.[0] ?? '',
// //     industrySector: user?.industrySectors?.[0] ?? '',
// //     yearsOfExperience: resolveYearsOfExperience(user?.yearsOfExperience),
// //     isVolunteer: user?.isVolunteer === true ? 'yes' : user?.isVolunteer === false ? 'no' : '',
// //     linkedin: user?.linkedin ?? '',
// //     twitter: user?.twitter ?? '',
// //     instagram: user?.instagram ?? '',
// //   };
// // }

// // const yearsOfExperienceSelectOptions = yearsOfExperienceOptions.map((o) => ({
// //   label: o.label,
// //   value: String(o.value),
// // }));

// // export default function EditProfileModal({ isOpen, onClose, currentUser }: Props) {
// //   // ✅ NEW: Query client for cache invalidation
// //   const queryClient = useQueryClient();
// //   const updateUser = useAuthStore((state) => state.updateUser);

// //   const [form, setForm] = useState<FormState>(() => toFormState(currentUser));
// //   const [photoFile, setPhotoFile] = useState<File | null>(null);
// //   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
// //   const [isSaving, setIsSaving] = useState(false);
// //   const [privacy, setPrivacy] = useState<PrivacySettings>(() => ({
// //     ...defaultPrivacySettings,
// //     ...currentUser?.privacy,
// //   }));

// //   const updatePrivacy = (field: keyof PrivacySettings, value: FieldVisibility) =>
// //     setPrivacy((prev) => ({ ...prev, [field]: value }));

// //   useEffect(() => {
// //     if (isOpen) {
// //       setForm(toFormState(currentUser));
// //       setPhotoFile(null);
// //       setPhotoPreview(null);
// //       setPrivacy({ ...defaultPrivacySettings, ...currentUser?.privacy });
// //     }
// //   }, [currentUser, isOpen]);

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
// //   ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

// //   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     setPhotoFile(file);

// //     const reader = new FileReader();
// //     reader.onload = () => setPhotoPreview(reader.result as string);
// //     reader.readAsDataURL(file);
// //   };

// //   const handleSave = async () => {
// //     if (!currentUser?.id) return;
// //     setIsSaving(true);

// //     const updates: Partial<AuthSessionUser> = {
// //       alternativePhone: form.alternativePhone || undefined,
// //       birthDate: form.birthDate || undefined,
// //       residentialAddress: form.residentialAddress || undefined,
// //       area: form.area || undefined,
// //       city: form.city || undefined,
// //       employmentStatus: form.employmentStatus || undefined,
// //       occupations: form.occupation ? [form.occupation] : undefined,
// //       industrySectors: form.industrySector ? [form.industrySector] : undefined,
// //       yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
// //       isVolunteer:
// //         form.isVolunteer === 'yes' ? true : form.isVolunteer === 'no' ? false : undefined,
// //       linkedin: form.linkedin || undefined,
// //       twitter: form.twitter || undefined,
// //       instagram: form.instagram || undefined,
// //     };

// //     try {
// //       const updatedFromBackend = await userService.updateProfile({
// //         userId: currentUser.id,
// //         updates,
// //         photoFile: photoFile ?? undefined,
// //       });

// //       console.log('📥 Backend response:', updatedFromBackend);

// //       const mergedUpdate: Partial<AuthSessionUser> = {
// //         ...updatedFromBackend,
// //         privacy,
// //       };

// //       // If we uploaded a new photo but backend hasn't returned URL yet,
// //       // use the preview temporarily so UI doesn't go blank
// //       if (photoPreview && !updatedFromBackend.photo) {
// //         mergedUpdate.photo = photoPreview;
// //       }

// //       console.log('🔄 Updating user with:', mergedUpdate);

// //       // ═══════════════════════════════════════════════════════════════════
// //       // ✅ CRITICAL: App-wide real-time sync
// //       // ═══════════════════════════════════════════════════════════════════

// //       // 1. Update auth store (local state)
// //       updateUser(mergedUpdate);

// //       // 2. Invalidate ALL React Query caches
// //       //    This forces fresh data fetch in ALL components
// //       queryClient.invalidateQueries({ queryKey: ['alumni'] });
// //       queryClient.invalidateQueries({ queryKey: ['user'] });
// //       queryClient.invalidateQueries({ queryKey: ['marketplace'] });
// //       queryClient.invalidateQueries({ queryKey: ['events'] });
// //       queryClient.invalidateQueries({ queryKey: ['news'] });

// //       console.log('✅ Caches invalidated - app will refresh everywhere');

// //       toast.success('Your profile has been updated.');

// //       // Clear photo states after successful save
// //       setPhotoFile(null);
// //       setPhotoPreview(null);

// //       onClose();
// //     } catch (error: any) {
// //       console.error('❌ Profile update error:', error);
// //       toast.fromError(error);
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   const handleClose = () => {
// //     setPhotoFile(null);
// //     setPhotoPreview(null);
// //     setForm(toFormState(currentUser));
// //     setPrivacy({ ...defaultPrivacySettings, ...currentUser?.privacy });
// //     onClose();
// //   };

// //   const displayPhoto = photoPreview ?? currentUser?.photo ?? null;

// //   return (
// //     <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
// //       <div className="flex flex-col gap-6">
// //         {/* ── Photo ────────────────────────────────────────────────────── */}
// //         <div className="flex items-start justify-between gap-4">
// //           <div className="flex items-center gap-4">
// //             <div className="relative flex-shrink-0">
// //               <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center">
// //                 {displayPhoto ? (
// //                   <img
// //                     src={displayPhoto}
// //                     alt={currentUser?.fullName}
// //                     className="w-full h-full object-cover"
// //                     onError={(e) => {
// //                       e.currentTarget.style.display = 'none';
// //                       const parent = e.currentTarget.parentElement;
// //                       if (parent) {
// //                         parent.innerHTML = `<span class="text-xl font-bold text-primary-400">${currentUser?.avatarInitials || 'U'}</span>`;
// //                       }
// //                     }}
// //                   />
// //                 ) : (
// //                   <span className="text-xl font-bold text-primary-400">
// //                     {currentUser?.avatarInitials}
// //                   </span>
// //                 )}
// //               </div>
// //               <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer shadow transition-colors">
// //                 <Icon icon="mdi:camera" className="w-3.5 h-3.5 text-white" />
// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   onChange={handlePhotoChange}
// //                   className="hidden"
// //                 />
// //               </label>
// //             </div>
// //             <div>
// //               <p className="text-sm font-semibold text-gray-800">{currentUser?.fullName}</p>
// //               <p className="text-xs text-gray-400">{currentUser?.email}</p>
// //               <p className="text-xs text-gray-400 mt-0.5">Class of {currentUser?.graduationYear}</p>
// //               {photoPreview && (
// //                 <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
// //                   <Icon icon="mdi:check-circle" className="w-3 h-3" />
// //                   New photo selected
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //           <div className="flex flex-col gap-1">
// //             <p className="text-xs text-gray-500">Photo visibility</p>
// //             <PrivacyToggle
// //               value={privacy.photo}
// //               onChange={(value) => updatePrivacy('photo', value)}
// //             />
// //           </div>
// //         </div>

// //         <hr className="border-gray-100" />

// //         {/* ── Contact ──────────────────────────────────────────────────── */}
// //         <div>
// //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// //             Contact
// //           </p>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <FieldWithPrivacy
// //               field="alternativePhone"
// //               label="Alternative Phone"
// //               privacy={privacy}
// //               onPrivacyChange={updatePrivacy}
// //             >
// //               <FormInput
// //                 name="alternativePhone"
// //                 value={form.alternativePhone}
// //                 onChange={handleChange}
// //                 placeholder="+234 000 000 0000"
// //               />
// //             </FieldWithPrivacy>
// //             <FieldWithPrivacy
// //               field="birthDate"
// //               label="Date of Birth"
// //               privacy={privacy}
// //               onPrivacyChange={updatePrivacy}
// //             >
// //               <FormInput
// //                 name="birthDate"
// //                 type="date"
// //                 value={form.birthDate}
// //                 onChange={handleChange}
// //               />
// //             </FieldWithPrivacy>
// //           </div>
// //         </div>

// //         {/* ── Address ──────────────────────────────────────────────────── */}
// //         <div>
// //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// //             Address
// //           </p>
// //           <div className="flex flex-col gap-4">
// //             <FieldWithPrivacy
// //               field="residentialAddress"
// //               label="Residential Address"
// //               privacy={privacy}
// //               onPrivacyChange={updatePrivacy}
// //             >
// //               <FormInput
// //                 name="residentialAddress"
// //                 value={form.residentialAddress}
// //                 onChange={handleChange}
// //                 placeholder="Street address"
// //               />
// //             </FieldWithPrivacy>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //               <FieldWithPrivacy
// //                 field="area"
// //                 label="Area"
// //                 privacy={privacy}
// //                 onPrivacyChange={updatePrivacy}
// //               >
// //                 <SelectInput
// //                   name="area"
// //                   value={form.area}
// //                   onChange={handleChange}
// //                   options={areaOptions}
// //                   placeholder="Select area"
// //                 />
// //               </FieldWithPrivacy>
// //               <FieldWithPrivacy
// //                 field="city"
// //                 label="City"
// //                 privacy={privacy}
// //                 onPrivacyChange={updatePrivacy}
// //               >
// //                 <FormInput
// //                   name="city"
// //                   value={form.city}
// //                   onChange={handleChange}
// //                   placeholder="e.g. Lagos"
// //                 />
// //               </FieldWithPrivacy>
// //             </div>
// //           </div>
// //         </div>

// //         {/* ── Work ─────────────────────────────────────────────────────── */}
// //         <div>
// //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Work</p>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <FieldWithPrivacy
// //               field="employmentStatus"
// //               label="Employment Status"
// //               privacy={privacy}
// //               onPrivacyChange={updatePrivacy}
// //             >
// //               <SelectInput
// //                 name="employmentStatus"
// //                 value={form.employmentStatus}
// //                 onChange={handleChange}
// //                 options={employmentStatusOptions}
// //                 placeholder="Select status"
// //               />
// //             </FieldWithPrivacy>
// //             <FieldWithPrivacy
// //               field="occupations"
// //               label="Occupation"
// //               privacy={privacy}
// //               onPrivacyChange={updatePrivacy}
// //             >
// //               <SelectInput
// //                 name="occupation"
// //                 value={form.occupation}
// //                 onChange={handleChange}
// //                 options={occupationOptions}
// //                 placeholder="Select occupation"
// //               />
// //             </FieldWithPrivacy>
// //             <FieldWithPrivacy
// //               field="industrySectors"
// //               label="Industry Sector"
// //               privacy={privacy}
// //               onPrivacyChange={updatePrivacy}
// //             >
// //               <SelectInput
// //                 name="industrySector"
// //                 value={form.industrySector}
// //                 onChange={handleChange}
// //                 options={industrySectorOptions}
// //                 placeholder="Select sector"
// //               />
// //             </FieldWithPrivacy>
// //             <FieldWithPrivacy
// //               field="yearsOfExperience"
// //               label="Years of Experience"
// //               privacy={privacy}
// //               onPrivacyChange={updatePrivacy}
// //             >
// //               <SelectInput
// //                 name="yearsOfExperience"
// //                 value={form.yearsOfExperience}
// //                 onChange={handleChange}
// //                 options={yearsOfExperienceSelectOptions}
// //                 placeholder="Select range"
// //               />
// //             </FieldWithPrivacy>
// //             <SelectInput
// //               label="Volunteer Interest"
// //               name="isVolunteer"
// //               value={form.isVolunteer}
// //               onChange={handleChange}
// //               options={[
// //                 { label: 'Yes, I am interested', value: 'yes' },
// //                 { label: 'No, not at this time', value: 'no' },
// //               ]}
// //               placeholder="Are you a volunteer?"
// //             />
// //           </div>
// //         </div>

// //         {/* ── Social Links ─────────────────────────────────────────────── */}
// //         <div>
// //           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
// //             Social Links
// //           </p>
// //           <div className="space-y-3">
// //             <FormInput
// //               label="LinkedIn"
// //               name="linkedin"
// //               value={form.linkedin}
// //               onChange={handleChange}
// //               placeholder="https://linkedin.com/in/yourname"
// //             />
// //             <FormInput
// //               label="Twitter / X"
// //               name="twitter"
// //               value={form.twitter}
// //               onChange={handleChange}
// //               placeholder="https://twitter.com/yourhandle"
// //             />
// //             <FormInput
// //               label="Instagram"
// //               name="instagram"
// //               value={form.instagram}
// //               onChange={handleChange}
// //               placeholder="https://instagram.com/yourhandle"
// //             />
// //           </div>
// //         </div>

// //         {/* ── Actions ──────────────────────────────────────────────────── */}
// //         <div className="flex gap-3 pt-2">
// //           <Button onClick={handleSave} disabled={isSaving} className="flex-1">
// //             {isSaving ? (
// //               <span className="flex items-center justify-center gap-2">
// //                 <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
// //                 Saving...
// //               </span>
// //             ) : (
// //               'Save Changes'
// //             )}
// //           </Button>
// //           <Button variant="outline" onClick={handleClose} disabled={isSaving} className="flex-1">
// //             Cancel
// //           </Button>
// //         </div>
// //       </div>
// //     </Modal>
// //   );
// // }

// /**
//  * ============================================================================
//  * EDIT PROFILE MODAL - COMPLETE VERSION
//  * ============================================================================
//  *
//  * Features:
//  * - ALL fields from registration
//  * - Partial updates (only changed fields sent to backend)
//  * - Real-time privacy from backend
//  * - Optimistic privacy toggle updates
//  * - App-wide sync via cache invalidation
//  * - Photo upload
//  *
//  * ============================================================================
//  */

// import { Icon } from '@iconify/react';
// import { useEffect, useState, useMemo } from 'react';
// import { useQueryClient } from '@tanstack/react-query';
// import { Modal } from '@/shared/components/ui/Modal';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import Button from '@/shared/components/ui/Button';
// import { toast } from '@/shared/components/ui/Toast';
// import type {
//   AuthSessionUser,
//   PrivacySettings,
//   FieldVisibility,
// } from '@/features/authentication/types/auth.types';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { userService } from '@/features/user/services/user.service';
// import { SelectInput } from '@/shared/components/ui/SelectInput';
// import { FieldWithPrivacy } from './FieldWithPrivacy';
// import { usePrivacySettings } from '@/features/user/hooks/usePrivacySettings';
// import {
//   areaOptions,
//   employmentStatusOptions,
//   industrySectorOptions,
//   occupationOptions,
//   yearsOfExperienceOptions,
//   houseColorOptions,
// } from '@/features/authentication/constants/profileOptions';
// import { TextareaInput } from '@/shared/components/ui/TextAreaInput';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   currentUser: AuthSessionUser | null;
// }

// interface FormState {
//   // Basic Info
//   firstName: string;
//   lastName: string;
//   nameInSchool: string;
//   whatsappPhone: string;
//   alternativePhone: string;
//   birthDate: string;
//   bio: string;

//   // School
//   graduationYear: string;
//   houseColor: string;

//   // Address
//   residentialAddress: string;
//   area: string;
//   city: string;

//   // Professional
//   employmentStatus: string;
//   occupation: string;
//   industrySector: string;
//   yearsOfExperience: string;
//   company: string;
//   position: string;

//   // Other
//   isVolunteer: string;

//   // Social
//   linkedin: string;
//   twitter: string;
//   instagram: string;
// }

// function resolveYearsOfExperience(years: number | undefined): string {
//   if (years == null) return '';
//   const match = [...yearsOfExperienceOptions].reverse().find((o) => o.value <= years);
//   return match ? String(match.value) : String(yearsOfExperienceOptions[0].value);
// }

// function toFormState(user: AuthSessionUser | null): FormState {
//   return {
//     firstName: user?.otherNames ?? '',
//     lastName: user?.surname ?? '',
//     nameInSchool: user?.nameInSchool ?? '',
//     whatsappPhone: user?.whatsappPhone ?? '',
//     alternativePhone: user?.alternativePhone ?? '',
//     birthDate: user?.birthDate ?? '',
//     bio: '', // TODO: Add bio field to AuthSessionUser type

//     graduationYear: user?.graduationYear ? String(user.graduationYear) : '',
//     houseColor: user?.houseColor ?? '',

//     residentialAddress: user?.residentialAddress ?? '',
//     area: user?.area ?? '',
//     city: user?.city ?? '',

//     employmentStatus: user?.employmentStatus ?? '',
//     occupation: user?.occupations?.[0] ?? '',
//     industrySector: user?.industrySectors?.[0] ?? '',
//     yearsOfExperience: resolveYearsOfExperience(user?.yearsOfExperience),
//     company: user?.company ?? '',
//     position: user?.position ?? '',

//     isVolunteer: user?.isVolunteer === true ? 'yes' : user?.isVolunteer === false ? 'no' : '',

//     linkedin: user?.linkedin ?? '',
//     twitter: user?.twitter ?? '',
//     instagram: user?.instagram ?? '',
//   };
// }

// const yearsOfExperienceSelectOptions = yearsOfExperienceOptions.map((o) => ({
//   label: o.label,
//   value: String(o.value),
// }));

// export default function EditProfileModal({ isOpen, onClose, currentUser }: Props) {
//   const queryClient = useQueryClient();
//   const updateUser = useAuthStore((state) => state.updateUser);

//   // ✅ Real privacy from backend
//   const { data: privacy, isLoading: privacyLoading } = usePrivacySettings();

//   const [form, setForm] = useState<FormState>(() => toFormState(currentUser));
//   const [initialForm, setInitialForm] = useState<FormState>(() => toFormState(currentUser));
//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       const formState = toFormState(currentUser);
//       setForm(formState);
//       setInitialForm(formState);
//       setPhotoFile(null);
//       setPhotoPreview(null);
//     }
//   }, [currentUser, isOpen]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
//   ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setPhotoFile(file);

//     const reader = new FileReader();
//     reader.onload = () => setPhotoPreview(reader.result as string);
//     reader.readAsDataURL(file);
//   };

//   // ═══════════════════════════════════════════════════════════════════════
//   // ✅ PARTIAL UPDATE: Only send changed fields
//   // ═══════════════════════════════════════════════════════════════════════
//   const changedFields = useMemo(() => {
//     const changes: Partial<AuthSessionUser> = {};

//     if (form.firstName !== initialForm.firstName) changes.otherNames = form.firstName || undefined;
//     if (form.lastName !== initialForm.lastName) changes.surname = form.lastName || undefined;
//     if (form.nameInSchool !== initialForm.nameInSchool) changes.nameInSchool = form.nameInSchool || undefined;
//     if (form.whatsappPhone !== initialForm.whatsappPhone) changes.whatsappPhone = form.whatsappPhone || undefined;
//     if (form.alternativePhone !== initialForm.alternativePhone) changes.alternativePhone = form.alternativePhone || undefined;
//     if (form.birthDate !== initialForm.birthDate) changes.birthDate = form.birthDate || undefined;

//     if (form.graduationYear !== initialForm.graduationYear) {
//       changes.graduationYear = form.graduationYear ? Number(form.graduationYear) : undefined;
//     }
//     if (form.houseColor !== initialForm.houseColor) changes.houseColor = form.houseColor || undefined;

//     if (form.residentialAddress !== initialForm.residentialAddress) {
//       changes.residentialAddress = form.residentialAddress || undefined;
//     }
//     if (form.area !== initialForm.area) changes.area = form.area || undefined;
//     if (form.city !== initialForm.city) changes.city = form.city || undefined;

//     if (form.employmentStatus !== initialForm.employmentStatus) {
//       changes.employmentStatus = form.employmentStatus || undefined;
//     }
//     if (form.occupation !== initialForm.occupation) {
//       changes.occupations = form.occupation ? [form.occupation] : undefined;
//     }
//     if (form.industrySector !== initialForm.industrySector) {
//       changes.industrySectors = form.industrySector ? [form.industrySector] : undefined;
//     }
//     if (form.yearsOfExperience !== initialForm.yearsOfExperience) {
//       changes.yearsOfExperience = form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined;
//     }
//     if (form.company !== initialForm.company) changes.company = form.company || undefined;
//     if (form.position !== initialForm.position) changes.position = form.position || undefined;

//     if (form.isVolunteer !== initialForm.isVolunteer) {
//       changes.isVolunteer =
//         form.isVolunteer === 'yes' ? true : form.isVolunteer === 'no' ? false : undefined;
//     }

//     if (form.linkedin !== initialForm.linkedin) changes.linkedin = form.linkedin || undefined;
//     if (form.twitter !== initialForm.twitter) changes.twitter = form.twitter || undefined;
//     if (form.instagram !== initialForm.instagram) changes.instagram = form.instagram || undefined;

//     return changes;
//   }, [form, initialForm]);

//   const hasChanges = Object.keys(changedFields).length > 0 || photoFile !== null;

//   const handleSave = async () => {
//     if (!currentUser?.id) return;

//     // ✅ Don't send if no changes
//     if (!hasChanges) {
//       toast.info('No changes to save');
//       return;
//     }

//     setIsSaving(true);

//     try {
//       console.log('📤 Sending only changed fields:', changedFields);

//       const updatedFromBackend = await userService.updateProfile({
//         userId: currentUser.id,
//         updates: changedFields, // ✅ Only changed fields!
//         photoFile: photoFile ?? undefined,
//       });

//       console.log('📥 Backend response:', updatedFromBackend);

//       const mergedUpdate: Partial<AuthSessionUser> = {
//         ...updatedFromBackend,
//         privacy, // Keep privacy from backend
//       };

//       // If we uploaded a new photo but backend hasn't returned URL yet,
//       // use the preview temporarily
//       if (photoPreview && !updatedFromBackend.photo) {
//         mergedUpdate.photo = photoPreview;
//       }

//       console.log('🔄 Updating user with:', mergedUpdate);

//       // Update auth store
//       updateUser(mergedUpdate);

//       // ✅ Invalidate caches for app-wide sync
//       queryClient.invalidateQueries({ queryKey: ['alumni'] });
//       queryClient.invalidateQueries({ queryKey: ['user'] });
//       queryClient.invalidateQueries({ queryKey: ['marketplace'] });
//       queryClient.invalidateQueries({ queryKey: ['events'] });

//       console.log('✅ Caches invalidated - app will refresh everywhere');

//       toast.success('Your profile has been updated.');

//       setPhotoFile(null);
//       setPhotoPreview(null);

//       onClose();
//     } catch (error: any) {
//       console.error('❌ Profile update error:', error);
//       toast.fromError(error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleClose = () => {
//     setPhotoFile(null);
//     setPhotoPreview(null);
//     setForm(toFormState(currentUser));
//     setInitialForm(toFormState(currentUser));
//     onClose();
//   };

//   const displayPhoto = photoPreview ?? currentUser?.photo ?? null;

//   if (privacyLoading) {
//     return (
//       <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
//         <div className="py-12 flex items-center justify-center">
//           <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-primary-500" />
//         </div>
//       </Modal>
//     );
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
//       <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
//         {/* ── Photo ────────────────────────────────────────────────────── */}
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="relative flex-shrink-0">
//               <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center">
//                 {displayPhoto ? (
//                   <img
//                     src={displayPhoto}
//                     alt={currentUser?.fullName}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.style.display = 'none';
//                       const parent = e.currentTarget.parentElement;
//                       if (parent) {
//                         parent.innerHTML = `<span class="text-xl font-bold text-primary-400">${currentUser?.avatarInitials || 'U'}</span>`;
//                       }
//                     }}
//                   />
//                 ) : (
//                   <span className="text-xl font-bold text-primary-400">
//                     {currentUser?.avatarInitials}
//                   </span>
//                 )}
//               </div>
//               <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center cursor-pointer shadow transition-colors">
//                 <Icon icon="mdi:camera" className="w-3.5 h-3.5 text-white" />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handlePhotoChange}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-800">{currentUser?.fullName}</p>
//               <p className="text-xs text-gray-400">{currentUser?.email}</p>
//               <p className="text-xs text-gray-400 mt-0.5">Class of {currentUser?.graduationYear}</p>
//               {photoPreview && (
//                 <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//                   <Icon icon="mdi:check-circle" className="w-3 h-3" />
//                   New photo selected
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex flex-col gap-1">
//             <p className="text-xs text-gray-500">Photo visibility</p>
//             <FieldWithPrivacy
//               field="photo"
//               privacy={privacy!}
//               onPrivacyChange={() => { }} // Privacy handled by optimistic hook
//               hideLabel
//             />
//           </div>
//         </div>

//         <hr className="border-gray-100" />

//         {/* ── Basic Information ────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//             Basic Information
//           </p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <FormInput
//               label="First Name"
//               name="firstName"
//               value={form.firstName}
//               onChange={handleChange}
//               required
//             />
//             <FormInput
//               label="Last Name"
//               name="lastName"
//               value={form.lastName}
//               onChange={handleChange}
//               required
//             />
//             <FormInput
//               label="Name in School"
//               name="nameInSchool"
//               value={form.nameInSchool}
//               onChange={handleChange}
//               placeholder="If different from current name"
//             />
//             <FormInput
//               label="Graduation Year"
//               name="graduationYear"
//               type="number"
//               value={form.graduationYear}
//               onChange={handleChange}
//               required
//             />
//             <SelectInput
//               label="House Color"
//               name="houseColor"
//               value={form.houseColor}
//               onChange={handleChange}
//               options={houseColorOptions}
//               placeholder="Select house"
//             />
//           </div>

//           <div className="mt-4">
//             <TextareaInput
//               label="Bio"
//               name="bio"
//               rows={5}
//               placeholder="Tell us about yourself..."
//               value={form.bio}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* ── Contact ──────────────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//             Contact
//           </p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <FieldWithPrivacy
//               field="whatsappPhone"
//               label="WhatsApp Phone"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <FormInput
//                 name="whatsappPhone"
//                 value={form.whatsappPhone}
//                 onChange={handleChange}
//                 placeholder="+234 000 000 0000"
//                 required
//               />
//             </FieldWithPrivacy>
//             <FieldWithPrivacy
//               field="alternativePhone"
//               label="Alternative Phone"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <FormInput
//                 name="alternativePhone"
//                 value={form.alternativePhone}
//                 onChange={handleChange}
//                 placeholder="+234 000 000 0000"
//               />
//             </FieldWithPrivacy>
//             <FieldWithPrivacy
//               field="birthDate"
//               label="Date of Birth"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <FormInput
//                 name="birthDate"
//                 type="date"
//                 value={form.birthDate}
//                 onChange={handleChange}
//               />
//             </FieldWithPrivacy>
//           </div>
//         </div>

//         {/* ── Address ──────────────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//             Address
//           </p>
//           <div className="flex flex-col gap-4">
//             <FieldWithPrivacy
//               field="residentialAddress"
//               label="Residential Address"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <FormInput
//                 name="residentialAddress"
//                 value={form.residentialAddress}
//                 onChange={handleChange}
//                 placeholder="Street address"
//               />
//             </FieldWithPrivacy>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FieldWithPrivacy
//                 field="area"
//                 label="Area"
//                 privacy={privacy!}
//                 onPrivacyChange={() => { }}
//               >
//                 <SelectInput
//                   name="area"
//                   value={form.area}
//                   onChange={handleChange}
//                   options={areaOptions}
//                   placeholder="Select area"
//                 />
//               </FieldWithPrivacy>
//               <FieldWithPrivacy
//                 field="city"
//                 label="City"
//                 privacy={privacy!}
//                 onPrivacyChange={() => { }}
//               >
//                 <FormInput
//                   name="city"
//                   value={form.city}
//                   onChange={handleChange}
//                   placeholder="e.g. Lagos"
//                 />
//               </FieldWithPrivacy>
//             </div>
//           </div>
//         </div>

//         {/* ── Professional ─────────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//             Professional Information
//           </p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <FieldWithPrivacy
//               field="employmentStatus"
//               label="Employment Status"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <SelectInput
//                 name="employmentStatus"
//                 value={form.employmentStatus}
//                 onChange={handleChange}
//                 options={employmentStatusOptions}
//                 placeholder="Select status"
//               />
//             </FieldWithPrivacy>
//             <FieldWithPrivacy
//               field="occupations"
//               label="Occupation"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <SelectInput
//                 name="occupation"
//                 value={form.occupation}
//                 onChange={handleChange}
//                 options={occupationOptions}
//                 placeholder="Select occupation"
//               />
//             </FieldWithPrivacy>
//             <FieldWithPrivacy
//               field="industrySectors"
//               label="Industry Sector"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <SelectInput
//                 name="industrySector"
//                 value={form.industrySector}
//                 onChange={handleChange}
//                 options={industrySectorOptions}
//                 placeholder="Select sector"
//               />
//             </FieldWithPrivacy>
//             <FieldWithPrivacy
//               field="yearsOfExperience"
//               label="Years of Experience"
//               privacy={privacy!}
//               onPrivacyChange={() => { }}
//             >
//               <SelectInput
//                 name="yearsOfExperience"
//                 value={form.yearsOfExperience}
//                 onChange={handleChange}
//                 options={yearsOfExperienceSelectOptions}
//                 placeholder="Select range"
//               />
//             </FieldWithPrivacy>
//             <FormInput
//               label="Current Company"
//               name="company"
//               value={form.company}
//               onChange={handleChange}
//               placeholder="Company name"
//             />
//             <FormInput
//               label="Current Position"
//               name="position"
//               value={form.position}
//               onChange={handleChange}
//               placeholder="Job title"
//             />
//             <SelectInput
//               label="Volunteer Interest"
//               name="isVolunteer"
//               value={form.isVolunteer}
//               onChange={handleChange}
//               options={[
//                 { label: 'Yes, I am interested', value: 'yes' },
//                 { label: 'No, not at this time', value: 'no' },
//               ]}
//               placeholder="Are you a volunteer?"
//             />
//           </div>
//         </div>

//         {/* ── Social Links ─────────────────────────────────────────────── */}
//         <div>
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
//             Social Links
//           </p>
//           <div className="space-y-3">
//             <FormInput
//               label="LinkedIn"
//               name="linkedin"
//               value={form.linkedin}
//               onChange={handleChange}
//               placeholder="https://linkedin.com/in/yourname"
//             />
//             <FormInput
//               label="Twitter / X"
//               name="twitter"
//               value={form.twitter}
//               onChange={handleChange}
//               placeholder="https://twitter.com/yourhandle"
//             />
//             <FormInput
//               label="Instagram"
//               name="instagram"
//               value={form.instagram}
//               onChange={handleChange}
//               placeholder="https://instagram.com/yourhandle"
//             />
//           </div>
//         </div>

//         {/* ── Actions ──────────────────────────────────────────────────── */}
//         <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-2 border-t border-gray-100 mt-4">
//           <Button
//             onClick={handleSave}
//             disabled={isSaving || !hasChanges}
//             className="flex-1"
//           >
//             {isSaving ? (
//               <span className="flex items-center justify-center gap-2">
//                 <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//                 Saving...
//               </span>
//             ) : (
//               `Save Changes${hasChanges ? ` (${Object.keys(changedFields).length})` : ''}`
//             )}
//           </Button>
//           <Button variant="outline" onClick={handleClose} disabled={isSaving} className="flex-1">
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

/**
 * ============================================================================
 * EDIT PROFILE MODAL - CLEAN PARTIAL UPDATES
 * ============================================================================
 *
 * Features:
 * - Only sends ACTUALLY CHANGED fields
 * - No undefined values in payload
 * - Fields completely excluded if not changed
 * - Real-time privacy from backend
 * - Optimistic privacy toggle updates
 * - App-wide sync via cache invalidation
 *
 * ============================================================================
 */

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
      console.log('📤 Payload (only changed fields, no undefined):', changedFields);
      console.log('📤 Field count:', Object.keys(changedFields).length);

      const updatedFromBackend = await userService.updateProfile({
        userId: currentUser.id,
        updates: changedFields,
        photoFile: photoFile ?? undefined,
      });

      console.log('📥 Backend response:', updatedFromBackend);

      const mergedUpdate: Partial<AuthSessionUser> = {
        ...updatedFromBackend,
        privacy,
      };

      if (photoPreview && !updatedFromBackend.photo) {
        mergedUpdate.photo = photoPreview;
      }

      console.log('🔄 Updating user with:', mergedUpdate);

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

      console.log('✅ Caches invalidated');

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
