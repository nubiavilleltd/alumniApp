// // features/admin/pages/AdminDashboardPage.tsx
// // MODIFIED: Upcoming Events panel now wired to real useUpcomingEvents hook.
// // Total Members stat derived from approved members count.
// // Upcoming Events stat derived from real events count.

// import { Icon } from '@iconify/react';
// import { useState, type ReactNode } from 'react';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { type AdminStat, type PendingMember } from '../api/adminDashboardApi';
// import { useAdminDashboard, useApproveMember, useRejectMember } from '../hooks/useAdminDashboard';
// import { useUpcomingEvents } from '@/features/events/hooks/useEvents';
// import { SEO } from '@/shared/common/SEO';
// import { ALUMNI_ROUTES } from '@/features/alumni/routes';
// import { USER_ROUTES } from '@/features/user/routes';
// import { EVENT_ROUTES } from '@/features/events/routes';
// import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';
// import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
// import { toast } from '@/shared/components/ui/Toast';
// import { ADMIN_ROUTES } from '../routes';
// import { PROJECT_ROUTES } from '@/features/projects/routes';

// // ─── Tone map ─────────────────────────────────────────────────────────────────

// const statToneClass: Record<AdminStat['tone'], string> = {
//   primary: 'from-primary-500 to-primary-700 text-white',
//   accent: 'from-accent-800 to-accent-950 text-white',
//   secondary: 'from-secondary-500 to-secondary-700 text-white',
//   warning: 'from-amber-500 to-orange-600 text-white',
// };

// // ─── Stat Card ────────────────────────────────────────────────────────────────

// function StatCard({ stat, overrideValue }: { stat: AdminStat; overrideValue?: string }) {
//   return (
//     <div className={`rounded-[1.5rem] bg-gradient-to-br p-5 shadow-lg ${statToneClass[stat.tone]}`}>
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-sm font-medium text-white/80">{stat.label}</p>
//           <p className="mt-3 text-2xl font-bold">{overrideValue ?? stat.value}</p>
//           <p className="mt-2 text-sm text-white/80">{stat.detail}</p>
//         </div>
//         <div className="rounded-2xl bg-white/10 p-3">
//           <Icon icon={stat.icon} className="h-6 w-6" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Section Card ─────────────────────────────────────────────────────────────

// function SectionCard({
//   title,
//   action,
//   children,
// }: {
//   title: string;
//   action?: ReactNode;
//   children: ReactNode;
// }) {
//   return (
//     <section className="rounded-[1.5rem] border border-accent-200 bg-white p-5 shadow-sm">
//       <div className="flex items-center justify-between gap-3">
//         <h2 className="text-lg font-semibold text-accent-900">{title}</h2>
//         {action}
//       </div>
//       <div className="mt-5">{children}</div>
//     </section>
//   );
// }

// // ─── Pending Member Row ───────────────────────────────────────────────────────

// function PendingMemberRow({
//   member,
//   onApprove,
//   onReject,
// }: {
//   member: PendingMember;
//   onApprove: (id: string) => void;
//   onReject: (id: string, reason?: string) => void;
// }) {
//   const [showRejectInput, setShowRejectInput] = useState(false);
//   const [rejectReason, setRejectReason] = useState('');
//   const [actionError, setActionError] = useState('');

//   const approveMutation = useApproveMember();
//   const rejectMutation = useRejectMember();
//   const busy = approveMutation.isPending || rejectMutation.isPending;

//   const handleApprove = async () => {
//     setActionError('');
//     try {
//       await approveMutation.mutateAsync(member.id);
//       onApprove(member.id);
//       toast.success('Account successfully approved');
//     } catch (error: any) {
//       setActionError(error.message ?? 'Approval failed. Please try again.');
//     }
//   };

//   const handleRejectConfirm = async () => {
//     setActionError('');
//     try {
//       await rejectMutation.mutateAsync({
//         userId: member.id,
//         reason: rejectReason.trim() || undefined,
//       });
//       onReject(member.id, rejectReason.trim() || undefined);
//       toast.success('Account successfully rejected');
//     } catch (error: any) {
//       setActionError(error.message ?? 'Rejection failed. Please try again.');
//     }
//   };

