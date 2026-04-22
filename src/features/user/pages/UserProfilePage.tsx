// features/user/pages/UserProfilePage.tsx
// Route: /user/profile  (ProtectedRoute)
// NEW DESIGN: Sidebar (ProfileCard) + right column (ProfileInfoPanel)
// Edit Profile now links to dedicated page instead of modal.

import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SEO } from '@/shared/common/SEO';
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '../routes';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { ProfileSkeleton } from '../components/ProfileSkeleton';
import { ProfileCard, type SocialLink } from '../components/ui/ProfileCard';
import { ProfileInfoPanel } from '../components/ui/ProfileInfoPanel';
import {
  employmentStatusOptions,
  industrySectorOptions,
  occupationOptions,
} from '@/features/authentication/constants/profileOptions';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Dashboard', href: USER_ROUTES.DASHBOARD },
  { label: 'My Profile' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserProfilePage() {
  const { data: currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <>
        <SEO title="My Profile" />
        <Breadcrumbs items={breadcrumbItems} />
        <section className="section py-8">
          <div className="container-custom">
            <ProfileSkeleton />
          </div>
        </section>
      </>
    );
  }

  // ── Derived display values ─────────────────────────────────────────────────
  const occupationLabel = resolveLabel(currentUser?.occupations?.[0], occupationOptions);
  const employmentLabel = resolveLabel(currentUser?.employmentStatus, employmentStatusOptions);
  const industrySectorLabel = resolveLabel(
    currentUser?.industrySectors?.[0],
    industrySectorOptions,
  );

  const positionLine =
    [
      currentUser?.position || occupationLabel,
      currentUser?.company ? `at ${currentUser.company}` : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  // Social links for the icon row
  const socials: SocialLink[] = [
    currentUser?.instagram && {
      icon: 'mdi:instagram',
      href: currentUser.instagram,
      label: 'Instagram',
    },
    currentUser?.facebook && {
      icon: 'mdi:facebook',
      href: currentUser.facebook,
      label: 'Facebook',
    },
    currentUser?.twitter && {
      icon: 'ri:twitter-x-fill',
      href: currentUser.twitter,
      label: 'X (Twitter)',
    },
    currentUser?.tiktok && {
      icon: 'ic:baseline-tiktok',
      href: currentUser.tiktok,
      label: 'TikTok',
    },
    currentUser?.linkedin && {
      icon: 'mdi:linkedin',
      href: currentUser.linkedin,
      label: 'LinkedIn',
    },
  ].filter(Boolean) as SocialLink[];

  // Right-column data
  const profileData = {
    bio: currentUser?.bio,
    fullName: currentUser?.fullName,
    maidenName:
      currentUser?.nameInSchool !== currentUser?.fullName ? currentUser?.nameInSchool : undefined,
    nicknameInSchool: currentUser?.nickName,
    email: currentUser?.email,
    whatsapp: currentUser?.whatsappPhone,
    altPhone: currentUser?.alternativePhone,
    dateOfBirth: formatDate(currentUser?.birthDate),
    streetAddress: currentUser?.residentialAddress,
    area: currentUser?.area,
    state: currentUser?.state,
    city: currentUser?.city,
    employmentStatus: employmentLabel,
    occupation: occupationLabel,
    industrySector: industrySectorLabel,
    yearsOfExperience:
      currentUser?.yearsOfExperience !== undefined ? `${currentUser.yearsOfExperience}` : undefined,
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: currentUser?.fullName ?? 'Profile', url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // toast handled by ProfileCard internally if needed
      });
    }
  };

  return (
    <>
      <SEO title="My Profile" description="View and manage your alumni profile." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section bg-gray-100 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* ── Left: sidebar ────────────────────────────────────── */}
            <div className="space-y-4 lg:sticky lg:top-6 h-fit">
              <ProfileCard
                photo={currentUser?.photo}
                fullName={currentUser?.fullName ?? ''}
                maidenName={
                  currentUser?.nameInSchool && currentUser.nameInSchool !== currentUser.fullName
                    ? currentUser.nameInSchool
                    : undefined
                }
                graduationYear={currentUser?.graduationYear}
                positionLine={positionLine}
                city={currentUser?.city}
                isVolunteer={currentUser?.isVolunteer}
                socials={socials}
                mode="owner"
                onShare={handleShare}
              />

              {/* Address card — shown in sidebar as per design */}
              {(currentUser?.residentialAddress || currentUser?.area || currentUser?.city) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Address</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {currentUser?.residentialAddress && (
                      <div className="grid grid-cols-[auto_1fr] gap-x-3">
                        <span className="text-gray-400 whitespace-nowrap">
                          Street Number and Name:
                        </span>
                        <span>{currentUser.residentialAddress}</span>
                      </div>
                    )}
                    {currentUser?.state && (
                      <div className="grid grid-cols-[auto_1fr] gap-x-3">
                        <span className="text-gray-400">State:</span>
                        <span>{currentUser.state}</span>
                      </div>
                    )}
                    {currentUser?.city && (
                      <div className="grid grid-cols-[auto_1fr] gap-x-3">
                        <span className="text-gray-400">City:</span>
                        <span>{currentUser.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: info panels ────────────────────────────────── */}
            <div>
              <ProfileInfoPanel data={profileData} copyable={false} isOwner={true} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
