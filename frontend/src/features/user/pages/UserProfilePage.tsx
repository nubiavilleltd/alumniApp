// features/user/pages/UserProfilePage.tsx

import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SEO } from '@/shared/common/SEO';
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '../routes';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { ProfileSkeleton } from '../components/ProfileSkeleton';
import { ProfileCard, type SocialLink } from '../components/ui/ProfileCard';
import { ProfileInfoPanel } from '../components/ui/ProfileInfoPanel';
import { buildProfileData, isGroupVisible } from '../utils/profileUtils';
import { toast } from '@/shared/components/ui/Toast';
import { ProfileAddressCard } from '../components/ui/ProfileAddressCard';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Dashboard', href: USER_ROUTES.DASHBOARD },
  { label: 'My Profile' },
];

export default function UserProfilePage() {
  const { data: currentUser, isLoading } = useCurrentUser();

  console.log('curr data', { currentUser });

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

  // Owner always sees everything
  const profileData = buildProfileData(currentUser ?? {}, true);

  // Socials for the ProfileCard icon row — owner always sees their own
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

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: currentUser?.fullName ?? 'Profile', url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => toast.success('Profile link copied!'));
    }
  };

  return (
    <>
      <SEO title="My Profile" description="View and manage your alumni profile." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section bg-[#F8F8F7] py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* ── Left: sidebar ─────────────────────────────────────── */}
            <div className="space-y-4 lg:sticky lg:top-6 h-fit">
              <ProfileCard
                photo={currentUser?.photo}
                fullName={currentUser?.fullName ?? ''}
                maidenName={profileData.maidenName}
                graduationYear={currentUser?.graduationYear}
                positionLine={profileData.positionLine}
                city={currentUser?.city}
                isVolunteer={currentUser?.isVolunteer}
                socials={socials}
                mode="owner"
                onShare={handleShare}
              />

              {/* Address sidebar card — owner always sees it */}
              <ProfileAddressCard
                streetAddress={currentUser?.residentialAddress}
                area={currentUser?.area}
                state={currentUser?.state}
                city={currentUser?.city}
                zone={currentUser?.zone}
              />
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
