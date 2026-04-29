import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useEvent } from '../hooks/useEvents';
import { useEventAttendees } from '../hooks/useEventAttendees';
import { EVENT_ROUTES } from '../routes';
import type { EventAttendee } from '../api/adapters/event-attendees.adapter';

function formatEventDate(date?: string) {
  if (!date) return '';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRegisteredAt(date?: string) {
  if (!date) return 'Recently registered';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function initialsFor(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function AttendeeCard({ attendee }: { attendee: EventAttendee }) {
  return (
    <article className="rounded-2xl border border-accent-100 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-100 to-accent-100 text-sm font-bold text-primary-700">
          {initialsFor(attendee.fullName)}
        </div>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-accent-950">{attendee.fullName}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-accent-500">
            <Icon
              icon="mdi:calendar-clock-outline"
              className="h-4 w-4 flex-shrink-0 text-accent-400"
            />
            <span>{formatRegisteredAt(attendee.registeredAt)}</span>
          </p>
        </div>
      </div>
    </article>
  );
}

function AttendeeCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-accent-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-accent-100" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-accent-100" />
            <div className="h-4 w-52 rounded bg-accent-50" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-full bg-accent-100" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-4 w-44 rounded bg-accent-50" />
        <div className="h-4 w-36 rounded bg-accent-50" />
      </div>
    </div>
  );
}

export default function AttendeesPage() {
  const { id = '' } = useParams();

  const { data: event } = useEvent(id);
  const { data: attendeeData, isLoading } = useEventAttendees(id, 'going');

  const attendees = useMemo(() => attendeeData?.attendees ?? [], [attendeeData?.attendees]);

  const pageTitle =
    (attendeeData?.eventTitle && attendeeData.eventTitle !== 'Unknown Event'
      ? attendeeData.eventTitle
      : event?.title) || 'Event attendees';
  const eventDate = attendeeData?.eventDate || event?.date || '';
  const totalCount = attendeeData?.goingCount ?? attendees.length;

  return (
    <>
      <SEO title={`${pageTitle} Attendees`} description={`View attendees for ${pageTitle}.`} />

      <main className="min-h-screen bg-[#faf9f7]">
        <div className="container-custom py-8">
          <div className="mb-4">
            <AppLink
              href={id ? EVENT_ROUTES.DETAIL(id) : EVENT_ROUTES.ROOT}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-colors hover:text-accent-900"
            >
              <Icon icon="mdi:arrow-left" className="h-4 w-4" />
              Back to Event
            </AppLink>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-accent-100 sm:p-8">
            <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold leading-tight text-accent-950 sm:text-4xl">
                  {pageTitle}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-accent-500">
                  {eventDate && (
                    <span className="inline-flex items-center gap-2">
                      <Icon icon="mdi:calendar-clock-outline" className="h-4 w-4" />
                      {formatEventDate(eventDate)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Icon icon="mdi:account-group-outline" className="h-4 w-4" />
                    {totalCount} going attendee{totalCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </header>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => <AttendeeCardSkeleton key={index} />)
            ) : attendees.length > 0 ? (
              attendees.map((attendee) => (
                <AttendeeCard key={attendee.userId} attendee={attendee} />
              ))
            ) : (
              <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-accent-100 md:col-span-2 xl:col-span-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
                  <Icon icon="mdi:account-group-outline" className="h-7 w-7 text-accent-700" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-accent-950">No attendees yet</h2>
                <p className="mt-2 text-sm text-accent-500">
                  No confirmed attendees yet for this event.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
