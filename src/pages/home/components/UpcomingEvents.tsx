import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useLatestEvents } from '@/features/events/hooks/useEvents';
import type { Event } from '@/features/events/types/event.types';

function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-52 overflow-hidden bg-gray-100">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">
            {new Date(event.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
        <h3 className="text-primary-500 font-semibold text-sm mb-2">{event.title}</h3>
        <div className="flex items-center gap-3 text-gray-500 text-xs mb-2">
          {event.location && (
            <span className="flex items-center gap-1">
              <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />
              {event.location}
            </span>
          )}
          {event.attire && (
            <span className="flex items-center gap-1">
              <Icon icon="mdi:hanger" className="w-3 h-3" />
              {event.attire}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{event.description}</p>
        <AppLink
          href={`/events/${event.slug}`}
          className="text-primary-500 text-xs font-semibold hover:underline flex items-center gap-1"
        >
          Register <Icon icon="mdi:arrow-right" className="w-3 h-3" />
        </AppLink>
      </div>
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

export default function UpcomingEvents() {
  const { data: events = [], isLoading } = useLatestEvents(4);
  // const { data: someEvents = [], } = useSomeEvents();

  // console.log("someEvents", {someEvents})

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)
            : events.map((event) => <EventCard key={event.slug} event={event} />)}
        </div>

        <div className="mt-6 text-right">
          <AppLink
            href="/events"
            className="text-primary-500 text-sm font-semibold hover:underline inline-flex items-center gap-1"
          >
            See More → 
          </AppLink>
        </div>
      </div>
    </section>
  );
}
