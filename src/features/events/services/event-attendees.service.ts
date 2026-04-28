/**
 * ============================================================================
 * EVENT ATTENDEES API SERVICE (ADMIN)
 * ============================================================================
 *
 * API methods for fetching and managing event attendees.
 * Admin-only operations.
 *
 * ============================================================================
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import {
  AttendeeStatus,
  createGetAttendeesPayload,
  EventAttendeeSummary,
  mapAttendeesResponse,
} from '../api/adapters/event-attendees.adapter';

export const eventAttendeesApi = {
  /**
   * Get all attendees for an event
   *
   * POST /api/get_event_attendees
   * {
   *   "event_id": "1",
   *   "status": "going"  // optional: filter by status
   * }
   *
   * Response:
   * {
   *   "status": 200,
   *   "event": { "id": "1", "title": "...", "date": "..." },
   *   "summary": { "total": 45, "going": 35, "maybe": 8, "not_going": 2 },
   *   "attendees": [...]
   * }
   */
  async getEventAttendees(
    eventId: string,
    status?: AttendeeStatus,
  ): Promise<EventAttendeeSummary | null> {
    try {
      const payload = createGetAttendeesPayload(eventId, status);
      const { data } = await apiClient.post(API_ENDPOINTS.EVENTS.GET_ATTENDEES, payload);

      return mapAttendeesResponse(data);
    } catch (error: any) {
      console.error('Failed to fetch event attendees:', error);

      // Return empty summary on error
      return {
        eventId,
        eventTitle: 'Unknown Event',
        eventDate: '',
        totalRegistrations: 0,
        goingCount: 0,
        maybeCount: 0,
        notGoingCount: 0,
        attendees: [],
      };
    }
  },
};
