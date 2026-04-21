// // features/user/pages/UserDashboardPage.tsx

// import { Icon } from '@iconify/react';
// import type { ReactNode } from 'react';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { useUpcomingEvents } from '@/features/events/hooks/useEvents';
// import { useLatestAnnouncements } from '@/features/announcements/hooks/useAnnouncements';
// import { useAlumni } from '@/features/alumni/hooks/useAlumni';
// import { SEO } from '@/shared/common/SEO';
// import { useMyEvents } from '@/features/events/hooks/useEventRegistration';
// import type { Event } from '@/features/events/types/event.types';
// import { ROUTES } from '@/shared/constants/routes';
// import { EVENT_ROUTES } from '@/features/events/routes';
// import { ALUMNI_ROUTES } from '@/features/alumni/routes';
// import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';
// import { USER_ROUTES } from '../routes';
// import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';

// import { useState } from 'react';
// import { usePendingVouches, useApproveVouch, useRejectVouch } from '../hooks/useVoucher';
// import type { PendingVouch } from '../api/voucherApi';

// // ── Helpers ───────────────────────────────────────────────────────────────────

// function formatEventDate(date: string) {
//   return new Date(date).toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
// }

// // ── Dashboard Event Card ──────────────────────────────────────────────────────

// function DashboardEventCard({ event }: { event: Event }) {
//   return (
//     <div className="flex flex-col gap-4 rounded-2xl border border-accent-100 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
//       <div className="flex-1 min-w-0">
//         <p className="font-medium text-accent-900 truncate">{event.title}</p>
//         <p className="mt-1 text-sm text-accent-600">
//           {formatEventDate(event.date)}
//           {event.location ? ` • ${event.location}` : ''}
//         </p>
//       </div>
//       <div className="flex items-center gap-3 flex-shrink-0">
//         <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
//           <Icon icon="mdi:check-circle" className="w-4 h-4" />
//           Registered
//         </div>
//         <AppLink
//           href={EVENT_ROUTES.DETAIL(event.id)}
//           className="text-xs text-primary-600 hover:text-primary-700 font-medium"
//         >
//           Details →
//         </AppLink>
//       </div>
//     </div>
//   );
// }

// // ── Upcoming Event Card (for the upcoming events widget) ──────────────────────

// function UpcomingEventCard({ event }: { event: Event }) {
//   return (
//     <AppLink
//       href={EVENT_ROUTES.DETAIL(event.id)}
//       className="flex items-center gap-3 rounded-2xl border border-accent-100 bg-accent-50/80 px-4 py-3 transition-colors hover:border-primary-200 hover:bg-primary-50/70"
//     >
//       <div className="mt-0.5 rounded-xl bg-white p-2 text-primary-600 shadow-sm flex-shrink-0">
//         <Icon icon="mdi:calendar-outline" className="h-4 w-4" />
//       </div>
//       <div className="min-w-0">
//         <p className="font-medium text-accent-900 truncate">{event.title}</p>
//         <p className="text-xs text-accent-500 mt-0.5">
//           {formatEventDate(event.date)}
//           {event.location ? ` • ${event.location}` : ''}
//         </p>
//       </div>
//     </AppLink>
//   );
// }

// // ── Stat Card ─────────────────────────────────────────────────────────────────

// type StatTone = 'primary' | 'accent' | 'secondary';
// const statToneClass: Record<StatTone, string> = {
//   primary: 'from-primary-500 to-primary-700 text-white',
//   accent: 'from-accent-800 to-accent-950 text-white',
//   secondary: 'from-orange-500 to-orange-500 text-white',
// };

// function StatCard({
//   label,
//   value,
//   detail,
//   icon,
//   tone,
//   loading,
// }: {
//   label: string;
//   value: string;
//   detail: string;
//   icon: string;
//   tone: StatTone;
//   loading?: boolean;
// }) {
//   return (
//     <div className={`rounded-[1.5rem] bg-gradient-to-br p-5 shadow-lg ${statToneClass[tone]}`}>
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-sm font-medium text-white/80">{label}</p>
//           <p className="mt-3 text-2xl font-bold">
//             {loading ? (
//               <span className="inline-block h-7 w-10 animate-pulse rounded-lg bg-white/20" />
//             ) : (
//               value
//             )}
//           </p>
//           <p className="mt-2 text-sm text-white/80">{detail}</p>
//         </div>
//         <div className="rounded-2xl bg-white/10 p-3">
//           <Icon icon={icon} className="h-6 w-6" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Section Card ──────────────────────────────────────────────────────────────

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

// function SectionSkeleton({ rows = 3 }: { rows?: number }) {
//   return (
//     <div className="space-y-3 animate-pulse">
//       {Array.from({ length: rows }).map((_, i) => (
//         <div key={i} className="h-16 rounded-2xl bg-accent-100" />
//       ))}
//     </div>
//   );
// }

