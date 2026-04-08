// // features/events/pages/EventDetailPage.tsx

// import { useMemo, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Icon } from '@iconify/react';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { Layout } from '@/shared/components/layout/Layout';
// import { renderMarkdown } from '@/data/content';
// import { SEO } from '@/shared/common/SEO';
// import { RegisterEventModal } from '../components/RegisterEventModal';
// import { useEvent } from '../hooks/useEvents';
// import { useEventRegistration, useEventAttendeeCount } from '../hooks/useEventRegistration';
// import type { Event } from '../types/event.types';
// import { EVENT_ROUTES } from '../routes';
// import { ROUTES } from '@/shared/constants/routes';

// // ─── Skeleton Loader ─────────────────────────────────────────────────────────
// function EventDetailSkeleton() {
//   return (
//     <div className="container-custom">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <div className="card p-6 animate-pulse">
//             <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
//             <div className="h-5 bg-gray-200 rounded w-full mb-2" />
//             <div className="h-5 bg-gray-200 rounded w-5/6 mb-4" />
//             <div className="h-64 bg-gray-200 rounded mb-4" />
//             <div className="space-y-3">
//               <div className="h-4 bg-gray-200 rounded w-full" />
//               <div className="h-4 bg-gray-200 rounded w-full" />
//               <div className="h-4 bg-gray-200 rounded w-3/4" />
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-1">
//           <div className="card p-6 animate-pulse">
//             <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
//             <div className="space-y-4">
//               <div className="h-12 bg-gray-200 rounded" />
//               <div className="h-12 bg-gray-200 rounded" />
//               <div className="h-12 bg-gray-200 rounded" />
//               <div className="h-12 bg-gray-200 rounded" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function EventDetailPage() {
//   const { slug = '' } = useParams();
//   const eventId = slug;
//   const [showRegisterModal, setShowRegisterModal] = useState(false);

//   // Fetch event by ID (slug is actually the ID from our routing)
//   const { data: event, isLoading, error } = useEvent(eventId);

//   console.log('Event data:', event);
//   console.log('Event title:', event?.title);
//   console.log('Event createdBy:', event?.createdBy);

//   // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
//   const { isRegistered, registration } = useEventRegistration(event?.id || '');
//   const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event);

//   // useMemo must also be called before conditional returns
//   const markdown = useMemo(() => {
//     if (!event?.content) return '';
//     return renderMarkdown(event.content);
//   }, [event?.content]);

//   // Handle loading state - return AFTER all hooks are called
//   if (isLoading) {
//     return (
//       <Layout title="Loading Event...">
//         <section className="section">
//           <EventDetailSkeleton />
//         </section>
//       </Layout>
//     );
//   }

//   // Handle error state
//   if (error || !event) {
//     return (
//       <section className="section">
//         <div className="container-custom text-center">
//           <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h1 className="text-3xl font-bold mb-4">Event not found</h1>
//           <p className="text-gray-600 mb-6">
//             The event you're looking for doesn't exist or has been removed.
//           </p>
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

//   const isPastEvent = new Date(event.date) < new Date();

//   const breadcrumbItems = [
//     { label: 'Home', href: ROUTES.HOME },
//     { label: 'Events', href: EVENT_ROUTES.ROOT },
//     { label: event.title },
//   ];

//   return (
//     <>
//       <SEO title={event.title} description={event.description} />
//       <Breadcrumbs items={breadcrumbItems} />
//       <section className="section">
//         <div className="container-custom">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2 card p-6">
//               <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
//               <p className="text-gray-600 mb-4">{event.description}</p>
//               {event.image && (
//                 <img
//                   src={event.image}
//                   alt={event.title}
//                   className="rounded mb-4 w-full object-cover max-h-[400px]"
//                   onError={(e) => {
//                     e.currentTarget.style.display = 'none';
//                   }}
//                 />
//               )}
//               <div
//                 className="prose max-w-none prose-headings:text-accent-900 prose-a:text-primary-600"
//                 dangerouslySetInnerHTML={{ __html: markdown }}
//               />
//             </div>

