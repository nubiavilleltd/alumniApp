// features/events/stores/useEventStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EventRegistration {
  eventId: string; // Event ID (e.g., 'evt-001')
  memberId: string; // User's member ID
  guestCount: number; // Number of guests (0 = just the member)
  registeredAt: string; // ISO timestamp
}

interface EventStore {
  // ── State ───────────────────────────────────────────────────────────────────
  registrations: EventRegistration[];

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Register current user for an event
   * TODO: Replace with API call when backend is ready
   * await apiClient.post(`/events/${eventId}/register`, { guestCount })
   */
  registerForEvent: (eventId: string, memberId: string, guestCount: number) => void;

  /**
   * Unregister current user from an event
   * TODO: Replace with API call when backend is ready
   * await apiClient.delete(`/events/${eventId}/register`)
   */
  unregisterFromEvent: (eventId: string, memberId: string) => void;

  /**
   * Check if current user is registered for an event
   */
  isRegisteredForEvent: (eventId: string, memberId: string) => boolean;

  /**
   * Get user's registration details for a specific event
   */
  getRegistration: (eventId: string, memberId: string) => EventRegistration | undefined;

  /**
   * Get all of current user's registrations
   */
  getMyRegistrations: (memberId: string) => EventRegistration[];

  /**
   * Get count of attendees for an event (mock - includes static + dynamic)
   * TODO: Backend will return this count directly from the event endpoint
   */
  getAttendeeCount: (eventId: string, staticCount: number) => number;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ───────────────────────────────────────────────────────
      registrations: [],

      // ── Actions ─────────────────────────────────────────────────────────────

      registerForEvent: (eventId: string, memberId: string, guestCount: number) => {
        const { registrations, isRegisteredForEvent } = get();

        // Prevent duplicate registration
        if (isRegisteredForEvent(eventId, memberId)) {
          console.warn(`User ${memberId} is already registered for event ${eventId}`);
          return;
        }

        const newRegistration: EventRegistration = {
          eventId,
          memberId,
          guestCount,
          registeredAt: new Date().toISOString(),
        };

        set({
          registrations: [...registrations, newRegistration],
        });

        // TODO: When backend is ready, replace above with:
        // try {
        //   await apiClient.post(`/events/${eventId}/register`, { guestCount });
        //   // Backend will return updated event with new registration count
        //   // We'll invalidate the event query cache to refetch fresh data
        // } catch (error) {
        //   console.error('Failed to register for event:', error);
        //   // Show error toast to user
        // }
      },

      unregisterFromEvent: (eventId: string, memberId: string) => {
        set((state) => ({
          registrations: state.registrations.filter(
            (r) => !(r.eventId === eventId && r.memberId === memberId),
          ),
        }));

        // TODO: When backend is ready, replace above with:
        // try {
        //   await apiClient.delete(`/events/${eventId}/register`);
        //   // Backend will return updated event with decreased registration count
        //   // We'll invalidate the event query cache to refetch fresh data
        // } catch (error) {
        //   console.error('Failed to unregister from event:', error);
        //   // Show error toast to user
        // }
      },

      isRegisteredForEvent: (eventId: string, memberId: string) => {
        const { registrations } = get();
        return registrations.some((r) => r.eventId === eventId && r.memberId === memberId);
      },

      getRegistration: (eventId: string, memberId: string) => {
        const { registrations } = get();
        return registrations.find((r) => r.eventId === eventId && r.memberId === memberId);
      },

      getMyRegistrations: (memberId: string) => {
        const { registrations } = get();
        return registrations.filter((r) => r.memberId === memberId);
      },

      getAttendeeCount: (eventId: string, staticCount: number) => {
        const { registrations } = get();
        // Count dynamic registrations for this event
        const dynamicCount = registrations.filter((r) => r.eventId === eventId).length;

        // Add static count from mock data + dynamic registrations
        // TODO: When backend is ready, backend will return the total count directly
        // and we won't need to calculate it here
        return staticCount + dynamicCount;
      },
    }),
    {
      name: 'event-registrations-storage', // sessionStorage key
      // Store in sessionStorage (clears on browser close)
      // TODO: When backend is ready, remove persist middleware entirely
      // since registration state will come from the server
    },
  ),
);
