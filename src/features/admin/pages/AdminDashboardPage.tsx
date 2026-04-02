// features/admin/pages/AdminDashboardPage.tsx
// Route: /admin/dashboard  (AdminRoute)

import { Icon } from '@iconify/react';
import { useState, type ReactNode } from 'react';
import { Layout } from '@/shared/components/layout/Layout';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { type AdminStat, type PendingMember } from '../api/adminDashboardApi';
import { useAdminDashboard, useApproveMember, useRejectMember } from '../hooks/useAdminDashboard';
import { SEO } from '@/shared/common/SEO';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';
import { USER_ROUTES } from '@/features/user/routes';
import { EVENT_ROUTES } from '@/features/events/routes';
import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';

// ─── Tone map ─────────────────────────────────────────────────────────────────

const statToneClass: Record<AdminStat['tone'], string> = {
  primary: 'from-primary-500 to-primary-700 text-white',
  accent: 'from-accent-800 to-accent-950 text-white',
  secondary: 'from-secondary-500 to-secondary-700 text-white',
  warning: 'from-amber-500 to-orange-600 text-white',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ stat }: { stat: AdminStat }) {
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

// ─── Pending member row ───────────────────────────────────────────────────────

function PendingMemberRow({
  member,
  onApprove,
  onReject,
}: {
  member: PendingMember;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState('');

  const approveMutation = useApproveMember();
  const rejectMutation = useRejectMember();

  const busy = approveMutation.isPending || rejectMutation.isPending;

  const handleApprove = async () => {
    setActionError('');
    try {
      await approveMutation.mutateAsync(member.id);
      onApprove(member.id);
    } catch (error: any) {
      setActionError(error.message ?? 'Approval failed. Please try again.');
    }
  };

  const handleRejectConfirm = async () => {
    setActionError('');
    try {
      await rejectMutation.mutateAsync({
        userId: member.id,
        reason: rejectReason.trim() || undefined,
      });
      onReject(member.id, rejectReason.trim() || undefined);
    } catch (error: any) {
      setActionError(error.message ?? 'Rejection failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-accent-100 bg-accent-50/60 px-4 py-4">
      {/* Member info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-medium text-accent-900">{member.fullName}</p>
          <p className="mt-0.5 text-xs text-accent-500">
            Name in school:{' '}
            <span className="font-medium text-accent-700">{member.nameInSchool}</span>
            {' · '}Class of {member.graduationYear}
            {' · '}
            {member.email}
          </p>
        </div>

        {/* Action buttons */}
        {!showRejectInput && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              disabled={busy}
              onClick={handleApprove}
              className="btn btn-primary btn-sm min-w-[80px]"
            >
              {approveMutation.isPending ? (
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              ) : (
                'Approve'
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setShowRejectInput(true);
                setActionError('');
              }}
              className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Inline reject reason input — appears when Reject is clicked */}
      {showRejectInput && (
        <div className="space-y-2 border-t border-accent-100 pt-3">
          <label className="block text-xs font-medium text-accent-700">
            Reason for rejection <span className="font-normal text-accent-400">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Could not verify graduation details provided."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full rounded-xl border border-accent-200 bg-white px-3 py-2 text-sm text-accent-900 placeholder:text-accent-300 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={handleRejectConfirm}
              className="btn btn-sm bg-red-500 text-white hover:bg-red-600 min-w-[100px]"
            >
              {rejectMutation.isPending ? (
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              ) : (
                'Confirm reject'
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setShowRejectInput(false);
                setRejectReason('');
                setActionError('');
              }}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Per-row error */}
      {actionError && (
        <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{actionError}</p>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AdminSkeleton() {
  return (
    // <Layout title="Admin Dashboard" description="Loading admin dashboard">

    // </Layout>

    <section className="section">
      <div className="container-custom space-y-6 animate-pulse">
        <div className="h-32 rounded-[2rem] bg-accent-900/80" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-[1.5rem] bg-accent-100" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="h-96 rounded-[1.5rem] bg-accent-100" />
          <div className="space-y-6">
            <div className="h-44 rounded-[1.5rem] bg-accent-100" />
            <div className="h-44 rounded-[1.5rem] bg-accent-100" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const currentUser = useAuthStore((state) => state.user);

  // All dashboard data via React Query — no local useState for data
  const { data: dashboard, isLoading, isError, refetch } = useAdminDashboard();

  // Local optimistic removal — remove from list immediately on approve/reject
  // while the cache invalidation + refetch completes in the background.
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  const handleApprove = (id: string) => setRemovedIds((prev) => new Set([...prev, id]));
  const handleReject = (id: string) => setRemovedIds((prev) => new Set([...prev, id]));

  if (isLoading) return <AdminSkeleton />;

  if (isError || !dashboard) {
    return (
      <section className="section">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-secondary-200 bg-white p-8 text-center shadow-sm">
            <Icon
              icon="mdi:alert-circle-outline"
              className="h-10 w-10 text-secondary-500 mx-auto"
            />
            <h1 className="mt-4 text-2xl font-bold text-accent-900">Dashboard unavailable</h1>
            <p className="mt-2 text-sm text-accent-600">
              Could not load admin dashboard data. This may be a network issue or the server is
              temporarily unavailable.
            </p>
            <button type="button" className="btn btn-primary mt-6" onClick={() => void refetch()}>
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Filter out optimistically removed members
  const visiblePending = dashboard.pendingApprovals.filter((m) => !removedIds.has(m.id));

  return (
    <>
      <SEO title="Admin Dashboard" description="Admin dashboard" />
      <section className="section bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.1),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#ffffff)]">
        <div className="container-custom space-y-6">
          {/* ── Banner ──────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_60%,_#1d4ed8_100%)] p-6 text-white shadow-2xl md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-3">
                  <Icon icon="mdi:shield-crown-outline" className="w-3.5 h-3.5" />
                  Admin Panel
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-white/60">
                  Signed in as {currentUser?.fullName ?? 'Admin'}
                </p>
              </div>
              <div className="flex gap-3">
                <AppLink
                  href={ALUMNI_ROUTES.PROFILES}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15 transition-colors"
                >
                  <Icon icon="mdi:account-group-outline" className="h-4 w-4" />
                  Members
                </AppLink>
                <AppLink
                  href={USER_ROUTES.DASHBOARD}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15 transition-colors"
                >
                  <Icon icon="mdi:account-outline" className="h-4 w-4" />
                  My Dashboard
                </AppLink>
              </div>
            </div>
          </section>

          {/* ── Stats ───────────────────────────────────────────────────── */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboard.stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </section>

          {/* ── Main grid ───────────────────────────────────────────────── */}
          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            {/* Left: pending approvals + recent members */}
            <div className="space-y-6">
              <SectionCard
                title={`Pending Approvals${visiblePending.length > 0 ? ` (${visiblePending.length})` : ''}`}
              >
                {visiblePending.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3">
                      <Icon icon="mdi:check-all" className="w-6 h-6 text-primary-500" />
                    </div>
                    <p className="font-medium text-accent-800">All caught up!</p>
                    <p className="mt-1 text-sm text-accent-500">
                      No registrations awaiting approval.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visiblePending.map((member) => (
                      <PendingMemberRow
                        key={member.id}
                        member={member}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Recent members */}
              <SectionCard
                title="Recent Members"
                action={
                  <AppLink
                    href="/admin/members"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </AppLink>
                }
              >
                {dashboard.recentMembers.length === 0 ? (
                  <p className="text-sm text-accent-400 py-4 text-center">No recent members yet.</p>
                ) : (
                  <div className="space-y-3">
                    {dashboard.recentMembers.map((m) => (
                      <div
                        key={m.slug}
                        className="flex items-center gap-3 rounded-2xl border border-accent-100 px-4 py-3"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-100 text-sm font-semibold text-accent-700">
                          {m.name
                            .split(' ')
                            .slice(0, 2)
                            .map((p) => p[0])
                            .join('')}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-accent-900 truncate">{m.name}</p>
                          <p className="text-xs text-accent-500 truncate">{m.email}</p>
                        </div>
                        <span className="text-xs text-accent-400 flex-shrink-0">
                          {new Date(m.joinedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <SectionCard
                title="Upcoming Events"
                action={
                  <AppLink
                    href={EVENT_ROUTES.ROOT}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Manage
                  </AppLink>
                }
              >
                {dashboard.upcomingEvents.length === 0 ? (
                  <p className="text-sm text-accent-400 py-4 text-center">No upcoming events.</p>
                ) : (
                  <div className="space-y-3">
                    {dashboard.upcomingEvents.map((event) => (
                      <AppLink
                        href={event.href}
                        key={event.href}
                        className="block rounded-2xl border border-accent-100 bg-accent-50 px-4 py-3 hover:border-primary-200 hover:bg-primary-50/60 transition-colors"
                      >
                        <p className="font-medium text-accent-900 text-sm">{event.title}</p>
                        <p className="mt-0.5 text-xs text-accent-500">
                          {event.date} · {event.location}
                        </p>
                      </AppLink>
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* Quick actions */}
              <SectionCard title="Quick Actions">
                <div className="space-y-2">
                  {[
                    {
                      label: 'Manage Members',
                      href: '/admin/members',
                      icon: 'mdi:account-group-outline',
                    },
                    {
                      label: 'Create Event',
                      href: EVENT_ROUTES.CREATE,
                      icon: 'mdi:calendar-plus-outline',
                    },
                    {
                      label: 'Post Announcement',
                      href: '/admin/announcements',
                      icon: 'mdi:bullhorn-outline',
                    },
                    {
                      label: 'View Marketplace',
                      href: MARKETPLACE_ROUTES.ROOT,
                      icon: 'mdi:store-outline',
                    },
                    { label: 'Site Settings', href: '/admin/settings', icon: 'mdi:cog-outline' },
                  ].map((link) => (
                    <AppLink
                      href={link.href}
                      key={link.label}
                      className="flex items-center gap-3 rounded-2xl border border-accent-100 bg-white px-4 py-3 text-accent-700 hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700 transition-colors"
                    >
                      <div className="rounded-xl bg-accent-100 p-2 text-primary-600">
                        <Icon icon={link.icon} className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
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
