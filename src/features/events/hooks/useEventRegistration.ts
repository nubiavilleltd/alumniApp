// // // // features/events/hooks/useEventRegistration.ts

// // // import { useEventStore } from '../stores/useEventStore';
// // // import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// // // import type { Event } from '../types/event.types';

// // // /**
// // //  * Hook for managing event registration for the current user
// // //  * Combines event store with auth store for convenience
// // //  */
// // // export function useEventRegistration(eventId: string) {
// // //   const currentUser = useAuthStore((state) => state.user);
// // //   const { registerForEvent, unregisterFromEvent, isRegisteredForEvent, getRegistration } =
// // //     useEventStore();

// // //   const memberId = currentUser?.memberId || '';

// // //   return {
// // //     // Check if current user is registered
// // //     isRegistered: isRegisteredForEvent(eventId, memberId),

// // //     // Get registration details
// // //     registration: getRegistration(eventId, memberId),

// // //     // Register current user
// // //     register: (guestCount: number = 0) => {
// // //       if (!currentUser) {
// // //         console.error('User must be logged in to register for events');
// // //         return;
// // //       }
// // //       registerForEvent(eventId, memberId, guestCount);
// // //     },

// // //     // Unregister current user
// // //     unregister: () => {
// // //       if (!currentUser) return;
// // //       unregisterFromEvent(eventId, memberId);
// // //     },

// // //     // Current user info
// // //     currentUser,
// // //   };
// // // }

// // // /**
// // //  * Hook to get attendee count for an event
// // //  * Combines static mock data count with dynamic registrations
// // //  */
// // // export function useEventAttendeeCount(event: Event) {
// // //   const { getAttendeeCount } = useEventStore();

// // //   // Get static registration count from mock data
// // //   const staticCount = event.registrations?.length || 0;

// // //   // Get total count (static + dynamic)
// // //   // TODO: When backend is ready, backend will return this count directly
// // //   const totalCount = getAttendeeCount(event.id, staticCount);

// // //   return {
// // //     attendeeCount: totalCount,
// // //     capacity: event.capacity,
// // //     isFull: event.capacity ? totalCount >= event.capacity : false,
// // //     spotsLeft: event.capacity ? event.capacity - totalCount : undefined,
// // //   };
// // // }

// // // /**
// // //  * Hook to get all events the current user is registered for
// // //  */
// // // export function useMyEvents() {
// // //   const currentUser = useAuthStore((state) => state.user);
// // //   const { getMyRegistrations } = useEventStore();

// // //   if (!currentUser) {
// // //     return {
// // //       registrations: [],
// // //       registeredEventIds: [],
// // //     };
// // //   }

// // //   const registrations = getMyRegistrations(currentUser.memberId);
// // //   const registeredEventIds = registrations.map((r) => r.eventId);

// // //   return {
// // //     registrations,
// // //     registeredEventIds,
// // //   };
// // // }

// // // // features/events/hooks/useEventRegistration.ts

// // // import { useEventStore } from '../stores/useEventStore';
// // // import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// // // import { useRegisterEvent, useCancelRegistration, useUpdateRSVP } from './useEvents';
// // // import type { Event } from '../types/event.types';

// // // /**
// // //  * Hook for managing event registration for the current user
// // //  * Uses real API calls for registration
// // //  */
// // // export function useEventRegistration(eventId: string) {
// // //   const currentUser = useAuthStore((state) => state.user);
// // //   const { getRegistration } = useEventStore();
// // //   const registerMutation = useRegisterEvent();
// // //   const cancelMutation = useCancelRegistration();
// // //   const updateRSVPMutation = useUpdateRSVP();

// // //   const memberId = currentUser?.memberId || '';
// // //   const registration = getRegistration(eventId, memberId);
// // //   const isRegistered = !!registration;

// // //   return {
// // //     isRegistered,
// // //     registration,
// // //     currentUser,
// // //     isLoading: registerMutation.isPending || cancelMutation.isPending || updateRSVPMutation.isPending,
// // //     register: (status: 'going' | 'maybe' | 'not_going' = 'going') => {
// // //       if (!currentUser) {
// // //         console.error('User must be logged in to register for events');
// // //         return;
// // //       }
// // //       registerMutation.mutate({ eventId, status });
// // //     },
// // //     unregister: () => {
// // //       if (!currentUser) return;
// // //       cancelMutation.mutate(eventId);
// // //     },
// // //     updateStatus: (status: 'going' | 'maybe' | 'not_going') => {
// // //       if (!currentUser) return;
// // //       updateRSVPMutation.mutate({ eventId, status });
// // //     },
// // //   };
// // // }

// // // /**
// // //  * Hook to get attendee count for an event
// // //  * Uses real attendee count from backend response
// // //  */
// // // export function useEventAttendeeCount(event: Event) {
// // //   // Use attendee_count from backend if available, otherwise fallback to registrations array
// // //   const attendeeCount = (event as any).attendeeCount || (event as any).attendee_count || event.registrations?.length || 0;

// // //   return {
// // //     attendeeCount,
// // //     capacity: event.capacity,
// // //     isFull: event.capacity ? attendeeCount >= event.capacity : false,
// // //     spotsLeft: event.capacity ? event.capacity - attendeeCount : undefined,
// // //   };
// // // }

