// // // features/events/pages/EventsPage.tsx

// // import { Icon } from '@iconify/react';
// // import { useState, useMemo } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { AppLink } from '@/shared/components/ui/AppLink';
// // import { SEO } from '@/shared/common/SEO';
// // import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// // import { RegisterEventModal } from '../components/RegisterEventModal';
// // import { SearchInput } from '@/shared/components/ui/input/SearchInput';
// // import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
// // import Button from '@/shared/components/ui/Button';
// // import {
// //   useUpcomingEvents,
// //   usePastEvents,
// //   useDeleteEvent,
// // } from '@/features/events/hooks/useEvents';
// // import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// // import {
// //   useEventRegistration,
// //   useEventAttendeeCount,
// // } from '@/features/events/hooks/useEventRegistration';
// // import type { Event } from '@/features/events/types/event.types';
// // import { EVENT_ROUTES } from '../routes';
// // import { ROUTES } from '@/shared/constants/routes';

// // type Tab = 'upcoming' | 'past';
// // type ViewType = 'grid' | 'calendar';
// // const ITEMS_PER_PAGE = 6;

// // // ─── Skeletons ────────────────────────────────────────────────────────────────
// // function EventCardSkeleton() {
// //   return (
// //     <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
// //       <div className="h-52 w-full bg-gray-200" />
// //       <div className="p-4 flex flex-col gap-3">
// //         <div className="h-4 bg-gray-200 rounded w-3/4" />
// //         <div className="h-3 bg-gray-200 rounded w-1/2" />
// //         <div className="h-3 bg-gray-200 rounded w-full" />
// //         <div className="h-3 bg-gray-200 rounded w-full" />
// //         <div className="h-3 bg-gray-200 rounded w-5/6" />
// //         <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Calendar Event Pill ──────────────────────────────────────────────────────
// // function CalendarEventPill({
// //   event,
// //   onRegister,
// // }: {
// //   event: Event;
// //   onRegister: (event: Event) => void;
// // }) {
// //   const { isRegistered } = useEventRegistration(event.id);

// //   return (
// //     <button
// //       type="button"
// //       onClick={() => onRegister(event)}
// //       className={`w-full text-left text-[10px] px-1.5 py-1 rounded truncate ${
// //         isRegistered
// //           ? 'bg-green-100 text-green-700 hover:bg-green-200'
// //           : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
// //       } transition-colors`}
// //       title={event.title}
// //     >
// //       {event.title}
// //     </button>
// //   );
// // }

// // // ─── Calendar View ────────────────────────────────────────────────────────────
// // function CalendarView({
// //   events,
// //   onRegister,
// //   currentDate,
// //   onDateChange,
// // }: {
// //   events: Event[];
// //   onRegister: (event: Event) => void;
// //   currentDate: Date;
// //   onDateChange: (date: Date) => void;
// // }) {
// //   // Group events by date
// //   const eventsByDate = useMemo(() => {
// //     const map = new Map<string, Event[]>();
// //     events.forEach((event) => {
// //       const dateKey = new Date(event.date).toISOString().split('T')[0];
// //       const existing = map.get(dateKey) || [];
// //       map.set(dateKey, [...existing, event]);
// //     });
// //     return map;
// //   }, [events]);

// //   // Get calendar data
// //   const { year, month, daysInMonth, firstDayOfWeek, prevMonthDays } = useMemo(() => {
// //     const y = currentDate.getFullYear();
// //     const m = currentDate.getMonth();
// //     const firstDay = new Date(y, m, 1);
// //     const lastDay = new Date(y, m + 1, 0);
// //     const prevLastDay = new Date(y, m, 0);

// //     return {
// //       year: y,
// //       month: m,
// //       daysInMonth: lastDay.getDate(),
// //       firstDayOfWeek: firstDay.getDay(),
// //       prevMonthDays: prevLastDay.getDate(),
// //     };
// //   }, [currentDate]);

// //   const monthNames = [
// //     'January',
// //     'February',
// //     'March',
// //     'April',
// //     'May',
// //     'June',
// //     'July',
// //     'August',
// //     'September',
// //     'October',
// //     'November',
// //     'December',
// //   ];
// //   const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// //   const goToPrevMonth = () => {
// //     onDateChange(new Date(year, month - 1, 1));
// //   };

// //   const goToNextMonth = () => {
// //     onDateChange(new Date(year, month + 1, 1));
// //   };

// //   const goToToday = () => {
// //     onDateChange(new Date());
// //   };

// //   // Generate calendar days
// //   const calendarDays = [];

// //   // Previous month days
// //   for (let i = firstDayOfWeek - 1; i >= 0; i--) {
// //     calendarDays.push({
// //       day: prevMonthDays - i,
// //       isCurrentMonth: false,
// //       date: new Date(year, month - 1, prevMonthDays - i),
// //     });
// //   }

// //   // Current month days
// //   for (let day = 1; day <= daysInMonth; day++) {
// //     calendarDays.push({
// //       day,
// //       isCurrentMonth: true,
// //       date: new Date(year, month, day),
// //     });
// //   }

// //   // Next month days to fill grid
// //   const remainingDays = 42 - calendarDays.length;
// //   for (let day = 1; day <= remainingDays; day++) {
// //     calendarDays.push({
// //       day,
// //       isCurrentMonth: false,
// //       date: new Date(year, month + 1, day),
// //     });
// //   }

