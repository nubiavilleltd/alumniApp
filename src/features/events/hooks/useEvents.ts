// // features/events/hooks/useEvents.ts

// import { useMemo } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { eventsService, type GetEventsParams } from '../services/event.service';

// // ─── Query Keys ───────────────────────────────────────────────────────────────
// export const eventKeys = {
//   all: ['events'] as const,
//   list: (params?: object) => [...eventKeys.all, 'list', params] as const,
//   detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
//   userEvents: (userId: string) => [...eventKeys.all, 'user', userId] as const,
//   attendees: (eventId: string) => [...eventKeys.all, 'attendees', eventId] as const,
// };

// // ─── Base Query - Single source of truth for all events ───────────────────────
// /** Get all events from API (no filters, gets everything) */
// function useAllEvents() {
//   return useQuery({
//     queryKey: eventKeys.all,
//     queryFn: () => eventsService.getAll(), // Empty payload = get all events
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
// }

// // ─── Derived Queries - Use memoized filtering ─────────────────────────────────

// /** Upcoming events only — sorted soonest first */
// export function useUpcomingEvents() {
//   const { data: allEvents = [], isLoading, error } = useAllEvents();
//   console.log('upcoming => ', allEvents);

//   const upcoming = useMemo(() => {
//     const now = new Date();

//     return allEvents
//       .filter((event) => {
//         const [hours, minutes] = (event.endTime || '23:59').split(':').map(Number);

//         const date = new Date(event.date);

//         const endDateTime = new Date(
//           date.getFullYear(),
//           date.getMonth(),
//           date.getDate(),
//           hours,
//           minutes,
//         );

//         return endDateTime >= now;
//       })
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//   }, [allEvents]);

//   // const upcoming = useMemo(() => {
//   //   const today = new Date();
//   //   today.setHours(0, 0, 0, 0);

//   //   return allEvents
//   //     .filter((event) => {
//   //       const eventDate = new Date(event.date);
//   //       eventDate.setHours(0, 0, 0, 0);
//   //       return eventDate >= today;
//   //     })
//   //     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//   // }, [allEvents]);

//   return { data: upcoming, isLoading, error };
// }

// /** Past events only — sorted most recent first */
// export function usePastEvents() {
//   const { data: allEvents = [], isLoading, error } = useAllEvents();

//   const past = useMemo(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     return allEvents
//       .filter((event) => {
//         const eventDate = new Date(event.date);
//         eventDate.setHours(0, 0, 0, 0);
//         return eventDate < today;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [allEvents]);

//   return { data: past, isLoading, error };
// }

// /** Latest N events for homepage */
// export function useLatestEvents(count = 4) {
//   const { data: allEvents = [], isLoading, error } = useAllEvents();

//   const latest = useMemo(() => {
//     return [...allEvents]
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//       .slice(0, count);
//   }, [allEvents, count]);

//   return { data: latest, isLoading, error };
// }

// /** Single event by ID */
// export function useEvent(id: string) {
//   const { data: allEvents = [], isLoading, error } = useAllEvents();

//   const event = useMemo(() => {
//     if (!id) return null;
//     return allEvents.find((e) => e.id === id) || null;
//   }, [allEvents, id]);

//   return { data: event, isLoading, error };
// }

// /** Get user's registered events (My Events) - still needs API call */
// export function useMyRegisteredEvents() {
//   const currentUser = useAuthStore((state) => state.user);

//   return useQuery({
//     queryKey: eventKeys.userEvents(currentUser?.id || ''),
//     queryFn: () => {
//       if (!currentUser?.id) return [];
//       return eventsService.getUserEvents(currentUser.id);
//     },
//     enabled: !!currentUser?.id,
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Get event attendees */
// export function useEventAttendees(eventId: string, status?: string) {
//   return useQuery({
//     queryKey: eventKeys.attendees(eventId),
//     queryFn: () => eventsService.getAttendees(eventId, status),
//     enabled: !!eventId,
//     staleTime: 1000 * 60 * 1,
//   });
// }

// // ─── Mutations ────────────────────────────────────────────────────────────────

// /** Register for an event */
// export function useRegisterEvent() {
//   const queryClient = useQueryClient();
//   const currentUser = useAuthStore((state) => state.user);

//   return useMutation({
//     mutationFn: ({
//       eventId,
//       status,
//     }: {
//       eventId: string;
//       status?: 'going' | 'maybe' | 'not_going';
//     }) => {
//       if (!currentUser?.memberId) {
//         throw new Error('You must be logged in to register for events');
//       }
//       return eventsService.register(eventId, currentUser.memberId, status || 'going');
//     },
//     onSuccess: (_, { eventId }) => {
//       // Invalidate all events cache since registration counts change
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//       if (currentUser?.memberId) {
//         queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
//       }
//       queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
//     },
//   });
// }

// /** Cancel event registration */
// export function useCancelRegistration() {
//   const queryClient = useQueryClient();
//   const currentUser = useAuthStore((state) => state.user);

//   return useMutation({
//     mutationFn: (eventId: string) => {
//       if (!currentUser?.memberId) {
//         throw new Error('You must be logged in to cancel registration');
//       }
//       return eventsService.cancelRegistration(eventId, currentUser.memberId);
//     },
//     onSuccess: (_, eventId) => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//       if (currentUser?.memberId) {
//         queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
//       }
//       queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
//     },
//   });
// }