//             <div className="lg:col-span-1 space-y-4">
//               <div className="card p-6">
//                 <h2 className="font-semibold mb-4">Event Details</h2>
//                 <ul className="text-sm text-gray-700 space-y-3">
//                   <li className="flex items-start gap-2">
//                     <Icon
//                       icon="mdi:calendar-outline"
//                       className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//                     />
//                     <div>
//                       <strong className="block text-xs text-gray-500 mb-0.5">Date</strong>
//                       <span>
//                         {new Date(event.date).toLocaleDateString('en-GB', {
//                           weekday: 'long',
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })}
//                       </span>
//                     </div>
//                   </li>

//                   {event.startTime && (
//                     <li className="flex items-start gap-2">
//                       <Icon
//                         icon="mdi:clock-outline"
//                         className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//                       />
//                       <div>
//                         <strong className="block text-xs text-gray-500 mb-0.5">Time</strong>
//                         <span>
//                           {event.startTime}
//                           {event.endTime && ` - ${event.endTime}`}
//                         </span>
//                       </div>
//                     </li>
//                   )}

//                   {event.location && (
//                     <li className="flex items-start gap-2">
//                       <Icon
//                         icon={event.isVirtual ? 'mdi:video-outline' : 'mdi:map-marker-outline'}
//                         className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//                       />
//                       <div>
//                         <strong className="block text-xs text-gray-500 mb-0.5">Location</strong>
//                         <span>{event.location}</span>
//                       </div>
//                     </li>
//                   )}

//                   {event.attire && (
//                     <li className="flex items-start gap-2">
//                       <Icon
//                         icon="mdi:hanger"
//                         className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//                       />
//                       <div>
//                         <strong className="block text-xs text-gray-500 mb-0.5">Dress Code</strong>
//                         <span>{event.attire}</span>
//                       </div>
//                     </li>
//                   )}

//                   {event.category && (
//                     <li className="flex items-start gap-2">
//                       <Icon
//                         icon="mdi:tag-outline"
//                         className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//                       />
//                       <div>
//                         <strong className="block text-xs text-gray-500 mb-0.5">Category</strong>
//                         <span>{event.category}</span>
//                       </div>
//                     </li>
//                   )}

//                   {/* Attendee Count - Only for upcoming events */}
//                   {!isPastEvent && (
//                     <li className="flex items-start gap-2">
//                       <Icon
//                         icon="mdi:account-group-outline"
//                         className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//                       />
//                       <div>
//                         <strong className="block text-xs text-gray-500 mb-0.5">Attendance</strong>
//                         <span>
//                           {capacity > 0 ? (
//                             <>
//                               {attendeeCount}/{capacity} attending
//                               {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
//                                 <span className="block text-orange-500 text-xs mt-0.5">
//                                   ({spotsLeft} spots left)
//                                 </span>
//                               )}
//                             </>
//                           ) : (
//                             <>{attendeeCount} attending</>
//                           )}
//                         </span>
//                       </div>
//                     </li>
//                   )}

//                   {/* Created By */}
//                   {event.createdBy && (
//                     <li className="flex items-start gap-2">
//                       <Icon
//                         icon="mdi:account-outline"
//                         className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
//                       />
//                       <div>
//                         <strong className="block text-xs text-gray-500 mb-0.5">Organizer</strong>
//                         <span>{event.createdBy}</span>
//                       </div>
//                     </li>
//                   )}
//                 </ul>

//                 {/* Registration Status & Actions */}
//                 <div className="mt-6 pt-4 border-t border-gray-100">
//                   {isPastEvent ? (
//                     <div className="text-center py-2 text-gray-500 text-sm">
//                       <Icon icon="mdi:calendar-check-outline" className="w-5 h-5 mx-auto mb-1" />
//                       This event has ended
//                     </div>
//                   ) : isRegistered ? (
//                     <div className="space-y-3">
//                       <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
//                         <Icon
//                           icon="mdi:check-circle"
//                           className="w-5 h-5 text-green-600 mx-auto mb-1"
//                         />
//                         <p className="text-green-700 font-semibold text-sm">You're Registered!</p>
//                         {registration && registration.guestCount > 0 && (
//                           <p className="text-green-600 text-xs mt-1">
//                             You + {registration.guestCount} guest
//                             {registration.guestCount > 1 ? 's' : ''}
//                           </p>
//                         )}
//                       </div>

