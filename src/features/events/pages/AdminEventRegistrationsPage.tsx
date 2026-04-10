/**
 * ============================================================================
 * ADMIN EVENT REGISTRATIONS PAGE
 * ============================================================================
 *
 * Route: /admin/event-registrations
 *
 * Features:
 * - View all events
 * - Click event to see attendees
 * - Filter attendees by status (All, Going, Maybe, Not Going)
 * - Export attendee list (future)
 * - See registration stats
 *
 * ============================================================================
 */

import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useAllEvents } from '@/features/events/hooks/useEvents';
import { useEventAttendees } from '@/features/events/hooks/useEventAttendees';
import type { Event } from '@/features/events/types/event.types';
import type { AttendeeStatus } from '@/features/events/api/adapters/event-attendees.adapter';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ROUTES } from '@/shared/constants/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Admin Dashboard', href: ADMIN_ROUTES.DASHBOARD },
  { label: 'Event Registrations' },
];

// ═══════════════════════════════════════════════════════════════════════════
// EVENT LIST ITEM
// ═══════════════════════════════════════════════════════════════════════════

function EventListItem({
  event,
  isSelected,
  onClick,
}: {
  event: Event;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isPast = new Date(event.date) < new Date();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`font-semibold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
            {event.title}
          </p>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:calendar-outline" className="w-3.5 h-3.5" />
              {new Date(event.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <Icon icon="mdi:map-marker-outline" className="w-3.5 h-3.5" />
                {event.location}
              </span>
            )}
            {isPast && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold">
                PAST
              </span>
            )}
          </div>
        </div>

        {event.attendeeCount !== undefined && (
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-bold text-primary-700">{event.attendeeCount}</p>
            <p className="text-[10px] text-gray-500">Registered</p>
          </div>
        )}
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ATTENDEE ROW
// ═══════════════════════════════════════════════════════════════════════════

function AttendeeRow({ attendee }: { attendee: any }) {
  const statusConfig = {
    going: { label: 'Going', color: 'text-green-700 bg-green-100' },
    maybe: { label: 'Maybe', color: 'text-amber-700 bg-amber-100' },
    not_going: { label: 'Not Going', color: 'text-red-700 bg-red-100' },
    '': { label: 'Unknown', color: 'text-gray-700 bg-gray-100' },
  };

  const config = statusConfig[attendee.status as AttendeeStatus] || statusConfig[''];

  // Get initials
  const initials = attendee.fullName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 hover:border-primary-200 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary-700">{initials}</span>
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">{attendee.fullName}</p>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:email-outline" className="w-3.5 h-3.5" />
              {attendee.email}
            </span>
            {attendee.phone && (
              <span className="flex items-center gap-1">
                <Icon icon="mdi:phone-outline" className="w-3.5 h-3.5" />
                {attendee.phone}
              </span>
            )}
            {attendee.graduationYear && <span>Class of {attendee.graduationYear}</span>}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {attendee.guestCount && attendee.guestCount > 0 && (
          <span className="text-xs text-gray-600">
            +{attendee.guestCount} guest{attendee.guestCount > 1 ? 's' : ''}
          </span>
        )}
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${config.color}`}>
          {config.label.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════════════

function AttendeeRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 bg-gray-200 rounded" />
        <div className="h-3 w-64 bg-gray-100 rounded" />
      </div>
      <div className="h-6 w-16 bg-gray-200 rounded-full" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export function AdminEventRegistrationsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | AttendeeStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all events
  const { data: events = [], isLoading: eventsLoading } = useAllEvents();

  // Fetch attendees for selected event
  const { data: attendeeData, isLoading: attendeesLoading } = useEventAttendees(
    selectedEventId || '',
    statusFilter === 'all' ? undefined : statusFilter,
  );

  // Get first event by default
  const firstEventId = events[0]?.id;
  if (!selectedEventId && firstEventId && !eventsLoading) {
    setSelectedEventId(firstEventId);
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Filter attendees by search
  const filteredAttendees =
    attendeeData?.attendees.filter((a) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return a.fullName.toLowerCase().includes(query) || a.email.toLowerCase().includes(query);
    }) || [];

  // Stats
  const stats = attendeeData
    ? [
        {
          label: 'Total Registered',
          value: attendeeData.totalRegistrations,
          color: 'text-primary-700',
        },
        { label: 'Going', value: attendeeData.goingCount, color: 'text-green-700' },
        { label: 'Maybe', value: attendeeData.maybeCount, color: 'text-amber-700' },
        { label: 'Not Going', value: attendeeData.notGoingCount, color: 'text-red-700' },
      ]
    : [];

  return (
    <>
      <SEO title="Event Registrations" description="View and manage event registrations" />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-8">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
            <p className="text-sm text-gray-500 mt-1">
              View attendees and manage event registrations
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
            {/* Left: Events List */}
            <div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="font-semibold text-gray-900 mb-4">Events</h2>

                {eventsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon
                      icon="mdi:calendar-blank-outline"
                      className="w-12 h-12 mx-auto text-gray-300 mb-2"
                    />
                    <p className="text-sm text-gray-500">No events found</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {events.map((event) => (
                      <EventListItem
                        key={event.id}
                        event={event}
                        isSelected={selectedEventId === event.id}
                        onClick={() => setSelectedEventId(event.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Attendees */}
            <div>
              {!selectedEventId ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Icon
                    icon="mdi:account-group-outline"
                    className="w-16 h-16 mx-auto text-gray-300 mb-3"
                  />
                  <p className="text-gray-500">Select an event to view attendees</p>
                </div>
              ) : (
                <>
                  {/* Event Header */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{selectedEvent?.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Icon icon="mdi:calendar-outline" className="w-4 h-4" />
                        {selectedEvent &&
                          new Date(selectedEvent.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                      </span>
                      {selectedEvent?.location && (
                        <span className="flex items-center gap-1">
                          <Icon icon="mdi:map-marker-outline" className="w-4 h-4" />
                          {selectedEvent.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-xl border border-gray-200 p-4"
                      >
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Filters */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Search */}
                      <div className="flex-1 relative">
                        <Icon
                          icon="mdi:magnify"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      {/* Status Filter */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setStatusFilter('all')}
                          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            statusFilter === 'all'
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setStatusFilter('going')}
                          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            statusFilter === 'going'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Going
                        </button>
                        <button
                          onClick={() => setStatusFilter('maybe')}
                          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            statusFilter === 'maybe'
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Maybe
                        </button>

                        <button
                          onClick={() => setStatusFilter('not_going')}
                          className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                            statusFilter === 'not_going'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Not Going
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Attendees List */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Attendees ({filteredAttendees.length})
                      </h3>
                      {/* Future: Export button */}
                    </div>

                    <div className="space-y-2">
                      {attendeesLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <AttendeeRowSkeleton key={i} />)
                      ) : filteredAttendees.length === 0 ? (
                        <div className="text-center py-12">
                          <Icon
                            icon="mdi:account-search-outline"
                            className="w-16 h-16 mx-auto text-gray-300 mb-3"
                          />
                          <p className="text-gray-500 text-sm">
                            {searchQuery
                              ? 'No attendees found matching your search'
                              : statusFilter === 'all'
                                ? 'No registrations yet'
                                : `No "${
                                    statusFilter === 'not_going'
                                      ? 'Not Going'
                                      : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
                                  }" registrations`}
                          </p>
                        </div>
                      ) : (
                        filteredAttendees.map((attendee) => (
                          <AttendeeRow key={attendee.userId} attendee={attendee} />
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
