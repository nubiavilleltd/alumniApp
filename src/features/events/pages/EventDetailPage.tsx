// // features/events/pages/EventDetailPage.tsx

// import { useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Icon } from '@iconify/react';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { SEO } from '@/shared/common/SEO';
// import { RegisterEventModal } from '../components/RegisterEventModal';
// import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
// import { useEvent, useDeleteEvent } from '../hooks/useEvents';
// import { useEventRegistration, useEventAttendeeCount } from '../hooks/useEventRegistration';
// import { toast } from '@/shared/components/ui/Toast';
// import { EVENT_ROUTES } from '../routes';
// import type { Event } from '../types/event.types';
// import { renderMarkdown } from '@/data/content';
// import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

// // ─── Skeleton ────────────────────────────────────────────────────────────────

// function EventDetailSkeleton() {
//   return (
//     <section className="section">
//       <div className="container-custom animate-pulse">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 card p-6 space-y-4">
//             <div className="h-10 bg-gray-200 rounded w-3/4" />
//             <div className="h-5 bg-gray-200 rounded w-full" />
//             <div className="h-5 bg-gray-200 rounded w-5/6" />
//             <div className="h-64 bg-gray-200 rounded" />
//           </div>
//           <div className="card p-6 space-y-4">
//             <div className="h-6 bg-gray-200 rounded w-1/2" />
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="h-12 bg-gray-200 rounded" />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Registration Sidebar Panel ──────────────────────────────────────────────

// function RegistrationPanel({
//   event,
//   isPast,
//   isLoggedIn,
//   isAdmin,
//   onRegister,
//   onDelete,
// }: {
//   event: Event;
//   isPast: boolean;
//   isLoggedIn: boolean;
//   isAdmin: boolean;
//   onRegister: () => void;
//   onDelete: () => void;
// }) {
//   const { isRegistered, registration } = useEventRegistration(event.id);
//   const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event);

//   const isCancelled = event.status === 'cancelled';

//   const renderAction = () => {
//     if (isPast) {
//       return (
//         <div className="text-center py-3 text-gray-500 text-sm">
//           <Icon icon="mdi:calendar-check-outline" className="w-5 h-5 mx-auto mb-1" />
//           This event has ended
//           {isRegistered && (
//             <p className="text-green-600 font-semibold mt-1 text-xs">You attended this event</p>
//           )}
//         </div>
//       );
//     }

//     if (isCancelled) {
//       return (
//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
//           <Icon icon="mdi:cancel" className="w-5 h-5 text-gray-400 mx-auto mb-1" />
//           <p className="text-gray-600 font-semibold text-sm">This event has been cancelled</p>
//         </div>
//       );
//     }

//     if (!isLoggedIn) {
//       return (
//         <div className="space-y-3">
//           <p className="text-sm text-gray-500 text-center">Sign in to register for this event</p>
//           <AppLink href="/auth/login" className="btn btn-primary btn-sm w-full text-center">
//             Sign In to Register
//           </AppLink>
//         </div>
//       );
//     }

//     if (isRegistered) {
//       return (
//         <div className="space-y-3">
//           <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
//             <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600 mx-auto mb-1" />
//             <p className="text-green-700 font-semibold text-sm">You're Registered!</p>
//             {attendeeCount > 1 && (
//               <p className="text-green-600 text-xs mt-1">
//                 {attendeeCount - 1} other {attendeeCount - 1 === 1 ? 'person is' : 'people are'}{' '}
//                 also attending
//               </p>
//             )}
//           </div>
//           {event.isVirtual && event.virtualLink && (
//             <a
//               href={event.virtualLink}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
//             >
//               <Icon icon="mdi:video-outline" className="w-4 h-4" />
//               Join Virtual Event
//             </a>
//           )}
//           <AppLink
//             href={EVENT_ROUTES.MY_EVENTS}
//             className="btn btn-outline btn-sm w-full text-center"
//           >
//             View My Events
//           </AppLink>
//         </div>
//       );
//     }

//     if (isFull) {
//       return (
//         <div className="text-center py-3">
//           <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 mx-auto mb-1 text-red-500" />
//           <p className="font-semibold text-red-600 text-sm">Event Full</p>
//           <p className="text-xs text-gray-500 mt-1">Registration is closed</p>
//         </div>
//       );
//     }

//     return (
//       <button type="button" onClick={onRegister} className="btn btn-primary btn-sm w-full">
//         Register for Event
//       </button>
//     );
//   };