// //   const today = new Date().toISOString().split('T')[0];

// //   return (
// //     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
// //       {/* Calendar Header */}
// //       <div className="flex items-center justify-between mb-6">
// //         <h2 className="text-xl font-bold text-gray-800">
// //           {monthNames[month]} {year}
// //         </h2>
// //         <div className="flex items-center gap-2">
// //           <button
// //             type="button"
// //             onClick={goToToday}
// //             className="px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
// //           >
// //             Today
// //           </button>
// //           <button
// //             type="button"
// //             onClick={goToPrevMonth}
// //             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //           >
// //             <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-600" />
// //           </button>
// //           <button
// //             type="button"
// //             onClick={goToNextMonth}
// //             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //           >
// //             <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-600" />
// //           </button>
// //         </div>
// //       </div>

// //       {/* Day Headers */}
// //       <div className="grid grid-cols-7 gap-2 mb-2">
// //         {dayNames.map((day) => (
// //           <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
// //             {day}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Calendar Grid */}
// //       <div className="grid grid-cols-7 gap-2">
// //         {calendarDays.map((calDay, idx) => {
// //           const dateKey = calDay.date.toISOString().split('T')[0];
// //           const dayEvents = eventsByDate.get(dateKey) || [];
// //           const isToday = dateKey === today;

// //           return (
// //             <div
// //               key={idx}
// //               className={`min-h-[100px] p-2 border rounded-lg ${
// //                 calDay.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
// //               } ${isToday ? 'border-primary-500 border-2' : 'border-gray-200'}`}
// //             >
// //               <div
// //                 className={`text-sm font-semibold mb-1 ${
// //                   calDay.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
// //                 } ${isToday ? 'text-primary-600' : ''}`}
// //               >
// //                 {calDay.day}
// //               </div>
// //               <div className="space-y-1">
// //                 {dayEvents.map((event) => (
// //                   <CalendarEventPill key={event.id} event={event} onRegister={onRegister} />
// //                 ))}
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* Legend */}
// //       <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500">
// //         <div className="flex items-center gap-2">
// //           <div className="w-3 h-3 rounded bg-primary-100 border border-primary-200" />
// //           <span>Event</span>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
// //           <span>Registered</span>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <div className="w-3 h-3 rounded border-2 border-primary-500" />
// //           <span>Today</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Event Card ───────────────────────────────────────────────────────────────
// // function EventCard({
// //   event,
// //   isPast,
// //   onRegister,
// //   isAdmin,
// //   onDelete,
// // }: {
// //   event: Event;
// //   isPast: boolean;
// //   onRegister: () => void;
// //   isAdmin: boolean;
// //   onDelete: (event: Event) => void;
// // }) {
// //   const navigate = useNavigate();
// //   const { isRegistered } = useEventRegistration(event.id);
// //   const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event);
// //   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

// //   const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
// //     weekday: 'short',
// //     day: '2-digit',
// //     month: 'short',
// //     year: 'numeric',
// //   });

// //   const handleDelete = () => {
// //     onDelete(event);
// //     setShowDeleteConfirm(false);
// //   };

// //   return (
// //     <>
// //       <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
// //         {event.image && (
// //           <div className="h-52 w-full overflow-hidden bg-gray-100 relative">
// //             <img
// //               src={event.image}
// //               alt={event.title}
// //               className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
// //               loading="lazy"
// //             />
// //             {/* Registration Status Badge */}
// //             {!isPast && isRegistered && (
// //               <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
// //                 <Icon icon="mdi:check-circle" className="w-3 h-3" />
// //                 Registered
// //               </div>
// //             )}
// //             {/* Event Full Badge */}
// //             {!isPast && isFull && (
// //               <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
// //                 Event Full
// //               </div>
// //             )}
// //           </div>
// //         )}
// //         <div className="p-4 flex flex-col gap-2 flex-1">
// //           <h3 className="text-primary-500 font-bold text-sm leading-snug">{event.title}</h3>
// //           <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-400 text-[11px]">
// //             {event.location && (
// //               <span className="flex items-center gap-1">
// //                 <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
// //                 {event.location}
// //               </span>
// //             )}
// //             {event.attire && (
// //               <span className="flex items-center gap-1">
// //                 <Icon icon="mdi:hanger" className="w-3 h-3 flex-shrink-0" />
// //                 {event.attire}
// //               </span>
// //             )}
// //             <span className="flex items-center gap-1">
// //               <Icon icon="mdi:calendar-outline" className="w-3 h-3 flex-shrink-0" />
// //               {formattedDate}
// //             </span>
// //           </div>
// //           <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">
// //             {event.description}
// //           </p>