// function PendingVouchRow({
//   vouch,
//   onApprove,
//   onReject,
// }: {
//   vouch: PendingVouch;
//   onApprove: (vouchId: string) => void;
//   onReject: (vouchId: string, reason?: string) => void;
// }) {
//   const [showRejectInput, setShowRejectInput] = useState(false);
//   const [rejectReason, setRejectReason] = useState('');
//   const [actionError, setActionError] = useState('');

//   const approveMutation = useApproveVouch();
//   const rejectMutation = useRejectVouch();
//   const busy = approveMutation.isPending || rejectMutation.isPending;

//   const handleApprove = async () => {
//     setActionError('');
//     try {
//       await approveMutation.mutateAsync(vouch.vouchId);
//       onApprove(vouch.vouchId);
//     } catch (error: any) {
//       setActionError(error.message ?? 'Approval failed. Please try again.');
//     }
//   };

//   const handleRejectConfirm = async () => {
//     setActionError('');
//     try {
//       await rejectMutation.mutateAsync({
//         vouchId: vouch.vouchId,
//         reason: rejectReason.trim() || undefined,
//       });
//       onReject(vouch.vouchId, rejectReason.trim() || undefined);
//     } catch (error: any) {
//       setActionError(error.message ?? 'Rejection failed. Please try again.');
//     }
//   };

//   return (
//     <div className="flex flex-col gap-3 rounded-2xl border border-accent-100 bg-accent-50/60 px-4 py-4">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div className="min-w-0 flex-1">
//           <div className="flex flex-wrap items-center gap-2">
//             <p className="font-medium text-accent-900">{vouch.fullName}</p>
//             <span className="rounded-full border border-accent-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-accent-700">
//               Class of {vouch.graduationYear}
//             </span>
//           </div>
//           <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-accent-600">
//             {vouch.nameInSchool?.trim() && (
//               <span>
//                 <span className="font-medium text-accent-800">School:</span> {vouch.nameInSchool}
//               </span>
//             )}
//             {vouch.department?.trim() && (
//               <span>
//                 <span className="font-medium text-accent-800">Department:</span> {vouch.department}
//               </span>
//             )}
//             <span>
//               <span className="font-medium text-accent-800">Email:</span> {vouch.email}
//             </span>
//             <span>
//               <span className="font-medium text-accent-800">Phone:</span>{' '}
//               {vouch.phone?.trim() || 'Not provided'}
//             </span>
//             <span>
//               <span className="font-medium text-accent-800">Nickname:</span>{' '}
//               {vouch.nickName?.trim() || 'Not provided'}
//             </span>
//           </div>
//           <p className="mt-1 text-xs text-accent-600">
//             <span className="font-medium text-accent-800">Address:</span>{' '}
//             {vouch.residentialAddress?.trim() || 'Not provided'}
//           </p>
//           <p className="mt-1 text-[11px] text-accent-400">
//             Submitted {new Date(vouch.createdAt).toLocaleDateString()}
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
//             placeholder="e.g. I do not recognise this person as an alumna of FGGC."
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

// // ── Page ──────────────────────────────────────────────────────────────────────

// export function UserDashboardPage() {
//   // const currentUser = useAuthStore((state) => state.user);

//   const { data: currentUser, isLoading: isLoadingProfile } = useCurrentUser();
//   const { data: pendingVouches = [], isLoading: vouchesLoading } = usePendingVouches();

//   const [removedVouchIds, setRemovedVouchIds] = useState<Set<string>>(new Set());
//   const handleVouchApprove = (vouchId: string) =>
//     setRemovedVouchIds((prev) => new Set([...prev, vouchId]));
//   const handleVouchReject = (vouchId: string) =>
//     setRemovedVouchIds((prev) => new Set([...prev, vouchId]));

//   // Real data
//   const { data: upcomingEvents = [], isLoading: eventsLoading } = useUpcomingEvents();
//   const { data: announcements = [], isLoading: announcementsLoading } = useLatestAnnouncements(3);
//   const { data: allAlumni = [], isLoading: alumniLoading } = useAlumni({ action_type: 'approved' });

//   // TODO: myEvents is blocked on backend implementing POST /get_events { user_id }
//   //       returning only RSVP'd events with rsvp_status per event.
//   //       Until then this returns an empty array.
//   const { events: myEvents = [], isLoading: myEventsLoading } = useMyEvents();

//   // My registered upcoming events (max 3 for dashboard)
//   const myRegisteredEvents = myEvents
//     .filter((event: Event) => new Date(event.date) >= new Date())
//     .slice(0, 3);

//   // Next 3 upcoming events for the widget
//   const nextUpcoming = upcomingEvents.slice(0, 3);