//   return (
//     <div className="card p-6 space-y-4 sticky top-4">
//       <h2 className="font-semibold text-gray-900">Event Details</h2>

//       <ul className="text-sm text-gray-700 space-y-3">
//         {/* Date */}
//         <li className="flex items-start gap-2">
//           <Icon
//             icon="mdi:calendar-outline"
//             className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//           />
//           <div>
//             <strong className="block text-xs text-gray-500 mb-0.5">Date</strong>
//             {new Date(event.date).toLocaleDateString('en-GB', {
//               weekday: 'long',
//               day: 'numeric',
//               month: 'long',
//               year: 'numeric',
//             })}
//           </div>
//         </li>

//         {/* Time */}
//         {event.startTime && (
//           <li className="flex items-start gap-2">
//             <Icon
//               icon="mdi:clock-outline"
//               className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//             />
//             <div>
//               <strong className="block text-xs text-gray-500 mb-0.5">Time</strong>
//               {event.startTime}
//               {event.endTime && ` – ${event.endTime}`}
//             </div>
//           </li>
//         )}

//         {/* Location */}
//         {event.location && (
//           <li className="flex items-start gap-2">
//             <Icon
//               icon={event.isVirtual ? 'mdi:video-outline' : 'mdi:map-marker-outline'}
//               className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//             />
//             <div>
//               <strong className="block text-xs text-gray-500 mb-0.5">Location</strong>
//               {event.location}
//             </div>
//           </li>
//         )}

//         {/* Attire */}
//         {event.attire && (
//           <li className="flex items-start gap-2">
//             <Icon icon="mdi:hanger" className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0" />
//             <div>
//               <strong className="block text-xs text-gray-500 mb-0.5">Dress Code</strong>
//               {event.attire}
//             </div>
//           </li>
//         )}

//         {/* Attendees */}
//         {!isCancelled && (
//           <li className="flex items-start gap-2">
//             <Icon
//               icon="mdi:account-group-outline"
//               className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//             />
//             <div>
//               <strong className="block text-xs text-gray-500 mb-0.5">Attendance</strong>
//               {capacity ? (
//                 <>
//                   {attendeeCount}/{capacity} registered
//                   {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
//                     <span className="text-orange-500 ml-1 text-xs">
//                       ({spotsLeft} spot{`${spotsLeft == 0 || spotsLeft > 1 ? 's' : ''}`} left)
//                     </span>
//                   )}
//                 </>
//               ) : (
//                 <>{attendeeCount} registered</>
//               )}
//             </div>
//           </li>
//         )}

//         {/* Organizer */}
//         {event.createdBy && (
//           <li className="flex items-start gap-2">
//             <Icon
//               icon="mdi:account-outline"
//               className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//             />
//             <div>
//               <strong className="block text-xs text-gray-500 mb-0.5">Organizer</strong>
//               {event.createdBy}
//             </div>
//           </li>
//         )}
//       </ul>

//       {/* Action */}
//       <div className="pt-4 border-t border-gray-100">{renderAction()}</div>

//       {/* Admin actions */}
//       {isAdmin && (
//         <div className="pt-3 border-t border-gray-100 flex gap-2">
//           <AppLink
//             href={EVENT_ROUTES.EDIT(event.id)}
//             className="flex-1 flex items-center justify-center gap-1.5 border border-primary-200 text-primary-600 hover:bg-primary-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
//           >
//             <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
//             Edit
//           </AppLink>
//           <button
//             type="button"
//             onClick={onDelete}
//             className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
//           >
//             <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Page ────────────────────────────────────────────────────────────────────

// export function EventDetailPage() {
//   const { slug = '' } = useParams();
//   const navigate = useNavigate();
//   const currentUser = useIdentityStore((state) => state.user);
//   const isLoggedIn = !!currentUser;
//   const isAdmin = currentUser?.role === 'admin';

//   const { data: event, isLoading, error } = useEvent(slug);
//   const deleteEvent = useDeleteEvent();

//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   const markdown = useMemo(() => {
//     if (!event?.content) return '';
//     try {
//       return renderMarkdown(event.content);
//     } catch {
//       return event.content;
//     }
//   }, [event?.content]);

//   if (isLoading) return <EventDetailSkeleton />;

