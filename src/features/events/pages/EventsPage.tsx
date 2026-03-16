import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { SearchInput } from '@/shared/components/ui/input/SearchInput';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import Button from '@/shared/components/ui/Button';
import { useUpcomingEvents, usePastEvents } from '@/features/events/hooks/useEvents';
import { useEventRegistration, useEventAttendeeCount } from '@/features/events/hooks/useEventRegistration';
import type { Event } from '@/features/events/types/event.types';

type Tab = 'upcoming' | 'past';
const ITEMS_PER_PAGE = 6;

// ─── Skeletons ────────────────────────────────────────────────────────────────
function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-52 w-full bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({
  event,
  isPast,
  onRegister,
}: {
  event: Event;
  isPast: boolean;
  onRegister: () => void;
}) {
  const { isRegistered } = useEventRegistration(event.id);
  const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event);

  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {event.image && (
        <div className="h-52 w-full overflow-hidden bg-gray-100 relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Registration Status Badge */}
          {!isPast && isRegistered && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Icon icon="mdi:check-circle" className="w-3 h-3" />
              Registered
            </div>
          )}
          {/* Event Full Badge */}
          {!isPast && isFull && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Event Full
            </div>
          )}
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-primary-500 font-bold text-sm leading-snug">{event.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-400 text-[11px]">
          {event.location && (
            <span className="flex items-center gap-1">
              <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
              {event.location}
            </span>
          )}
          {event.attire && (
            <span className="flex items-center gap-1">
              <Icon icon="mdi:hanger" className="w-3 h-3 flex-shrink-0" />
              {event.attire}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Icon icon="mdi:calendar-outline" className="w-3 h-3 flex-shrink-0" />
            {formattedDate}
          </span>
        </div>
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">
          {event.description}
        </p>

        {/* Attendee Count - Show for upcoming events */}
        {!isPast && (
          <div className="flex items-center gap-1 text-gray-600 text-[11px] mt-1">
            <Icon icon="mdi:account-group-outline" className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {capacity ? (
                <>
                  <span className="font-semibold">{attendeeCount}</span>/{capacity} attending
                  {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
                    <span className="text-orange-500 ml-1">({spotsLeft} spots left)</span>
                  )}
                </>
              ) : (
                <>
                  <span className="font-semibold">{attendeeCount}</span> attending
                </>
              )}
            </span>
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center gap-2">
          {isPast ? (
            <AppLink
              href={`/events/${event.slug}`}
              className="inline-block border border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-500 text-xs font-semibold px-5 py-1.5 rounded-md transition-colors"
            >
              View Details
            </AppLink>
          ) : isRegistered ? (
            <>
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1 border border-green-500 text-green-600 text-xs font-semibold px-4 py-1.5 rounded-md cursor-default"
              >
                <Icon icon="mdi:check-circle" className="w-3.5 h-3.5" />
                Registered
              </button>
              <AppLink
                href={`/events/${event.slug}`}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-500 text-xs font-semibold transition-colors"
              >
                View Details
              </AppLink>
            </>
          ) : isFull ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1 text-gray-400 text-xs font-semibold cursor-not-allowed"
            >
              Event Full
            </button>
          ) : (
            <button
              type="button"
              onClick={onRegister}
              className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-xs font-semibold transition-colors"
            >
              Register <Icon icon="mdi:arrow-right" className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function EventsPage() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [registerEvent, setRegisterEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // ── Hooks — share same React Query cache, one network request ─────────────
  const { data: upcoming = [], isLoading: upcomingLoading } = useUpcomingEvents();
  const { data: past = [], isLoading: pastLoading } = usePastEvents();

  const isLoading = tab === 'upcoming' ? upcomingLoading : pastLoading;
  const activeList = tab === 'upcoming' ? upcoming : past;

  // ── Client-side filtering ──────────────────────────────────────────────────
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
      return matchesSearch && matchesLocation;
    });
  }, [activeList, searchTerm, locationFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setVisibleCount(ITEMS_PER_PAGE);
    setSearchTerm('');
    setLocationFilter('');
  };

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Events' }];

  return (
    <>
      <SEO
        title="Events"
        description="Through the generosity of our alumni, we continue to support and improve our beloved school."
      />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold italic mb-2">Events</h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Through the generosity of our alumni, we continue to support and improve our beloved
              school
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex items-center gap-2 mb-6">
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <SearchInput
              label="Search"
              value={searchTerm}
              onValueChange={handleFilterChange(setSearchTerm)}
              placeholder="Search events..."
              className="flex-1"
            />
            <FilterDropdown
              label="Location"
              value={locationFilter}
              onChange={handleFilterChange(setLocationFilter)}
              options={locationOptions}
              placeholder="All Locations"
            />
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {visible.map((event) => (
                <EventCard
                  key={event.slug}
                  event={event}
                  isPast={tab === 'past'}
                  onRegister={() => setRegisterEvent(event)}
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

          {/* Load More */}
          {hasMore && !isLoading && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
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