// //           {/* Attendee Count - Show for upcoming events */}
// //           {!isPast && (
// //             <div className="flex items-center gap-1 text-gray-600 text-[11px] mt-1">
// //               <Icon icon="mdi:account-group-outline" className="w-3.5 h-3.5 flex-shrink-0" />
// //               <span>
// //                 {capacity ? (
// //                   <>
// //                     <span className="font-semibold">{attendeeCount}</span>/{capacity} attending
// //                     {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
// //                       <span className="text-orange-500 ml-1">({spotsLeft} spots left)</span>
// //                     )}
// //                   </>
// //                 ) : (
// //                   <>
// //                     <span className="font-semibold">{attendeeCount}</span> attending
// //                   </>
// //                 )}
// //               </span>
// //             </div>
// //           )}
// //           <div className="mt-auto pt-2 flex items-center justify-between">
// //             <div className="flex items-center gap-2">
// //               {isPast ? (
// //                 <AppLink
// //                   href={EVENT_ROUTES.DETAIL(event.id)}
// //                   className="inline-block border border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-500 text-xs font-semibold px-5 py-1.5 rounded-md transition-colors"
// //                 >
// //                   View Details
// //                 </AppLink>
// //               ) : isRegistered ? (
// //                 <>
// //                   <button
// //                     type="button"
// //                     disabled
// //                     className="inline-flex items-center gap-1 border border-green-500 text-green-600 text-xs font-semibold px-4 py-1.5 rounded-md cursor-default"
// //                   >
// //                     <Icon icon="mdi:check-circle" className="w-3.5 h-3.5" />
// //                     Registered
// //                   </button>
// //                   <AppLink
// //                     href={EVENT_ROUTES.DETAIL(event.id)}
// //                     className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-500 text-xs font-semibold transition-colors"
// //                   >
// //                     View Details
// //                   </AppLink>
// //                 </>
// //               ) : isFull ? (
// //                 <button
// //                   type="button"
// //                   disabled
// //                   className="inline-flex items-center gap-1 text-gray-400 text-xs font-semibold cursor-not-allowed"
// //                 >
// //                   Event Full
// //                 </button>
// //               ) : (
// //                 <button
// //                   type="button"
// //                   onClick={onRegister}
// //                   className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-xs font-semibold transition-colors"
// //                 >
// //                   Register <Icon icon="mdi:arrow-right" className="w-3 h-3" />
// //                 </button>
// //               )}
// //             </div>

// //             {/* Admin Actions */}
// //             {isAdmin && (
// //               <div className="flex items-center gap-2">
// //                 <AppLink
// //                   href={EVENT_ROUTES.EDIT(event.id)}
// //                   className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 transition-colors"
// //                 >
// //                   <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
// //                   Edit
// //                 </AppLink>
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowDeleteConfirm(true)}
// //                   className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
// //                 >
// //                   <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
// //                   Delete
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Delete Confirmation Modal */}
// //       {showDeleteConfirm && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
// //           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
// //             <div className="flex items-start gap-3 mb-4">
// //               <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
// //                 <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-600" />
// //               </div>
// //               <div>
// //                 <h3 className="text-gray-900 font-bold text-lg mb-1">Delete Event?</h3>
// //                 <p className="text-gray-600 text-sm">
// //                   Are you sure you want to delete{' '}
// //                   <span className="font-semibold">{event.title}</span>? This action cannot be
// //                   undone.
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="flex items-center gap-3 justify-end mt-6">
// //               <button
// //                 type="button"
// //                 onClick={() => setShowDeleteConfirm(false)}
// //                 className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="button"
// //                 onClick={handleDelete}
// //                 className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
// //               >
// //                 Yes, Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }

// // // ─── Main Page ────────────────────────────────────────────────────────────────
// // export function EventsPage() {
// //   const navigate = useNavigate();
// //   const currentUser = useAuthStore((state) => state.user);
// //   const isAdmin = currentUser?.role === 'admin';
// //   const deleteEvent = useDeleteEvent();

// //   // Read view from URL parameter (e.g., /events?view=calendar)
// //   const searchParams = new URLSearchParams(window.location.search);
// //   const initialView = searchParams.get('view') === 'calendar' ? 'calendar' : 'grid';

// //   const [tab, setTab] = useState<Tab>('upcoming');
// //   const [viewType, setViewType] = useState<ViewType>(initialView);
// //   const [registerEvent, setRegisterEvent] = useState<Event | null>(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [locationFilter, setLocationFilter] = useState('');
// //   const [dateFrom, setDateFrom] = useState('');
// //   const [dateTo, setDateTo] = useState('');
// //   const [calendarDate, setCalendarDate] = useState(new Date());
// //   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

// //   // ── Hooks — share same React Query cache, one network request ─────────────
// //   const { data: upcoming = [], isLoading: upcomingLoading } = useUpcomingEvents();
// //   const { data: past = [], isLoading: pastLoading } = usePastEvents();

// //   const isLoading = tab === 'upcoming' ? upcomingLoading : pastLoading;
// //   const activeList = tab === 'upcoming' ? upcoming : past;

// //   // ── Client-side filtering ──────────────────────────────────────────────────
// //   const locationOptions = useMemo(() => {
// //     const locs = [...new Set(activeList.map((e) => e.location).filter(Boolean))];
// //     return locs.map((l) => ({ label: l as string, value: l as string }));
// //   }, [activeList]);

// //   const filtered = useMemo(() => {
// //     const q = searchTerm.trim().toLowerCase();
// //     return activeList.filter((e) => {
// //       const matchesSearch =
// //         !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
// //       const matchesLocation = !locationFilter || e.location === locationFilter;

// //       // Date range filtering
// //       let matchesDateRange = true;
// //       if (dateFrom || dateTo) {
// //         const eventDate = new Date(e.date);
// //         const fromDate = dateFrom ? new Date(dateFrom) : null;
// //         const toDate = dateTo ? new Date(dateTo) : null;