//   if (error || !event) {
//     return (
//       <section className="section">
//         <div className="container-custom text-center">
//           <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-4">Event not found</h1>
//           <p className="text-gray-600 mb-6">This event doesn't exist or has been removed.</p>
//           <div className="flex gap-4 justify-center">
//             <AppLink href={EVENT_ROUTES.ROOT} className="btn btn-primary">
//               Back to Events
//             </AppLink>
//             <button onClick={() => window.location.reload()} className="btn btn-outline">
//               Try Again
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   const isPast = new Date(event.date) < new Date();
//   const isCancelled = event.status === 'cancelled';

//   const breadcrumbItems = [
//     { label: 'Home', href: '/' },
//     { label: 'Events', href: EVENT_ROUTES.ROOT },
//     { label: event.title },
//   ];

//   const handleDelete = () => {
//     deleteEvent.mutate(event.id, {
//       onSuccess: () => navigate(EVENT_ROUTES.ROOT),
//       onError: (err: any) => {
//         setShowDeleteModal(false);
//         toast.fromError(err);
//       },
//     });
//   };

//   return (
//     <>
//       <SEO title={event.title} description={event.description} />
//       <Breadcrumbs items={breadcrumbItems} />

//       <section className="section">
//         <div className="container-custom">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* ── Left: content ────────────────────────────────────────── */}
//             <div className="lg:col-span-2 card p-6">
//               <div className="flex items-center gap-2 mb-3 flex-wrap">
//                 {isPast && !isCancelled && (
//                   <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
//                     Past Event
//                   </span>
//                 )}
//                 {isCancelled && (
//                   <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
//                     Cancelled
//                   </span>
//                 )}
//                 {event.featured && (
//                   <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
//                     Featured
//                   </span>
//                 )}
//               </div>

//               <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
//               <p className="text-gray-600 mb-4">{event.description}</p>

//               {event.image && (
//                 <img
//                   src={event.image}
//                   alt={event.title}
//                   className="rounded-xl mb-6 w-full object-cover max-h-[420px]"
//                   onError={(e) => {
//                     e.currentTarget.style.display = 'none';
//                   }}
//                 />
//               )}

//               {markdown && (
//                 <div
//                   className="prose max-w-none prose-headings:text-gray-900 prose-a:text-primary-600"
//                   dangerouslySetInnerHTML={{ __html: markdown }}
//                 />
//               )}

//               <AppLink
//                 href={EVENT_ROUTES.ROOT}
//                 className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-semibold mt-6"
//               >
//                 <Icon icon="mdi:arrow-left" className="w-4 h-4" />
//                 Back to Events
//               </AppLink>
//             </div>

//             {/* ── Right: registration sidebar ──────────────────────────── */}
//             <div className="lg:col-span-1">
//               <RegistrationPanel
//                 event={event}
//                 isPast={isPast}
//                 isLoggedIn={isLoggedIn}
//                 isAdmin={isAdmin}
//                 onRegister={() => setShowRegisterModal(true)}
//                 onDelete={() => setShowDeleteModal(true)}
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <RegisterEventModal
//         event={showRegisterModal ? event : null}
//         onClose={() => setShowRegisterModal(false)}
//       />

//       {showDeleteModal && (
//         <DeleteConfirmModal
//           title={event.title}
//           isDeleting={deleteEvent.isPending}
//           onConfirm={handleDelete}
//           onCancel={() => setShowDeleteModal(false)}
//         />
//       )}
//     </>
//   );
// }

// features/events/pages/EventDetailPage.tsx
// NEW DESIGN: Full-width banner image, title + meta below, description, then
// Register/Share buttons at the bottom. Countdown for upcoming events.
// Admin sees Edit + Delete. Unregister confirmation on registered events.