//   return (
//     <div className="flex flex-col gap-3 rounded-2xl border border-accent-100 bg-accent-50/60 px-4 py-4">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="min-w-0 flex-1">
//           <div className="flex flex-wrap items-center gap-2">
//             <p className="font-medium text-accent-900">{member.fullName}</p>
//             <span className="rounded-full border border-accent-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-accent-700">
//               Class of {member.graduationYear}
//             </span>
//           </div>
//           <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-accent-600">
//             <span>
//               <span className="font-medium text-accent-800">School:</span> {member.nameInSchool}
//             </span>
//             <span>
//               <span className="font-medium text-accent-800">Email:</span> {member.email}
//             </span>
//             <span>
//               <span className="font-medium text-accent-800">Nickname:</span>{' '}
//               {member.nickName?.trim() || 'Not provided'}
//             </span>
//           </div>
//           <p className="mt-1 text-xs text-accent-600">
//             <span className="font-medium text-accent-800">Address:</span>{' '}
//             {member.residentialAddress?.trim() || 'Not provided'}
//           </p>
//           <p className="mt-1 text-[11px] text-accent-400">
//             Submitted {new Date(member.submittedAt).toLocaleDateString()}
//           </p>
//         </div>
//         {!showRejectInput && (
//           <div className="flex gap-2 flex-shrink-0">
//             <button
//               type="button"
//               disabled={busy}
//               onClick={handleApprove}
//               className="btn btn-primary btn-sm min-w-[80px]"
//             >
//               {approveMutation.isPending ? (
//                 <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//               ) : (
//                 'Approve'
//               )}
//             </button>
//             <button
//               type="button"
//               disabled={busy}
//               onClick={() => {
//                 setShowRejectInput(true);
//                 setActionError('');
//               }}
//               className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50"
//             >
//               Reject
//             </button>
//           </div>
//         )}
//       </div>

//       {showRejectInput && (
//         <div className="space-y-2 border-t border-accent-100 pt-3">
//           <label className="block text-xs font-medium text-accent-700">
//             Reason for rejection <span className="font-normal text-accent-400">(optional)</span>
//           </label>
//           <textarea
//             rows={2}
//             placeholder="e.g. Could not verify graduation details provided."
//             value={rejectReason}
//             onChange={(e) => setRejectReason(e.target.value)}
//             className="w-full rounded-xl border border-accent-200 bg-white px-3 py-2 text-sm text-accent-900 placeholder:text-accent-300 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 resize-none"
//           />
//           <div className="flex gap-2">
//             <button
//               type="button"
//               disabled={busy}
//               onClick={handleRejectConfirm}
//               className="btn btn-sm bg-red-500 text-white hover:bg-red-600 min-w-[100px]"
//             >
//               {rejectMutation.isPending ? (
//                 <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//               ) : (
//                 'Confirm reject'
//               )}
//             </button>
//             <button
//               type="button"
//               disabled={busy}
//               onClick={() => {
//                 setShowRejectInput(false);
//                 setRejectReason('');
//                 setActionError('');
//               }}
//               className="btn btn-outline btn-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {actionError && (
//         <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{actionError}</p>
//       )}
//     </div>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function AdminSkeleton() {
//   return (
//     <section className="section">
//       <div className="container-custom space-y-6 animate-pulse">
//         <div className="h-32 rounded-[2rem] bg-accent-900/80" />
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="h-32 rounded-[1.5rem] bg-accent-100" />
//           ))}
//         </div>
//         <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
//           <div className="h-96 rounded-[1.5rem] bg-accent-100" />
//           <div className="space-y-6">
//             <div className="h-44 rounded-[1.5rem] bg-accent-100" />
//             <div className="h-44 rounded-[1.5rem] bg-accent-100" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export function AdminDashboardPage() {
//   // const currentUser = useAuthStore((state) => state.user);

//   const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUser();

//   const { data: dashboard, isLoading, isError, refetch } = useAdminDashboard();

//   // Real upcoming events — replaces the placeholder empty array
//   const { data: upcomingEvents = [], isLoading: eventsLoading } = useUpcomingEvents();

//   // Optimistic removal after approve/reject
//   const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
//   const handleApprove = (id: string) => setRemovedIds((prev) => new Set([...prev, id]));
//   const handleReject = (id: string) => setRemovedIds((prev) => new Set([...prev, id]));

//   if (isLoading || isLoadingProfile) return <AdminSkeleton />;