//                       {/* Virtual Event Link */}
//                       {event.isVirtual && event.virtualLink && (
//                         <a
//                           href={event.virtualLink}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
//                         >
//                           <Icon icon="mdi:video-outline" className="w-4 h-4" />
//                           Join Virtual Event
//                         </a>
//                       )}

//                       <AppLink
//                         href={EVENT_ROUTES.MY_EVENTS}
//                         className="btn btn-outline btn-sm w-full text-center"
//                       >
//                         View My Events
//                       </AppLink>
//                     </div>
//                   ) : isFull ? (
//                     <div className="text-center py-3 text-gray-500 text-sm">
//                       <Icon
//                         icon="mdi:alert-circle-outline"
//                         className="w-5 h-5 mx-auto mb-1 text-red-500"
//                       />
//                       <p className="font-semibold text-red-600">Event Full</p>
//                       <p className="text-xs mt-1">Registration is closed</p>
//                     </div>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={() => setShowRegisterModal(true)}
//                       className="btn btn-primary btn-sm w-full"
//                     >
//                       Register for Event
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Registration Modal */}
//       <RegisterEventModal
//         event={showRegisterModal ? event : null}
//         onClose={() => setShowRegisterModal(false)}
//       />
//     </>
//   );
// }

// // features/events/pages/EventDetailPage.tsx
// // MODIFIED: Handles unauthenticated users, cancelled events, admin actions,
// // past events. Uses shared DeleteConfirmModal. Removes mock imports.
// // Console.logs removed.

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
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { toast } from '@/shared/components/ui/Toast';
// import { EVENT_ROUTES } from '../routes';
// import type { Event } from '../types/event.types';
// import { renderMarkdown } from '@/data/content';

// // ─── Skeleton ─────────────────────────────────────────────────────────────────

// function EventDetailSkeleton() {
//   return (
//     <section className="section">
//       <div className="container-custom animate-pulse">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 card p-6 space-y-4">
//             <div className="h-10 bg-gray-200 rounded w-3/4" />
//             <div className="h-5  bg-gray-200 rounded w-full" />
//             <div className="h-5  bg-gray-200 rounded w-5/6" />
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

// // ─── Registration Sidebar Panel ───────────────────────────────────────────────

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

//   // ── What to show in the action area ────────────────────────────────────────
//   const renderAction = () => {
//     // Past event
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

//     // Cancelled
//     if (isCancelled) {
//       return (
//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
//           <Icon icon="mdi:cancel" className="w-5 h-5 text-gray-400 mx-auto mb-1" />
//           <p className="text-gray-600 font-semibold text-sm">This event has been cancelled</p>
//         </div>
//       );
//     }

//     // Not logged in
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

//     // Already registered
//     if (isRegistered) {
//       return (
//         <div className="space-y-3">
//           <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
//             <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600 mx-auto mb-1" />
//             <p className="text-green-700 font-semibold text-sm">You're Registered!</p>
//             {registration && registration.guestCount > 0 && (
//               <p className="text-green-600 text-xs mt-1">
//                 You + {registration.guestCount} guest{registration.guestCount > 1 ? 's' : ''}
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

//     // Event full
//     if (isFull) {
//       return (
//         <div className="text-center py-3">
//           <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 mx-auto mb-1 text-red-500" />
//           <p className="font-semibold text-red-600 text-sm">Event Full</p>
//           <p className="text-xs text-gray-500 mt-1">Registration is closed</p>
//         </div>
//       );
//     }