import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useEvent, useDeleteEvent } from '../hooks/useEvents';
import { useEventRegistration, useEventAttendeeCount } from '../hooks/useEventRegistration';
import { useCancelRegistration } from '../hooks/useEvents';
import { toast } from '@/shared/components/ui/Toast';
import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { renderMarkdown } from '@/data/content';

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(targetDate: string, startTime?: string) {
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(
    null,
  );

  useEffect(() => {
    const target = (() => {
      const [y, mo, d] = targetDate.split('-').map(Number);
      const [h = 0, mi = 0] = (startTime ?? '00:00').split(':').map(Number);
      return new Date(y, mo - 1, d, h, mi, 0);
    })();

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining(null);
        return;
      }
      const s = Math.floor(diff / 1000);
      setRemaining({
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, startTime]);

  return remaining;
}

function CountdownBanner({ date, startTime }: { date: string; startTime?: string }) {
  const t = useCountdown(date, startTime);
  if (!t) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-primary-500 text-white rounded-2xl px-5 py-4 flex items-center justify-between gap-4 mb-5">
      <div>
        <p className="text-xs font-semibold text-primary-200 uppercase tracking-wide mb-0.5">
          Event starts in
        </p>
        <div className="flex items-end gap-3 text-2xl font-bold tabular-nums">
          {t.d > 0 && (
            <span>
              <span>{t.d}</span>
              <span className="text-sm font-normal text-primary-200 ml-1">d</span>
            </span>
          )}
          <span>
            <span>{pad(t.h)}</span>
            <span className="text-sm font-normal text-primary-200 ml-1">h</span>
          </span>
          <span>
            <span>{pad(t.m)}</span>
            <span className="text-sm font-normal text-primary-200 ml-1">m</span>
          </span>
          <span>
            <span>{pad(t.s)}</span>
            <span className="text-sm font-normal text-primary-200 ml-1">s</span>
          </span>
        </div>
      </div>
      <Icon icon="mdi:timer-outline" className="w-10 h-10 text-primary-300 flex-shrink-0" />
    </div>
  );
}

// ─── Unregister confirmation ──────────────────────────────────────────────────