//   if (isError || !dashboard) {
//     return (
//       <section className="section">
//         <div className="container-custom">
//           <div className="mx-auto max-w-2xl rounded-[2rem] border border-secondary-200 bg-white p-8 text-center shadow-sm">
//             <Icon
//               icon="mdi:alert-circle-outline"
//               className="h-10 w-10 text-secondary-500 mx-auto"
//             />
//             <h1 className="mt-4 text-2xl font-bold text-accent-900">Dashboard unavailable</h1>
//             <p className="mt-2 text-sm text-accent-600">
//               Could not load admin dashboard data. Please try again.
//             </p>
//             <button type="button" className="btn btn-primary mt-6" onClick={() => void refetch()}>
//               Try again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const visiblePending = dashboard.pendingApprovals.filter((m) => !removedIds.has(m.id));

//   // Derive real stat values where possible
//   const totalMembersValue =
//     dashboard.recentMembers.length > 0 ? String(dashboard.recentMembers.length) + '+' : '—';
//   const upcomingEventsValue = eventsLoading ? '…' : String(upcomingEvents.length);

//   // Next 3 upcoming events for the sidebar panel
//   const nextUpcoming = upcomingEvents.slice(0, 3);

//   return (
//     <>
//       <SEO title="Admin Dashboard" description="Admin dashboard" />
//       <section className="section bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.1),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#ffffff)]">
//         <div className="container-custom space-y-6">
//           {/* ── Banner ──────────────────────────────────────────────── */}
//           <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_60%,_#1d4ed8_100%)] p-6 text-white shadow-2xl md:p-8">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
//             <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-3">
//                   <Icon icon="mdi:shield-crown-outline" className="w-3.5 h-3.5" />
//                   Admin Panel
//                 </div>
//                 <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
//                 <p className="mt-1 text-sm text-white/60">
//                   Signed in as {currentUser?.fullName ?? 'Admin'}
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <AppLink
//                   href={ALUMNI_ROUTES.PROFILES}
//                   className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15 transition-colors"
//                 >
//                   <Icon icon="mdi:account-group-outline" className="h-4 w-4" />
//                   Members
//                 </AppLink>
//                 <AppLink
//                   href={USER_ROUTES.DASHBOARD}
//                   className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/15 transition-colors"
//                 >
//                   <Icon icon="mdi:account-outline" className="h-4 w-4" />
//                   My Dashboard
//                 </AppLink>
//               </div>
//             </div>
//           </section>

//           {/* ── Stats ───────────────────────────────────────────────── */}
//           <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//             {dashboard.stats.map((stat) => (
//               <StatCard
//                 key={stat.id}
//                 stat={stat}
//                 // Override with real values where available
//                 overrideValue={
//                   stat.id === 'members'
//                     ? totalMembersValue
//                     : stat.id === 'events'
//                       ? upcomingEventsValue
//                       : undefined
//                 }
//               />
//             ))}
//           </section>

