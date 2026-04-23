// features/events/pages/EventsPage.tsx
// NEW DESIGN: Side-by-side calendar + scrollable event list panel.
// Clicking a calendar event highlights and scrolls it into view in the list.
// Handles hundreds of events via incremental "load more" within the scroll panel.

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SEO } from '@/shared/common/SEO';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { useUpcomingEvents, usePastEvents } from '../hooks/useEvents';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';
import { MonthYearPicker } from '@/shared/components/ui/MonthYearPicker';
import { ROUTES } from '@/shared/constants/routes';

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

function formatShort(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  }); // e.g. "Apr 15"
}

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
      className={`
        w-full text-left rounded-xl p-2 sm:p-2.5
        transition-all duration-200
        hover:brightness-95
      `}
      style={{
        backgroundColor: color + '30', // soft background
        border: `1px solid ${color}20`,
        ...(isActive && { outline: `2px solid ${color}` }),
      }}
    >
      {/* Date badge (dark pill like screenshot) */}
      <div className="inline-flex items-center gap-1 px-2 py-[3px] rounded-md text-[10px] font-medium text-white bg-gray-800 mb-1.5">
        <span>📅</span>
        {formatShort(event.date)}
      </div>

      {/* Title */}
      <p className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-tight line-clamp-2">
        {event.title}
      </p>
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
      <div className="grid grid-cols-7 mb-2 gap-2">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] sm:text-xs font-semibold text-gray-900 py-1 ring-1 ring-gray-100 rounded-lg"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((calDay, idx) => {
          const key = formatDateKey(calDay.date);
          const dayEvents = eventsByDate.get(key) || [];
          const isToday = key === today;
          return (
            <div
              key={idx}
              className={`min-h-[60px] sm:min-h-[80px] p-0.5 sm:p-1 rounded-lg flex items-center justify-center ${
                calDay.isCurrentMonth ? 'bg-white' : 'bg-gray-50/60'
              } ${isToday ? 'ring-1 ring-primary-400' : 'ring-1 ring-gray-100'}`}
            >
              <span
                className={`block text-right text-[10px] sm:text-xs font-semibold mb-0.5 ${
                  calDay.isCurrentMonth ? 'text-gray-700' : 'text-gray-300'
                } ${isToday ? 'text-primary-600' : ''}`}
              >
                {dayEvents.length == 0 ? calDay.day : ''}
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
      className={`bg-white flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border scroll-mt-2 ${
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

      <Icon icon="mdi:chevron-right" className="w-4 h-4 text-primary-500 flex-shrink-0" />
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
          <div className="flex flex-col sm:flex-row sm:justify-between mb-12">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Events</h1>

            <div className="flex flex-wrap justify-center items-center gap-3 flex-shrink-0">
              <Link
                to={ROUTES.PROJECTS.ROOT}
                className="flex-1 text-center border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
              >
                Go to Our Projects
              </Link>
              <Link
                to={ROUTES.NEWS}
                className="flex-1 text-center border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
              >
                Go to Announcement
              </Link>
            </div>
          </div>

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
                <Icon icon="mdi:arrow-left" className="w-5 h-5 text-primary-500" />
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
                <Icon icon="mdi:arrow-right" className="w-5 h-5 text-primary-500" />
              </button>
              {/* <span className="font-bold text-gray-900 text-lg flex items-center gap-1 ml-1">
                {MONTH_NAMES[calendarDate.getMonth()]}
                <Icon icon="mdi:chevron-down" className="w-6 h-6 text-gray-400" />
              </span> */}

              <MonthYearPicker value={calendarDate} onChange={handleDateChange} />
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
                  <span className="hidden sm:inline">Create Event</span>
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
              className="rounded-2xl shadow-sm border border-gray-100 flex flex-col"
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
                    <div className="flex flex-col gap-3">
                      {' '}
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
                    </div>
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