// //         if (fromDate) {
// //           fromDate.setHours(0, 0, 0, 0);
// //           eventDate.setHours(0, 0, 0, 0);
// //         }
// //         if (toDate) {
// //           toDate.setHours(23, 59, 59, 999);
// //         }

// //         if (fromDate && toDate) {
// //           matchesDateRange = eventDate >= fromDate && eventDate <= toDate;
// //         } else if (fromDate) {
// //           matchesDateRange = eventDate >= fromDate;
// //         } else if (toDate) {
// //           matchesDateRange = eventDate <= toDate;
// //         }
// //       }

// //       return matchesSearch && matchesLocation && matchesDateRange;
// //     });
// //   }, [activeList, searchTerm, locationFilter, dateFrom, dateTo]);

// //   const visible = filtered.slice(0, visibleCount);
// //   const hasMore = visibleCount < filtered.length;

// //   const handleTabChange = (newTab: Tab) => {
// //     setTab(newTab);
// //     setVisibleCount(ITEMS_PER_PAGE);
// //     setSearchTerm('');
// //     setLocationFilter('');
// //     setDateFrom('');
// //     setDateTo('');
// //   };

// //   const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
// //     setter(value);
// //     setVisibleCount(ITEMS_PER_PAGE);
// //   };

// //   const handleDeleteEvent = (event: Event) => {
// //     deleteEvent.mutate(event.id, {
// //       onSuccess: () => {
// //         // Event deleted, UI will update automatically via React Query cache invalidation
// //       },
// //     });
// //   };

// //   const breadcrumbItems = [{ label: 'Home', href: ROUTES.HOME }, { label: 'Events' }];

// //   return (
// //     <>
// //       <SEO
// //         title="Events"
// //         description="Through the generosity of our alumni, we continue to support and improve our beloved school."
// //       />
// //       <Breadcrumbs items={breadcrumbItems} />

// //       <section className="section">
// //         <div className="container-custom">
// //           {/* Header */}
// //           <div className="text-center mb-8">
// //             <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Events</h1>
// //             <p className="text-gray-500 text-sm max-w-md mx-auto">
// //               Through the generosity of our alumni, we continue to support and improve our beloved
// //               school
// //             </p>
// //           </div>

// //           {/* Tab toggle + View toggle + Create Button */}
// //           <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
// //             <div className="flex items-center gap-2">
// //               <Button
// //                 variant={tab === 'upcoming' ? 'primary' : 'outline'}
// //                 onClick={() => handleTabChange('upcoming')}
// //                 className="px-5 py-2 rounded-lg text-sm"
// //               >
// //                 Upcoming
// //               </Button>
// //               <Button
// //                 variant={tab === 'past' ? 'primary' : 'outline'}
// //                 onClick={() => handleTabChange('past')}
// //                 className="px-5 py-2 rounded-lg text-sm"
// //               >
// //                 Past
// //               </Button>
// //             </div>

// //             <div className="flex items-center gap-3">
// //               {/* View Toggle */}
// //               <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
// //                 <button
// //                   type="button"
// //                   onClick={() => setViewType('grid')}
// //                   className={`p-2 rounded transition-colors ${
// //                     viewType === 'grid'
// //                       ? 'bg-white text-primary-600 shadow-sm'
// //                       : 'text-gray-500 hover:text-gray-700'
// //                   }`}
// //                   title="Grid view"
// //                 >
// //                   <Icon icon="mdi:view-grid-outline" className="w-5 h-5" />
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setViewType('calendar')}
// //                   className={`p-2 rounded transition-colors ${
// //                     viewType === 'calendar'
// //                       ? 'bg-white text-primary-600 shadow-sm'
// //                       : 'text-gray-500 hover:text-gray-700'
// //                   }`}
// //                   title="Calendar view"
// //                 >
// //                   <Icon icon="mdi:calendar-month-outline" className="w-5 h-5" />
// //                 </button>
// //               </div>

// //               {/* Create Event Button - Admin Only */}
// //               {isAdmin && (
// //                 <button
// //                   type="button"
// //                   onClick={() => navigate(EVENT_ROUTES.CREATE)}
// //                   className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
// //                 >
// //                   <Icon icon="mdi:plus" className="w-4 h-4" />
// //                   Create Event
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           {/* Filters - only show in grid view */}
// //           {viewType === 'grid' && (
// //             <div className="space-y-3 mb-8">
// //               <div className="flex flex-col sm:flex-row items-end gap-3">
// //                 <SearchInput
// //                   label="Search"
// //                   value={searchTerm}
// //                   onValueChange={handleFilterChange(setSearchTerm)}
// //                   placeholder="Search events..."
// //                   className="flex-1"
// //                 />
// //                 <FilterDropdown
// //                   label="Location"
// //                   value={locationFilter}
// //                   onChange={handleFilterChange(setLocationFilter)}
// //                   options={locationOptions}
// //                   placeholder="All Locations"
// //                 />
// //               </div>