//   // ── Profile completion ───────────────────────────────────────────────────
//   const profileCompletion = (() => {
//     if (!currentUser) return 0;
//     const checks = [
//       currentUser.photo,
//       currentUser.alternativePhone,
//       currentUser.birthDate,
//       currentUser.residentialAddress,
//       currentUser.employmentStatus,
//       currentUser.occupations?.length,
//       currentUser.industrySectors?.length,
//       currentUser.isVolunteer !== undefined ? true : undefined,
//     ];
//     const filled = checks.filter(Boolean).length;
//     return Math.min(100, Math.round(40 + (filled / checks.length) * 60));
//   })();

//   const profileTasks: string[] = [];
//   if (currentUser && !currentUser.photo) profileTasks.push('Upload a profile photo');
//   if (currentUser && !currentUser.employmentStatus) profileTasks.push('Add your employment status');
//   if (currentUser && !currentUser.occupations?.length) profileTasks.push('Add your occupation(s)');
//   if (currentUser && !currentUser.residentialAddress)
//     profileTasks.push('Add your residential address');

//   const suggestedAlumni = allAlumni.filter((a) => a.slug !== currentUser?.slug).slice(0, 2);

//   const communityUpdates = [
//     {
//       title: 'Mentorship circle opens next week',
//       subtitle: 'Join a cross-year mentoring group before seats fill up.',
//       href: ROUTES.ABOUT,
//     },
//     {
//       title: 'Regional meetup planning has started',
//       subtitle: 'See the latest planning note and volunteer opportunities.',
//       href: EVENT_ROUTES.ROOT,
//     },
//     {
//       title: 'Community directory refresh underway',
//       subtitle: 'Profiles with complete details will be featured more often.',
//       href: ALUMNI_ROUTES.PROFILES,
//     },
//   ];

//   const quickLinks = [
//     { label: 'Edit Profile', href: USER_ROUTES.PROFILE, icon: 'mdi:account-edit-outline' },
//     { label: 'My Events', href: EVENT_ROUTES.MY_EVENTS, icon: 'mdi:calendar-check-outline' },
//     { label: 'View Directory', href: ALUMNI_ROUTES.PROFILES, icon: 'mdi:account-group-outline' },
//     { label: 'Browse Events', href: EVENT_ROUTES.ROOT, icon: 'mdi:calendar-month-outline' },
//     { label: 'My Business', href: MARKETPLACE_ROUTES.MY_BUSINESS, icon: 'mdi:store-outline' },
//   ];

//   const isLoading =
//     eventsLoading ||
//     myEventsLoading ||
//     isLoadingProfile ||
//     announcementsLoading ||
//     vouchesLoading ||
//     isLoadingProfile;

//   const visiblePendingVouches = pendingVouches.filter((v) => !removedVouchIds.has(v.vouchId));

//   return (
//     <>
//       <SEO title="Dashboard" description="Your alumni dashboard" />
//       <section className="section bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.08),_transparent_28%),linear-gradient(180deg,_#ffffff,_#f8fafc)]">
//         <div className="container-custom space-y-6">
//           {/* ── Hero banner ────────────────────────────────────────────── */}
//           <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a_0%,_#1e293b_48%,_#1d4ed8_100%)] p-6 text-white shadow-2xl md:p-8">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(96,165,250,0.25),_transparent_34%)]" />
//             <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//               <div>
//                 <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
//                   Welcome back
//                 </p>
//                 <h1 className="mt-3 text-3xl font-bold md:text-4xl">{currentUser?.fullName}</h1>
//                 <p className="mt-1 text-sm text-white/60">Class of {currentUser?.graduationYear}</p>
//                 <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85">
//                   <span className="font-semibold">{profileCompletion}% complete</span>
//                   <span className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
//                     <span
//                       className="block h-full rounded-full bg-primary-200 transition-all duration-500"
//                       style={{ width: `${profileCompletion}%` }}
//                     />
//                   </span>
//                   {/* <span>Profile</span> */}
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 self-start">
//                 {/* TODO: Wire to a notifications endpoint when backend provides one */}
//                 {/* <button
//                   type="button"
//                   className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white/15"
//                 >
//                   <Icon icon="mdi:bell-outline" className="h-5 w-5" />
//                   <span>Notifications</span>
//                 </button> */}
//                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-base font-bold shadow-lg">
//                   {currentUser?.avatarInitials}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ── Stats ──────────────────────────────────────────────────── */}
//           <section className="grid gap-4 md:grid-cols-2">
//             <StatCard
//               label="My Registered Events"
//               value={String(myRegisteredEvents.length)}
//               detail="Upcoming events you've registered for"
//               icon="mdi:calendar-check"
//               tone="primary"
//               loading={isLoading}
//             />
//             {/* <StatCard
//               label="Announcements"
//               value={String(announcements.length)}
//               detail="Fresh updates to review"
//               icon="mdi:bullhorn-outline"
//               tone="accent"
//               loading={announcementsLoading}
//             /> */}