function UnregisterConfirmModal({
  eventTitle,
  isLoading,
  onConfirm,
  onCancel,
}: {
  eventTitle: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Cancel Registration?</h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to unregister from{' '}
              <span className="font-semibold">{eventTitle}</span>?
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Keep Registration
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading && <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />}
            Yes, Unregister
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function EventDetailSkeleton() {
  return (
    <div className="container-custom py-8 animate-pulse">
      <div className="w-full h-64 sm:h-80 bg-gray-200 rounded-2xl mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function EventDetailPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const currentUser = useIdentityStore((state) => state.user);
  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  const { data: event, isLoading, error } = useEvent(slug);
  const deleteEvent = useDeleteEvent();
  const cancelMutation = useCancelRegistration();

  const { isRegistered } = useEventRegistration(event?.id ?? '');
  const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event ?? null);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);

  const markdown = useMemo(() => {
    if (!event?.content) return '';
    try {
      // const { renderMarkdown } = require('@/data/content');
      return renderMarkdown(event.content);
    } catch {
      return event.content ?? '';
    }
  }, [event?.content]);

  if (isLoading)
    return (
      <div className="section">
        <EventDetailSkeleton />
      </div>
    );

  if (error || !event) {
    return (
      <section className="section">
        <div className="container-custom text-center py-12">
          <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-3">Event not found</h1>
          <p className="text-gray-600 mb-6">This event doesn't exist or has been removed.</p>
          <div className="flex gap-4 justify-center">
            <AppLink href={EVENT_ROUTES.ROOT} className="btn btn-primary">
              Back to Events
            </AppLink>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const isPast = new Date(event.date) < new Date();
  const isCancelled = event.status === 'cancelled';
  const isUpcoming = !isPast && !isCancelled;

  const handleDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: () => navigate(EVENT_ROUTES.ROOT),
      onError: (err: any) => {
        setShowDeleteModal(false);
        toast.fromError(err);
      },
    });
  };

  const handleUnregister = async () => {
    try {
      await cancelMutation.mutateAsync(event.id);
      toast.success('You have been unregistered from this event.');
    } catch (err: any) {
      toast.fromError(err);
    } finally {
      setShowUnregisterModal(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: event.title, url }).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success('Link copied!'))
        .catch(() => {});
    }
  };

  // Format date range
  const dateDisplay = (() => {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = new Date(event.date).toLocaleDateString('en-US', opts);
    return event.startTime ? `${start}` : start;
  })();

  // ── CTA button ────────────────────────────────────────────────────────────
  const renderCTA = () => {
    if (isPast) {
      return (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Icon icon="mdi:calendar-check-outline" className="w-4 h-4" />
          This event has ended
          {isRegistered && (
            <span className="text-green-600 font-semibold ml-1">· You attended</span>
          )}
        </div>
      );
    }

    if (isCancelled) {
      return (
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-sm font-medium px-4 py-2 rounded-xl">
          <Icon icon="mdi:cancel" className="w-4 h-4" />
          Event Cancelled
        </div>
      );
    }

    if (!isLoggedIn) {
      return (
        <AppLink
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
        >
          Sign in to Register
        </AppLink>
      );
    }

    if (isRegistered) {
      return (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 font-semibold text-sm px-5 py-2.5 rounded-full">
            <Icon icon="mdi:check-circle" className="w-4 h-4" />
            Registered
          </div>
          <button
            type="button"
            onClick={() => setShowUnregisterModal(true)}
            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
          >
            <Icon icon="mdi:close-circle-outline" className="w-4 h-4" />
            Unregister
          </button>
        </div>
      );
    }

    if (isFull) {
      return (
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 font-semibold text-sm px-5 py-2.5 rounded-full">
          <Icon icon="mdi:alert-circle-outline" className="w-4 h-4" />
          Event Full
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={() => setShowRegisterModal(true)}
        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors shadow-sm"
      >
        Register
      </button>
    );
  };

  return (
    <>
      <SEO title={event.title} description={event.description} />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-6 max-w-4xl">
          {/* ── Hero image ──────────────────────────────────────────── */}
          {event.image ? (
            <div
              className="w-full rounded-2xl overflow-hidden mb-5 bg-gray-100"
              style={{ maxHeight: 360 }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
                style={{ maxHeight: 360 }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-40 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-5">
              <Icon icon="mdi:calendar-month-outline" className="w-16 h-16 text-primary-300" />
            </div>
          )}

          {/* ── Status badges ───────────────────────────────────────── */}
          {(isPast || isCancelled || event.featured) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {isPast && !isCancelled && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  Past Event
                </span>
              )}
              {isCancelled && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-600">
                  Cancelled
                </span>
              )}
              {event.featured && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                  Featured
                </span>
              )}
            </div>
          )}

          {/* ── Title & meta ────────────────────────────────────────── */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug">
            {event.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-gray-500 text-sm mb-5">
            {event.location && (
              <span className="flex items-center gap-1.5">
                <Icon
                  icon="mdi:map-marker-outline"
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                />
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Icon icon="mdi:clock-outline" className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {dateDisplay}
              {event.startTime && ` · ${event.startTime}`}
              {event.endTime && ` – ${event.endTime}`}
            </span>
            {!isCancelled && attendeeCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Icon
                  icon="mdi:account-group-outline"
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                />
                {capacity ? `${attendeeCount}/${capacity}` : attendeeCount} attending
                {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
                  <span className="text-orange-500 font-semibold">· {spotsLeft} left</span>
                )}
              </span>
            )}
          </div>

          {/* ── Countdown ───────────────────────────────────────────── */}
          {isUpcoming && <CountdownBanner date={event.date} startTime={event.startTime} />}

          {/* ── Description ─────────────────────────────────────────── */}
          {event.description && (
            <p className="text-gray-700 leading-relaxed mb-5">{event.description}</p>
          )}

          {markdown && (
            <div
              className="prose max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 mb-6"
              dangerouslySetInnerHTML={{ __html: markdown }}
            />
          )}

          {/* ── Actions row ─────────────────────────────────────────── */}
          <div className="flex items-center gap-3 pt-4 flex-wrap">
            {renderCTA()}

            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 transition-colors shadow-sm"
              title="Share event"
            >
              <Icon icon="mdi:share-variant-outline" className="w-4 h-4" />
            </button>

            {/* Admin actions */}
            {isAdmin && (
              <>
                <AppLink
                  href={EVENT_ROUTES.EDIT(event.id)}
                  className="inline-flex items-center gap-1.5 border border-primary-200 text-primary-600 hover:bg-primary-50 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:pencil-outline" className="w-4 h-4" />
                  Edit
                </AppLink>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Back link */}
          <div className="mt-8 pt-5 border-t border-gray-200">
            <AppLink
              href={EVENT_ROUTES.ROOT}
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              <Icon icon="mdi:arrow-left" className="w-4 h-4" />
              Back to Events
            </AppLink>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegisterEventModal
        event={showRegisterModal ? event : null}
        onClose={() => setShowRegisterModal(false)}
      />

      {showDeleteModal && (
        <DeleteConfirmModal
          title={event.title}
          isDeleting={deleteEvent.isPending}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showUnregisterModal && (
        <UnregisterConfirmModal
          eventTitle={event.title}
          isLoading={cancelMutation.isPending}
          onConfirm={handleUnregister}
          onCancel={() => setShowUnregisterModal(false)}
        />
      )}
    </>
  );
}
