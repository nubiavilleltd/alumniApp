import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { AppLink } from '@/shared/components/ui/AppLink';
import Button from '@/shared/components/ui/Button';
import { ROUTES } from '@/shared/constants/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { useAllEvents } from '../hooks/useEvents';
import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
  { label: 'Events' },
];

const monthOptions = [
  { label: 'Month', value: 'all' },
  { label: 'January', value: '0' },
  { label: 'February', value: '1' },
  { label: 'March', value: '2' },
  { label: 'April', value: '3' },
  { label: 'May', value: '4' },
  { label: 'June', value: '5' },
  { label: 'July', value: '6' },
  { label: 'August', value: '7' },
  { label: 'September', value: '8' },
  { label: 'October', value: '9' },
  { label: 'November', value: '10' },
  { label: 'December', value: '11' },
] as const;

function parseEventDate(dateStr?: string) {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split('-').map(Number);
  if ([year, month, day].some((value) => Number.isNaN(value))) return null;

  return new Date(year, month - 1, day);
}

function formatEventSummary(event: Event) {
  return event.description?.trim() || event.content?.trim() || 'No event summary provided yet.';
}

function formatDateLabel(date?: Date | null) {
  if (!date) return 'Date to be announced';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimeLabel(time?: string) {
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time;

  const value = new Date();
  value.setHours(hours, minutes, 0, 0);

  return value.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatEventSchedule(event: Event) {
  const dateLabel = formatDateLabel(parseEventDate(event.date));
  const startLabel = formatTimeLabel(event.startTime);
  const endLabel = formatTimeLabel(event.endTime);

  if (startLabel && endLabel) return `${dateLabel} · ${startLabel} - ${endLabel}`;
  if (startLabel) return `${dateLabel} · ${startLabel}`;

  return dateLabel;
}

function sortEventsForAdmin(events: Event[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...events].sort((left, right) => {
    const leftDate = parseEventDate(left.date);
    const rightDate = parseEventDate(right.date);

    if (!leftDate && !rightDate) return left.title.localeCompare(right.title);
    if (!leftDate) return 1;
    if (!rightDate) return -1;

    const leftUpcoming = leftDate >= today;
    const rightUpcoming = rightDate >= today;

    if (leftUpcoming && !rightUpcoming) return -1;
    if (!leftUpcoming && rightUpcoming) return 1;

    if (leftUpcoming && rightUpcoming) return leftDate.getTime() - rightDate.getTime();

    return rightDate.getTime() - leftDate.getTime();
  });
}

function isFutureOrToday(date?: string) {
  const value = parseEventDate(date);
  if (!value) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return value >= today;
}

function statusBadgeClass(event: Event) {
  switch (event.status) {
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    case 'completed':
      return 'bg-gray-100 text-gray-700';
    case 'draft':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-primary-50 text-primary-700';
  }
}

function statusLabel(event: Event) {
  if (event.status === 'completed') return 'Completed';
  if (event.status === 'cancelled') return 'Cancelled';
  if (event.status === 'draft') return 'Draft';
  return isFutureOrToday(event.date) ? 'Upcoming' : 'Published';
}

function AdminEventsCard({ event }: { event: Event }) {
  return (
    <AppLink
      href={EVENT_ROUTES.DETAIL(event.id)}
      className="group block h-full rounded-[1.5rem] bg-white p-4 text-inherit no-underline shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)]"
    >
      <article className="flex h-full flex-col gap-4 sm:flex-row">
        <div className="h-32 overflow-hidden rounded-[1.125rem] bg-accent-50 sm:h-[9rem] sm:w-[9rem] sm:flex-shrink-0">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-200">
              <Icon icon="mdi:calendar-month-outline" className="h-12 w-12" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="max-w-3xl text-[1.45rem] font-bold leading-tight text-accent-950 transition-colors duration-200 group-hover:text-primary-700">
              {event.title}
            </h2>
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusBadgeClass(
                event,
              )}`}
            >
              {statusLabel(event)}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-base leading-relaxed text-accent-500">
            {formatEventSummary(event)}
          </p>

          <div className="mt-3 space-y-2 text-sm text-accent-500">
            <div className="flex items-start gap-2">
              <Icon
                icon="mdi:map-marker-outline"
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-400"
              />
              <span>{event.location?.trim() || 'Location to be announced'}</span>
            </div>

            <div className="flex items-start gap-2">
              <Icon
                icon="mdi:calendar-clock-outline"
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-400"
              />
              <span>{formatEventSchedule(event)}</span>
            </div>

            {event.attendeeCount !== undefined && (
              <div className="flex items-start gap-2">
                <Icon
                  icon="mdi:account-group-outline"
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-400"
                />
                <span>
                  {event.attendeeCount} attendee{event.attendeeCount === 1 ? '' : 's'}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </AppLink>
  );
}

function AdminEventsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="h-14 flex-1 rounded-full bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.06)]" />
          <div className="h-14 w-full rounded-full bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:w-44" />
        </div>
        <div className="h-14 w-full rounded-full bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.06)] sm:w-52" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[1.5rem] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="h-32 rounded-[1.125rem] bg-accent-100 sm:h-[9rem] sm:w-[9rem]" />
              <div className="flex-1 space-y-3">
                <div className="h-7 w-3/4 rounded bg-accent-100" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-accent-50" />
                  <div className="h-4 w-5/6 rounded bg-accent-50" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-4/5 rounded bg-accent-50" />
                  <div className="h-4 w-3/5 rounded bg-accent-50" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');

  const { data: events = [], isLoading, isError, refetch } = useAllEvents();

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return sortEventsForAdmin(events).filter((event) => {
      const eventDate = parseEventDate(event.date);
      const matchesMonth =
        selectedMonth === 'all' ||
        (eventDate ? eventDate.getMonth() === Number(selectedMonth) : false);

      if (!matchesMonth) return false;

      if (!normalizedSearch) return true;

      const haystack = [event.title, event.description, event.content, event.location]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [events, searchTerm, selectedMonth]);

  return (
    <>
      <SEO title="Admin Events" description="Manage events from the admin dashboard." />
      <Breadcrumbs items={breadcrumbItems} />

      <main className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-6">
          <h1 className="sr-only">Admin Events</h1>

          {isLoading ? (
            <AdminEventsSkeleton />
          ) : isError ? (
            <div className="rounded-[1.5rem] bg-white p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Icon icon="mdi:alert-circle-outline" className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-accent-950">Could not load events</h2>
              <p className="mt-2 text-sm text-accent-500">
                Try again to reload the events management view.
              </p>
              <Button className="mt-6" onClick={() => void refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                  <label className="relative block flex-1">
                    <span className="sr-only">Search events</span>
                    <Icon
                      icon="mdi:magnify"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-300"
                    />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search events"
                      className="w-full rounded-full border border-white bg-white py-3 pl-12 pr-5 text-base text-accent-900 shadow-[0_10px_28px_rgba(15,23,42,0.06)] outline-none transition focus:border-primary-200 focus:ring-4 focus:ring-primary-100"
                    />
                  </label>

                  <label className="relative block sm:w-44">
                    <span className="sr-only">Filter events by month</span>
                    <select
                      value={selectedMonth}
                      onChange={(event) => setSelectedMonth(event.target.value)}
                      className="w-full appearance-none rounded-full border border-white bg-white px-5 py-3 pr-11 text-base font-semibold text-accent-600 shadow-[0_10px_28px_rgba(15,23,42,0.06)] outline-none transition focus:border-primary-200 focus:ring-4 focus:ring-primary-100"
                    >
                      {monthOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Icon
                      icon="mdi:chevron-down"
                      className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-400"
                    />
                  </label>
                </div>

                <AppLink
                  href={EVENT_ROUTES.CREATE}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-base font-semibold text-white no-underline shadow-[0_10px_26px_rgba(37,99,235,0.18)] transition hover:bg-primary-600"
                >
                  Create Event
                  <Icon icon="mdi:plus" className="h-4 w-4" />
                </AppLink>
              </div>

              {filteredEvents.length > 0 ? (
                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {filteredEvents.map((event) => (
                    <AdminEventsCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-500">
                    <Icon icon="mdi:calendar-search-outline" className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-accent-950">No events found</h2>
                  <p className="mt-2 text-sm text-accent-500">
                    Adjust your search or month filter to find a matching event.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