//             {/* {pendingVouches.length > 0 && (
//               <StatCard
//                 label="Pending Vouches"
//                 value={String(visiblePendingVouches.length)}
//                 detail="Awaiting your review"
//                 icon="mdi:account-check-outline"
//                 tone="secondary"
//                 loading={vouchesLoading}
//               />
//             )} */}

//             <StatCard
//               label="Pending Vouches"
//               value={String(visiblePendingVouches.length)}
//               detail="Awaiting your review"
//               icon="mdi:account-check-outline"
//               tone="secondary"
//               loading={vouchesLoading}
//             />
//           </section>

//           {/* ── Main grid ──────────────────────────────────────────────── */}
//           <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
//             {/* Left column */}
//             <div className="space-y-6">
//               {/* {pendingVouches.length > 0 && (
//                 <SectionCard
//                   title={`Pending Vouches${visiblePendingVouches.length > 0 ? ` (${visiblePendingVouches.length})` : ''}`}
//                 >
//                   {vouchesLoading ? (
//                     <SectionSkeleton rows={2} />
//                   ) : visiblePendingVouches.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-10 text-center">
//                       <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3">
//                         <Icon icon="mdi:check-all" className="w-6 h-6 text-primary-500" />
//                       </div>
//                       <p className="font-medium text-accent-800">All caught up!</p>
//                       <p className="mt-1 text-sm text-accent-500">No pending vouches to review.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-3">
//                       {visiblePendingVouches.map((vouch) => (
//                         <PendingVouchRow
//                           key={vouch.vouchId}
//                           vouch={vouch}
//                           onApprove={handleVouchApprove}
//                           onReject={handleVouchReject}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </SectionCard>
//               )} */}

//               <SectionCard
//                 title={`Pending Vouches${visiblePendingVouches.length > 0 ? ` (${visiblePendingVouches.length})` : ''}`}
//               >
//                 {vouchesLoading ? (
//                   <SectionSkeleton rows={2} />
//                 ) : visiblePendingVouches.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-10 text-center">
//                     <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3">
//                       <Icon icon="mdi:check-all" className="w-6 h-6 text-primary-500" />
//                     </div>
//                     <p className="font-medium text-accent-800">All caught up!</p>
//                     <p className="mt-1 text-sm text-accent-500">No pending vouches to review.</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {visiblePendingVouches.map((vouch) => (
//                       <PendingVouchRow
//                         key={vouch.vouchId}
//                         vouch={vouch}
//                         onApprove={handleVouchApprove}
//                         onReject={handleVouchReject}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Announcements */}
//               {/* <SectionCard
//                 title="Announcements"
//                 action={
//                   <AppLink
//                     href="/announcements"
//                     className="text-sm font-semibold text-primary-600 hover:text-primary-700"
//                   >
//                     View all
//                   </AppLink>
//                 }
//               >
//                 {announcementsLoading ? (
//                   <SectionSkeleton rows={3} />
//                 ) : (
//                   <div className="space-y-3">
//                     {announcements.length > 0 ? (
//                       announcements.map((item) => (
//                         <AppLink
//                           href={`/announcements/${item.slug}`}
//                           key={item.slug}
//                           className="flex items-start gap-3 rounded-2xl border border-accent-100 bg-accent-50/80 px-4 py-4 transition-colors hover:border-primary-200 hover:bg-primary-50/70"
//                         >
//                           <div className="mt-0.5 rounded-xl bg-white p-2 text-primary-600 shadow-sm">
//                             <Icon icon="mdi:bullhorn-outline" className="h-4 w-4" />
//                           </div>
//                           <div className="min-w-0">
//                             <p className="font-medium text-accent-900">{item.title}</p>
//                           </div>
//                         </AppLink>
//                       ))
//                     ) : (
//                       <p className="text-sm text-accent-400 py-4 text-center">
//                         No announcements yet.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </SectionCard> */}

