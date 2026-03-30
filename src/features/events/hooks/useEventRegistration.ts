// features/events/hooks/useEventRegistration.ts

import { useEventStore } from '../stores/useEventStore';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import {
  useRegisterEvent,
  useCancelRegistration,
  useUpdateRSVP,
  useMyRegisteredEvents,
} from './useEvents';
import type { Event } from '../types/event.types';

/**
 * Hook for managing event registration for the current user
 * Uses real API calls for registration
 */
export function useEventRegistration(eventId: string) {
  const currentUser = useAuthStore((state) => state.user);
  const { getRegistration } = useEventStore();
  const registerMutation = useRegisterEvent();
  const cancelMutation = useCancelRegistration();
  const updateRSVPMutation = useUpdateRSVP();

  const memberId = currentUser?.memberId || '';
  const registration = getRegistration(eventId, memberId);
  const isRegistered = !!registration;

  return {
    isRegistered,
    registration,
    currentUser,
    isLoading:
      registerMutation.isPending || cancelMutation.isPending || updateRSVPMutation.isPending,
    register: (status: 'going' | 'maybe' | 'not_going' = 'going') => {
      if (!currentUser) {
        console.error('User must be logged in to register for events');
        return;
      }
      registerMutation.mutate({ eventId, status });
    },
    unregister: () => {
      if (!currentUser) return;
      cancelMutation.mutate(eventId);
    },
    updateStatus: (status: 'going' | 'maybe' | 'not_going') => {
      if (!currentUser) return;
      updateRSVPMutation.mutate({ eventId, status });
    },
  };
}

/**
 * Hook to get attendee count for an event
 * Accepts Event | null | undefined and handles null/undefined gracefully
 */
export function useEventAttendeeCount(event: Event | null | undefined) {
  // Handle null or undefined event gracefully
  if (!event) {
    return {
      attendeeCount: 0,
      capacity: 0,
      isFull: false,
      spotsLeft: undefined,
    };
  }

  // Get attendee count from the event object
  // The backend returns attendee_count directly
  const attendeeCount = (event as any).attendeeCount || (event as any).attendee_count || 0;

  return {
    attendeeCount,
    capacity: event.capacity || 0,
    isFull: event.capacity ? attendeeCount >= event.capacity : false,
    spotsLeft: event.capacity ? event.capacity - attendeeCount : undefined,
  };
}

/**
 * Hook to get all events the current user is registered for
 * Uses real API call to get user's registered events
 */
export function useMyEvents() {
  const currentUser = useAuthStore((state) => state.user);
  const { data: userEvents = [], isLoading } = useMyRegisteredEvents();

  if (!currentUser) {
    return {
      registrations: [],
      registeredEventIds: [],
      events: [],
      isLoading: false,
    };
  }

  const registeredEventIds = userEvents.map((event: Event) => event.id);

  return {
    registrations: userEvents.map((event: Event) => ({
      eventId: event.id,
      memberId: currentUser.memberId,
      guestCount: 0,
      registeredAt: new Date().toISOString(),
    })),
    registeredEventIds,
    events: userEvents,
    isLoading,
  };
}