// //               {/* Date Range Filter */}
// //               <div className="flex flex-col sm:flex-row items-end gap-3">
// //                 <div className="flex-1">
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
// //                   <input
// //                     type="date"
// //                     value={dateFrom}
// //                     onChange={(e) => {
// //                       setDateFrom(e.target.value);
// //                       setVisibleCount(ITEMS_PER_PAGE);
// //                     }}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
// //                   />
// //                 </div>
// //                 <div className="flex-1">
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
// //                   <input
// //                     type="date"
// //                     value={dateTo}
// //                     onChange={(e) => {
// //                       setDateTo(e.target.value);
// //                       setVisibleCount(ITEMS_PER_PAGE);
// //                     }}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
// //                   />
// //                 </div>
// //                 {(dateFrom || dateTo) && (
// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setDateFrom('');
// //                       setDateTo('');
// //                       setVisibleCount(ITEMS_PER_PAGE);
// //                     }}
// //                     className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
// //                   >
// //                     <Icon icon="mdi:close" className="w-4 h-4" />
// //                     Clear Dates
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Content */}
// //           {isLoading ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
// //               {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
// //                 <EventCardSkeleton key={i} />
// //               ))}
// //             </div>
// //           ) : viewType === 'calendar' ? (
// //             /* Calendar View */
// //             <CalendarView
// //               events={filtered}
// //               onRegister={setRegisterEvent}
// //               currentDate={calendarDate}
// //               onDateChange={setCalendarDate}
// //             />
// //           ) : visible.length > 0 ? (
// //             /* Grid View */
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
// //               {visible.map((event) => (
// //                 <EventCard
// //                   key={event.id}
// //                   event={event}
// //                   isPast={tab === 'past'}
// //                   onRegister={() => setRegisterEvent(event)}
// //                   isAdmin={isAdmin}
// //                   onDelete={handleDeleteEvent}
// //                 />
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-20 text-gray-400">
// //               <Icon
// //                 icon="mdi:calendar-blank-outline"
// //                 className="w-12 h-12 mx-auto mb-3 opacity-40"
// //               />
// //               <p className="text-sm">No {tab} events found.</p>
// //             </div>
// //           )}

// //           {/* Load More - only in grid view */}
// //           {viewType === 'grid' && hasMore && !isLoading && (
// //             <div className="text-center">
// //               <button
// //                 type="button"
// //                 onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
// //                 className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
// //               >
// //                 Load More Events
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </section>

// //       <RegisterEventModal event={registerEvent} onClose={() => setRegisterEvent(null)} />
// //     </>
// //   );
// // }

// // features/events/pages/EventsPage.tsx
// // MODIFIED: Uses shared EventCard + EventCardSkeleton (no local duplicates).
// // CalendarEventPill uses proper top-level import for useEventRegistration.

// import { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Icon } from '@iconify/react';
// import { SEO } from '@/shared/common/SEO';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { RegisterEventModal } from '../components/RegisterEventModal';
// import { EventCard, EventCardSkeleton } from '../components/EventCard';
// import { SearchInput } from '@/shared/components/ui/input/SearchInput';
// import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
// import Button from '@/shared/components/ui/Button';
// import { useUpcomingEvents, usePastEvents } from '@/features/events/hooks/useEvents';
// import { useEventRegistration } from '@/features/events/hooks/useEventRegistration';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import type { Event } from '@/features/events/types/event.types';
// import { EVENT_ROUTES } from '../routes';

// type Tab = 'upcoming' | 'past';
// type ViewType = 'grid' | 'calendar';
// const ITEMS_PER_PAGE = 6;

// // ─── Calendar Event Pill ──────────────────────────────────────────────────────
// // Kept local because it's calendar-specific and only used here.

// function CalendarEventPill({
//   event,
//   onRegister,
// }: {
//   event: Event;
//   onRegister: (event: Event) => void;
// }) {
//   const { isRegistered } = useEventRegistration(event.id);
//   return (
//     <button
//       type="button"
//       onClick={() => onRegister(event)}
//       className={`w-full text-left text-[10px] px-1.5 py-1 rounded truncate transition-colors ${
//         isRegistered
//           ? 'bg-green-100 text-green-700 hover:bg-green-200'
//           : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
//       }`}
//       title={event.title}
//     >
//       {event.title}
//     </button>
//   );
// }

// // ─── Calendar View ────────────────────────────────────────────────────────────

// function CalendarView({
//   events,
//   onRegister,
//   currentDate,
//   onDateChange,
// }: {
//   events: Event[];
//   onRegister: (event: Event) => void;
//   currentDate: Date;
//   onDateChange: (date: Date) => void;
// }) {
//   const eventsByDate = useMemo(() => {
//     const map = new Map<string, Event[]>();
//     events.forEach((event) => {
//       const key = new Date(event.date).toISOString().split('T')[0];
//       map.set(key, [...(map.get(key) || []), event]);
//     });
//     return map;
//   }, [events]);

//   const { year, month, daysInMonth, firstDayOfWeek, prevMonthDays } = useMemo(() => {
//     const y = currentDate.getFullYear();
//     const m = currentDate.getMonth();
//     return {
//       year: y,
//       month: m,
//       daysInMonth: new Date(y, m + 1, 0).getDate(),
//       firstDayOfWeek: new Date(y, m, 1).getDay(),
//       prevMonthDays: new Date(y, m, 0).getDate(),
//     };
//   }, [currentDate]);

//   const MONTH_NAMES = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];
//   const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
//   for (let i = firstDayOfWeek - 1; i >= 0; i--)
//     days.push({
//       day: prevMonthDays - i,
//       isCurrentMonth: false,
//       date: new Date(year, month - 1, prevMonthDays - i),
//     });
//   for (let d = 1; d <= daysInMonth; d++)
//     days.push({ day: d, isCurrentMonth: true, date: new Date(year, month, d) });
//   for (let d = 1; days.length < 42; d++)
//     days.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) });