//               {/* My Registered Events */}
//               <SectionCard
//                 title="My Registered Events"
//                 action={
//                   <AppLink
//                     href={EVENT_ROUTES.MY_EVENTS}
//                     className="text-sm font-semibold text-primary-600 hover:text-primary-700"
//                   >
//                     View all
//                   </AppLink>
//                 }
//               >
//                 {isLoading ? (
//                   <SectionSkeleton rows={3} />
//                 ) : myRegisteredEvents.length > 0 ? (
//                   <div className="space-y-3">
//                     {myRegisteredEvents.map((event: Event) => (
//                       <DashboardEventCard key={event.id} event={event} />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <Icon
//                       icon="mdi:calendar-blank-outline"
//                       className="w-12 h-12 mx-auto mb-3 text-gray-300"
//                     />
//                     <p className="text-sm mb-3">
//                       You haven't registered for any upcoming events yet.
//                     </p>
//                     <AppLink
//                       href={EVENT_ROUTES.ROOT}
//                       className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-semibold"
//                     >
//                       Browse Events <Icon icon="mdi:arrow-right" className="w-4 h-4" />
//                     </AppLink>
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Upcoming Events (real data from backend) */}
//               <SectionCard
//                 title="Upcoming Events"
//                 action={
//                   <AppLink
//                     href={EVENT_ROUTES.ROOT}
//                     className="text-sm font-semibold text-primary-600 hover:text-primary-700"
//                   >
//                     View all
//                   </AppLink>
//                 }
//               >
//                 {eventsLoading ? (
//                   <SectionSkeleton rows={3} />
//                 ) : nextUpcoming.length > 0 ? (
//                   <div className="space-y-3">
//                     {nextUpcoming.map((event) => (
//                       <UpcomingEventCard key={event.id} event={event} />
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-accent-400 py-4 text-center">No upcoming events.</p>
//                 )}
//               </SectionCard>
//             </div>

//             {/* Right column */}
//             <div className="space-y-6">
//               {/* Profile completion */}
//               <SectionCard title="Profile Completion">
//                 <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4">
//                   <div className="flex items-center justify-between gap-4">
//                     <div>
//                       <p className="text-sm font-medium text-primary-900">Profile progress</p>
//                       <p className="mt-1 text-3xl font-bold text-primary-900">
//                         {profileCompletion}%
//                       </p>
//                     </div>
//                     <div className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-primary-700 shadow-sm">
//                       {profileCompletion === 100 ? 'Complete!' : 'Keep going'}
//                     </div>
//                   </div>
//                   <div className="mt-4 h-3 overflow-hidden rounded-full bg-primary-100">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-700 transition-all duration-500"
//                       style={{ width: `${profileCompletion}%` }}
//                     />
//                   </div>
//                 </div>
//                 {profileTasks.length > 0 && (
//                   <div className="mt-4 space-y-3">
//                     {profileTasks.map((task) => (
//                       <div key={task} className="flex items-center gap-3 text-sm text-accent-700">
//                         <Icon
//                           icon="mdi:checkbox-blank-circle-outline"
//                           className="h-4 w-4 flex-shrink-0 text-primary-500"
//                         />
//                         <span>{task}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <AppLink
//                   href={USER_ROUTES.PROFILE}
//                   className="btn btn-primary mt-5 w-full text-center"
//                 >
//                   {profileCompletion === 100 ? 'View Profile' : 'Complete Profile'}
//                 </AppLink>
//               </SectionCard>

//               {/* Suggested alumni */}
//               <SectionCard
//                 title="Suggested Alumni"
//                 action={
//                   <AppLink
//                     href={ALUMNI_ROUTES.PROFILES}
//                     className="text-sm font-semibold text-primary-600 hover:text-primary-700"
//                   >
//                     View directory
//                   </AppLink>
//                 }
//               >
//                 {alumniLoading ? (
//                   <SectionSkeleton rows={2} />
//                 ) : (
//                   <div className="space-y-3">
//                     {suggestedAlumni.length > 0 ? (
//                       suggestedAlumni.map((alumnus) => (
//                         <AppLink
//                           href={ALUMNI_ROUTES.PROFILE(alumnus.memberId)}
//                           key={alumnus.memberId}
//                           className="flex items-center gap-3 rounded-2xl border border-accent-100 px-4 py-4 transition-colors hover:border-primary-200 hover:bg-primary-50/60"
//                         >
//                           <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-100 font-semibold text-accent-700">
//                             {alumnus.name
//                               .split(' ')
//                               .slice(0, 2)
//                               .map((p) => p[0])
//                               .join('')}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="font-medium text-accent-900">{alumnus.name}</p>
//                             <p className="mt-1 truncate text-sm text-accent-600">
//                               {alumnus.position && `${alumnus.position} • `}Class of{' '}
//                               {alumnus.graduationYear}
//                             </p>
//                           </div>
//                         </AppLink>
//                       ))
//                     ) : (
//                       <p className="text-sm text-accent-400 py-2 text-center">
//                         No suggestions yet.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </SectionCard>

