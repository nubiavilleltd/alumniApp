// features/events/components/EventCard.tsx
//
// Single shared card component used by:
//   - EventsPage (grid + calendar)
//   - UpcomingEvents (homepage)
//   - Any other listing surface
//
// Eliminates duplication between EventsPage's local EventCard and
// the homepage UpcomingEvents component's local EventCard.

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { AppLink } from '@/shared/components/ui/AppLink';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { useEventRegistration, useEventAttendeeCount } from '../hooks/useEventRegistration';
import { useDeleteEvent } from '../hooks/useEvents';

import { EVENT_ROUTES } from '../routes';
import type { Event } from '../types/event.types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-col">
      <div className="h-52 w-full bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: Event;
  isPast?: boolean;
  /** Called when the user clicks Register — parent controls modal state */
  onRegister?: () => void;
  /** When true shows Edit / Delete admin buttons */
  isAdmin?: boolean;
  /** Called after a successful delete so parent can update its list */
  onDeleted?: (eventId: string) => void;
  /** Compact variant used on homepage — hides attendee count + admin actions */
  compact?: boolean;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function EventCard({
  event,
  isPast = false,
  onRegister,
  isAdmin = false,
  onDeleted,
  compact = false,
}: EventCardProps) {
  const currentUser = useAuthStore((state) => state.user);
  const isLoggedIn = !!currentUser;

  const { isRegistered } = useEventRegistration(event.id);
  const { attendeeCount, capacity, isFull, spotsLeft } = useEventAttendeeCount(event);

  const deleteEvent = useDeleteEvent();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isCancelled = event.status === 'cancelled';

  const formattedDate = new Date(event.date).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleDelete = () => {
    deleteEvent.mutate(event.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        onDeleted?.(event.id);
      },
    });
  };

  // ── Registration button logic ──────────────────────────────────────────────
  const renderAction = () => {
    if (isPast) {
      return (
        <AppLink
          href={EVENT_ROUTES.DETAIL(event.id)}
          className="inline-block border border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-500 text-xs font-semibold px-5 py-1.5 rounded-md transition-colors"
        >
          View Details
        </AppLink>
      );
    }

    if (isCancelled) {
      return (
        <span className="inline-flex items-center gap-1 text-red-500 text-xs font-semibold">
          <Icon icon="mdi:cancel" className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    }

    if (!isLoggedIn) {
      return (
        <AppLink
          href={EVENT_ROUTES.DETAIL(event.id)}
          className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-xs font-semibold transition-colors"
        >
          View Details <Icon icon="mdi:arrow-right" className="w-3 h-3" />
        </AppLink>
      );
    }

    if (isRegistered) {
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1 border border-green-500 text-green-600 text-xs font-semibold px-4 py-1.5 rounded-md cursor-default"
          >
            <Icon icon="mdi:check-circle" className="w-3.5 h-3.5" />
            Registered
          </button>
          <AppLink
            href={EVENT_ROUTES.DETAIL(event.id)}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-500 text-xs font-semibold transition-colors"
          >
            Details
          </AppLink>
        </div>
      );
    }

    if (isFull) {
      return (
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-1 text-gray-400 text-xs font-semibold cursor-not-allowed"
        >
          Event Full
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onRegister}
        className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 text-xs font-semibold transition-colors"
      >
        Register <Icon icon="mdi:arrow-right" className="w-3 h-3" />
      </button>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
        {/* Banner image */}
        <div className="h-52 w-full overflow-hidden bg-gray-100 relative">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-50">
              <Icon icon="mdi:calendar-month-outline" className="w-12 h-12 text-primary-200" />
            </div>
          )}

          {/* Badges */}
          {!isPast && isRegistered && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Icon icon="mdi:check-circle" className="w-3 h-3" />
              Registered
            </div>
          )}
          {!isPast && isFull && !isRegistered && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Event Full
            </div>
          )}
          {isCancelled && (
            <div className="absolute top-3 left-3 bg-gray-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Cancelled
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="text-primary-500 font-bold text-sm leading-snug">{event.title}</h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-400 text-[11px]">
            {event.location && (
              <span className="flex items-center gap-1">
                <Icon icon="mdi:map-marker-outline" className="w-3 h-3 flex-shrink-0" />
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Icon icon="mdi:calendar-outline" className="w-3 h-3 flex-shrink-0" />
              {formattedDate}
            </span>
            {event.startTime && (
              <span className="flex items-center gap-1">
                <Icon icon="mdi:clock-outline" className="w-3 h-3 flex-shrink-0" />
                {event.startTime}
              </span>
            )}
          </div>

          <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-3">
            {event.description}
          </p>

          {/* Attendee count — hidden in compact mode */}
          {!compact && !isPast && !isCancelled && (
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

          {/* Footer row */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">{renderAction()}</div>

            {/* Admin actions — hidden in compact mode */}
            {!compact && isAdmin && (
              <div className="flex items-center gap-2">
                <AppLink
                  href={EVENT_ROUTES.EDIT(event.id)}
                  className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 transition-colors"
                >
                  <Icon icon="mdi:pencil-outline" className="w-3.5 h-3.5" />
                  Edit
                </AppLink>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  <Icon icon="mdi:trash-can-outline" className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          title={event.title}
          isDeleting={deleteEvent.isPending}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
