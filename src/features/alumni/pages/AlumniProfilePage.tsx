// features/alumni/pages/AlumniProfilePage.tsx
// NEW DESIGN: Sidebar (ProfileCard with message button) + right column (ProfileInfoPanel with copy).

import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useAlumnus } from '@/features/alumni/hooks/useAlumni';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SEO } from '@/shared/common/SEO';
import { useStartDirectConversation } from '@/features/messages/hooks/useStartDirectConversation';
import {
  employmentStatusOptions,
  industrySectorOptions,
  occupationOptions,
} from '@/features/authentication/constants/profileOptions';
import { ALUMNI_ROUTES } from '../routes';
import { ROUTES } from '@/shared/constants/routes';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { ProfileCard, type SocialLink } from '@/features/user/components/ui/ProfileCard';
import { ProfileInfoPanel } from '@/features/user/components/ui/ProfileInfoPanel';
import { toast } from '@/shared/components/ui/Toast';

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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <section className="section py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 animate-pulse">
          <div className="bg-white rounded-2xl h-72 shadow-sm" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AlumniProfilePage() {
  const { slug = '' } = useParams();
  const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUser();
  const { startDirectConversation, isPending: isStartingConversation } =
    useStartDirectConversation();
  const { data: alumnus, isLoading, error } = useAlumnus(slug);

  if (isLoading || isLoadingProfile) return <ProfileSkeleton />;

  if (error) {
    return (
      <section className="section">
        <div className="container-custom text-center py-12">
          <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-gray-500 mb-6">There was an error loading this profile.</p>
          <div className="flex gap-3 justify-center">
            <AppLink href={ALUMNI_ROUTES.PROFILES} className="btn btn-primary">
              Browse Directory
            </AppLink>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!alumnus) {
    return (
      <section className="section">
        <div className="container-custom text-center py-12">
          <Icon icon="mdi:account-alert" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-3">Profile not found</h1>
          <p className="text-gray-500 mb-6">This profile doesn't exist or has been removed.</p>
          <AppLink href={ALUMNI_ROUTES.PROFILES} className="btn btn-primary">
            Browse Directory
          </AppLink>
        </div>
      </section>
    );
  }

  const isOwnProfile = currentUser?.memberId === alumnus.memberId;
  const isSignedIn = !!currentUser;

  // ── Derived display values ─────────────────────────────────────────────────
  const occupationLabel = resolveLabel(alumnus.occupations?.[0], occupationOptions);
  const employmentLabel = resolveLabel(alumnus.employmentStatus, employmentStatusOptions);
  const industrySectorLabel = resolveLabel(alumnus.industrySectors?.[0], industrySectorOptions);

  const positionLine =
    [alumnus.position || occupationLabel, alumnus.company ? `at ${alumnus.company}` : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

  const socials: SocialLink[] = [
    alumnus.instagram && { icon: 'mdi:instagram', href: alumnus.instagram, label: 'Instagram' },
    alumnus.facebook && { icon: 'mdi:facebook', href: alumnus.facebook, label: 'Facebook' },
    alumnus.twitter && { icon: 'ri:twitter-x-fill', href: alumnus.twitter, label: 'X (Twitter)' },
    alumnus.tiktok && { icon: 'ic:baseline-tiktok', href: alumnus.tiktok, label: 'TikTok' },
  ].filter(Boolean) as SocialLink[];

  const profileData = {
    bio: alumnus.bio,
    fullName: alumnus.name,
    nicknameInSchool: alumnus.nickName,
    email: isSignedIn ? alumnus.email : undefined,
    whatsapp:
      isSignedIn && (isOwnProfile || alumnus.privacy?.whatsappPhone === 'public')
        ? alumnus.whatsappPhone
        : undefined,
    altPhone:
      isSignedIn && (isOwnProfile || alumnus.privacy?.alternativePhone === 'public')
        ? alumnus.alternativePhone
        : undefined,
    dateOfBirth:
      isOwnProfile || alumnus.privacy?.birthDate === 'public'
        ? formatDate(alumnus.birthDate)
        : undefined,
    streetAddress:
      isOwnProfile || alumnus.privacy?.residentialAddress === 'public'
        ? alumnus.residentialAddress
        : undefined,
    area: alumnus.area,
    state: alumnus.state,
    city: alumnus.city,
    employmentStatus: employmentLabel,
    occupation: alumnus.occupations
      ?.map((o) => resolveLabel(o, occupationOptions))
      .filter(Boolean)
      .join(', '),
    industrySector: alumnus.industrySectors
      ?.map((s) => resolveLabel(s, industrySectorOptions))
      .filter(Boolean)
      .join(', '),
    yearsOfExperience:
      alumnus.yearsOfExperience !== undefined ? `${alumnus.yearsOfExperience}` : undefined,
  };

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Profiles', href: ALUMNI_ROUTES.PROFILES },
    { label: alumnus.name || 'Profile' },
  ];

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: alumnus.name, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      toast.success('Profile link copied to clipboard!');
    }
  };

  const handleMessage = () => {
    const recipientHeadline =
      alumnus.position && alumnus.company
        ? `${alumnus.position} at ${alumnus.company}`
        : (occupationLabel ?? `Class of ${alumnus.graduationYear}`);

    void startDirectConversation({
      participantMemberId: alumnus.memberId,
      topic: `Alumni profile conversation with ${alumnus.name}`,
      recipientProfile: {
        fullName: alumnus.name,
        avatar: alumnus.photo,
        headline: recipientHeadline,
        location: alumnus.location || alumnus.city,
        graduationYear: alumnus.graduationYear,
        slug: alumnus.slug,
        profileHref: `/alumni/profiles/${alumnus.memberId}`,
      },
    });
  };

  return (
    <>
      <SEO title={alumnus.name || 'Alumni Profile'} description={alumnus.bio} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section bg-gray-100 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* ── Left: sidebar ──────────────────────────────────────── */}
            <div className="space-y-4 lg:sticky lg:top-6 h-fit">
              <ProfileCard
                photo={alumnus.photo}
                fullName={alumnus.name}
                maidenName={
                  alumnus.nameInSchool && alumnus.nameInSchool !== alumnus.name
                    ? alumnus.nameInSchool
                    : undefined
                }
                graduationYear={alumnus.graduationYear}
                positionLine={positionLine}
                city={alumnus.city}
                isVolunteer={alumnus.isVolunteer}
                socials={socials}
                mode={isOwnProfile ? 'owner' : isSignedIn ? 'visitor' : 'public'}
                onMessage={handleMessage}
                isMessaging={isStartingConversation}
                onShare={handleShare}
              />

              {/* Address card in sidebar */}
              {(alumnus.residentialAddress || alumnus.area || alumnus.city) &&
                (isOwnProfile || alumnus.privacy?.residentialAddress === 'public') && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Address</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      {alumnus.residentialAddress && (
                        <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-3">
                          <span className="text-gray-400 whitespace-nowrap">
                            Street Number and Name:
                          </span>
                          <span className="break-words">{alumnus.residentialAddress}</span>
                        </div>
                      )}
                      {alumnus.state && (
                        <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-3">
                          <span className="text-gray-400">State:</span>
                          <span className="break-words">{alumnus.state}</span>
                        </div>
                      )}
                      {alumnus.city && (
                        <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-3">
                          <span className="text-gray-400">City:</span>
                          <span className="break-words">{alumnus.city}</span>
                        </div>
                      )}
                      {alumnus.zone && (
                        <div className="flex flex-col sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-3">
                          <span className="text-gray-400">Zone:</span>
                          <span className="break-words">{alumnus.zone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* ── Right: info panels ──────────────────────────────────── */}
            <div>
              <ProfileInfoPanel
                data={profileData}
                copyable={!isOwnProfile && isSignedIn} // copy buttons only on visitor view
                isOwner={isOwnProfile}
              />

              {/* Privacy notice */}
              {!isOwnProfile && isSignedIn && (
                <p className="text-xs text-gray-400 text-center mt-4">
                  Some fields may be hidden based on this member's privacy settings.
                </p>
              )}

              {/* Sign-in prompt */}
              {!isSignedIn && (
                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center mt-4">
                  <Icon
                    icon="mdi:lock-outline"
                    className="w-10 h-10 text-primary-400 mx-auto mb-3"
                  />
                  <h3 className="text-lg font-semibold text-primary-800 mb-2">
                    Sign in to view full profile
                  </h3>
                  <p className="text-sm text-primary-600 mb-4">
                    Join our alumni network to connect and access complete profiles.
                  </p>
                  <AppLink href={AUTH_ROUTES.LOGIN} className="btn btn-primary btn-sm">
                    Sign In
                  </AppLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