//     // Open for registration
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
//                     <span className="text-orange-500 ml-1 text-xs">({spotsLeft} spots left)</span>
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

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export function EventDetailPage() {
//   const { slug = '' } = useParams();
//   const navigate = useNavigate();
//   const currentUser = useAuthStore((state) => state.user);
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
//             {/* ── Left: content ──────────────────────────────────────── */}
//             <div className="lg:col-span-2 card p-6">
//               {/* Status badges */}
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

//             {/* ── Right: registration sidebar ────────────────────────── */}
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

import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { SEO } from '@/shared/common/SEO';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { useEvent, useDeleteEvent } from '../hooks/useEvents';
import { useEventRegistration, useEventAttendeeCount } from '../hooks/useEventRegistration';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { toast } from '@/shared/components/ui/Toast';
import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';
import { renderMarkdown } from '@/data/content';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function EventDetailSkeleton() {
  return (
    <section className="section">
      <div className="container-custom animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 card p-6 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-5/6" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
          <div className="card p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Registration Sidebar Panel ──────────────────────────────────────────────

function RegistrationPanel({
  event,
  isPast,
  isLoggedIn,
  isAdmin,
  onRegister,
  onDelete,
}: {
  event: Event;
  isPast: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onRegister: () => void;
  onDelete: () => void;
}) {
  const { isRegistered, registration } = useEventRegistration(event.id);
  const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event);

  const isCancelled = event.status === 'cancelled';

  const renderAction = () => {
    if (isPast) {
      return (
        <div className="text-center py-3 text-gray-500 text-sm">
          <Icon icon="mdi:calendar-check-outline" className="w-5 h-5 mx-auto mb-1" />
          This event has ended
          {isRegistered && (
            <p className="text-green-600 font-semibold mt-1 text-xs">You attended this event</p>
          )}
        </div>
      );
    }

    if (isCancelled) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <Icon icon="mdi:cancel" className="w-5 h-5 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-600 font-semibold text-sm">This event has been cancelled</p>
        </div>
      );
    }

    if (!isLoggedIn) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 text-center">Sign in to register for this event</p>
          <AppLink href="/auth/login" className="btn btn-primary btn-sm w-full text-center">
            Sign In to Register
          </AppLink>
        </div>
      );
    }

    if (isRegistered) {
      return (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-green-700 font-semibold text-sm">You're Registered!</p>
            {attendeeCount > 1 && (
              <p className="text-green-600 text-xs mt-1">
                {attendeeCount - 1} other {attendeeCount - 1 === 1 ? 'person is' : 'people are'}{' '}
                also attending
              </p>
            )}
          </div>
          {event.isVirtual && event.virtualLink && (
            <a
              href={event.virtualLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:video-outline" className="w-4 h-4" />
              Join Virtual Event
            </a>
          )}
          <AppLink
            href={EVENT_ROUTES.MY_EVENTS}
            className="btn btn-outline btn-sm w-full text-center"
          >
            View My Events
          </AppLink>
        </div>
      );
    }

    if (isFull) {
      return (
        <div className="text-center py-3">
          <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 mx-auto mb-1 text-red-500" />
          <p className="font-semibold text-red-600 text-sm">Event Full</p>
          <p className="text-xs text-gray-500 mt-1">Registration is closed</p>
        </div>
      );
    }

    return (
      <button type="button" onClick={onRegister} className="btn btn-primary btn-sm w-full">
        Register for Event
      </button>
    );
  };

  return (
    <div className="card p-6 space-y-4 sticky top-4">
      <h2 className="font-semibold text-gray-900">Event Details</h2>

      <ul className="text-sm text-gray-700 space-y-3">
        {/* Date */}
        <li className="flex items-start gap-2">
          <Icon
            icon="mdi:calendar-outline"
            className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
          />
          <div>
            <strong className="block text-xs text-gray-500 mb-0.5">Date</strong>
            {new Date(event.date).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </li>

        {/* Time */}
        {event.startTime && (
          <li className="flex items-start gap-2">
            <Icon
              icon="mdi:clock-outline"
              className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
            />
            <div>
              <strong className="block text-xs text-gray-500 mb-0.5">Time</strong>
              {event.startTime}
              {event.endTime && ` – ${event.endTime}`}
            </div>
          </li>
        )}

        {/* Location */}
        {event.location && (
          <li className="flex items-start gap-2">
            <Icon
              icon={event.isVirtual ? 'mdi:video-outline' : 'mdi:map-marker-outline'}
              className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
            />
            <div>
              <strong className="block text-xs text-gray-500 mb-0.5">Location</strong>
              {event.location}
            </div>
          </li>
        )}

        {/* Attire */}
        {event.attire && (
          <li className="flex items-start gap-2">
            <Icon icon="mdi:hanger" className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0" />
            <div>
              <strong className="block text-xs text-gray-500 mb-0.5">Dress Code</strong>
              {event.attire}
            </div>
          </li>
        )}

        {/* Attendees */}
        {!isCancelled && (
          <li className="flex items-start gap-2">
            <Icon
              icon="mdi:account-group-outline"
              className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
            />
            <div>
              <strong className="block text-xs text-gray-500 mb-0.5">Attendance</strong>
              {capacity ? (
                <>
                  {attendeeCount}/{capacity} registered
                  {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
                    <span className="text-orange-500 ml-1 text-xs">
                      ({spotsLeft} spot{`${spotsLeft == 0 || spotsLeft > 1 ? 's' : ''}`} left)
                    </span>
                  )}
                </>
              ) : (
                <>{attendeeCount} registered</>
              )}
            </div>
          </li>
        )}

        {/* Organizer */}
        {event.createdBy && (
          <li className="flex items-start gap-2">
            <Icon
              icon="mdi:account-outline"
              className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
            />
            <div>
              <strong className="block text-xs text-gray-500 mb-0.5">Organizer</strong>
              {event.createdBy}
            </div>
          </li>
        )}
      </ul>

      {/* Action */}
      <div className="pt-4 border-t border-gray-100">{renderAction()}</div>

      {/* Admin actions */}
      {isAdmin && (
        <div className="pt-3 border-t border-gray-100 flex gap-2">
          <AppLink
            href={EVENT_ROUTES.EDIT(event.id)}
            className="flex-1 flex items-center justify-center gap-1.5 border border-primary-200 text-primary-600 hover:bg-primary-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
            Edit
          </AppLink>
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function EventDetailPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  const { data: event, isLoading, error } = useEvent(slug);
  const deleteEvent = useDeleteEvent();

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const markdown = useMemo(() => {
    if (!event?.content) return '';
    try {
      return renderMarkdown(event.content);
    } catch {
      return event.content;
    }
  }, [event?.content]);

  if (isLoading) return <EventDetailSkeleton />;

  if (error || !event) {
    return (
      <section className="section">
        <div className="container-custom text-center">
          <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Event not found</h1>
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

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: EVENT_ROUTES.ROOT },
    { label: event.title },
  ];

  const handleDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: () => navigate(EVENT_ROUTES.ROOT),
      onError: (err: any) => {
        setShowDeleteModal(false);
        toast.fromError(err);
      },
    });
  };

  return (
    <>
      <SEO title={event.title} description={event.description} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left: content ────────────────────────────────────────── */}
            <div className="lg:col-span-2 card p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {isPast && !isCancelled && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    Past Event
                  </span>
                )}
                {isCancelled && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
                    Cancelled
                  </span>
                )}
                {event.featured && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.description}</p>

              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="rounded-xl mb-6 w-full object-cover max-h-[420px]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              {markdown && (
                <div
                  className="prose max-w-none prose-headings:text-gray-900 prose-a:text-primary-600"
                  dangerouslySetInnerHTML={{ __html: markdown }}
                />
              )}

              <AppLink
                href={EVENT_ROUTES.ROOT}
                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-semibold mt-6"
              >
                <Icon icon="mdi:arrow-left" className="w-4 h-4" />
                Back to Events
              </AppLink>
            </div>

            {/* ── Right: registration sidebar ──────────────────────────── */}
            <div className="lg:col-span-1">
              <RegistrationPanel
                event={event}
                isPast={isPast}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                onRegister={() => setShowRegisterModal(true)}
                onDelete={() => setShowDeleteModal(true)}
              />
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
}
