// features/user/pages/UserDashboardPage.tsx
// Route: /dashboard  (ProtectedRoute)

import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { useUpcomingEvents } from '@/features/events/hooks/useEvents';
import { useLatestAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import { SEO } from '@/shared/common/SEO';
import { useMyEvents } from '@/features/events/hooks/useEventRegistration';
import type { Event } from '@/features/events/types/event.types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ── Dashboard Event Card ──────────────────────────────────────────────────────
function DashboardEventCard({ event }: { event: Event }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-accent-100 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <p className="font-medium text-accent-900">{event.title}</p>
        <p className="mt-1 text-sm text-accent-600">
          {formatEventDate(event.date)} • {event.location}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
          <Icon icon="mdi:check-circle" className="w-4 h-4" />
          Registered
        </div>
        <AppLink
          href={`/events/${event.id}`}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          Details →
        </AppLink>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
type StatTone = 'primary' | 'accent' | 'secondary';

const statToneClass: Record<StatTone, string> = {
  primary: 'from-primary-500 to-primary-700 text-white',
  accent: 'from-accent-800 to-accent-950 text-white',
  secondary: 'from-secondary-500 to-secondary-700 text-white',
};

function StatCard({
  label,
  value,
  detail,
  icon,
  tone,
  loading,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: StatTone;
  loading?: boolean;
}) {
  return (
    <div className={`rounded-[1.5rem] bg-gradient-to-br p-5 shadow-lg ${statToneClass[tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="mt-3 text-2xl font-bold">
            {loading ? (
              <span className="inline-block h-7 w-10 animate-pulse rounded-lg bg-white/20" />
            ) : (
              value
            )}
          </p>
          <p className="mt-2 text-sm text-white/80">{detail}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <Icon icon={icon} className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-accent-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-accent-900">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-accent-100" />
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function UserDashboardPage() {
  const currentUser = useAuthStore((state) => state.user);

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useUpcomingEvents();
  const { data: announcements = [], isLoading: announcementsLoading } = useLatestAnnouncements(3);
  const { data: allAlumni = [], isLoading: alumniLoading } = useAlumni();
  const { events: myEvents = [], isLoading: myEventsLoading } = useMyEvents();

  // ── Get registered events (upcoming only) ────────────────────────────────────
  const myRegisteredEvents = myEvents
    .filter((event: Event) => new Date(event.date) >= new Date()) // Only upcoming
    .slice(0, 3); // Show max 3 on dashboard

  // ── Profile completion ─────────────────────────────────────────────────────
  const profileCompletion = (() => {
    if (!currentUser) return 0;
    const checks = [
      currentUser.photo,
      currentUser.alternativePhone,
      currentUser.birthDate,
      currentUser.residentialAddress,
      currentUser.employmentStatus,
      currentUser.occupations?.length,
      currentUser.industrySectors?.length,
      currentUser.isVolunteer !== undefined ? true : undefined,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.min(100, Math.round(40 + (filled / checks.length) * 60));
  })();

  const profileTasks: string[] = [];
  if (currentUser && !currentUser.photo) profileTasks.push('Upload a profile photo');
  if (currentUser && !currentUser.employmentStatus) profileTasks.push('Add your employment status');
  if (currentUser && !currentUser.occupations?.length) profileTasks.push('Add your occupation(s)');
  if (currentUser && !currentUser.residentialAddress)
    profileTasks.push('Add your residential address');

  // ── Derived data ───────────────────────────────────────────────────────────
  const suggestedAlumni = allAlumni.filter((a) => a.slug !== currentUser?.slug).slice(0, 2);

  const communityUpdates = [
    {
      title: 'Mentorship circle opens next week',
      subtitle: 'Join a cross-year mentoring group before seats fill up.',
      href: '/about',
    },
    {
      title: 'Regional meetup planning has started',
      subtitle: 'See the latest planning note and volunteer opportunities.',
      href: '/events',
    },
    {
      title: 'Community directory refresh underway',
      subtitle: 'Profiles with complete details will be featured more often.',
      href: '/alumni/profiles',
    },
  ];

  const quickLinks = [
    { label: 'Edit Profile', href: '/user/profile', icon: 'mdi:account-edit-outline' },
    { label: 'My Events', href: '/my-events', icon: 'mdi:calendar-check-outline' },
    { label: 'View Directory', href: '/alumni/profiles', icon: 'mdi:account-group-outline' },
    { label: 'Browse Events', href: '/events', icon: 'mdi:calendar-month-outline' },
    { label: 'My Business', href: '/marketplace/my-business', icon: 'mdi:store-outline' },
  ];

  // Combine loading states
  const isLoading = eventsLoading || myEventsLoading;

  return (
    <>
      <SEO title="Dashboard" description="Your alumni dashboard" />
      <section className="section bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.08),_transparent_28%),linear-gradient(180deg,_#ffffff,_#f8fafc)]">
        <div className="container-custom space-y-6">
          {/* ── Hero banner ────────────────────────────────────────────── */}
          <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_48%,_#1d4ed8_100%)] p-6 text-white shadow-2xl md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(96,165,250,0.25),_transparent_34%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                  Welcome back
                </p>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">{currentUser?.fullName}</h1>
                <p className="mt-1 text-sm text-white/60">Class of {currentUser?.graduationYear}</p>
                <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85">
                  <span className="font-semibold">{profileCompletion}% complete</span>
                  <span className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-primary-200 transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </span>
                  <span>Profile</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  <Icon icon="mdi:bell-outline" className="h-5 w-5" />
                  <span>Notifications</span>
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-base font-bold shadow-lg">
                  {currentUser?.avatarInitials}
                </div>
              </div>
            </div>
          </section>

          {/* ── Stats ──────────────────────────────────────────────────── */}
          <section className="grid gap-4 md:grid-cols-2">
            <StatCard
              label="My Registered Events"
              value={String(myRegisteredEvents.length)}
              detail="Upcoming events you've registered for"
              icon="mdi:calendar-check"
              tone="primary"
              loading={isLoading}
            />
            <StatCard
              label="Announcements"
              value={String(announcements.length)}
              detail="Fresh updates to review"
              icon="mdi:bullhorn-outline"
              tone="accent"
              loading={announcementsLoading}
            />
          </section>

          {/* ── Main grid ──────────────────────────────────────────────── */}
          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            {/* Left column */}
            <div className="space-y-6">
              <SectionCard
                title="Announcements"
                action={
                  <AppLink
                    href="/announcements"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </AppLink>
                }
              >
                {announcementsLoading ? (
                  <SectionSkeleton rows={3} />
                ) : (
                  <div className="space-y-3">
                    {announcements.map((item) => (
                      <AppLink
                        href={`/announcements/${item.slug}`}
                        key={item.slug}
                        className="flex items-start gap-3 rounded-2xl border border-accent-100 bg-accent-50/80 px-4 py-4 transition-colors hover:border-primary-200 hover:bg-primary-50/70"
                      >
                        <div className="mt-0.5 rounded-xl bg-white p-2 text-primary-600 shadow-sm">
                          <Icon icon="mdi:bullhorn-outline" className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-accent-900">{item.title}</p>
                        </div>
                      </AppLink>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard
                title="My Registered Events"
                action={
                  <AppLink
                    href="/my-events"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </AppLink>
                }
              >
                {isLoading ? (
                  <SectionSkeleton rows={3} />
                ) : myRegisteredEvents.length > 0 ? (
                  <div className="space-y-3">
                    {myRegisteredEvents.map((event: Event) => (
                      <DashboardEventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Icon
                      icon="mdi:calendar-blank-outline"
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-sm mb-3">
                      You haven't registered for any upcoming events yet.
                    </p>
                    <AppLink
                      href="/events"
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-semibold"
                    >
                      Browse Events
                      <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                    </AppLink>
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Right column - Keep the same */}
            <div className="space-y-6">
              {/* Profile completion */}
              <SectionCard title="Profile Completion">
                <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-primary-900">Profile progress</p>
                      <p className="mt-1 text-3xl font-bold text-primary-900">
                        {profileCompletion}%
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-primary-700 shadow-sm">
                      {profileCompletion === 100 ? 'Complete!' : 'Keep going'}
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-700 transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>

                {profileTasks.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {profileTasks.map((task) => (
                      <div key={task} className="flex items-center gap-3 text-sm text-accent-700">
                        <Icon
                          icon="mdi:checkbox-blank-circle-outline"
                          className="h-4 w-4 flex-shrink-0 text-primary-500"
                        />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                )}

                <AppLink href="/user/profile" className="btn btn-primary mt-5 w-full text-center">
                  {profileCompletion === 100 ? 'View Profile' : 'Complete Profile'}
                </AppLink>
              </SectionCard>

              {/* Suggested alumni */}
              <SectionCard
                title="Suggested Alumni"
                action={
                  <AppLink
                    href="/alumni/profiles"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View directory
                  </AppLink>
                }
              >
                {alumniLoading ? (
                  <SectionSkeleton rows={2} />
                ) : (
                  <div className="space-y-3">
                    {suggestedAlumni.map((alumnus) => (
                      <AppLink
                        href={`/alumni/profiles/${alumnus.slug}`}
                        key={alumnus.slug}
                        className="flex items-center gap-3 rounded-2xl border border-accent-100 px-4 py-4 transition-colors hover:border-primary-200 hover:bg-primary-50/60"
                      >
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-100 font-semibold text-accent-700">
                          {alumnus.name
                            .split(' ')
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-accent-900">{alumnus.name}</p>
                          <p className="mt-1 truncate text-sm text-accent-600">
                            {alumnus.position} • Class of {alumnus.year}
                          </p>
                        </div>
                      </AppLink>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Community updates */}
              <SectionCard title="Community Updates">
                <div className="space-y-3">
                  {communityUpdates.map((item) => (
                    <AppLink
                      href={item.href}
                      key={item.title}
                      className="block rounded-2xl border border-accent-100 bg-accent-50 px-4 py-4 transition-colors hover:border-primary-200 hover:bg-primary-50/60"
                    >
                      <p className="font-medium text-accent-900">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-accent-600">{item.subtitle}</p>
                    </AppLink>
                  ))}
                </div>
              </SectionCard>

              {/* Quick links */}
              <SectionCard title="Quick Links">
                <div className="grid gap-3 sm:grid-cols-2">
                  {quickLinks.map((link) => (
                    <AppLink
                      href={link.href}
                      key={link.label}
                      className="flex items-center gap-3 rounded-2xl border border-accent-100 bg-white px-4 py-4 text-accent-700 transition-colors hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700"
                    >
                      <div className="rounded-xl bg-accent-100 p-2 text-primary-600">
                        <Icon icon={link.icon} className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{link.label}</span>
                    </AppLink>
                  ))}
                </div>
              </SectionCard>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
