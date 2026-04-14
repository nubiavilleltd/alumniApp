// features/user/pages/UserProfilePage.tsx
// Route: /user/profile  (ProtectedRoute)

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
import type {
  AuthSessionUser,
  FieldVisibility,
  PrivacySettings,
} from '@/features/authentication/types/auth.types';
import {
  areaOptions,
  employmentStatusOptions,
  industrySectorOptions,
  occupationOptions,
} from '@/features/authentication/constants/profileOptions';
import EditProfileModal from '../components/ui/EditProfileModal';
import { SEO } from '@/shared/common/SEO';
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '../routes';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { mapCurrentUserResponse } from '@/features/authentication/api/adapters/login.adapter';
import { ProfileSkeleton } from '../components/ProfileSkeleton';
import { usePrivacySettings } from '../hooks/usePrivacySettings';
import { NIGERIA_STATES } from '@/features/authentication/constants/nigerianStates';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Dashboard', href: USER_ROUTES.DASHBOARD },
  { label: 'My Profile' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const stateOptions = NIGERIA_STATES.map((state) => ({
  label: state,
  value: state,
}));

function resolveLabel(
  value: string | undefined,
  options: readonly { label: string; value: string }[],
): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label ?? value;
}

function formatDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number;
  icon: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Icon icon={icon} className="w-4 h-4" />
        {label}
      </div>
      <p className={`text-sm font-medium ${value ? 'text-gray-700' : 'text-gray-300 italic'}`}>
        {value ?? 'Not added'}
      </p>
    </div>
  );
}