//               {/* Community updates — TODO: replace with real announcements once endpoint is live */}
//               {/* <SectionCard title="Community Updates">
//                 <div className="space-y-3">
//                   {communityUpdates.map((item) => (
//                     <AppLink
//                       href={item.href}
//                       key={item.title}
//                       className="block rounded-2xl border border-accent-100 bg-accent-50 px-4 py-4 transition-colors hover:border-primary-200 hover:bg-primary-50/60"
//                     >
//                       <p className="font-medium text-accent-900">{item.title}</p>
//                       <p className="mt-1 text-sm leading-6 text-accent-600">{item.subtitle}</p>
//                     </AppLink>
//                   ))}
//                 </div>
//               </SectionCard> */}

//               {/* Quick links */}
//               <SectionCard title="Quick Links">
//                 <div className="grid gap-3 sm:grid-cols-2">
//                   {quickLinks.map((link) => (
//                     <AppLink
//                       href={link.href}
//                       key={link.label}
//                       className="flex items-center gap-3 rounded-2xl border border-accent-100 bg-white px-4 py-4 text-accent-700 transition-colors hover:border-primary-200 hover:bg-primary-50/60 hover:text-primary-700"
//                     >
//                       <div className="rounded-xl bg-accent-100 p-2 text-primary-600">
//                         <Icon icon={link.icon} className="h-4 w-4" />
//                       </div>
//                       <span className="font-medium">{link.label}</span>
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

// features/user/pages/UserDashboardPage.tsx
// NEW DESIGN: Matches screenshot exactly.
// Header → Profile Completeness (full width) →
// Attestation|Suggested Alumnae (two-column) →
// My Registered Events (left column, matching width above)
// Background: warm off-white #f5f4f0

import { Icon } from '@iconify/react';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useAlumni } from '@/features/alumni/hooks/useAlumni';
import { SEO } from '@/shared/common/SEO';
import { useMyEvents } from '@/features/events/hooks/useEventRegistration';
import type { Event } from '@/features/events/types/event.types';
import { EVENT_ROUTES } from '@/features/events/routes';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';
import { USER_ROUTES } from '../routes';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { usePendingVouches, useApproveVouch, useRejectVouch } from '../hooks/useVoucher';
import type { PendingVouch } from '../api/voucherApi';

// ─── Profile completeness checklist ──────────────────────────────────────────

interface CheckItem {
  key: string;
  label: string;
  done: boolean;
}

function buildCheckItems(user: any): CheckItem[] {
  return [
    { key: 'photo', label: 'Profile Photo', done: !!user?.photo },
    { key: 'email', label: 'Email Address', done: !!user?.email },
    { key: 'phone', label: 'Phone Number', done: !!user?.whatsappPhone },
    { key: 'bio', label: 'About Me', done: !!user?.bio },
    { key: 'maiden', label: 'Maiden Name', done: !!user?.nameInSchool },
    { key: 'nickname', label: 'Nickname in School', done: !!user?.nickName },
    { key: 'dob', label: 'Date of Birth', done: !!user?.birthDate },
    { key: 'employment', label: 'Employment status', done: !!user?.employmentStatus },
    { key: 'occupation', label: 'Occupation', done: !!user?.occupations?.length },
    { key: 'address', label: 'Address', done: !!user?.residentialAddress },
    {
      key: 'socials',
      label: 'Socials',
      done: !!(user?.instagram || user?.twitter || user?.linkedin || user?.facebook),
    },
  ];
}

function computePct(items: CheckItem[]) {
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}

// ─── Profile Completeness Card ────────────────────────────────────────────────