//           {/* ── Main grid ───────────────────────────────────────────── */}
//           <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
//             {/* Left */}
//             <div className="space-y-6">
//               {/* Pending approvals */}
//               <SectionCard
//                 title={`Pending Approvals${visiblePending.length > 0 ? ` (${visiblePending.length})` : ''}`}
//               >
//                 {visiblePending.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-10 text-center">
//                     <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3">
//                       <Icon icon="mdi:check-all" className="w-6 h-6 text-primary-500" />
//                     </div>
//                     <p className="font-medium text-accent-800">All caught up!</p>
//                     <p className="mt-1 text-sm text-accent-500">
//                       No registrations awaiting approval.
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {visiblePending.map((member) => (
//                       <PendingMemberRow
//                         key={member.id}
//                         member={member}
//                         onApprove={handleApprove}
//                         onReject={handleReject}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Recent members */}
//               <SectionCard
//                 title="Recent Members"
//                 action={
//                   <AppLink
//                     href="/admin/members"
//                     className="text-sm font-semibold text-primary-600 hover:text-primary-700"
//                   >
//                     View all
//                   </AppLink>
//                 }
//               >
//                 {dashboard.recentMembers.length === 0 ? (
//                   <p className="text-sm text-accent-400 py-4 text-center">No recent members yet.</p>
//                 ) : (
//                   <div className="space-y-3">
//                     {dashboard.recentMembers.map((m) => (
//                       <div
//                         key={m.slug}
//                         className="flex items-center gap-3 rounded-2xl border border-accent-100 px-4 py-3"
//                       >
//                         <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent-100 text-sm font-semibold text-accent-700">
//                           {m.name
//                             .split(' ')
//                             .slice(0, 2)
//                             .map((p) => p[0])
//                             .join('')}
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="font-medium text-accent-900 truncate">{m.name}</p>
//                           <p className="text-xs text-accent-500 truncate">{m.email}</p>
//                         </div>
//                         <span className="text-xs text-accent-400 flex-shrink-0">
//                           {new Date(m.joinedAt).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'short',
//                           })}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>
//             </div>

//             {/* Right */}
//             <div className="space-y-6">
//               {/* Upcoming Events — now real data */}
//               <SectionCard
//                 title="Upcoming Events"
//                 action={
//                   <AppLink
//                     href={EVENT_ROUTES.ROOT}
//                     className="text-sm font-semibold text-primary-600 hover:text-primary-700"
//                   >
//                     Manage
//                   </AppLink>
//                 }
//               >
//                 {eventsLoading ? (
//                   <div className="space-y-3 animate-pulse">
//                     {[1, 2, 3].map((i) => (
//                       <div key={i} className="h-14 rounded-2xl bg-accent-100" />
//                     ))}
//                   </div>
//                 ) : nextUpcoming.length === 0 ? (
//                   <p className="text-sm text-accent-400 py-4 text-center">No upcoming events.</p>
//                 ) : (
//                   <div className="space-y-3">
//                     {nextUpcoming.map((event) => (
//                       <AppLink
//                         href={EVENT_ROUTES.DETAIL(event.id)}
//                         key={event.id}
//                         className="block rounded-2xl border border-accent-100 bg-accent-50 px-4 py-3 hover:border-primary-200 hover:bg-primary-50/60 transition-colors"
//                       >
//                         <p className="font-medium text-accent-900 text-sm truncate">
//                           {event.title}
//                         </p>
//                         <p className="mt-0.5 text-xs text-accent-500">
//                           {new Date(event.date).toLocaleDateString('en-GB', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric',
//                           })}
//                           {event.location ? ` · ${event.location}` : ''}
//                         </p>
//                       </AppLink>
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Quick Actions */}
//               <SectionCard title="Quick Actions">
//                 <div className="space-y-2">
//                   {[
//                     {
//                       label: 'Manage Members',
//                       href: '/admin/members',
//                       icon: 'mdi:account-group-outline',
//                     },
//                     {
//                       label: 'Create Event',
//                       href: EVENT_ROUTES.CREATE,
//                       icon: 'mdi:calendar-plus-outline',
//                     },
//                     {
//                       label: 'View Event Registrations',
//                       href: ADMIN_ROUTES.EVENT_REGISTRATIONS,
//                       icon: 'mdi:clipboard-list-outline',
//                     },
//                     {
//                       label: 'Manage Announcements',
//                       href: ADMIN_ROUTES.ANNOUNCEMENTS,
//                       icon: 'mdi:bullhorn-outline',
//                     },
//                     {
//                       label: 'View Marketplace',
//                       href: MARKETPLACE_ROUTES.ROOT,
//                       icon: 'mdi:store-outline',
//                     },
//                     {
//                       label: 'View Projects',
//                       href: PROJECT_ROUTES.ROOT,
//                       icon: 'mdi:briefcase-outline',
//                     },
//                     // { label: 'Site Settings', href: '/admin/settings', icon: 'mdi:cog-outline' },
//                   ].map((link) => (
//                     <AppLink
//                       href={link.href}
//                       key={link.label}
//                       className="flex items-center gap-3 rounded-2xl border border-accent-100 bg-white px-4 py-3 text-accent-700 hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700 transition-colors"
//                     >
//                       <div className="rounded-xl bg-accent-100 p-2 text-primary-600">
//                         <Icon icon={link.icon} className="h-4 w-4" />
//                       </div>
//                       <span className="text-sm font-medium">{link.label}</span>
//                     </AppLink>
//                   ))}
//                 </div>
//               </SectionCard>
//             </div>
//           </section>
//         </div>
//       </section>
//     </>
//   );
// }

// features/admin/pages/AdminDashboardPage.tsx
// REDESIGNED: Matches screenshot exactly with:
// - Dark blue gradient banner with tabs
// - 4 stat cards (Total, Active, Inactive, Pending)
// - Pending Approvals section with full details
// - Fully responsive on all screen sizes

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useAdminDashboard, useApproveMember, useRejectMember } from '../hooks/useAdminDashboard';
import { SEO } from '@/shared/common/SEO';
import { ROUTES } from '@/shared/constants/routes';
import { ADMIN_ROUTES } from '../routes';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { toast } from '@/shared/components/ui/Toast';
import { PROJECT_ROUTES } from '@/features/projects/routes';
import type { PendingMember } from '../api/adminDashboardApi';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';

// ═══════════════════════════════════════════════════════════════════════════
// PENDING APPROVAL ROW
// ═══════════════════════════════════════════════════════════════════════════

function PendingApprovalRow({
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

  const handleConfirm = async () => {
    setActionError('');
    try {
      await approveMutation.mutateAsync(member.id);
      onApprove(member.id);
      toast.success('Account successfully approved');
    } catch (error: any) {
      setActionError(error.message ?? 'Approval failed. Please try again.');
    }
  };

  const handleDeny = async () => {
    setActionError('');
    try {
      await rejectMutation.mutateAsync({
        userId: member.id,
        reason: rejectReason.trim() || undefined,
      });
      onReject(member.id, rejectReason.trim() || undefined);
      toast.success('Account successfully rejected');
    } catch (error: any) {
      setActionError(error.message ?? 'Rejection failed. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left: User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base">
              {member.fullName}
              {member.nickName && member.nickName.trim() && (
                <span className="font-normal text-gray-600"> nee {member.nameInSchool}</span>
              )}
            </h3>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <p className="text-gray-700">
                <span className="font-medium">Class of</span> {member.graduationYear}
              </p>
              {member.nickName && member.nickName.trim() && (
                <p className="text-gray-700">
                  <span className="font-medium">A.K.A</span> {member.nickName}
                </p>
              )}
            </div>

            <p className="text-gray-700">{member.email}</p>

            {/* {member.department && member.department.trim() && (
              <p className="text-gray-700">
                <span className="font-medium">Position Held in School:</span> {member.department}
              </p>
            )} */}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Registered on{' '}
            {new Date(member.submittedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Right: Action Buttons */}
        {!showRejectInput && (
          <div className="flex lg:flex-col gap-3 flex-shrink-0">
            <button
              type="button"
              disabled={busy}
              onClick={handleConfirm}
              className="flex-1 lg:flex-none bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-2.5 rounded-full transition-colors disabled:opacity-50 min-w-[120px] flex items-center justify-center"
            >
              {approveMutation.isPending ? (
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              ) : (
                'Confirm'
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setShowRejectInput(true);
                setActionError('');
              }}
              className="flex-1 lg:flex-none border-2 border-red-400 text-red-500 hover:bg-red-50 text-sm font-semibold px-8 py-2.5 rounded-full transition-colors disabled:opacity-50 min-w-[120px]"
            >
              Deny
            </button>
          </div>
        )}
      </div>

      {/* Deny Reason Input */}
      {showRejectInput && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Reason for denial <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Could not verify graduation details provided."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
          />
          <div className="flex gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={handleDeny}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-6 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {rejectMutation.isPending && (
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              )}
              Confirm deny
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setShowRejectInput(false);
                setRejectReason('');
                setActionError('');
              }}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold px-6 py-2 rounded-full transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {actionError && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{actionError}</p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'cyan' | 'gray' | 'orange';
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-[#1e5aa8] to-[#2563eb] text-white',
    cyan: 'from-[#0891b2] to-[#06b6d4] text-white',
    gray: 'from-[#475569] to-[#64748b] text-white',
    orange: 'from-[#ea580c] to-[#f97316] text-white',
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${colorClasses[color]} p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80 mb-2">{label}</p>
          <p className="text-4xl font-bold">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon icon={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════════════

function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f4f0]">
      {/* Banner Skeleton */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#1e40af] animate-pulse">
        <div className="container-custom py-8">
          <div className="h-8 w-64 bg-white/20 rounded mb-2" />
          <div className="h-4 w-40 bg-white/20 rounded mb-6" />
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-32 bg-white/20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>

        {/* Pending Approvals Skeleton */}
        <div className="bg-white rounded-2xl p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export function AdminDashboardPage() {
  const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUser();
  const { data: dashboard, isLoading, isError, refetch } = useAdminDashboard();
  const { data: alumniList = [], isLoading: isLoadingAlumni } = useAlumni();

  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const handleApprove = (id: string) => setRemovedIds((prev) => new Set([...prev, id]));
  const handleReject = (id: string) => setRemovedIds((prev) => new Set([...prev, id]));

  if (isLoading || isLoadingProfile || isLoadingAlumni) {
    return (
      <>
        <SEO title="Admin Dashboard" description="Admin dashboard" />
        <AdminDashboardSkeleton />
      </>
    );
  }

  if (isError || !dashboard) {
    return (
      <section className="section">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <Icon icon="mdi:alert-circle-outline" className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard unavailable</h1>
            <p className="text-sm text-gray-600 mb-6">
              Could not load admin dashboard data. Please try again.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => void refetch()}>
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const visiblePending = dashboard.pendingApprovals.filter((m) => !removedIds.has(m.id));

  // Calculate stats
  const totalMembers = alumniList.length; // This should come from backend
  const activeMembers = alumniList.filter((m) => m.isActive !== false).length;
  const inactiveMembers = totalMembers - activeMembers;
  const pendingApprovals = visiblePending.length;

  // Navigation tabs
  const tabs = [
    { id: 'dashboard', label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
    { id: 'members', label: 'Members', href: ADMIN_ROUTES.MEMBERS },
    { id: 'events', label: 'Events', href: ADMIN_ROUTES.EVENTS },
    { id: 'announcements', label: 'Announcements', href: ADMIN_ROUTES.ANNOUNCEMENTS },
    { id: 'projects', label: 'Projects', href: PROJECT_ROUTES.ROOT },
  ];

  return (
    <>
      <SEO title="Admin Dashboard" description="Admin dashboard" />

      <div className="min-h-screen bg-[#f5f4f0]">
        {/* ══════════════════════════════════════════════════════════
            BANNER WITH GRADIENT BACKGROUND & TABS
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#1e3a5f] to-[#1e40af] relative overflow-hidden">
          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_50%)]" />

          <div className="container-custom flex justify-between items-center py-6 sm:py-8 relative z-10">
            <div>
              {/* Admin Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-3 py-1.5 mb-3">
                <Icon icon="mdi:shield-crown-outline" className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-semibold text-amber-200 uppercase tracking-wide">
                  Admin Panel
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-sm text-white/70 mb-6">
                Signed in as {currentUser?.fullName ?? 'Admin'}
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {tabs.map((tab) => (
                <AppLink
                  key={tab.id}
                  href={tab.href}
                  className={`
                    px-4 sm:px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${
                      tab.id === 'dashboard'
                        ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                        : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {tab.label}
                </AppLink>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            MAIN CONTENT
            ═══════════════════════════════════════════════════════ */}
        <div className="container-custom py-6 sm:py-8">
          {/* ══════════════════════════════════════════════════════════
              STAT CARDS (4 columns)
              ═══════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Members"
              value={totalMembers}
              icon="mdi:account-group"
              color="blue"
            />
            <StatCard
              label="Active Members"
              value={activeMembers}
              icon="mdi:account-check"
              color="cyan"
            />
            <StatCard
              label="Inactive Members"
              value={inactiveMembers}
              icon="mdi:account-off"
              color="gray"
            />
            <StatCard
              label="Pending Approvals"
              value={pendingApprovals}
              icon="mdi:account-clock"
              color="orange"
            />
          </div>

          {/* ══════════════════════════════════════════════════════════
              PENDING APPROVALS SECTION
              ═══════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Pending Approvals</h2>
            </div>

            <div className="p-6">
              {visiblePending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                    <Icon icon="mdi:check-all" className="w-8 h-8 text-primary-500" />
                  </div>
                  <p className="font-semibold text-gray-900 text-lg mb-1">All caught up!</p>
                  <p className="text-sm text-gray-500">No registrations awaiting approval.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visiblePending.map((member) => (
                    <PendingApprovalRow
                      key={member.id}
                      member={member}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