// /** Update RSVP status */
// export function useUpdateRSVP() {
//   const queryClient = useQueryClient();
//   const currentUser = useAuthStore((state) => state.user);

//   return useMutation({
//     mutationFn: ({
//       eventId,
//       status,
//     }: {
//       eventId: string;
//       status: 'going' | 'maybe' | 'not_going';
//     }) => {
//       if (!currentUser?.memberId) {
//         throw new Error('You must be logged in to update RSVP');
//       }
//       return eventsService.updateRSVP(eventId, currentUser.memberId, status);
//     },
//     onSuccess: (_, { eventId }) => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//       if (currentUser?.memberId) {
//         queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
//       }
//       queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
//     },
//   });
// }

// /** Create a new event (admin) */
// export function useCreateEvent() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: FormData | Record<string, any>) => eventsService.create(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//     },
//   });
// }

// /** Update an event (admin) */
// export function useUpdateEvent() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: Record<string, any> }) =>
//       eventsService.update(id, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//     },
//   });
// }

// /** Delete an event (admin) */
// export function useDeleteEvent() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => eventsService.delete(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//     },
//   });
// }

// features/events/hooks/useEvents.ts

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { eventsService, type GetEventsParams } from '../services/event.service';
import type { Event } from '../types/event.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const eventKeys = {
  all: ['events'] as const,
  list: (params?: object) => [...eventKeys.all, 'list', params] as const,
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
  userEvents: (userId: string) => [...eventKeys.all, 'user', userId] as const,
  attendees: (eventId: string) => [...eventKeys.all, 'attendees', eventId] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetch all events */
export function useAllEvents() {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: () => eventsService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
}

/** Upcoming events sorted soonest first */
export function useUpcomingEvents() {
  const { data: allEvents = [], isLoading, error } = useAllEvents();

  const upcoming = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter((event) => {
        const [hours, minutes] = (event.endTime || '23:59').split(':').map(Number);
        const date = new Date(event.date);
        const endDateTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hours,
          minutes,
        );
        return endDateTime >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents]);

  return { data: upcoming, isLoading, error };
}

/** Past events sorted most recent first */
export function usePastEvents() {
  const { data: allEvents = [], isLoading, error } = useAllEvents();

  const past = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return allEvents
      .filter((event) => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allEvents]);

  return { data: past, isLoading, error };
}

/** Latest N events */
export function useLatestEvents(count = 4) {
  const { data: allEvents = [], isLoading, error } = useAllEvents();

  const latest = useMemo(() => {
    return [...allEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }, [allEvents, count]);

  return { data: latest, isLoading, error };
}

/** Single event by ID */
export function useEvent(id: string) {
  const { data: allEvents = [], isLoading, error } = useAllEvents();

  const event = useMemo(() => {
    if (!id) return null;
    return allEvents.find((e) => e.id === id) || null;
  }, [allEvents, id]);

  return { data: event, isLoading, error };
}

/** Events current user is registered for */
export function useMyRegisteredEvents() {
  const currentUser = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: eventKeys.userEvents(currentUser?.id || ''),
    queryFn: async () => {
      if (!currentUser?.id) return [];
      // return eventsService.getUserEvents(currentUser.id);

      const events = await eventsService.getUserEvents(currentUser.id);

      // Filter only active RSVPs
      return events.filter((event) => event.rsvpStatus === 'going' || event.rsvpStatus === 'maybe');
    },
    enabled: !!currentUser?.id,
    staleTime: 1000 * 60 * 5,
  });
}

/** Event attendees */
export function useEventAttendees(eventId: string, status?: string) {
  return useQuery({
    queryKey: eventKeys.attendees(eventId),
    queryFn: () => eventsService.getAttendees(eventId, status),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 1,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Register for an event */
export function useRegisterEvent() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({
      eventId,
      status,
    }: {
      eventId: string;
      status?: 'going' | 'maybe' | 'not_going';
    }) => {
      if (!currentUser?.memberId) throw new Error('You must be logged in to register for events');
      return eventsService.register(eventId, currentUser.memberId, status || 'going');
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      if (currentUser?.memberId)
        queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
    },
  });
}

/** Cancel event registration */
export function useCancelRegistration() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (eventId: string) => {
      if (!currentUser?.memberId) throw new Error('You must be logged in to cancel registration');
      return eventsService.cancelRegistration(eventId, currentUser.memberId);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      if (currentUser?.memberId)
        queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
    },
  });
}

/** Update RSVP status */
export function useUpdateRSVP() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({
      eventId,
      status,
    }: {
      eventId: string;
      status: 'going' | 'maybe' | 'not_going';
    }) => {
      if (!currentUser?.memberId) throw new Error('You must be logged in to update RSVP');
      return eventsService.updateRSVP(eventId, currentUser.memberId, status);
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      if (currentUser?.memberId)
        queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
    },
  });
}

/** Admin: Create event */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData | Record<string, any>) => eventsService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

/** Admin: Update event */
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, any> }) =>
      eventsService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  });
}

/** Admin: Delete event */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all }),
  });
}
