// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   eventsService,
//   type EventRegistrationPayload,
//   type GetEventsParams,
// } from '@/features/events/services/event.service';

// // ─── Query Keys ───────────────────────────────────────────────────────────────
// export const eventKeys = {
//   all: ['events'] as const,
//   list: (params?: object) => [...eventKeys.all, 'list', params] as const,
//   detail: (slug: string) => [...eventKeys.all, 'detail', slug] as const,
// };

// // ─── Queries ──────────────────────────────────────────────────────────────────

// /** All events — raw, unfiltered */
// export function useEvents(params?: GetEventsParams) {
//   return useQuery({
//     queryKey: eventKeys.list(params),
//     queryFn: () => eventsService.getAll(params),
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
// }
// // export function useSomeEvents(params?: GetEventsParams) {
// //   return useQuery({
// //     queryKey: [...eventKeys.all, 'some-events'],
// //     queryFn: () => eventsService.getSomeEvents(),
// //     staleTime: 1000 * 60 * 5, // 5 minutes
// //   });
// // }

// /** Single event by slug */
// export function useEvent(slug: string) {
//   return useQuery({
//     queryKey: eventKeys.detail(slug),
//     queryFn: () => eventsService.getBySlug(slug),
//     enabled: !!slug,
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Upcoming events only — sorted soonest first */
// export function useUpcomingEvents() {
//   return useQuery({
//     queryKey: eventKeys.list(),
//     queryFn: () => eventsService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) =>
//       [...data]
//         .filter((e) => new Date(e.date) >= new Date())
//         .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
//   });
// }

// /** Past events only — sorted most recent first */
// export function usePastEvents() {
//   return useQuery({
//     queryKey: eventKeys.list(),
//     queryFn: () => eventsService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) =>
//       [...data]
//         .filter((e) => new Date(e.date) < new Date())
//         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
//   });
// }

// /** Latest N events for homepage — sorted most recent first */
// export function useLatestEvents(count = 4) {
//   return useQuery({
//     queryKey: eventKeys.list(),
//     queryFn: () => eventsService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) =>
//       [...data]
//         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//         .slice(0, count),
//   });
// }

// // ─── Mutations ────────────────────────────────────────────────────────────────

// /** Register for an event */
// export function useRegisterEvent() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ slug, payload }: { slug: string; payload: EventRegistrationPayload }) =>
//       eventsService.register(slug, payload),
//     onSuccess: (_, { slug }) => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.detail(slug) });
//     },
//   });
// }

// /** Create a new event (admin) */
// export function useCreateEvent() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: FormData) => eventsService.create(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.all });
//     },
//   });
// }

// /** Update an event (admin) */
// export function useUpdateEvent() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
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

// // features/events/hooks/useEvents.ts

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

// // ─── Queries ──────────────────────────────────────────────────────────────────

// /** All events — with optional filters */
// export function useEvents(params?: GetEventsParams) {
//   return useQuery({
//     queryKey: eventKeys.list(params),
//     queryFn: () => eventsService.getAll(params),
//     staleTime: 1000 * 60 * 5, // 5 minutes
//   });
// }

// /** Single event by ID */
// // features/events/hooks/useEvents.ts

// /** Single event by ID */
// export function useEvent(id: string) {
//   console.log('useEvent called with id:', id); // Debug
//   return useQuery({
//     queryKey: eventKeys.detail(id),
//     queryFn: async () => {
//       console.log('Fetching event with id:', id); // Debug
//       const result = await eventsService.getById(id);
//       console.log('Fetched event result:', result); // Debug
//       return result;
//     },
//     enabled: !!id,
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Upcoming events only — sorted soonest first */
// export function useUpcomingEvents() {
//   return useQuery({
//     queryKey: eventKeys.list({ type: 'upcoming' }),
//     queryFn: () => eventsService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) => {
//       console.log('📊 All events from API:', data.length);
//       console.log('All event details:', data.map(e => ({
//         id: e.id,
//         title: e.title,
//         date: e.date,
//         rawDate: e.date,
//         isPast: new Date(e.date) < new Date()
//       })));

//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const upcoming = data.filter((e) => {
//         const eventDate = new Date(e.date);
//         eventDate.setHours(0, 0, 0, 0);
//         const isUpcoming = eventDate >= today;
//         console.log(`Event: ${e.title}, Date: ${e.date}, Is Upcoming: ${isUpcoming}`);
//         return isUpcoming;
//       });

//       console.log('📅 Upcoming events count:', upcoming.length);
//       console.log('Upcoming events:', upcoming.map(e => ({ id: e.id, title: e.title, date: e.date })));

//       return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//     },
//   });
// }

// /** Past events only — sorted most recent first */
// export function usePastEvents() {
//   return useQuery({
//     queryKey: eventKeys.list({ type: 'past' }),
//     queryFn: () => eventsService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) => {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);

