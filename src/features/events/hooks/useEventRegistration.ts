// // features/events/hooks/useEventRegistration.ts

// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import {
//   useRegisterEvent,
//   useCancelRegistration,
//   useUpdateRSVP,
//   useMyRegisteredEvents,
// } from './useEvents';
// import type { Event } from '../types/event.types';
// import { useEventStore } from '../stores/useEventStore';

// /**
//  * Hook for managing event registration for the current user
//  * Uses real API calls for registration
//  */
// export function useEventRegistration(eventId: string) {
//   const currentUser = useAuthStore((state) => state.user);
//   const { getRegistration } = useEventStore();
//   const registerMutation = useRegisterEvent();
//   const cancelMutation = useCancelRegistration();
//   const updateRSVPMutation = useUpdateRSVP();

//   const memberId = currentUser?.id || '';
//   const registration = getRegistration(eventId, memberId);
//   const isRegistered = !!registration;

//   return {
//     isRegistered,
//     registration,
//     currentUser,
//     isLoading:
//       registerMutation.isPending || cancelMutation.isPending || updateRSVPMutation.isPending,
//     register: (status: 'going' | 'maybe' | 'not_going' = 'going') => {
//       if (!currentUser) {
//         console.error('User must be logged in to register for events');
//         return;
//       }
//       registerMutation.mutate({ eventId, status });
//     },
//     unregister: () => {
//       if (!currentUser) return;
//       cancelMutation.mutate(eventId);
//     },
//     updateStatus: (status: 'going' | 'maybe' | 'not_going') => {
//       if (!currentUser) return;
//       updateRSVPMutation.mutate({ eventId, status });
//     },
//   };
// }

// // export function useEventRegistration(eventId: string) {
// //   const currentUser = useAuthStore((state) => state.user);

// //   const registerMutation = useRegisterEvent();
// //   const cancelMutation = useCancelRegistration();
// //   const updateRSVPMutation = useUpdateRSVP();

// //   // ✅ Get event directly from cache
// //   // const { data: event } = useEvent(eventId);

// //   const event =

// //   const rsvpStatus = event?.rsvpStatus ?? null;

// //   const isRegistered = rsvpStatus !== null;

// //   return {
// //     isRegistered,
// //     rsvpStatus,
// //     currentUser,

// //     isLoading:
// //       registerMutation.isPending ||
// //       cancelMutation.isPending ||
// //       updateRSVPMutation.isPending,

// //     register: (status: 'going' | 'maybe' | 'not_going' = 'going') => {
// //       if (!currentUser?.id) return;
// //       registerMutation.mutate({ eventId, status });
// //     },

// //     unregister: () => {
// //       if (!currentUser?.id) return;
// //       cancelMutation.mutate(eventId);
// //     },

// //     updateStatus: (status: 'going' | 'maybe' | 'not_going') => {
// //       if (!currentUser?.id) return;
// //       updateRSVPMutation.mutate({ eventId, status });
// //     },
// //   };
// // }

// /**
//  * Hook to get attendee count for an event
//  * Accepts Event | null | undefined and handles null/undefined gracefully
//  */
// export function useEventAttendeeCount(event: Event | null | undefined) {
//   // Handle null or undefined event gracefully
//   if (!event) {
//     return {
//       attendeeCount: 0,
//       capacity: 0,
//       isFull: false,
//       spotsLeft: undefined,
//     };
//   }

//   // Get attendee count from the event object
//   // The backend returns attendee_count directly
//   const attendeeCount = (event as any).attendeeCount || (event as any).attendee_count || 0;

//   return {
//     attendeeCount,
//     capacity: event.capacity || 0,
//     isFull: event.capacity ? attendeeCount >= event.capacity : false,
//     spotsLeft: event.capacity ? event.capacity - attendeeCount : undefined,
//   };
// }

// /**
//  * Hook to get all events the current user is registered for
//  * Uses real API call to get user's registered events
//  */
// export function useMyEvents() {
//   const currentUser = useAuthStore((state) => state.user);
//   const { data: userEvents = [], isLoading } = useMyRegisteredEvents();

//   if (!currentUser) {
//     return {
//       registrations: [],
//       registeredEventIds: [],
//       events: [],
//       isLoading: false,
//     };
//   }

//   const registeredEventIds = userEvents.map((event: Event) => event.id);

//   return {
//     registrations: userEvents.map((event: Event) => ({
//       eventId: event.id,
//       memberId: currentUser.memberId,
//       guestCount: 0,
//       registeredAt: new Date().toISOString(),
//     })),
//     registeredEventIds,
//     events: userEvents,
//     isLoading,
//   };
// }

// features/events/hooks/useEventRegistration.ts

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
 * Uses API hooks to track registration status
 */
export function useEventRegistration(eventId: string) {
  const currentUser = useAuthStore((state) => state.user);
  const { data: userEvents = [], isLoading: isUserEventsLoading } = useMyRegisteredEvents();

  const registerMutation = useRegisterEvent();
  const cancelMutation = useCancelRegistration();
  const updateRSVPMutation = useUpdateRSVP();

  const memberId = currentUser?.id || '';

  // Determine if the user is registered for this event
  const registration = userEvents.find((event) => event.id === eventId);
  const isRegistered = !!registration;
  const rsvpStatus = registration?.rsvpStatus || null;

  return {
    isRegistered,
    registration,
    rsvpStatus,
    currentUser,
    isLoading:
      isUserEventsLoading ||
      registerMutation.isPending ||
      cancelMutation.isPending ||
      updateRSVPMutation.isPending,

    register: (status: 'going' | 'maybe' | 'not_going' = 'going') => {
      if (!currentUser?.id) {
        console.error('User must be logged in to register for events');
        return;
      }
      registerMutation.mutate({ eventId, status });
    },

    unregister: () => {
      if (!currentUser?.id) return;
      cancelMutation.mutate(eventId);
    },

    updateStatus: (status: 'going' | 'maybe' | 'not_going') => {
      if (!currentUser?.id) return;
      updateRSVPMutation.mutate({ eventId, status });
    },
  };
}

/**
 * Hook to get attendee count for an event
 */
export function useEventAttendeeCount(event: Event | null | undefined) {
  if (!event) {
    return { attendeeCount: 0, capacity: 0, isFull: false, spotsLeft: undefined };
  }

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
 */
export function useMyEvents() {
  const currentUser = useAuthStore((state) => state.user);
  const { data: userEvents = [], isLoading } = useMyRegisteredEvents();

  if (!currentUser) {
    return { registrations: [], registeredEventIds: [], events: [], isLoading: false };
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
