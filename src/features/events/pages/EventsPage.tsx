// // features/events/pages/EventsPage.tsx

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
// import { useUpcomingEvents, usePastEvents } from '../hooks/useEvents';
// import type { Event } from '../types/event.types';
// import { EVENT_ROUTES } from '../routes';
// import { useEventRegistration } from '../hooks/useEventRegistration';
// import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

// type Tab = 'upcoming' | 'past';
// type ViewType = 'grid' | 'calendar';
// const ITEMS_PER_PAGE = 6;

// function parseDateOnly(dateStr: string) {
//   const [y, m, d] = dateStr.split('-').map(Number);
//   return new Date(y, m - 1, d); // ✅ local date, no timezone shift
// }

// function formatDateKey(date: Date) {
//   return (
//     date.getFullYear() +
//     '-' +
//     String(date.getMonth() + 1).padStart(2, '0') +
//     '-' +
//     String(date.getDate()).padStart(2, '0')
//   );
// }

// // ─── Calendar Event Pill ──────────────────────────────────────────────────────
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
//       // const key = new Date(event.date).toISOString().split('T')[0];
//       const key = formatDateKey(parseDateOnly(event.date));
//       // const key = formatDateKey(new Date(event.date));
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

//   // const today = new Date().toISOString().split('T')[0];
//   const today = formatDateKey(new Date());

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
//           // const key = calDay.date.toISOString().split('T')[0];
//           const key = formatDateKey(calDay.date);
//           const dayEvents = eventsByDate.get(key) || [];
//           const isToday = key === today;

//           return (
//             <div
//               key={idx}
//               className={`min-h-[100px] p-2 border rounded-lg ${
//                 calDay.isCurrentMonth ? 'bg-white' : 'bg-gray-50'
//               } ${isToday ? 'border-primary-500 border-2' : 'border-gray-200'}`}
//             >
//               <div
//                 className={`text-sm font-semibold mb-1 ${
//                   calDay.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
//                 } ${isToday ? 'text-primary-600' : ''}`}
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

// // ─── Events Page ──────────────────────────────────────────────────────────────
// export function EventsPage() {
//   const navigate = useNavigate();
//   const currentUser = useIdentityStore((state) => state.user);
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
//   console.log('upcoming', { upcoming });
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
//         if (from) from.setHours(0, 0, 0, 0);
//         if (to) to.setHours(23, 59, 59, 999);
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

//                 <div>
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

//                 <div>
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
//               </div>

//               {/* <div className="flex flex-col sm:flex-row items-end gap-3">
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
//               </div> */}
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
// NEW DESIGN: Side-by-side calendar + scrollable event list panel.
// Clicking a calendar event highlights and scrolls it into view in the list.
// Handles hundreds of events via incremental "load more" within the scroll panel.

import { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { useUpcomingEvents, usePastEvents } from '../hooks/useEvents';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDateOnly(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateKey(date: Date) {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
}

function formatEventDate(event: Event): string {
  const d = parseDateOnly(event.date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Stable pastel color per event, deterministic from id
const EVENT_COLORS = ['#7c6af7', '#e8b84b', '#6ac8f7', '#f76a9f', '#52c97a', '#f79a6a'];
function eventColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return EVENT_COLORS[Math.abs(hash) % EVENT_COLORS.length];
}

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
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LIST_PAGE = 20;

// ─── Calendar event block ─────────────────────────────────────────────────────

function CalendarBlock({
  event,
  isActive,
  onClick,
}: {
  event: Event;
  isActive: boolean;
  onClick: () => void;
}) {
  const color = eventColor(event.id);
  return (
    <button
      type="button"
      onClick={onClick}
      title={event.title}
      style={{ backgroundColor: color + '30', outline: isActive ? `2px solid ${color}` : 'none' }}
      className="w-full text-left px-1 py-0.5 rounded text-[9px] sm:text-[10px] font-medium leading-snug truncate mb-0.5 transition-all"
    >
      <span className="text-[9px] opacity-70 mr-0.5">📅</span>
      {event.date.slice(5).replace('-', '/')} {event.title}
    </button>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({
  events,
  currentDate,
  activeEventId,
  onDateChange,
  onEventClick,
}: {
  events: Event[];
  currentDate: Date;
  activeEventId: string | null;
  onDateChange: (d: Date) => void;
  onEventClick: (e: Event) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((ev) => {
      const key = formatDateKey(parseDateOnly(ev.date));
      map.set(key, [...(map.get(key) || []), ev]);
    });
    return map;
  }, [events]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rawFirst = new Date(year, month, 1).getDay();
  const firstDayOfWeek = (rawFirst + 6) % 7; // Mon = 0
  const prevMonthDays = new Date(year, month, 0).getDate();
  const today = formatDateKey(new Date());

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5">
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] sm:text-xs font-semibold text-gray-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {days.map((calDay, idx) => {
          const key = formatDateKey(calDay.date);
          const dayEvents = eventsByDate.get(key) || [];
          const isToday = key === today;
          return (
            <div
              key={idx}
              className={`min-h-[60px] sm:min-h-[80px] p-0.5 sm:p-1 rounded-lg ${
                calDay.isCurrentMonth ? 'bg-white' : 'bg-gray-50/60'
              } ${isToday ? 'ring-1 ring-primary-400' : ''}`}
            >
              <span
                className={`block text-right text-[10px] sm:text-xs font-semibold mb-0.5 ${
                  calDay.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'
                } ${isToday ? 'text-primary-600' : ''}`}
              >
                {calDay.day}
              </span>
              {dayEvents.slice(0, 2).map((ev) => (
                <CalendarBlock
                  key={ev.id}
                  event={ev}
                  isActive={activeEventId === ev.id}
                  onClick={() => onEventClick(ev)}
                />
              ))}
              {dayEvents.length > 2 && (
                <span className="text-[9px] text-gray-400">+{dayEvents.length - 2}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Event list item ──────────────────────────────────────────────────────────

function EventListItem({
  event,
  isActive,
  onClick,
  itemRef,
}: {
  event: Event;
  isActive: boolean;
  onClick: () => void;
  itemRef: (el: HTMLDivElement | null) => void;
}) {
  const color = eventColor(event.id);
  return (
    <div
      ref={itemRef}
      onClick={onClick}
      className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all border scroll-mt-2 ${
        isActive
          ? 'border-primary-300 bg-blue-50/60 shadow-sm'
          : 'border-transparent hover:bg-gray-50'
      }`}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
            {event.title}
          </h3>
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: color }}
          />
        </div>
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
          {formatEventDate(event)}
        </p>
      </div>

      <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </div>
  );
}

function EventListSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-[72px] h-[72px] rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function EventsPage() {
  const navigate = useNavigate();
  const currentUser = useIdentityStore((state) => state.user);
  const isAdmin = currentUser?.role === 'admin';

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [registerEvent, setRegisterEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [listCount, setListCount] = useState(LIST_PAGE);

  const { data: upcoming = [], isLoading: upcomingLoading } = useUpcomingEvents();
  const { data: past = [], isLoading: pastLoading } = usePastEvents();
  const isLoading = upcomingLoading || pastLoading;

  // All events sorted by date ascending
  const allEvents = useMemo(
    () =>
      [...upcoming, ...past].sort(
        (a, b) => parseDateOnly(a.date).getTime() - parseDateOnly(b.date).getTime(),
      ),
    [upcoming, past],
  );

  // Events for the currently shown calendar month
  const calendarMonthEvents = useMemo(
    () =>
      allEvents.filter((e) => {
        const d = parseDateOnly(e.date);
        return (
          d.getFullYear() === calendarDate.getFullYear() && d.getMonth() === calendarDate.getMonth()
        );
      }),
    [allEvents, calendarDate],
  );

  // Right panel filtered events
  const filteredEvents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allEvents;
    return allEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q),
    );
  }, [allEvents, searchTerm]);

  const visibleEvents = filteredEvents.slice(0, listCount);
  const hasMore = listCount < filteredEvents.length;

  // Ref map for scrolling individual list items
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleCalendarClick = useCallback(
    (event: Event) => {
      setActiveEventId(event.id);

      // Make sure it's in the visible portion, then scroll
      const idx = filteredEvents.findIndex((e) => e.id === event.id);
      if (idx >= 0 && idx >= listCount) {
        setListCount(idx + LIST_PAGE);
      }

      requestAnimationFrame(() => {
        const el = itemRefs.current.get(event.id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    },
    [filteredEvents, listCount],
  );

  const handleListClick = (event: Event) => {
    setActiveEventId(event.id);
    navigate(EVENT_ROUTES.DETAIL(event.id));
  };

  const handleDateChange = (d: Date) => {
    setCalendarDate(d);
    setActiveEventId(null);
  };

  return (
    <>
      <SEO title="Events" description="Alumni events — connect, celebrate and give back." />

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-5 sm:py-7">
          {/* ── Top bar ──────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            {/* Month nav */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDateChange(
                    new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1),
                  )
                }
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={() =>
                  handleDateChange(
                    new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1),
                  )
                }
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-600" />
              </button>
              <span className="font-bold text-gray-900 text-lg flex items-center gap-1 ml-1">
                {MONTH_NAMES[calendarDate.getMonth()]}
                <Icon icon="mdi:chevron-down" className="w-4 h-4 text-gray-400" />
              </span>
            </div>

            {/* Search + create */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setListCount(LIST_PAGE);
                    setActiveEventId(null);
                  }}
                  placeholder="Search events"
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm"
                />
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => navigate(EVENT_ROUTES.CREATE)}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  <Icon icon="mdi:plus" className="w-4 h-4" />
                  <span className="hidden sm:inline">Create</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Two-column layout ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_430px] gap-4 lg:items-start">
            {/* Calendar */}
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse h-[480px]" />
            ) : (
              <Calendar
                events={calendarMonthEvents}
                currentDate={calendarDate}
                activeEventId={activeEventId}
                onDateChange={handleDateChange}
                onEventClick={handleCalendarClick}
              />
            )}

            {/* Scrollable event list */}
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col"
              style={{ maxHeight: 'calc(100vh - 130px)' }}
            >
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => <EventListSkeleton key={i} />)
                ) : visibleEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Icon icon="mdi:calendar-blank-outline" className="w-10 h-10 mb-3 opacity-40" />
                    <p className="text-sm">No events found</p>
                  </div>
                ) : (
                  <>
                    {visibleEvents.map((event) => (
                      <EventListItem
                        key={event.id}
                        event={event}
                        isActive={activeEventId === event.id}
                        onClick={() => handleListClick(event)}
                        itemRef={(el) => {
                          if (el) itemRefs.current.set(event.id, el);
                          else itemRefs.current.delete(event.id);
                        }}
                      />
                    ))}
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => setListCount((c) => c + LIST_PAGE)}
                        className="w-full py-3 text-xs font-semibold text-primary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                      >
                        Load {Math.min(filteredEvents.length - listCount, LIST_PAGE)} more events…
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Footer count */}
              {!isLoading && filteredEvents.length > 0 && (
                <div className="border-t border-gray-50 px-4 py-2 text-center text-[11px] text-gray-400">
                  {Math.min(visibleEvents.length, filteredEvents.length)} of {filteredEvents.length}{' '}
                  events
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RegisterEventModal event={registerEvent} onClose={() => setRegisterEvent(null)} />
    </>
  );
}