//   const today = new Date().toISOString().split('T')[0];

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-bold text-gray-800">
//           {MONTH_NAMES[month]} {year}
//         </h2>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => onDateChange(new Date())}
//             className="px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
//           >
//             Today
//           </button>
//           <button
//             type="button"
//             onClick={() => onDateChange(new Date(year, month - 1, 1))}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-600" />
//           </button>
//           <button
//             type="button"
//             onClick={() => onDateChange(new Date(year, month + 1, 1))}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>
//       </div>
//       <div className="grid grid-cols-7 gap-2 mb-2">
//         {DAY_NAMES.map((d) => (
//           <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
//             {d}
//           </div>
//         ))}
//       </div>
//       <div className="grid grid-cols-7 gap-2">
//         {days.map((calDay, idx) => {
//           const key = calDay.date.toISOString().split('T')[0];
//           const dayEvents = eventsByDate.get(key) || [];
//           const isToday = key === today;
//           return (
//             <div
//               key={idx}
//               className={`min-h-[100px] p-2 border rounded-lg ${calDay.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${isToday ? 'border-primary-500 border-2' : 'border-gray-200'}`}
//             >
//               <div
//                 className={`text-sm font-semibold mb-1 ${calDay.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'} ${isToday ? 'text-primary-600' : ''}`}
//               >
//                 {calDay.day}
//               </div>
//               <div className="space-y-1">
//                 {dayEvents.map((event) => (
//                   <CalendarEventPill key={event.id} event={event} onRegister={onRegister} />
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded bg-primary-100 border border-primary-200" />
//           <span>Event</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
//           <span>Registered</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded border-2 border-primary-500" />
//           <span>Today</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export function EventsPage() {
//   const navigate = useNavigate();
//   const currentUser = useAuthStore((state) => state.user);

//   console.log('currentUser', { currentUser });
//   const isAdmin = currentUser?.role === 'admin';

//   const initialView =
//     new URLSearchParams(window.location.search).get('view') === 'calendar' ? 'calendar' : 'grid';

//   const [tab, setTab] = useState<Tab>('upcoming');
//   const [viewType, setViewType] = useState<ViewType>(initialView);
//   const [registerEvent, setRegisterEvent] = useState<Event | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [locationFilter, setLocationFilter] = useState('');
//   const [dateFrom, setDateFrom] = useState('');
//   const [dateTo, setDateTo] = useState('');
//   const [calendarDate, setCalendarDate] = useState(new Date());
//   const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

//   const { data: upcoming = [], isLoading: upcomingLoading } = useUpcomingEvents();
//   const { data: past = [], isLoading: pastLoading } = usePastEvents();

//   const isLoading = tab === 'upcoming' ? upcomingLoading : pastLoading;
//   const activeList = tab === 'upcoming' ? upcoming : past;

//   const locationOptions = useMemo(() => {
//     const locs = [...new Set(activeList.map((e) => e.location).filter(Boolean))];
//     return locs.map((l) => ({ label: l as string, value: l as string }));
//   }, [activeList]);

//   const filtered = useMemo(() => {
//     const q = searchTerm.trim().toLowerCase();
//     return activeList.filter((e) => {
//       const matchesSearch =
//         !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
//       const matchesLocation = !locationFilter || e.location === locationFilter;
//       let matchesDate = true;
//       if (dateFrom || dateTo) {
//         const ed = new Date(e.date);
//         const from = dateFrom ? new Date(dateFrom) : null;
//         const to = dateTo ? new Date(dateTo) : null;
//         if (from) {
//           from.setHours(0, 0, 0, 0);
//           ed.setHours(0, 0, 0, 0);
//         }
//         if (to) {
//           to.setHours(23, 59, 59, 999);
//         }
//         if (from && to) matchesDate = ed >= from && ed <= to;
//         else if (from) matchesDate = ed >= from;
//         else if (to) matchesDate = ed <= to;
//       }
//       return matchesSearch && matchesLocation && matchesDate;
//     });
//   }, [activeList, searchTerm, locationFilter, dateFrom, dateTo]);

//   const visible = filtered.slice(0, visibleCount);
//   const hasMore = visibleCount < filtered.length;

//   const handleTabChange = (newTab: Tab) => {
//     setTab(newTab);
//     setVisibleCount(ITEMS_PER_PAGE);
//     setSearchTerm('');
//     setLocationFilter('');
//     setDateFrom('');
//     setDateTo('');
//   };

//   return (
//     <>
//       <SEO
//         title="Events"
//         description="Through the generosity of our alumni, we continue to support and improve our beloved school."
//       />
//       <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Events' }]} />

//       <section className="section">
//         <div className="container-custom">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Events</h1>
//             <p className="text-gray-500 text-sm max-w-md mx-auto">
//               Through the generosity of our alumni, we continue to support and improve our beloved
//               school
//             </p>
//           </div>

