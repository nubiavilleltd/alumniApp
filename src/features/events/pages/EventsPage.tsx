// import { useMemo, useState } from 'react';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { getEvents } from '@/data/site-data';
// import { SEO } from '@/shared/common/SEO';

// export function EventsPage() {
//   const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
//   const events = getEvents();

//   const upcoming = useMemo(() => {
//     const now = new Date();
//     return events
//       .filter((event) => new Date(event.date) >= now)
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//   }, [events]);

//   const past = useMemo(() => {
//     const now = new Date();
//     return events
//       .filter((event) => new Date(event.date) < now)
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [events]);

//   const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Events' }];

//   const isUpcoming = activeTab === 'upcoming';
//   const activeList = isUpcoming ? upcoming : past;

//   return (
//     <>
//       <SEO title="Events" />
//       <Breadcrumbs items={breadcrumbItems} />
//       <section className="section">
//         <div className="container-custom">
//           <h1 className="text-3xl font-bold mb-6">Events</h1>

//           <div className="mb-6 flex gap-2">
//             <button
//               type="button"
//               className={`tab-btn btn bg-primary-600 text-white`}
//               // className={`tab-btn text-white btn btn-outline btn-sm ${isUpcoming ? 'bg-primary-600 text-white' : ''}`}
//               onClick={() => setActiveTab('upcoming')}
//             >
//               Upcoming
//             </button>
//             <button
//               type="button"
//               className={`tab-btn btn btn-outline btn-sm ${!isUpcoming ? 'bg-primary-600 text-white' : ''}`}
//               onClick={() => setActiveTab('past')}
//             >
//               Past
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {activeList.map((event) => (
//               <AppLink
//                 href={`/events/${event.slug}`}
//                 className="card card-hover block"
//                 key={event.slug}
//               >
//                 <div className="p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <span className={`badge ${isUpcoming ? 'badge-primary' : 'badge-accent'}`}>
//                       {isUpcoming ? 'Upcoming' : 'Past'}
//                     </span>
//                     <span className="text-sm text-gray-500">
//                       {new Date(event.date).toDateString()}
//                     </span>
//                   </div>
//                   <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
//                   <p className="text-gray-600 mb-4">{event.description}</p>
//                   {event.location && <p className="text-sm text-gray-500">{event.location}</p>}
//                 </div>
//               </AppLink>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import { Icon } from '@iconify/react';
import { useState, useMemo } from 'react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { getEvents } from '@/data/site-data';

type Tab = 'upcoming' | 'past';

// ─── Reusable Search Input ────────────────────────────────────────────────────
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

function SearchInput({
  value,
  onChange,
  placeholder = 'Search events...',
  label,
}: SearchInputProps) {
  return (
    <div className="flex-1">
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="pl-3 text-gray-400">
          <Icon icon="mdi:magnify" className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

// ─── Reusable Filter Dropdown ─────────────────────────────────────────────────
interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label?: string;
  placeholder?: string;
}

function FilterDropdown({
  value,
  onChange,
  options,
  label,
  placeholder = 'All',
}: FilterDropdownProps) {
  return (
    <div className="w-full sm:w-48">
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-9 text-sm text-gray-700 shadow-sm outline-none focus:border-primary-400 cursor-pointer"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Icon
          icon="mdi:chevron-down"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
interface AlumnaeEvent {
  slug: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  attire?: string;
  date: string;
  isVirtual?: boolean;
}

function EventCard({ event, isPast }: { event: AlumnaeEvent; isPast: boolean }) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      {event.image && (
        <div className="h-52 w-full overflow-hidden bg-gray-100">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-primary-500 font-bold text-sm leading-snug">{event.title}</h3>

        {/* Meta row */}
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

        {/* Description */}
        <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">
          {event.description}
        </p>

        {/* Action */}
        <div className="mt-auto pt-2">
          {isPast ? (
            <AppLink
              href={`/events/${event.slug}`}
              className="inline-block border border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-500 text-xs font-semibold px-5 py-1.5 rounded-md transition-colors"
            >
              View Details
            </AppLink>
          ) : (
            <AppLink
              href={`/events/${event.slug}`}
              className="inline-block bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-5 py-1.5 rounded-md transition-colors"
            >
              Register
            </AppLink>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

export function EventsPage() {
  const allEvents = getEvents();
  const now = new Date();

  const [tab, setTab] = useState<Tab>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const upcoming = useMemo(
    () =>
      allEvents
        .filter((e) => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [allEvents],
  );

  const past = useMemo(
    () =>
      allEvents
        .filter((e) => new Date(e.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [allEvents],
  );

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
            <button
              type="button"
              onClick={() => handleTabChange('upcoming')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === 'upcoming'
                  ? 'bg-primary-500 text-white'
                  : 'border border-primary-500 text-primary-500 hover:bg-primary-50'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('past')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === 'past'
                  ? 'bg-primary-500 text-white'
                  : 'border border-primary-500 text-primary-500 hover:bg-primary-50'
              }`}
            >
              Past
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-end gap-3 mb-8">
            <SearchInput
              label="Search"
              value={searchTerm}
              onChange={handleFilterChange(setSearchTerm)}
              placeholder="Search events..."
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
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {visible.map((event) => (
                <EventCard key={event.slug} event={event} isPast={tab === 'past'} />
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
          {hasMore && (
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
    </>
  );
}
