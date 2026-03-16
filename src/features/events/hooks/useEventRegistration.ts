// features/events/hooks/useEventRegistration.ts

import { useEventStore } from '../stores/useEventStore';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import type { Event } from '../types/event.types';

/**
 * Hook for managing event registration for the current user
 * Combines event store with auth store for convenience
 */
export function useEventRegistration(eventId: string) {
  const currentUser = useAuthStore((state) => state.user);
  const { registerForEvent, unregisterFromEvent, isRegisteredForEvent, getRegistration } =
    useEventStore();

  const memberId = currentUser?.memberId || '';

  return {
    // Check if current user is registered
    isRegistered: isRegisteredForEvent(eventId, memberId),

    // Get registration details
    registration: getRegistration(eventId, memberId),

    // Register current user
    register: (guestCount: number = 0) => {
      if (!currentUser) {
        console.error('User must be logged in to register for events');
        return;
      }
      registerForEvent(eventId, memberId, guestCount);
    },

    // Unregister current user
    unregister: () => {
      if (!currentUser) return;
      unregisterFromEvent(eventId, memberId);
    },

    // Current user info
    currentUser,
  };
}

/**
 * Hook to get attendee count for an event
 * Combines static mock data count with dynamic registrations
 */
export function useEventAttendeeCount(event: Event) {
  const { getAttendeeCount } = useEventStore();

  // Get static registration count from mock data
  const staticCount = event.registrations?.length || 0;

  // Get total count (static + dynamic)
  // TODO: When backend is ready, backend will return this count directly
  const totalCount = getAttendeeCount(event.id, staticCount);

  return {
    attendeeCount: totalCount,
    capacity: event.capacity,
    isFull: event.capacity ? totalCount >= event.capacity : false,
    spotsLeft: event.capacity ? event.capacity - totalCount : undefined,
  };
}

/**
 * Hook to get all events the current user is registered for
 */
export function useMyEvents() {
  const currentUser = useAuthStore((state) => state.user);
  const { getMyRegistrations } = useEventStore();

  if (!currentUser) {
    return {
      registrations: [],
      registeredEventIds: [],
    };
  }

  const registrations = getMyRegistrations(currentUser.memberId);
  const registeredEventIds = registrations.map((r) => r.eventId);

  return {
    registrations,
    registeredEventIds,
  };
}