//           {/* Controls */}
//           <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//             <div className="flex items-center gap-2">
//               <Button
//                 variant={tab === 'upcoming' ? 'primary' : 'outline'}
//                 onClick={() => handleTabChange('upcoming')}
//                 className="px-5 py-2 rounded-lg text-sm"
//               >
//                 Upcoming
//               </Button>
//               <Button
//                 variant={tab === 'past' ? 'primary' : 'outline'}
//                 onClick={() => handleTabChange('past')}
//                 className="px-5 py-2 rounded-lg text-sm"
//               >
//                 Past
//               </Button>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
//                 <button
//                   type="button"
//                   onClick={() => setViewType('grid')}
//                   className={`p-2 rounded transition-colors ${viewType === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   <Icon icon="mdi:view-grid-outline" className="w-5 h-5" />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setViewType('calendar')}
//                   className={`p-2 rounded transition-colors ${viewType === 'calendar' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//                 >
//                   <Icon icon="mdi:calendar-month-outline" className="w-5 h-5" />
//                 </button>
//               </div>
//               {isAdmin && (
//                 <button
//                   type="button"
//                   onClick={() => navigate(EVENT_ROUTES.CREATE)}
//                   className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
//                 >
//                   <Icon icon="mdi:plus" className="w-4 h-4" />
//                   Create Event
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Filters */}
//           {viewType === 'grid' && (
//             <div className="space-y-3 mb-8">
//               <div className="flex flex-col sm:flex-row items-end gap-3">
//                 <SearchInput
//                   label="Search"
//                   value={searchTerm}
//                   onValueChange={(v) => {
//                     setSearchTerm(v);
//                     setVisibleCount(ITEMS_PER_PAGE);
//                   }}
//                   placeholder="Search events..."
//                   className="flex-1"
//                 />
//                 <FilterDropdown
//                   label="Location"
//                   value={locationFilter}
//                   onChange={(v) => {
//                     setLocationFilter(v);
//                     setVisibleCount(ITEMS_PER_PAGE);
//                   }}
//                   options={locationOptions}
//                   placeholder="All Locations"
//                 />
//               </div>
//               <div className="flex flex-col sm:flex-row items-end gap-3">
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//                   <input
//                     type="date"
//                     value={dateFrom}
//                     onChange={(e) => {
//                       setDateFrom(e.target.value);
//                       setVisibleCount(ITEMS_PER_PAGE);
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//                   <input
//                     type="date"
//                     value={dateTo}
//                     onChange={(e) => {
//                       setDateTo(e.target.value);
//                       setVisibleCount(ITEMS_PER_PAGE);
//                     }}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
//                   />
//                 </div>
//                 {(dateFrom || dateTo) && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setDateFrom('');
//                       setDateTo('');
//                       setVisibleCount(ITEMS_PER_PAGE);
//                     }}
//                     className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center gap-1"
//                   >
//                     <Icon icon="mdi:close" className="w-4 h-4" />
//                     Clear Dates
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Content */}
//           {isLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//               {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
//                 <EventCardSkeleton key={i} />
//               ))}
//             </div>
//           ) : viewType === 'calendar' ? (
//             <CalendarView
//               events={filtered}
//               onRegister={setRegisterEvent}
//               currentDate={calendarDate}
//               onDateChange={setCalendarDate}
//             />
//           ) : visible.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//               {visible.map((event) => (
//                 <EventCard
//                   key={event.id}
//                   event={event}
//                   isPast={tab === 'past'}
//                   onRegister={() => setRegisterEvent(event)}
//                   isAdmin={isAdmin}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-20 text-gray-400">
//               <Icon
//                 icon="mdi:calendar-blank-outline"
//                 className="w-12 h-12 mx-auto mb-3 opacity-40"
//               />
//               <p className="text-sm">No {tab} events found.</p>
//             </div>
//           )}

//           {viewType === 'grid' && hasMore && !isLoading && (
//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={() => setVisibleCount((p) => p + ITEMS_PER_PAGE)}
//                 className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
//               >
//                 Load More Events
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       <RegisterEventModal event={registerEvent} onClose={() => setRegisterEvent(null)} />
//     </>
//   );
// }

// features/events/pages/EventsPage.tsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { EventCard, EventCardSkeleton } from '../components/EventCard';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import Button from '@/shared/components/ui/Button';
import { useUpcomingEvents, usePastEvents } from '../hooks/useEvents';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import type { Event } from '../types/event.types';
import { EVENT_ROUTES } from '../routes';
import { useEventRegistration } from '../hooks/useEventRegistration';

type Tab = 'upcoming' | 'past';
type ViewType = 'grid' | 'calendar';
const ITEMS_PER_PAGE = 6;