//       const past = data.filter((e) => {
//         const eventDate = new Date(e.date);
//         eventDate.setHours(0, 0, 0, 0);
//         return eventDate < today;
//       });

//       console.log('📅 Past events count:', past.length);
//       console.log('Past events:', past.map(e => ({ id: e.id, title: e.title, date: e.date })));

//       return past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     },
//   });
// }

// /** Latest N events for homepage */
// export function useLatestEvents(count = 4) {
//   return useQuery({
//     queryKey: eventKeys.list({ limit: count }),
//     queryFn: () => eventsService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) =>
//       [...data]
//         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//         .slice(0, count),
//   });
// }

// /** Get user's registered events (My Events) */
// export function useMyRegisteredEvents() {
//   const currentUser = useAuthStore((state) => state.user);

//   return useQuery({
//     queryKey: eventKeys.userEvents(currentUser?.memberId || ''),
//     queryFn: () => {
//       if (!currentUser?.memberId) return [];
//       return eventsService.getUserEvents(currentUser.memberId);
//     },
//     enabled: !!currentUser?.memberId,
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
//     mutationFn: ({ eventId, status }: { eventId: string; status?: 'going' | 'maybe' | 'not_going' }) => {
//       if (!currentUser?.memberId) {
//         throw new Error('You must be logged in to register for events');
//       }
//       return eventsService.register(eventId, currentUser.memberId, status || 'going');
//     },
//     onSuccess: (_, { eventId }) => {
//       // Invalidate event detail and user events
//       queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
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
//       queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
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
//     mutationFn: ({ eventId, status }: { eventId: string; status: 'going' | 'maybe' | 'not_going' }) => {
//       if (!currentUser?.memberId) {
//         throw new Error('You must be logged in to update RSVP');
//       }
//       return eventsService.updateRSVP(eventId, currentUser.memberId, status);
//     },
//     onSuccess: (_, { eventId }) => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
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
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: eventKeys.detail(id) });
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

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const eventKeys = {
  all: ['events'] as const,
  list: (params?: object) => [...eventKeys.all, 'list', params] as const,
  detail: (id: string) => [...eventKeys.all, 'detail', id] as const,
  userEvents: (userId: string) => [...eventKeys.all, 'user', userId] as const,
  attendees: (eventId: string) => [...eventKeys.all, 'attendees', eventId] as const,
};

// ─── Base Query - Single source of truth for all events ───────────────────────
/** Get all events from API (no filters, gets everything) */
function useAllEvents() {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: () => eventsService.getAll(), // Empty payload = get all events
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ─── Derived Queries - Use memoized filtering ─────────────────────────────────

/** Upcoming events only — sorted soonest first */
export function useUpcomingEvents() {
  const { data: allEvents = [], isLoading, error } = useAllEvents();

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allEvents]);

  return { data: upcoming, isLoading, error };
}

/** Past events only — sorted most recent first */
export function usePastEvents() {
  const { data: allEvents = [], isLoading, error } = useAllEvents();

  const past = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return allEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < today;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allEvents]);

  return { data: past, isLoading, error };
}

/** Latest N events for homepage */
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

/** Get user's registered events (My Events) - still needs API call */
export function useMyRegisteredEvents() {
  const currentUser = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: eventKeys.userEvents(currentUser?.memberId || ''),
    queryFn: () => {
      if (!currentUser?.memberId) return [];
      return eventsService.getUserEvents(currentUser.memberId);
    },
    enabled: !!currentUser?.memberId,
    staleTime: 1000 * 60 * 5,
  });
}

/** Get event attendees */
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
      if (!currentUser?.memberId) {
        throw new Error('You must be logged in to register for events');
      }
      return eventsService.register(eventId, currentUser.memberId, status || 'going');
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate all events cache since registration counts change
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      if (currentUser?.memberId) {
        queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
      }
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
      if (!currentUser?.memberId) {
        throw new Error('You must be logged in to cancel registration');
      }
      return eventsService.cancelRegistration(eventId, currentUser.memberId);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      if (currentUser?.memberId) {
        queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
      }
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
      if (!currentUser?.memberId) {
        throw new Error('You must be logged in to update RSVP');
      }
      return eventsService.updateRSVP(eventId, currentUser.memberId, status);
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      if (currentUser?.memberId) {
        queryClient.invalidateQueries({ queryKey: eventKeys.userEvents(currentUser.memberId) });
      }
      queryClient.invalidateQueries({ queryKey: eventKeys.attendees(eventId) });
    },
  });
}

/** Create a new event (admin) */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData | Record<string, any>) => eventsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

/** Update an event (admin) */
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, any> }) =>
      eventsService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

/** Delete an event (admin) */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => eventsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}
