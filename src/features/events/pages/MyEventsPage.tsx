// features/events/pages/MyEventsPage.tsx
// NEW DESIGN: Card grid (3 cols desktop, 2 tablet, 1 mobile).
// Clicking a card navigates to event detail. Unregister still available.
// Past events section below upcoming.

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { useMyEvents } from '../hooks/useEventRegistration';
import { useCancelRegistration } from '../hooks/useEvents';
import { toast } from '@/shared/components/ui/Toast';
import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';

// ─── Unregister modal ────────────────────────────────────────────────────────

function UnregisterModal({
  event,
  isLoading,
  onConfirm,
  onCancel,
}: {
  event: Event | null;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!event) return null;
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
              <span className="font-semibold">{event.title}</span>?
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

// ─── Event card ───────────────────────────────────────────────────────────────

function MyEventCard({
  event,
  isPast,
  onUnregisterClick,
}: {
  event: Event;
  isPast: boolean;
  onUnregisterClick: (e: React.MouseEvent) => void;
}) {
  const navigate = useNavigate();
  const isCancelled = event.status === 'cancelled';

  const dateDisplay = (() => {
    const d = new Date(event.date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  })();

  return (
    <div
      onClick={() => navigate(EVENT_ROUTES.DETAIL(event.id))}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Image */}
      <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-50">
            <Icon icon="mdi:calendar-month-outline" className="w-10 h-10 text-primary-200" />
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
          {isCancelled && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700/90 text-white">
              Cancelled
            </span>
          )}
          {isPast && !isCancelled && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-600/90 text-white flex items-center gap-1">
              <Icon icon="mdi:check-circle" className="w-3 h-3" /> Attended
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
          {event.description}
        </p>

        {event.location && (
          <p className="text-gray-400 text-xs flex items-center gap-1 mb-1 truncate">
            <Icon icon="mdi:map-marker-outline" className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        )}

        <p className="text-gray-400 text-xs flex items-center gap-1">
          <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5 flex-shrink-0" />
          {dateDisplay}
        </p>

        {/* Unregister — upcoming + not cancelled only, stops propagation */}
        {!isPast && !isCancelled && (
          <button
            type="button"
            onClick={onUnregisterClick}
            className="mt-3 flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-medium transition-colors"
          >
            <Icon icon="mdi:close-circle-outline" className="w-3.5 h-3.5" />
            Unregister
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function MyEventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ type }: { type: 'upcoming' | 'past' }) {
  return (
    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
      <Icon
        icon={type === 'upcoming' ? 'mdi:calendar-blank-outline' : 'mdi:calendar-check-outline'}
        className="w-10 h-10 mx-auto mb-3 text-gray-300"
      />
      <p className="text-gray-500 text-sm mb-3">
        {type === 'upcoming'
          ? "You haven't registered for any upcoming events yet."
          : "You haven't attended any past events."}
      </p>
      {type === 'upcoming' && (
        <AppLink
          href={EVENT_ROUTES.ROOT}
          className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-sm font-semibold"
        >
          Browse Events <Icon icon="mdi:arrow-right" className="w-4 h-4" />
        </AppLink>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function MyEventsPage() {
  // TODO: myEvents empty until backend implements POST /get_events { user_id }
  const { events: myEvents = [], isLoading } = useMyEvents();
  const cancelMutation = useCancelRegistration();
  const [unregisterEvent, setUnregisterEvent] = useState<Event | null>(null);

  const now = new Date();
  const upcomingEvents = myEvents.filter((e: Event) => {
    const [h = 23, m = 59] = (e.endTime || '23:59').split(':').map(Number);
    const d = new Date(e.date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m) >= now;
  });
  const pastEvents = myEvents.filter((e: Event) => {
    const [h = 23, m = 59] = (e.endTime || '23:59').split(':').map(Number);
    const d = new Date(e.date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m) < now;
  });

  const handleUnregister = async () => {
    if (!unregisterEvent) return;
    try {
      await cancelMutation.mutateAsync(unregisterEvent.id);
      toast.success('You have been unregistered from this event.');
    } catch (err: any) {
      toast.fromError(err);
    } finally {
      setUnregisterEvent(null);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: EVENT_ROUTES.ROOT },
    { label: 'My Registered Events' },
  ];

  return (
    <>
      <SEO title="My Registered Events" description="View and manage your event registrations" />
      {/* <Breadcrumbs items={breadcrumbItems} /> */}

      <div className="min-h-screen bg-[#f5f4f0]">
        <div className="container-custom py-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-7">
            My Registered Events
          </h1>

          {/* Upcoming */}
          {(isLoading || upcomingEvents.length > 0) && (
            <section className="mb-10">
              {!isLoading && upcomingEvents.length > 0 && (
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Icon icon="mdi:calendar-clock-outline" className="w-4 h-4 text-primary-500" />
                  Upcoming ({upcomingEvents.length})
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <MyEventCardSkeleton key={i} />)
                ) : upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: Event) => (
                    <MyEventCard
                      key={event.id}
                      event={event}
                      isPast={false}
                      onUnregisterClick={(e) => {
                        e.stopPropagation();
                        setUnregisterEvent(event);
                      }}
                    />
                  ))
                ) : (
                  <EmptyState type="upcoming" />
                )}
              </div>
            </section>
          )}

          {/* Empty upcoming (when not loading) */}
          {!isLoading && upcomingEvents.length === 0 && (
            <section className="mb-10">
              <div className="grid grid-cols-1">
                <EmptyState type="upcoming" />
              </div>
            </section>
          )}

          {/* Past */}
          {(isLoading || pastEvents.length > 0) && (
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Icon icon="mdi:calendar-check-outline" className="w-4 h-4 text-gray-400" />
                Past Events ({isLoading ? '…' : pastEvents.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => <MyEventCardSkeleton key={i} />)
                ) : pastEvents.length > 0 ? (
                  pastEvents.map((event: Event) => (
                    <MyEventCard
                      key={event.id}
                      event={event}
                      isPast={true}
                      onUnregisterClick={(e) => e.stopPropagation()}
                    />
                  ))
                ) : (
                  <EmptyState type="past" />
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <UnregisterModal
        event={unregisterEvent}
        isLoading={cancelMutation.isPending}
        onConfirm={handleUnregister}
        onCancel={() => setUnregisterEvent(null)}
      />
    </>
  );
}