// // // /**
// // //  * Hook to get all events the current user is registered for
// // //  * Uses real API call to get user's registered events
// // //  */
// // // export function useMyEvents() {
// // //   const currentUser = useAuthStore((state) => state.user);
// // //   const { data: userEvents = [], isLoading } = useMyRegisteredEvents();

// // //   if (!currentUser) {
// // //     return {
// // //       registrations: [],
// // //       registeredEventIds: [],
// // //       isLoading: false,
// // //     };
// // //   }

// // //   const registeredEventIds = userEvents.map((event) => event.id);

// // //   return {
// // //     registrations: userEvents.map(event => ({
// // //       eventId: event.id,
// // //       memberId: currentUser.memberId,
// // //       guestCount: 0,
// // //       registeredAt: new Date().toISOString(),
// // //     })),
// // //     registeredEventIds,
// // //     events: userEvents,
// // //     isLoading,
// // //   };
// // // }

// // // features/events/hooks/useEventRegistration.ts

// // import { useEventStore } from '../stores/useEventStore';
// // import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// // import {
// //   useRegisterEvent,
// //   useCancelRegistration,
// //   useUpdateRSVP,
// //   useMyRegisteredEvents  // Add this import
// // } from './useEvents';
// // import type { Event } from '../types/event.types';

// // /**
// //  * Hook for managing event registration for the current user
// //  * Uses real API calls for registration
// //  */
// // export function useEventRegistration(eventId: string) {
// //   const currentUser = useAuthStore((state) => state.user);
// //   const { getRegistration } = useEventStore();
// //   const registerMutation = useRegisterEvent();
// //   const cancelMutation = useCancelRegistration();
// //   const updateRSVPMutation = useUpdateRSVP();

// //   const memberId = currentUser?.memberId || '';
// //   const registration = getRegistration(eventId, memberId);
// //   const isRegistered = !!registration;

// //   return {
// //     isRegistered,
// //     registration,
// //     currentUser,
// //     isLoading: registerMutation.isPending || cancelMutation.isPending || updateRSVPMutation.isPending,
// //     register: (status: 'going' | 'maybe' | 'not_going' = 'going') => {
// //       if (!currentUser) {
// //         console.error('User must be logged in to register for events');
// //         return;
// //       }
// //       registerMutation.mutate({ eventId, status });
// //     },
// //     unregister: () => {
// //       if (!currentUser) return;
// //       cancelMutation.mutate(eventId);
// //     },
// //     updateStatus: (status: 'going' | 'maybe' | 'not_going') => {
// //       if (!currentUser) return;
// //       updateRSVPMutation.mutate({ eventId, status });
// //     },
// //   };
// // }

// // /**
// //  * Hook to get attendee count for an event
// //  * Uses real attendee count from backend response
// //  */
// // export function useEventAttendeeCount(event: Event | undefined) {
// //   // Handle undefined event gracefully
// //   if (!event) {
// //     return {
// //       attendeeCount: 0,
// //       capacity: 0,
// //       isFull: false,
// //       spotsLeft: undefined,
// //     };
// //   }

// //   // Use attendee_count from backend if available
// //   const attendeeCount = (event as any).attendeeCount || (event as any).attendee_count || event.registrations?.length || 0;

// //   return {
// //     attendeeCount,
// //     capacity: event.capacity,
// //     isFull: event.capacity ? attendeeCount >= event.capacity : false,
// //     spotsLeft: event.capacity ? event.capacity - attendeeCount : undefined,
// //   };
// // }

// // /**
// //  * Hook to get all events the current user is registered for
// //  * Uses real API call to get user's registered events
// //  */
// // export function useMyEvents() {
// //   const currentUser = useAuthStore((state) => state.user);
// //   const { data: userEvents = [], isLoading } = useMyRegisteredEvents();

// //   if (!currentUser) {
// //     return {
// //       registrations: [],
// //       registeredEventIds: [],
// //       events: [],
// //       isLoading: false,
// //     };
// //   }

// //   const registeredEventIds = userEvents.map((event: Event) => event.id);

// //   return {
// //     registrations: userEvents.map((event: Event) => ({
// //       eventId: event.id,
// //       memberId: currentUser.memberId,
// //       guestCount: 0,
// //       registeredAt: new Date().toISOString(),
// //     })),
// //     registeredEventIds,
// //     events: userEvents,
// //     isLoading,
// //   };
// // }

// // features/events/hooks/useEventRegistration.ts

// import { useEventStore } from '../stores/useEventStore';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { useRegisterEvent, useCancelRegistration, useUpdateRSVP, useMyRegisteredEvents } from './useEvents';
// import type { Event } from '../types/event.types';

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

//   const memberId = currentUser?.memberId || '';
//   const registration = getRegistration(eventId, memberId);
//   const isRegistered = !!registration;

//   return {
//     isRegistered,
//     registration,
//     currentUser,
//     isLoading: registerMutation.isPending || cancelMutation.isPending || updateRSVPMutation.isPending,
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

// /**
//  * Hook to get attendee count for an event
//  * This is a pure computation - no internal hooks
//  */
// export function useEventAttendeeCount(event: Event | undefined) {
//   // If event is undefined, return default values
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