// ─── Calendar Event Pill ──────────────────────────────────────────────────────
function CalendarEventPill({
  event,
  onRegister,
}: {
  event: Event;
  onRegister: (event: Event) => void;
}) {
  const { isRegistered } = useEventRegistration(event.id);

  return (
    <button
      type="button"
      onClick={() => onRegister(event)}
      className={`w-full text-left text-[10px] px-1.5 py-1 rounded truncate transition-colors ${
        isRegistered
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
      }`}
      title={event.title}
    >
      {event.title}
    </button>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────
function CalendarView({
  events,
  onRegister,
  currentDate,
  onDateChange,
}: {
  events: Event[];
  onRegister: (event: Event) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((event) => {
      const key = new Date(event.date).toISOString().split('T')[0];
      map.set(key, [...(map.get(key) || []), event]);
    });
    return map;
  }, [events]);

  const { year, month, daysInMonth, firstDayOfWeek, prevMonthDays } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return {
      year: y,
      month: m,
      daysInMonth: new Date(y, m + 1, 0).getDate(),
      firstDayOfWeek: new Date(y, m, 1).getDay(),
      prevMonthDays: new Date(y, m, 0).getDate(),
    };
  }, [currentDate]);

  const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--)
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i),
    });
  for (let d = 1; d <= daysInMonth; d++)
    days.push({ day: d, isCurrentMonth: true, date: new Date(year, month, d) });
  for (let d = 1; days.length < 42; d++)
    days.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) });

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onDateChange(new Date(year, month - 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={() => onDateChange(new Date(year, month + 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((calDay, idx) => {
          const key = calDay.date.toISOString().split('T')[0];
          const dayEvents = eventsByDate.get(key) || [];
          const isToday = key === today;

          return (
            <div
              key={idx}
              className={`min-h-[100px] p-2 border rounded-lg ${
                calDay.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'border-primary-500 border-2' : 'border-gray-200'}`}
            >
              <div
                className={`text-sm font-semibold mb-1 ${
                  calDay.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                } ${isToday ? 'text-primary-600' : ''}`}
              >
                {calDay.day}
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <CalendarEventPill key={event.id} event={event} onRegister={onRegister} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary-100 border border-primary-200" />
          <span>Event</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-200" />
          <span>Registered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-primary-500" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}

// ─── Events Page ──────────────────────────────────────────────────────────────
export function EventsPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const initialView =
    new URLSearchParams(window.location.search).get('view') === 'calendar' ? 'calendar' : 'grid';

  const [tab, setTab] = useState<Tab>('upcoming');
  const [viewType, setViewType] = useState<ViewType>(initialView);
  const [registerEvent, setRegisterEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { data: upcoming = [], isLoading: upcomingLoading } = useUpcomingEvents();
  const { data: past = [], isLoading: pastLoading } = usePastEvents();

  const isLoading = tab === 'upcoming' ? upcomingLoading : pastLoading;
  const activeList = tab === 'upcoming' ? upcoming : past;

  const locationOptions = useMemo(() => {
    const locs = [...new Set(activeList.map((e) => e.location).filter(Boolean))];
    return locs.map((l) => ({ label: l as string, value: l as string }));
  }, [activeList]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return activeList.filter((e) => {
      const matchesSearch =
        !q || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q);
      const matchesLocation = !locationFilter || e.location === locationFilter;

      let matchesDate = true;
      if (dateFrom || dateTo) {
        const ed = new Date(e.date);
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;
        if (from) from.setHours(0, 0, 0, 0);
        if (to) to.setHours(23, 59, 59, 999);
        if (from && to) matchesDate = ed >= from && ed <= to;
        else if (from) matchesDate = ed >= from;
        else if (to) matchesDate = ed <= to;
      }

      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [activeList, searchTerm, locationFilter, dateFrom, dateTo]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setVisibleCount(ITEMS_PER_PAGE);
    setSearchTerm('');
    setLocationFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <>
      <SEO
        title="Events"
        description="Through the generosity of our alumni, we continue to support and improve our beloved school."
      />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Events' }]} />

      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Events</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Through the generosity of our alumni, we continue to support and improve our beloved
              school
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={tab === 'upcoming' ? 'primary' : 'outline'}
                onClick={() => handleTabChange('upcoming')}
                className="px-5 py-2 rounded-lg text-sm"
              >
                Upcoming
              </Button>
              <Button
                variant={tab === 'past' ? 'primary' : 'outline'}
                onClick={() => handleTabChange('past')}
                className="px-5 py-2 rounded-lg text-sm"
              >
                Past
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setViewType('grid')}
                  className={`p-2 rounded transition-colors ${viewType === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Icon icon="mdi:view-grid-outline" className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewType('calendar')}
                  className={`p-2 rounded transition-colors ${viewType === 'calendar' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Icon icon="mdi:calendar-month-outline" className="w-5 h-5" />
                </button>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate(EVENT_ROUTES.CREATE)}
                  className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4" />
                  Create Event
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          {viewType === 'grid' && (
            <div className="space-y-3 mb-8">
              <div className="flex flex-col sm:flex-row items-end gap-3">
                <SearchInput
                  label="Search"
                  value={searchTerm}
                  onValueChange={(v) => {
                    setSearchTerm(v);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  placeholder="Search events..."
                  className="flex-1"
                />
                <FilterDropdown
                  label="Location"
                  value={locationFilter}
                  onChange={(v) => {
                    setLocationFilter(v);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  options={locationOptions}
                  placeholder="All Locations"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                </div>
                {(dateFrom || dateTo) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom('');
                      setDateTo('');
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center gap-1"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                    Clear Dates
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : viewType === 'calendar' ? (
            <CalendarView
              events={filtered}
              onRegister={setRegisterEvent}
              currentDate={calendarDate}
              onDateChange={setCalendarDate}
            />
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {visible.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isPast={tab === 'past'}
                  onRegister={() => setRegisterEvent(event)}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Icon
                icon="mdi:calendar-blank-outline"
                className="w-12 h-12 mx-auto mb-3 opacity-40"
              />
              <p className="text-sm">No {tab} events found.</p>
            </div>
          )}

          {viewType === 'grid' && hasMore && !isLoading && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((p) => p + ITEMS_PER_PAGE)}
                className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Load More Events
              </button>
            </div>
          )}
        </div>
      </section>

      <RegisterEventModal event={registerEvent} onClose={() => setRegisterEvent(null)} />
    </>
  );
}
