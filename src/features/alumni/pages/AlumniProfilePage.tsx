import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useAlumnus } from '@/features/alumni/hooks/useAlumni';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
import type { PrivacySettings, AuthSessionUser } from '@/features/authentication/types/auth.types';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SEO } from '@/shared/common/SEO';
import {
  isFieldVisible,
  getPrivateFieldDisplay,
  getPhotoDisplay,
} from '@/features/alumni/utils/privacyHelpers';
import {
  employmentStatusOptions,
  occupationOptions,
  industrySectorOptions,
  yearsOfExperienceOptions,
  areaOptions,
} from '@/features/authentication/constants/profileOptions';

interface UserDataForDisplay {
  whatsappPhone?: string;
  alternativePhone?: string;
  birthDate?: string;
  houseColor?: string;
  isClassCoordinator?: boolean;
  residentialAddress?: string;
  area?: string;
  city?: string;
  employmentStatus?: string;
  occupation?: string; // Singular for display
  industrySector?: string; // Singular for display
  yearsOfExperience?: number;
  isVolunteer?: boolean;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

// Helper to get display label from option value
function getDisplayLabel(
  value: string | number | undefined,
  options: readonly { label: string; value: string | number }[],
): string {
  if (value === undefined || value === null) return 'Not provided';
  const option = options.find((opt) => opt.value == value); // Use == for loose comparison
  return option?.label || value.toString();
}
// Helper to capitalize first letter
function capitalizeFirst(text: string | undefined): string {
  if (!text) return 'Not provided';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <section className="section py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
          <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 flex flex-col items-center gap-3">
            <div className="w-36 h-36 rounded-full bg-gray-200" />
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="w-full mt-2 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-3 bg-gray-200 rounded w-4/6" />
            </div>
          </aside>
          <main className="lg:col-span-2 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white shadow-md rounded-2xl p-6 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
}

// ─── Helper to get user data from account ────────────────────────────────────
function getUserDataFromAccount(alumnus: any): UserDataForDisplay | null {
  const account = alumnus.memberId ? getMockAccountByMemberId(alumnus.memberId) : undefined;
  if (!account) return null;

  return {
    whatsappPhone: account.whatsappPhone,
    alternativePhone: account.alternativePhone,
    birthDate: account.birthDate,
    houseColor: account.houseColor,
    isClassCoordinator: account.isClassCoordinator,
    residentialAddress: account.residentialAddress,
    area: account.area,
    city: account.city,
    employmentStatus: account.employmentStatus,
    occupation: account.occupations?.[0],
    industrySector: account.industrySectors?.[0],
    yearsOfExperience: account.yearsOfExperience,
    isVolunteer: account.isVolunteer,
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function AlumniProfilePage() {
  const { slug = '' } = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const isSignedIn = !!currentUser;

  const { data: alumnus, isLoading } = useAlumnus(slug);
  // console.log("alumnus", {alumnus})

  if (isLoading) return <ProfileSkeleton />;

  if (!alumnus) {
    return (
      <Layout title="Profile Not Found">
        <section className="section">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-bold mb-4">Alumni profile not found</h1>
            <AppLink href="/alumni/profiles" className="btn btn-primary">
              Browse Directory
            </AppLink>
          </div>
        </section>
      </Layout>
    );
  }

  // ── Get privacy settings and user data from MockAuthAccount ────────────────
  const alumnusAccount = alumnus.memberId ? getMockAccountByMemberId(alumnus.memberId) : undefined;
  const privacy: PrivacySettings = { ...defaultPrivacySettings, ...alumnusAccount?.privacy };
  const userData = getUserDataFromAccount(alumnus);
  const alumnusWithPrivacy = { ...alumnus, privacy, id: alumnus.memberId };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: alumnus.name },
  ];

  // Determine if viewing own profile
  const isOwnProfile = currentUser?.memberId === alumnus.memberId;

  return (
    <>
      <SEO title={alumnus.name} description={alumnus.short_bio} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 text-center">
              {/* Photo — respects privacy */}
              {getPhotoDisplay(
                alumnus.photo,
                isFieldVisible(alumnusWithPrivacy, 'photo', currentUser),
              ) ? (
                <img
                  src={alumnus.photo || '/logo.svg'}
                  alt={alumnus.name}
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border mx-auto mb-4"
                />
              ) : (
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-100 border flex flex-col items-center justify-center mx-auto mb-4">
                  <Icon icon="mdi:lock" className="w-12 h-12 text-gray-300" />
                  <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5">
                    <Icon icon="mdi:lock" className="w-3 h-3" />
                    Private
                  </span>
                </div>
              )}

              <h1 className="text-2xl font-bold">{alumnus.name}</h1>
              <p className="text-primary-600 mt-1">Class of {alumnus.year}</p>

              {/* House Color */}
              {userData?.houseColor && (
                <p className="text-sm text-gray-500 mt-2">
                  <Icon icon="mdi:home" className="inline w-4 h-4 mr-1" />
                  {userData.houseColor} House
                </p>
              )}

              {/* Class Coordinator Badge */}
              {userData?.isClassCoordinator && (
                <div className="mt-3 inline-flex items-center gap-1 bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-semibold">
                  <Icon icon="mdi:star" className="w-3.5 h-3.5" />
                  Class Coordinator
                </div>
              )}

              {isSignedIn ? (
                <>
                  <div className="mt-6 space-y-3 text-sm text-gray-700 text-left">
                    {/* Email - always visible */}
                    {alumnus.email && (
                      <div className="flex items-start gap-2">
                        <Icon
                          icon="mdi:email-outline"
                          className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                        />
                        <AppLink
                          href={`mailto:${alumnus.email}`}
                          className="text-primary-600 hover:underline break-all"
                        >
                          {alumnus.email}
                        </AppLink>
                      </div>
                    )}

                    {/* WhatsApp Phone */}
                    {userData?.whatsappPhone && (
                      <div className="flex items-start gap-2">
                        <Icon
                          icon="mdi:whatsapp"
                          className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                        />
                        <span className="break-all">
                          {getPrivateFieldDisplay(
                            userData.whatsappPhone,
                            isFieldVisible(alumnusWithPrivacy, 'whatsappPhone', currentUser),
                            'Not provided',
                          )}
                        </span>
                      </div>
                    )}

                    {/* Alternative Phone */}
                    {userData?.alternativePhone && (
                      <div className="flex items-start gap-2">
                        <Icon
                          icon="mdi:phone-outline"
                          className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                        />
                        <span className="break-all">
                          {getPrivateFieldDisplay(
                            userData.alternativePhone,
                            isFieldVisible(alumnusWithPrivacy, 'alternativePhone', currentUser),
                            'Not provided',
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(alumnus.social?.linkedin || alumnus.social?.twitter || alumnus.social?.instagram) && (
                    <div className="mt-6 flex justify-center gap-5 text-gray-600">
                      {alumnus.social.linkedin && (
                        <AppLink
                          href={alumnus.social.linkedin}
                          target="_blank"
                          className="hover:text-primary-600"
                        >
                          <Icon icon="mdi:linkedin" className="w-6 h-6" />
                        </AppLink>
                      )}
                      {alumnus.social.twitter && (
                        <AppLink
                          href={alumnus.social.twitter}
                          target="_blank"
                          className="hover:text-primary-600"
                        >
                          <Icon icon="mdi:twitter" className="w-6 h-6" />
                        </AppLink>
                      )}
                      {alumnus.social.instagram && (
                        <AppLink
                          href={alumnus.social.instagram}
                          target="_blank"
                          className="hover:text-primary-600"
                        >
                          <Icon icon="mdi:instagram" className="w-6 h-6" />
                        </AppLink>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-left">
                  <p className="text-sm font-semibold text-primary-900">Member-only profile</p>
                  <p className="mt-2 text-sm leading-6 text-primary-900/80">
                    Sign in to view contact information and full profile details.
                  </p>
                  <AppLink
                    href="/auth/login"
                    className="btn btn-primary btn-sm mt-4 w-full justify-center"
                  >
                    Sign in to continue
                  </AppLink>
                </div>
              )}
            </aside>

            {/* ── Main Content ─────────────────────────────────────────── */}
            <main className="lg:col-span-2 space-y-6">
              {isSignedIn ? (
                <>
                  {/* About */}
                  <section className="bg-white shadow-md rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Icon icon="mdi:account-outline" className="w-5 h-5 text-primary-500" />
                      About
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{alumnus.long_bio}</p>
                  </section>

                  {/* Professional Information */}
                  {(userData?.employmentStatus ||
                    userData?.occupation ||
                    userData?.industrySector ||
                    userData?.yearsOfExperience) && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:briefcase-outline" className="w-5 h-5 text-primary-500" />
                        Professional Information
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {userData.employmentStatus && (
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Employment Status
                            </p>
                            <p className="font-medium text-gray-800">
                              {getPrivateFieldDisplay(
                                getDisplayLabel(userData.employmentStatus, employmentStatusOptions),
                                isFieldVisible(alumnusWithPrivacy, 'employmentStatus', currentUser),
                              )}
                            </p>
                          </div>
                        )}
                        {userData.occupation && (
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Occupation
                            </p>
                            <p className="font-medium text-gray-800">
                              {getPrivateFieldDisplay(
                                getDisplayLabel(userData.occupation, occupationOptions),
                                isFieldVisible(alumnusWithPrivacy, 'occupations', currentUser),
                              )}
                            </p>
                          </div>
                        )}
                        {userData.industrySector && (
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Industry Sector
                            </p>
                            <p className="font-medium text-gray-800">
                              {getPrivateFieldDisplay(
                                getDisplayLabel(userData.industrySector, industrySectorOptions),
                                isFieldVisible(alumnusWithPrivacy, 'industrySectors', currentUser),
                              )}
                            </p>
                          </div>
                        )}
                        {userData.yearsOfExperience && (
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Years of Experience
                            </p>
                            <p className="font-medium text-gray-800">
                              {getPrivateFieldDisplay(
                                getDisplayLabel(
                                  userData.yearsOfExperience?.toString(),
                                  yearsOfExperienceOptions,
                                ),
                                isFieldVisible(
                                  alumnusWithPrivacy,
                                  'yearsOfExperience',
                                  currentUser,
                                ),
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Location Information */}
                  {(userData?.city || userData?.area || userData?.residentialAddress) && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-primary-500" />
                        Location
                      </h2>
                      <div className="space-y-3 text-sm">
                        {userData.city && (
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              City
                            </p>
                            <p className="font-medium text-gray-800">
                              {getPrivateFieldDisplay(
                                capitalizeFirst(userData.city),
                                isFieldVisible(alumnusWithPrivacy, 'city', currentUser),
                              )}
                            </p>
                          </div>
                        )}
                        {userData.area && (
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Area
                            </p>
                            <p className="font-medium text-gray-800">
                              {getPrivateFieldDisplay(
                                getDisplayLabel(userData.area, areaOptions),
                                isFieldVisible(alumnusWithPrivacy, 'area', currentUser),
                              )}
                            </p>
                          </div>
                        )}
                        {userData.residentialAddress && (
                          <div>
                            <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                              Residential Address
                            </p>
                            <p className="font-medium text-gray-800">
                              {getPrivateFieldDisplay(
                                userData.residentialAddress,
                                isFieldVisible(
                                  alumnusWithPrivacy,
                                  'residentialAddress',
                                  currentUser,
                                ),
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Personal Information */}
                  {userData?.birthDate && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Icon icon="mdi:calendar-outline" className="w-5 h-5 text-primary-500" />
                        Personal
                      </h2>
                      <div className="text-sm">
                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
                          Date of Birth
                        </p>
                        <p className="font-medium text-gray-800">
                          {getPrivateFieldDisplay(
                            userData.birthDate,
                            isFieldVisible(alumnusWithPrivacy, 'birthDate', currentUser),
                          )}
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Volunteer Status */}
                  {userData?.isVolunteer && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Icon icon="mdi:hand-heart-outline" className="w-5 h-5 text-primary-500" />
                        Community
                      </h2>
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Available for volunteer opportunities</span>
                      </div>
                    </section>
                  )}

                  {/* Privacy notice — only shown when viewing someone else's profile */}
                  {!isOwnProfile && (
                    <p className="text-xs text-gray-400 text-center pb-2">
                      Some fields may be hidden based on this member's privacy settings.
                    </p>
                  )}
                </>
              ) : (
                <section className="bg-white shadow-md rounded-2xl p-6">
                  <h2 className="text-xl font-semibold mb-3">Profile access limited</h2>
                  <p className="text-gray-700 leading-7">
                    Sign in to view full profile information including professional background,
                    location details, and contact information.
                  </p>
                </section>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
