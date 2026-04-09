/**
 * ============================================================================
 * EVENT ATTENDEES HOOKS (ADMIN)
 * ============================================================================
 *
 * React Query hook for fetching event attendees.
 *
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';

import type { AttendeeStatus } from '../api/adapters/event-attendees.adapter';
import { eventAttendeesApi } from '../services/event-attendees.service';

// ═══════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════

export const eventAttendeesKeys = {
  all: ['eventAttendees'] as const,
  event: (eventId: string) => [...eventAttendeesKeys.all, eventId] as const,
  filtered: (eventId: string, status?: AttendeeStatus) =>
    [...eventAttendeesKeys.event(eventId), { status }] as const,
};

// ═══════════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get event attendees with optional status filter
 *
 * Usage:
 * ```tsx
 * const { data, isLoading } = useEventAttendees('123');
 * const { data, isLoading } = useEventAttendees('123', 'going');
 * ```
 */
export function useEventAttendees(eventId: string, status?: AttendeeStatus) {
  return useQuery({
    queryKey: eventAttendeesKeys.filtered(eventId, status),
    queryFn: () => eventAttendeesApi.getEventAttendees(eventId, status),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
