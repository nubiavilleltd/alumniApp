import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  eventsService,
  type EventRegistrationPayload,
  type GetEventsParams,
} from '@/features/events/services/event.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const eventKeys = {
  all:    ['events'] as const,
  list:   (params?: object) => [...eventKeys.all, 'list', params] as const,
  detail: (slug: string)    => [...eventKeys.all, 'detail', slug] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All events — raw, unfiltered */
export function useEvents(params?: GetEventsParams) {
  return useQuery({
    queryKey: eventKeys.list(params),
    queryFn:  () => eventsService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/** Single event by slug */
export function useEvent(slug: string) {
  return useQuery({
    queryKey: eventKeys.detail(slug),
    queryFn:  () => eventsService.getBySlug(slug),
    enabled:  !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

/** Upcoming events only — sorted soonest first */
export function useUpcomingEvents() {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn:  () => eventsService.getAll(),
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      [...data]
        .filter((e) => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  });
}

/** Past events only — sorted most recent first */
export function usePastEvents() {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn:  () => eventsService.getAll(),
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      [...data]
        .filter((e) => new Date(e.date) < new Date())
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  });
}

/** Latest N events for homepage — sorted most recent first */
export function useLatestEvents(count = 4) {
  return useQuery({
    queryKey: eventKeys.list(),
    queryFn:  () => eventsService.getAll(),
    staleTime: 1000 * 60 * 5,
    select: (data) =>
      [...data]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Register for an event */
export function useRegisterEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: EventRegistrationPayload }) =>
      eventsService.register(slug, payload),
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(slug) });
    },
  });
}

/** Create a new event (admin) */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => eventsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

/** Update an event (admin) */
export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
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