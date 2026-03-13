import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { dashboardApi, type DashboardData, type DashboardStat } from '../../dashboard/api/dashboardApi';

const statToneClass: Record<DashboardStat['tone'], string> = {
  primary: 'from-primary-500 to-primary-700 text-white',
  accent: 'from-accent-800 to-accent-950 text-white',
  secondary: 'from-secondary-500 to-secondary-700 text-white',
};

function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <div className={`rounded-[1.5rem] bg-gradient-to-br p-5 shadow-lg ${statToneClass[stat.tone]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/80">{stat.label}</p>
          <p className="mt-3 text-2xl font-bold">{stat.value}</p>
          <p className="mt-2 text-sm text-white/80">{stat.detail}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <Icon icon={stat.icon} className="h-6 w-6" />
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

function DashboardSkeleton() {
  return (
    <Layout title="Dashboard" description="Loading your alumni dashboard">
      <section className="section bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),linear-gradient(180deg,_#ffffff,_#f8fafc)]">
        <div className="container-custom space-y-6 animate-pulse">
          <div className="rounded-[2rem] bg-accent-900 p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="h-4 w-40 rounded-full bg-white/15" />
                <div className="h-10 w-72 rounded-full bg-white/20" />
                <div className="h-4 w-48 rounded-full bg-white/10" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-24 rounded-2xl bg-white/10" />
                <div className="h-12 w-12 rounded-2xl bg-white/10" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-32 rounded-[1.5rem] bg-accent-100" key={index} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <div className="h-72 rounded-[1.5rem] bg-accent-100" />
              <div className="h-72 rounded-[1.5rem] bg-accent-100" />
            </div>
            <div className="space-y-6">
              <div className="h-64 rounded-[1.5rem] bg-accent-100" />
              <div className="h-64 rounded-[1.5rem] bg-accent-100" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function UserDashboardPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setDashboard(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      setError('');

      try {
        const response = await dashboardApi.getDashboard(currentUser?.email);

        if (!isCancelled) {
          setDashboard(response);
        }
      } catch {
        if (!isCancelled) {
          setError('Dashboard data could not be loaded. Try again.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, [currentUser]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!currentUser) {
    return (
      <Layout title="Dashboard" description="Your alumni dashboard">
        <section className="section">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-accent-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                <Icon icon="mdi:account-lock-outline" className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl font-bold text-accent-900">Sign in required</h1>
              <p className="mt-3 text-sm leading-6 text-accent-600">
                Start a session with one of the dummy accounts to access the alumni dashboard.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <AppLink href="/auth/login" className="btn btn-primary">
                  Go to login
                </AppLink>
                <AppLink href="/" className="btn btn-outline">
                  Back home
                </AppLink>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!dashboard || error) {
    return (
      <Layout title="Dashboard" description="Your alumni dashboard">
        <section className="section">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-secondary-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-700">
                <Icon icon="mdi:alert-circle-outline" className="h-7 w-7" />
              </div>
              <h1 className="mt-5 text-2xl font-bold text-accent-900">Dashboard unavailable</h1>
              <p className="mt-3 text-sm leading-6 text-accent-600">
                {error || 'Something went wrong while loading your dashboard.'}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
                <AppLink href="/auth/login" className="btn btn-outline">
                  Back to login
                </AppLink>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" description="Your alumni dashboard">
      <section className="section bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.08),_transparent_28%),linear-gradient(180deg,_#ffffff,_#f8fafc)]">
        <div className="container-custom space-y-6">
          <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_48%,_#1d4ed8_100%)] p-6 text-white shadow-2xl md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(96,165,250,0.25),_transparent_34%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                  Welcome back
                </p>
                <h1 className="mt-3 text-3xl font-bold md:text-4xl">{dashboard.user.name}</h1>
                <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85">
                  <span className="font-semibold">
                    {dashboard.user.profileCompletion}% complete
                  </span>
                  <span className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-primary-200"
                      style={{ width: `${dashboard.user.profileCompletion}%` }}
                    />
                  </span>
                  <span>Profile</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/15"
                >
                  <Icon icon="mdi:bell-outline" className="h-5 w-5" />
                  <span>Notifications</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary-700">
                    {dashboard.user.notifications}
                  </span>
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-base font-bold shadow-lg">
                  {dashboard.user.initials}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboard.stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <SectionCard
                title="Announcements / News"
                action={
                  <AppLink
                    href="/blog"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </AppLink>
                }
              >
                <div className="space-y-3">
                  {dashboard.announcements.map((item) => (
                    <AppLink
                      href={item.href}
                      key={item.href}
                      className="flex items-start gap-3 rounded-2xl border border-accent-100 bg-accent-50/80 px-4 py-4 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50/70"
                    >
                      <div className="mt-0.5 rounded-xl bg-white p-2 text-primary-600 shadow-sm">
                        <Icon icon="mdi:newspaper-variant-outline" className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-accent-900">{item.title}</p>
                        <p className="mt-1 text-sm text-accent-600">{item.subtitle}</p>
                      </div>
                    </AppLink>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Upcoming Events"
                action={
                  <AppLink
                    href="/events"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Calendar
                  </AppLink>
                }
              >
                <div className="space-y-3">
                  {dashboard.upcomingEvents.map((event) => (
                    <div
                      className="flex flex-col gap-4 rounded-2xl border border-accent-100 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between"
                      key={event.href}
                    >
                      <div>
                        <p className="font-medium text-accent-900">{event.title}</p>
                        <p className="mt-1 text-sm text-accent-600">{event.subtitle}</p>
                      </div>
                      <AppLink href={event.href} className="btn btn-primary btn-sm justify-center">
                        {event.cta}
                      </AppLink>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            <div className="space-y-6">
              <SectionCard title="Profile Completion">
                <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-primary-900">Profile progress</p>
                      <p className="mt-1 text-3xl font-bold text-primary-900">
                        {dashboard.user.profileCompletion}%
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-primary-700 shadow-sm">
                      Keep going
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-700"
                      style={{ width: `${dashboard.user.profileCompletion}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {dashboard.profileTasks.map((task) => (
                    <div className="flex items-center gap-3 text-sm text-accent-700" key={task}>
                      <Icon
                        icon="mdi:checkbox-blank-circle-outline"
                        className="h-4 w-4 text-primary-500"
                      />
                      <span>{task}</span>
                    </div>
                  ))}
                </div>

                <AppLink href={dashboard.user.profileHref} className="btn btn-primary mt-5 w-full">
                  Complete Profile
                </AppLink>
              </SectionCard>

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
                <div className="space-y-3">
                  {dashboard.suggestedAlumni.map((alumnus) => (
                    <AppLink
                      href={alumnus.href}
                      key={alumnus.href}
                      className="flex items-center gap-3 rounded-2xl border border-accent-100 px-4 py-4 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50/60"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-100 font-semibold text-accent-700">
                        {alumnus.title
                          .split(' ')
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-accent-900">{alumnus.title}</p>
                        <p className="mt-1 text-sm text-accent-600">{alumnus.subtitle}</p>
                      </div>
                    </AppLink>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Community Updates">
                <div className="space-y-3">
                  {dashboard.communityUpdates.map((item) => (
                    <AppLink
                      href={item.href}
                      key={item.title}
                      className="block rounded-2xl border border-accent-100 bg-accent-50 px-4 py-4 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50/60"
                    >
                      <p className="font-medium text-accent-900">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-accent-600">{item.subtitle}</p>
                    </AppLink>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="My Groups / Quick Links">
                <div className="grid gap-3 sm:grid-cols-2">
                  {dashboard.quickLinks.map((link) => (
                    <AppLink
                      href={link.href}
                      key={link.label}
                      className="flex items-center gap-3 rounded-2xl border border-accent-100 bg-white px-4 py-4 text-accent-700 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700"
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
    </Layout>
  );
}
