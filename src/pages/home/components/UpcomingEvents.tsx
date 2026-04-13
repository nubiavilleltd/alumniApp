// pages/home/components/UpcomingEvents.tsx
// MODIFIED: Uses shared EventCard + EventCardSkeleton — no local duplicates.

import { AppLink } from '@/shared/components/ui/AppLink';
import { EventCard, EventCardSkeleton } from '@/features/events/components/EventCard';
import { useLatestEvents } from '@/features/events/hooks/useEvents';
import EmptyState from '@/shared/components/ui/EmptyState';

export default function UpcomingEvents() {
  const { data: events = [], isLoading } = useLatestEvents(4);

  const isEmpty = !isLoading && events.length === 0;

  return (
    <section className="section">
      <div className="container-custom">
        <p className="text-primary-500 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
          <span className="inline-block w-6 h-px bg-primary-500" />
          Upcoming Events
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Through the generosity of our alumni, we continue to support and improve our beloved
          school
        </p>

        {isEmpty ? (
          <EmptyState
            icon="mdi:calendar-blank-outline"
            title="No upcoming events right now"
            description="Check back soon for new events."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
              : events.map((event) => <EventCard key={event.id} event={event} compact />)}
          </div>
        )}

        {!isEmpty && (
          <div className="mt-6 text-right">
            <AppLink
              href="/events"
              className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
            >
              See More →
            </AppLink>
          </div>
        )}
      </div>
    </section>
  );
}
