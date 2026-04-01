// features/events/pages/MyEventsPage.tsx

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { useMyEvents, useEventRegistration } from '../hooks/useEventRegistration';
import type { Event } from '../types/event.types';
import { EVENT_ROUTES } from '../routes';
import { ROUTES } from '@/shared/constants/routes';

// ─── Unregister Confirmation Modal ───────────────────────────────────────────
function UnregisterModal({
  event,
  onConfirm,
  onCancel,
}: {
  event: Event | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">Cancel Registration?</h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to unregister from{' '}
              <span className="font-semibold">{event.title}</span>?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Keep Registration
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Yes, Unregister
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Event Card for My Events ─────────────────────────────────────────────────
function MyEventCard({
  event,
  isPast,
  onUnregister,
  isLoading,
}: {
  event: Event;
  isPast: boolean;
  onUnregister: () => void;
  isLoading?: boolean;
}) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = event.startTime ? ` at ${event.startTime}` : '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Event Image */}
        {event.image && (
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-gray-900 font-bold text-base mb-1">{event.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 text-xs">
                <span className="flex items-center gap-1">
                  <Icon
                    icon={event.isVirtual ? 'mdi:video-outline' : 'mdi:map-marker-outline'}
                    className="w-3.5 h-3.5 flex-shrink-0"
                  />
                  {event.location}
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:calendar-outline" className="w-3.5 h-3.5 flex-shrink-0" />
                  {formattedDate}
                  {formattedTime}
                </span>
                {event.attire && (
                  <span className="flex items-center gap-1">
                    <Icon icon="mdi:hanger" className="w-3.5 h-3.5 flex-shrink-0" />
                    {event.attire}
                  </span>
                )}
              </div>
            </div>

            {/* Past Event Badge */}
            {isPast && (
              <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                <Icon icon="mdi:check-circle" className="w-3.5 h-3.5" />
                Attended
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Virtual Event - Join Button */}
            {!isPast && event.isVirtual && event.virtualLink && (
              <a
                href={event.virtualLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Icon icon="mdi:video-outline" className="w-4 h-4" />
                Join Meeting
              </a>
            )}

            {/* View Details */}
            <AppLink
              href={EVENT_ROUTES.DETAIL(event.id)}
              className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-xs font-semibold transition-colors px-3 py-2"
            >
              View Details
              <Icon icon="mdi:arrow-right" className="w-3.5 h-3.5" />
            </AppLink>

            {/* Unregister - Only for upcoming */}
            {!isPast && (
              <button
                type="button"
                onClick={onUnregister}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-semibold transition-colors px-3 py-2 ml-auto disabled:opacity-50"
              >
                {isLoading ? (
                  <Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon icon="mdi:close-circle-outline" className="w-3.5 h-3.5" />
                )}
                Unregister
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function MyEventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 rounded-lg bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-2 mt-3">
            <div className="h-8 bg-gray-200 rounded w-24" />
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ type }: { type: 'upcoming' | 'past' }) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <Icon
        icon={type === 'upcoming' ? 'mdi:calendar-blank-outline' : 'mdi:calendar-check-outline'}
        className="w-12 h-12 mx-auto mb-3 text-gray-300"
      />
      <p className="text-gray-500 text-sm mb-4">
        {type === 'upcoming'
          ? "You haven't registered for any upcoming events yet."
          : "You haven't attended any past events."}
      </p>
      {type === 'upcoming' && (
        <AppLink
          href={EVENT_ROUTES.ROOT}
          className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-semibold transition-colors"
        >
          Browse Events
          <Icon icon="mdi:arrow-right" className="w-4 h-4" />
        </AppLink>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function MyEventsPage() {
  const { events: myEvents = [], isLoading } = useMyEvents();
  const [unregisterEvent, setUnregisterEvent] = useState<Event | null>(null);
  const { unregister, isLoading: unregisterLoading } = useEventRegistration(
    unregisterEvent?.id || '',
  );

  // Split into upcoming and past
  const upcomingEvents = myEvents.filter((event: Event) => new Date(event.date) >= new Date());
  const pastEvents = myEvents.filter((event: Event) => new Date(event.date) < new Date());

  const handleUnregister = () => {
    if (!unregisterEvent) return;
    unregister();
    setUnregisterEvent(null);
  };

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.HOME },
    { label: 'Events', href: EVENT_ROUTES.ROOT },
    { label: 'My Events' },
  ];

  return (
    <>
      <SEO title="My Events" description="View and manage your event registrations" />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold italic mb-2">My Events</h1>
            <p className="text-gray-500 text-sm">View and manage your event registrations</p>
          </div>

          {/* Upcoming Events */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon icon="mdi:calendar-clock-outline" className="w-5 h-5 text-primary-500" />
                Upcoming Events
                <span className="text-sm font-normal text-gray-500">({upcomingEvents.length})</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <MyEventCardSkeleton key={i} />
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event: Event) => (
                  <MyEventCard
                    key={event.id}
                    event={event}
                    isPast={false}
                    onUnregister={() => setUnregisterEvent(event)}
                    isLoading={unregisterLoading && unregisterEvent?.id === event.id}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="upcoming" />
            )}
          </div>

          {/* Past Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon icon="mdi:calendar-check-outline" className="w-5 h-5 text-gray-400" />
                Past Events
                <span className="text-sm font-normal text-gray-500">({pastEvents.length})</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <MyEventCardSkeleton key={i} />
                ))}
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="space-y-4">
                {pastEvents.map((event: Event) => (
                  <MyEventCard key={event.id} event={event} isPast={true} onUnregister={() => {}} />
                ))}
              </div>
            ) : (
              <EmptyState type="past" />
            )}
          </div>
        </div>
      </section>

      {/* Unregister Confirmation Modal */}
      {unregisterEvent && (
        <UnregisterModal
          event={unregisterEvent}
          onConfirm={handleUnregister}
          onCancel={() => setUnregisterEvent(null)}
        />
      )}
    </>
  );
}
