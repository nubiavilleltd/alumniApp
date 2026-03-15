import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useAlumnus } from '@/features/alumni/hooks/useAlumni';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
import type { PrivacySettings } from '@/features/authentication/types/auth.types';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SEO } from '@/shared/common/SEO';

// ─── Privacy helper ───────────────────────────────────────────────────────────
// Returns the value if public, or a "Hidden" badge if private.
// isOwnProfile — owner always sees their own data regardless.

function usePrivacyResolver(
  privacy: PrivacySettings,
  isOwnProfile: boolean,
) {
  return function resolve(
    field: keyof PrivacySettings,
    value: React.ReactNode,
  ): React.ReactNode {
    if (isOwnProfile) return value;
    if (privacy[field] === 'private') {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-gray-400 italic">
          <Icon icon="mdi:eye-off-outline" className="w-3.5 h-3.5" />
          Hidden
        </span>
      );
    }
    return value;
  };
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export function AlumniProfilePage() {
  const { slug = '' }  = useParams();
  const currentUser    = useAuthStore((state) => state.user);
  const isSignedIn     = !!currentUser;

  const { data: alumnus, isLoading } = useAlumnus(slug);

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

  // ── Resolve privacy settings for this alumnus ──────────────────────────────
  // Look up their MockAuthAccount to get stored privacy settings.
  // Falls back to defaultPrivacySettings if not found.
  const alumnusAccount = alumnus.memberId
    ? getMockAccountByMemberId(alumnus.memberId)
    : undefined;

  const privacy: PrivacySettings = {
    ...defaultPrivacySettings,
    ...alumnusAccount?.privacy,
  };

  // Is the currently logged-in user viewing their own profile?
  const isOwnProfile = !!currentUser && currentUser.memberId === alumnus.memberId;

  const resolve = usePrivacyResolver(privacy, isOwnProfile);

  const alum    = { ...alumnus };
  const socials = alum.social ?? {};

  const breadcrumbItems = [
    { label: 'Home',     href: '/' },
    { label: 'Profiles', href: '/alumni/profiles' },
    { label: alum.name },
  ];

  return (
    <>
      <SEO title={alum.name} description={alum.short_bio} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <aside className="lg:col-span-1 bg-white shadow-md rounded-2xl p-6 text-center">

              {/* Photo — respects privacy */}
              {privacy.photo === 'public' || isOwnProfile ? (
                <img
                  src={alum.photo || '/logo.svg'}
                  alt={alum.name}
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border mx-auto mb-4"
                />
              ) : (
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gray-100 border flex flex-col items-center justify-center mx-auto mb-4">
                  <Icon icon="mdi:account-outline" className="w-14 h-14 text-gray-300" />
                  <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-0.5">
                    <Icon icon="mdi:eye-off-outline" className="w-3 h-3" />
                    Hidden
                  </span>
                </div>
              )}

              <h1 className="text-2xl font-bold">{alum.name}</h1>
              <p className="text-primary-600 mt-1">Class of {alum.year}</p>

              {isSignedIn ? (
                <>
                  <div className="mt-4 space-y-2 text-sm text-gray-700 text-left">
                    {alum.position && (
                      <p><strong>Position:</strong> {alum.position}</p>
                    )}
                    {alum.company && (
                      <p><strong>Company:</strong> {alum.company}</p>
                    )}
                    {alum.location && (
                      <p><strong>Location:</strong> {resolve('city', alum.location)}</p>
                    )}
                    {alum.email && (
                      <p className="flex items-center gap-1 flex-wrap">
                        <strong>Email:</strong>
                        <AppLink
                          href={`mailto:${alum.email}`}
                          className="text-primary-600 hover:underline"
                        >
                          {alum.email}
                        </AppLink>
                      </p>
                    )}
                  </div>

                  {(socials.linkedin || socials.github || socials.twitter) && (
                    <div className="mt-6 flex justify-center gap-5 text-gray-600">
                      {socials.linkedin && (
                        <AppLink href={socials.linkedin} target="_blank" className="hover:text-primary-600">
                          <Icon icon="mdi:linkedin" className="w-6 h-6" />
                        </AppLink>
                      )}
                      {socials.github && (
                        <AppLink href={socials.github} target="_blank" className="hover:text-primary-600">
                          <Icon icon="mdi:github" className="w-6 h-6" />
                        </AppLink>
                      )}
                      {socials.twitter && (
                        <AppLink href={socials.twitter} target="_blank" className="hover:text-primary-600">
                          <Icon icon="mdi:twitter" className="w-6 h-6" />
                        </AppLink>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-primary-200 bg-primary-50 p-4 text-left">
                  <p className="text-sm font-semibold text-primary-900">Member-only profile</p>
                  <p className="mt-2 text-sm leading-6 text-primary-900/80">
                    Sign in to view this alumnus's biography, work details, contact information, and
                    full profile sections.
                  </p>
                  <AppLink href="/auth/login" className="btn btn-primary btn-sm mt-4 w-full justify-center">
                    Sign in to continue
                  </AppLink>
                </div>
              )}
            </aside>

            {/* ── Main Content ─────────────────────────────────────────── */}
            <main className="lg:col-span-2 space-y-8">
              {isSignedIn ? (
                <>
                  <section className="bg-white shadow-md rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-3">About</h2>
                    <p className="text-gray-700">{alum.long_bio}</p>
                  </section>

                  {/* Skills */}
                  {alum.skills && alum.skills.length > 0 && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-3">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {alum.skills.map((skill) => (
                          <span className="badge badge-primary" key={skill}>{skill}</span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Work Experience */}
                  {alum.work_experience && alum.work_experience.length > 0 && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
                      <div className="space-y-4">
                        {alum.work_experience.map((exp) => (
                          <div key={`${exp.company}-${exp.position}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">{exp.position}</h3>
                                <p className="text-sm text-primary-600">{exp.company}</p>
                              </div>
                              <span className="text-xs text-gray-400 flex-shrink-0">{exp.duration}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {alum.education && alum.education.length > 0 && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-4">Education</h2>
                      <div className="space-y-3">
                        {alum.education.map((edu) => (
                          <div key={`${edu.degree}-${edu.year}`}>
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="text-sm text-gray-600">
                              {edu.institution} · {edu.year}
                            </p>
                            {edu.gpa && (
                              <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Achievements */}
                  {alum.achievements && alum.achievements.length > 0 && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-3">Achievements</h2>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {alum.achievements.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Interests */}
                  {alum.interests && alum.interests.length > 0 && (
                    <section className="bg-white shadow-md rounded-2xl p-6">
                      <h2 className="text-xl font-semibold mb-3">Interests</h2>
                      <div className="flex flex-wrap gap-2">
                        {alum.interests.map((interest) => (
                          <span className="badge badge-secondary" key={interest}>{interest}</span>
                        ))}
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
                    Visitors can view only the most basic alumni information. Sign in with a member
                    session to unlock biography, professional background, education history,
                    projects, achievements, interests, and contact details.
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