function ProfileCompletenessCard({ user }: { user: any }) {
  const navigate = useNavigate();
  const items = buildCheckItems(user);
  const pct = computePct(items);
  const left = items.filter((i) => !i.done).length;

  // 4 columns
  const cols: CheckItem[][] = [
    items.slice(0, 3),
    items.slice(3, 6),
    items.slice(6, 9),
    items.slice(9),
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <h2 className="font-bold text-gray-900 text-base mb-0.5">Profile Completeness</h2>
      <p className="text-sm text-gray-500 mb-4">
        You're almost there! Complete your profile to help your sisters find you and connect with
        you.
      </p>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-700 font-medium">{pct}% Complete</span>
        <span className="text-gray-400">
          {left} Item{left !== 1 ? 's' : ''} Left
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 mb-5 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist: 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 mb-6">
        {cols.map((col, ci) => (
          <div key={ci} className="space-y-2">
            {col.map((item) => (
              <div key={item.key} className="flex items-center gap-1.5 text-sm">
                {item.done ? (
                  <Icon icon="mdi:check" className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                ) : (
                  <Icon icon="mdi:close" className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                )}
                <span className={item.done ? 'text-primary-600 font-medium' : 'text-gray-600'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => navigate(USER_ROUTES.EDIT_PROFILE)}
          className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-10 py-2.5 rounded-full transition-colors"
        >
          Complete Your Profile
        </button>
      </div>
    </div>
  );
}

// ─── Attestation row ──────────────────────────────────────────────────────────

function AttestationRow({
  vouch,
  onApprove,
  onReject,
}: {
  vouch: PendingVouch;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState('');

  const approveMutation = useApproveVouch();
  const rejectMutation = useRejectVouch();
  const busy = approveMutation.isPending || rejectMutation.isPending;

  const handleApprove = async () => {
    setActionError('');
    try {
      await approveMutation.mutateAsync(vouch.vouchId);
      onApprove(vouch.vouchId);
    } catch (err: any) {
      setActionError(err.message ?? 'Failed.');
    }
  };

  const handleDeny = async () => {
    setActionError('');
    try {
      await rejectMutation.mutateAsync({
        vouchId: vouch.vouchId,
        reason: rejectReason.trim() || undefined,
      });
      onReject(vouch.vouchId);
    } catch (err: any) {
      setActionError(err.message ?? 'Failed.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-start gap-3 justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm">{vouch.fullName}</p>
          <p className="text-xs text-gray-500">Class of {vouch.graduationYear}</p>
          {vouch.nickName && <p className="text-xs text-gray-500">A.K.A {vouch.nickName}</p>}
          <p className="text-xs text-gray-500 mt-1">{vouch.email}</p>
          {vouch.department && (
            <p className="text-xs text-gray-500">Position Held in School: {vouch.department}</p>
          )}
        </div>

        {/* Confirm + Deny stacked */}
        {!showRejectInput && (
          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleApprove}
              disabled={busy}
              className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-1.5 rounded-full transition-colors disabled:opacity-60 min-w-[90px] flex items-center justify-center"
            >
              {approveMutation.isPending ? (
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              ) : (
                'Confirm'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRejectInput(true);
                setActionError('');
              }}
              disabled={busy}
              className="border border-red-400 text-red-500 hover:bg-red-50 text-sm font-semibold px-5 py-1.5 rounded-full transition-colors disabled:opacity-60 min-w-[90px] text-center"
            >
              Deny
            </button>
          </div>
        )}
      </div>

      {showRejectInput && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
          <label className="text-xs font-medium text-gray-700">
            Reason <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. I do not recognise this person as an alumna of FGGC."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-200 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDeny}
              disabled={busy}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1 disabled:opacity-60"
            >
              {rejectMutation.isPending && (
                <Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />
              )}
              Confirm deny
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRejectInput(false);
                setRejectReason('');
                setActionError('');
              }}
              disabled={busy}
              className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-4 py-1.5 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {actionError && (
        <p className="mt-2 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-1.5">{actionError}</p>
      )}
    </div>
  );
}

// ─── Registered event row ─────────────────────────────────────────────────────

function RegisteredEventRow({ event }: { event: Event }) {
  const dateStr = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <AppLink
      href={EVENT_ROUTES.DETAIL(event.id)}
      className="flex items-center gap-3 sm:gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-colors"
    >
      <div className="w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon icon="mdi:calendar-month-outline" className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">{event.title}</p>
        <p className="text-gray-500 text-xs mt-0.5 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
        {event.location && (
          <p className="text-gray-400 text-[11px] mt-1 flex items-center gap-1 truncate">
            <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        )}
        <p className="text-gray-400 text-[11px] mt-0.5 flex items-center gap-1">
          <Icon icon="mdi:clock-outline" className="w-3 h-3 flex-shrink-0" />
          {dateStr}
        </p>
      </div>
    </AppLink>
  );
}

// ─── Suggested alumna row ─────────────────────────────────────────────────────

function SuggestedAlumnaRow({ alumnus }: { alumnus: any }) {
  const initials = alumnus.name
    ?.split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();
  return (
    <AppLink
      href={ALUMNI_ROUTES.PROFILE(alumnus.memberId)}
      className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 -mx-1 px-1 rounded-xl transition-colors"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
        {alumnus.photo ? (
          <img
            src={alumnus.photo}
            alt={alumnus.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="text-sm font-bold text-gray-500">{initials || '?'}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{alumnus.name}</p>
        <p className="text-xs text-gray-500">Class of {alumnus.graduationYear}</p>
        {alumnus.nickName && <p className="text-xs text-gray-400">A.K.A {alumnus.nickName}</p>}
      </div>
    </AppLink>
  );
}

// ─── Panel card ───────────────────────────────────────────────────────────────

function PanelCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
        <h2 className="font-bold text-gray-900 text-sm">{title}</h2>
        {action}
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function SkeletonRows({ n = 2 }: { n?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function UserDashboardPage() {
  const { data: currentUser, isLoading: profileLoading } = useCurrentUser();
  const { data: pendingVouches = [], isLoading: vouchesLoading } = usePendingVouches();
  const { data: allAlumni = [], isLoading: alumniLoading } = useAlumni({ action_type: 'approved' });
  const { events: myEvents = [], isLoading: myEventsLoading } = useMyEvents();

  const [removedVouchIds, setRemovedVouchIds] = useState<Set<string>>(new Set());
  const handleVouchApprove = (id: string) => setRemovedVouchIds((p) => new Set([...p, id]));
  const handleVouchReject = (id: string) => setRemovedVouchIds((p) => new Set([...p, id]));

  const visibleVouches = pendingVouches.filter((v) => !removedVouchIds.has(v.vouchId));

  const myRegisteredEvents = myEvents
    .filter((e: Event) => new Date(e.date) >= new Date())
    .slice(0, 5);

  const suggestedAlumni = allAlumni.filter((a) => a.slug !== currentUser?.slug).slice(0, 3);

  return (
    <>
      <SEO title="Dashboard" description="Your alumni dashboard" />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-6 sm:py-8 space-y-4 sm:space-y-5">
          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="pb-4 border-b border-gray-200">
            {profileLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-7 bg-gray-200 rounded w-52" />
                <div className="h-4 bg-gray-200 rounded w-28" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Welcome back,{' '}
                  {currentUser?.otherNames || currentUser?.fullName?.split(' ')[0] || 'Alumni'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Class of {currentUser?.graduationYear}
                </p>
              </>
            )}
          </div>

          {/* ── Profile Completeness ─────────────────────────────────── */}
          {profileLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse space-y-4">
              <div className="h-5 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-2 bg-gray-100 rounded-full" />
              <div className="grid grid-cols-4 gap-x-6 gap-y-2">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          ) : (
            <ProfileCompletenessCard user={currentUser} />
          )}

          {/* ── Attestation | Suggested Alumnae row ──────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start">
            {/* Pending Attestation */}
            <PanelCard
              title="Pending your Attestation"
              // action={
              //   <AppLink
              //     href="#"
              //     className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
              //   >
              //     View All <Icon icon="mdi:chevron-right" className="w-3.5 h-3.5" />
              //   </AppLink>
              // }
            >
              {vouchesLoading ? (
                <SkeletonRows n={2} />
              ) : visibleVouches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mb-2">
                    <Icon icon="mdi:check-all" className="w-5 h-5 text-primary-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">All caught up!</p>
                  <p className="text-xs text-gray-400 mt-0.5">No pending attestations.</p>
                </div>
              ) : (
                visibleVouches.map((v) => (
                  <AttestationRow
                    key={v.vouchId}
                    vouch={v}
                    onApprove={handleVouchApprove}
                    onReject={handleVouchReject}
                  />
                ))
              )}
            </PanelCard>

            {/* Suggested Alumnae */}
            <PanelCard
              title="Suggested Alumnae"
              action={
                <AppLink
                  href={ALUMNI_ROUTES.PROFILES}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
                >
                  View Directory <Icon icon="mdi:chevron-right" className="w-3.5 h-3.5" />
                </AppLink>
              }
            >
              {alumniLoading ? (
                <div className="space-y-2 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-gray-100 rounded w-28" />
                        <div className="h-3 bg-gray-100 rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : suggestedAlumni.length > 0 ? (
                <div className="-mt-1">
                  {suggestedAlumni.map((a) => (
                    <SuggestedAlumnaRow key={a.memberId} alumnus={a} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-4 text-center">No suggestions yet.</p>
              )}
            </PanelCard>
          </div>

          {/* ── My Registered Events ─────────────────────────────────── */}
          {/* Left column only, matching the layout above */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4 items-start">
            <PanelCard
              title="My Registered Events"
              action={
                <AppLink
                  href={EVENT_ROUTES.MY_EVENTS}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-0.5"
                >
                  View All <Icon icon="mdi:chevron-right" className="w-3.5 h-3.5" />
                </AppLink>
              }
            >
              {myEventsLoading ? (
                <SkeletonRows n={2} />
              ) : myRegisteredEvents.length > 0 ? (
                myRegisteredEvents.map((event: Event) => (
                  <RegisteredEventRow key={event.id} event={event} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon
                    icon="mdi:calendar-blank-outline"
                    className="w-10 h-10 text-gray-300 mb-2"
                  />
                  <p className="text-sm text-gray-500 mb-3">
                    You haven't registered for any upcoming events yet.
                  </p>
                  <AppLink
                    href={EVENT_ROUTES.ROOT}
                    className="text-sm font-semibold text-primary-500 hover:text-primary-600 inline-flex items-center gap-1"
                  >
                    Browse Events <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                  </AppLink>
                </div>
              )}
            </PanelCard>

            {/* Right slot intentionally empty to keep the column width */}
            <div />
          </div>
        </div>
      </div>
    </>
  );
}