function FieldRowWithPrivacy({
  label,
  value,
  icon,
  privacy,
}: {
  label: string;
  value?: string | number;
  icon: string;
  privacy: FieldVisibility; // required — no longer optional
}) {
  const isPublic = privacy === 'public';

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Icon icon={icon} className="w-4 h-4" />
        {label}
      </div>
      <div className="flex items-center gap-2">
        <p className={`text-sm font-medium ${value ? 'text-gray-700' : 'text-gray-300 italic'}`}>
          {value ?? 'Not added'}
        </p>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
            isPublic
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-gray-100 text-gray-600 border border-gray-300'
          }`}
          title={isPublic ? 'Visible to everyone' : 'Only visible to you'}
        >
          <Icon icon={isPublic ? 'mdi:eye-outline' : 'mdi:lock'} className="w-3 h-3" />
          {isPublic ? 'Public' : 'Private'}
        </span>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  onEdit,
  children,
}: {
  title: string;
  icon: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Icon icon={icon} className="w-5 h-5 text-primary-400" />
          {title}
        </h2>
        {/* <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary-500 hover:text-primary-600 font-semibold flex items-center gap-1"
        >
          <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
          Edit
        </button> */}
      </div>
      {children}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UserProfilePage() {
  // const currentUser = useAuthStore((state) => state.user);

  const { data: currentUser, isLoading } = useCurrentUser();
  const { data: privacyValue, isLoading: privacyLoading } = usePrivacySettings();

  const [showEdit, setShowEdit] = useState(false);
  const openEdit = () => setShowEdit(true);

  if (isLoading || privacyLoading) {
    return (
      <>
        <SEO title="My Profile" />
        <Breadcrumbs items={breadcrumbItems} />
        <section className="section py-12">
          <div className="container-custom">
            <ProfileSkeleton />
          </div>
        </section>
      </>
    );
  }

  // Always have a complete privacy object — merge stored settings over defaults.
  // This guarantees badges always render even for users who haven't edited yet.
  // const privacy: PrivacySettings = {
  //   ...defaultPrivacySettings,
  //   ...currentUser?.privacy,
  // };
  const privacy: PrivacySettings = privacyValue as PrivacySettings;

  const occupationLabel = resolveLabel(currentUser?.occupations?.[0], occupationOptions);
  const employmentLabel = resolveLabel(currentUser?.employmentStatus, employmentStatusOptions);
  // const areaLabel = resolveLabel(currentUser?.area, areaOptions);
  const stateLabel = resolveLabel(currentUser?.state, areaOptions);

  const locationParts = [stateLabel, currentUser?.city]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <>
      <SEO title="My Profile" description="View and manage your alumni profile." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-12">
        <div className="container-custom">
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* ── Sidebar ────────────────────────────────────────────── */}
            <aside className="space-y-4 lg:col-span-1 h-fit">
              <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-100 bg-primary-50 flex items-center justify-center mb-4">
                    {currentUser?.photo ? (
                      <img
                        src={currentUser.photo}
                        alt={currentUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary-400">
                        {currentUser?.avatarInitials}
                      </span>
                    )}
                  </div>
                  {/* Photo privacy badge — always shown */}
                  <span
                    className={`absolute bottom-3 right-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      privacy?.photo === 'public'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                    title={privacy?.photo === 'public' ? 'Photo is public' : 'Photo is private'}
                  >
                    <Icon
                      icon={privacy?.photo === 'public' ? 'mdi:eye-outline' : 'mdi:lock'}
                      className="w-3 h-3"
                    />
                  </span>
                </div>

                <h1 className="text-lg font-bold text-gray-800">
                  {currentUser?.fullName ?? 'Your Name'}
                </h1>

                {currentUser?.nameInSchool && currentUser.nameInSchool !== currentUser.fullName && (
                  <p className="text-xs text-gray-400 mt-0.5">née {currentUser.nameInSchool}</p>
                )}

                <p className="text-sm text-primary-500 mt-0.5">
                  Class of {currentUser?.graduationYear}
                </p>

                {occupationLabel && (
                  <p className="text-xs text-gray-500 mt-1">
                    {occupationLabel}
                    {employmentLabel ? ` · ${employmentLabel}` : ''}
                  </p>
                )}

                {locationParts.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Icon icon="mdi:map-marker-outline" className="w-3.5 h-3.5" />
                    {locationParts.join(', ')}
                  </p>
                )}

                <button
                  type="button"
                  onClick={openEdit}
                  className="mt-5 w-full flex items-center justify-center gap-2 border border-primary-200 text-primary-500 hover:bg-primary-50 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {currentUser?.isVolunteer && (
                <div className="bg-primary-50 border border-primary-100 rounded-2xl px-4 py-3 flex items-center gap-3">
                  <Icon
                    icon="mdi:hand-heart-outline"
                    className="w-5 h-5 text-primary-500 flex-shrink-0"
                  />
                  <p className="text-sm text-primary-700 font-medium">Volunteer</p>
                </div>
              )}
            </aside>

            {/* ── Main content ───────────────────────────────────────── */}
            <main className="space-y-6 lg:col-span-2">
              {/* About Section */}
              <SectionCard title="About" icon="mdi:information-outline" onEdit={openEdit}>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {currentUser?.bio || 'No bio available.'}
                </p>
              </SectionCard>

              <SectionCard title="Identity" icon="mdi:account-outline" onEdit={openEdit}>
                <div className="divide-y divide-gray-50">
                  <FieldRow
                    label="Full Name"
                    value={currentUser?.fullName}
                    icon="mdi:account-outline"
                  />
                  <FieldRow
                    label="Name in School"
                    value={currentUser?.nameInSchool}
                    icon="mdi:school-outline"
                  />
                  <FieldRow
                    label="Nickname"
                    value={currentUser?.nickName}
                    icon="mdi:school-outline"
                  />
                  <FieldRow label="Email" value={currentUser?.email} icon="mdi:email-outline" />
                  <FieldRowWithPrivacy
                    label="WhatsApp"
                    value={currentUser?.whatsappPhone}
                    icon="mdi:whatsapp"
                    privacy={privacy?.whatsappPhone}
                  />
                  {currentUser?.alternativePhone && (
                    <FieldRowWithPrivacy
                      label="Alt. Phone"
                      value={currentUser.alternativePhone}
                      icon="mdi:phone-outline"
                      privacy={privacy?.alternativePhone}
                    />
                  )}
                  {currentUser?.birthDate && (
                    <FieldRowWithPrivacy
                      label="Date of Birth"
                      value={formatDate(currentUser.birthDate)}
                      icon="mdi:calendar-outline"
                      privacy={privacy.birthDate}
                    />
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Address" icon="mdi:map-marker-outline" onEdit={openEdit}>
                <div className="divide-y divide-gray-50">
                  <FieldRowWithPrivacy
                    label="Residential Address"
                    value={currentUser?.residentialAddress}
                    icon="mdi:home-outline"
                    privacy={privacy.residentialAddress}
                  />
                  {/* <FieldRowWithPrivacy
                    label="Area"
                    value={areaLabel}
                    icon="mdi:map-outline"
                    privacy={privacy.area}
                  /> */}
                  <FieldRowWithPrivacy
                    label="State"
                    value={stateLabel}
                    icon="mdi:map-outline"
                    privacy={privacy.state}
                  />
                  <FieldRowWithPrivacy
                    label="City"
                    value={currentUser?.city}
                    icon="mdi:city-variant-outline"
                    privacy={privacy.city}
                  />
                </div>
              </SectionCard>

              <SectionCard title="Work" icon="mdi:briefcase-outline" onEdit={openEdit}>
                <div className="divide-y divide-gray-50">
                  <FieldRowWithPrivacy
                    label="Employment Status"
                    value={employmentLabel}
                    icon="mdi:briefcase-outline"
                    privacy={privacy.employmentStatus}
                  />
                  <FieldRowWithPrivacy
                    label="Occupation"
                    value={currentUser?.occupations
                      ?.map((o) => resolveLabel(o, occupationOptions))
                      .join(', ')}
                    icon="mdi:account-hard-hat-outline"
                    privacy={privacy.occupations}
                  />
                  <FieldRowWithPrivacy
                    label="Industry Sector"
                    value={currentUser?.industrySectors
                      ?.map((s) => resolveLabel(s, industrySectorOptions))
                      .join(', ')}
                    icon="mdi:domain"
                    privacy={privacy.industrySectors}
                  />
                  <FieldRowWithPrivacy
                    label="Years of Experience"
                    value={
                      currentUser?.yearsOfExperience !== undefined
                        ? `${currentUser.yearsOfExperience} years`
                        : undefined
                    }
                    icon="mdi:chart-timeline-variant"
                    privacy={privacy.yearsOfExperience}
                  />
                </div>
              </SectionCard>

              {(currentUser?.linkedin || currentUser?.twitter || currentUser?.instagram) && (
                <SectionCard title="Social Links" icon="mdi:link-variant" onEdit={openEdit}>
                  <div className="divide-y divide-gray-50">
                    {currentUser.linkedin && (
                      <div className="flex items-center py-3">
                        <a
                          href={currentUser.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <Icon icon="mdi:linkedin" className="w-4 h-4" />
                          LinkedIn
                        </a>
                      </div>
                    )}

                    {currentUser.twitter && (
                      <div className="flex items-center py-3">
                        <a
                          href={currentUser.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <Icon icon="mdi:twitter" className="w-4 h-4" />
                          Twitter / X
                        </a>
                      </div>
                    )}

                    {currentUser.instagram && (
                      <div className="flex items-center py-3">
                        <a
                          href={currentUser.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <Icon icon="mdi:instagram" className="w-4 h-4" />
                          Instagram
                        </a>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}
            </main>
          </div>
        </div>
      </section>

      <EditProfileModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        currentUser={currentUser as AuthSessionUser}
      />
    </>
  );
}
