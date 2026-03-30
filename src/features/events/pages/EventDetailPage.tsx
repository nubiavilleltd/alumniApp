// features/events/pages/EventDetailPage.tsx

import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { Layout } from '@/shared/components/layout/Layout';
import { renderMarkdown } from '@/data/content';
import { SEO } from '@/shared/common/SEO';
import { RegisterEventModal } from '../components/RegisterEventModal';
import { useEvent } from '../hooks/useEvents';
import { useEventRegistration, useEventAttendeeCount } from '../hooks/useEventRegistration';
import type { Event } from '../types/event.types';

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function EventDetailSkeleton() {
  return (
    <div className="container-custom">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card p-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-5 bg-gray-200 rounded w-full mb-2" />
            <div className="h-5 bg-gray-200 rounded w-5/6 mb-4" />
            <div className="h-64 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventDetailPage() {
  const { slug = '' } = useParams();
  const eventId = slug;
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Fetch event by ID (slug is actually the ID from our routing)
  const { data: event, isLoading, error } = useEvent(eventId);

  console.log('Event data:', event);
  console.log('Event title:', event?.title);
  console.log('Event createdBy:', event?.createdBy);

  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { isRegistered, registration } = useEventRegistration(event?.id || '');
  const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event);

  // useMemo must also be called before conditional returns
  const markdown = useMemo(() => {
    if (!event?.content) return '';
    return renderMarkdown(event.content);
  }, [event?.content]);

  // Handle loading state - return AFTER all hooks are called
  if (isLoading) {
    return (
      <Layout title="Loading Event...">
        <section className="section">
          <EventDetailSkeleton />
        </section>
      </Layout>
    );
  }

  // Handle error state
  if (error || !event) {
    return (
      <section className="section">
        <div className="container-custom text-center">
          <Icon icon="mdi:calendar-alert" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Event not found</h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <AppLink href="/events" className="btn btn-primary">
              Back to Events
            </AppLink>
            <button onClick={() => window.location.reload()} className="btn btn-outline">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const isPastEvent = new Date(event.date) < new Date();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: event.title },
  ];

  return (
    <>
      <SEO title={event.title} description={event.description} />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6">
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">{event.description}</p>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="rounded mb-4 w-full object-cover max-h-[400px]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div
                className="prose max-w-none prose-headings:text-accent-900 prose-a:text-primary-600"
                dangerouslySetInnerHTML={{ __html: markdown }}
              />
            </div>

            <div className="lg:col-span-1 space-y-4">
              <div className="card p-6">
                <h2 className="font-semibold mb-4">Event Details</h2>
                <ul className="text-sm text-gray-700 space-y-3">
                  <li className="flex items-start gap-2">
                    <Icon
                      icon="mdi:calendar-outline"
                      className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                    />
                    <div>
                      <strong className="block text-xs text-gray-500 mb-0.5">Date</strong>
                      <span>
                        {new Date(event.date).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </li>

                  {event.startTime && (
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:clock-outline"
                        className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                      />
                      <div>
                        <strong className="block text-xs text-gray-500 mb-0.5">Time</strong>
                        <span>
                          {event.startTime}
                          {event.endTime && ` - ${event.endTime}`}
                        </span>
                      </div>
                    </li>
                  )}

                  {event.location && (
                    <li className="flex items-start gap-2">
                      <Icon
                        icon={event.isVirtual ? 'mdi:video-outline' : 'mdi:map-marker-outline'}
                        className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                      />
                      <div>
                        <strong className="block text-xs text-gray-500 mb-0.5">Location</strong>
                        <span>{event.location}</span>
                      </div>
                    </li>
                  )}

                  {event.attire && (
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:hanger"
                        className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                      />
                      <div>
                        <strong className="block text-xs text-gray-500 mb-0.5">Dress Code</strong>
                        <span>{event.attire}</span>
                      </div>
                    </li>
                  )}

                  {event.category && (
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:tag-outline"
                        className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                      />
                      <div>
                        <strong className="block text-xs text-gray-500 mb-0.5">Category</strong>
                        <span>{event.category}</span>
                      </div>
                    </li>
                  )}

                  {/* Attendee Count - Only for upcoming events */}
                  {!isPastEvent && (
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:account-group-outline"
                        className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                      />
                      <div>
                        <strong className="block text-xs text-gray-500 mb-0.5">Attendance</strong>
                        <span>
                          {capacity > 0 ? (
                            <>
                              {attendeeCount}/{capacity} attending
                              {spotsLeft !== undefined && spotsLeft > 0 && spotsLeft <= 10 && (
                                <span className="block text-orange-500 text-xs mt-0.5">
                                  ({spotsLeft} spots left)
                                </span>
                              )}
                            </>
                          ) : (
                            <>{attendeeCount} attending</>
                          )}
                        </span>
                      </div>
                    </li>
                  )}

                  {/* Created By */}
                  {event.createdBy && (
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:account-outline"
                        className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0"
                      />
                      <div>
                        <strong className="block text-xs text-gray-500 mb-0.5">Organizer</strong>
                        <span>{event.createdBy}</span>
                      </div>
                    </li>
                  )}
                </ul>

                {/* Registration Status & Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  {isPastEvent ? (
                    <div className="text-center py-2 text-gray-500 text-sm">
                      <Icon icon="mdi:calendar-check-outline" className="w-5 h-5 mx-auto mb-1" />
                      This event has ended
                    </div>
                  ) : isRegistered ? (
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <Icon
                          icon="mdi:check-circle"
                          className="w-5 h-5 text-green-600 mx-auto mb-1"
                        />
                        <p className="text-green-700 font-semibold text-sm">You're Registered!</p>
                        {registration && registration.guestCount > 0 && (
                          <p className="text-green-600 text-xs mt-1">
                            You + {registration.guestCount} guest
                            {registration.guestCount > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      {/* Virtual Event Link */}
                      {event.isVirtual && event.virtualLink && (
                        <a
                          href={event.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2"
                        >
                          <Icon icon="mdi:video-outline" className="w-4 h-4" />
                          Join Virtual Event
                        </a>
                      )}

                      <AppLink
                        href="/my-events"
                        className="btn btn-outline btn-sm w-full text-center"
                      >
                        View My Events
                      </AppLink>
                    </div>
                  ) : isFull ? (
                    <div className="text-center py-3 text-gray-500 text-sm">
                      <Icon
                        icon="mdi:alert-circle-outline"
                        className="w-5 h-5 mx-auto mb-1 text-red-500"
                      />
                      <p className="font-semibold text-red-600">Event Full</p>
                      <p className="text-xs mt-1">Registration is closed</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowRegisterModal(true)}
                      className="btn btn-primary btn-sm w-full"
                    >
                      Register for Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <RegisterEventModal
        event={showRegisterModal ? event : null}
        onClose={() => setShowRegisterModal(false)}
      />
    </>
  );
}
