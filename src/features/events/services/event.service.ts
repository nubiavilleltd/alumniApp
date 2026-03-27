// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { getEvents, getEventBySlug } from '@/data/site-data';
// import type { Event } from '@/features/events/types/event.types';

// export interface GetEventsParams {
//   search?: string;
//   location?: string;
//   type?: 'upcoming' | 'past';
//   token?: string;
// }

// export interface EventRegistrationPayload {
//   name: string;
//   email: string;
//   location: string;
//   graduationYear?: string;
//   attending: 'yes' | 'no';
// }

// export const eventsService = {
//   getAll: async (params?: GetEventsParams): Promise<Event[]> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.EVENTS.LIST, { params });
//     // return data;

//     // 🟢 MOCK — delete when API is ready
//     return getEvents();
//   },

//   //This is just to test API integration. I will take it out
//   // getSomeEvents: async (): Promise<Event[]> => {
//   //   console.log("getting from DB...");
//   //   const { data } = await apiClient.post("/get_events");

//   //   console.log("data from DB", { data });
//   //   return data;
//   // },

//   getBySlug: async (slug: string): Promise<Event | undefined> => {
//     // 🔴 TODO: replace with real API call
//     // const { data } = await apiClient.get(API_ENDPOINTS.EVENTS.DETAIL(slug));
//     // return data;

//     // 🟢 MOCK — delete when API is ready
//     return getEventBySlug(slug);
//   },

//   register: async (slug: string, payload: EventRegistrationPayload): Promise<void> => {
//     const { data } = await apiClient.post(API_ENDPOINTS.EVENTS.REGISTER(slug), payload);
//     return data;
//   },

//   create: async (payload: FormData): Promise<Event> => {
//     const { data } = await apiClient.post(API_ENDPOINTS.EVENTS.CREATE, payload);
//     return data;
//   },

//   update: async (id: string, payload: FormData): Promise<Event> => {
//     const { data } = await apiClient.put(API_ENDPOINTS.EVENTS.UPDATE(id), payload);
//     return data;
//   },

//   delete: async (id: string): Promise<void> => {
//     await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id));
//   },
// };

// features/events/services/event.service.ts

import { apiClient } from '@/lib/api/client';
import {
  mapBackendEventList,
  mapBackendEventToFrontend,
  mapEventToCreatePayload,
  mapEventToUpdatePayload,
  mapEventToDeletePayload,
  mapFilterEventsPayload,
  mapGetSingleEventPayload,
  mapRegisterEventPayload,
  mapCancelRegistrationPayload,
  mapUpdateRSVPPayload,
  mapGetEventAttendeesPayload,
  mapGetUserEventsPayload,
} from '../api/adapters/event.adapter';
import type { Event } from '../types/event.types';

// API endpoints (using exact endpoints from backend contract)
const ENDPOINTS = {
  CREATE_EVENT: '/create_event',
  MANAGE_EVENT: '/manage_event',
  GET_EVENTS: '/get_events',
  REGISTER_EVENT: '/register_event',
  MANAGE_EVENT_RSVP: '/manage_event_rsvp',
  GET_EVENT_ATTENDEES: '/get_event_attendees',
};

export interface GetEventsParams {
  search?: string;
  location?: string;
  type?: 'upcoming' | 'past';
  visibility?: string;
  status?: string;
  chapterId?: string;
  year?: string;
}

export interface EventRegistrationPayload {
  name: string;
  email: string;
  location: string;
  graduationYear?: string;
  attending: 'yes' | 'no';
}

export const eventsService = {
  /**
   * Get all events with optional filters
   * POST /api/get_events
   */
  getAll: async (params?: GetEventsParams): Promise<Event[]> => {
    try {
      const payload = mapFilterEventsPayload({
        visibility: params?.visibility,
        status: params?.status,
        chapterId: params?.chapterId,
        year: params?.year,
      });

      console.log('🔍 Fetching events with payload:', payload);
      const response = await apiClient.post(ENDPOINTS.GET_EVENTS, payload);
      console.log('📥 Get events response:', response.data);

      // Handle different response structures
      let events = [];
      if (response.data.events && Array.isArray(response.data.events)) {
        events = response.data.events;
      } else if (Array.isArray(response.data)) {
        events = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        events = response.data.data;
      } else {
        console.warn('Unexpected response structure:', response.data);
        events = [];
      }

      const mappedEvents = mapBackendEventList(events);
      console.log(`✅ Mapped ${mappedEvents.length} events`);
      return mappedEvents;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  },

  /**
   * Get a single event by ID
   * POST /api/get_events with { id: "1" }
   */

  // features/events/services/event.service.ts

  /**
   * Get a single event by ID
   * POST /api/get_events with { id: "1" }
   * Note: Backend returns all events, so we need to filter client-side
   */
  // features/events/services/event.service.ts

  /**
   * Get a single event by ID
   * POST /api/get_events with { id: "1" }
   */
  getById: async (id: string): Promise<Event | null> => {
    try {
      const payload = mapGetSingleEventPayload(id);
      console.log(`🔍 Fetching event ${id} with payload:`, payload);
      const response = await apiClient.post(ENDPOINTS.GET_EVENTS, payload);
      console.log(`📥 Get event by ID response for ${id}:`, response.data);

      let eventData = null;

      // Handle different response structures
      if (response.data.event) {
        // Single event response (like we're getting)
        eventData = response.data.event;
      } else if (response.data.events && Array.isArray(response.data.events)) {
        // Array response - find the one with matching ID
        eventData = response.data.events.find((e: any) => String(e.id) === String(id));
      } else if (Array.isArray(response.data)) {
        eventData = response.data.find((e: any) => String(e.id) === String(id));
      } else if (response.data.data) {
        eventData = response.data.data;
      }

      if (!eventData) {
        console.warn(`Event with ID ${id} not found in response`);
        return null;
      }

      console.log('Found event data:', eventData);

      const mappedEvent = mapBackendEventToFrontend(eventData);
      console.log('Mapped event:', mappedEvent);
      return mappedEvent;
    } catch (error) {
      console.error(`Failed to fetch event ${id}:`, error);
      return null;
    }
  },
  /**
   * Get events by slug (ID based for now)
   */
  getBySlug: async (slug: string): Promise<Event | undefined> => {
    // Since backend uses ID, we need to extract ID from slug
    // For now, return null and let caller handle
    console.log('getBySlug not implemented, use getById instead');
    return undefined;
  },

  /**
   * Get user's events (My Events - events user has RSVP'd to)
   * POST /api/get_events with user_id
   */
  getUserEvents: async (userId: string): Promise<Event[]> => {
    try {
      const payload = mapGetUserEventsPayload(userId);
      console.log(`🔍 Fetching events for user ${userId}`);
      const response = await apiClient.post(ENDPOINTS.GET_EVENTS, payload);

      let events = [];
      if (response.data.events && Array.isArray(response.data.events)) {
        events = response.data.events;
      } else if (Array.isArray(response.data)) {
        events = response.data;
      } else {
        events = [];
      }

      return mapBackendEventList(events);
    } catch (error) {
      console.error(`Failed to fetch user events for ${userId}:`, error);
      return [];
    }
  },

  /**
   * Create a new event (admin only)
   * POST /api/create_event
   */
  create: async (payload: FormData | Record<string, any>): Promise<Event> => {
    let response;

    if (payload instanceof FormData) {
      console.log('📤 Sending create event as FormData');
      response = await apiClient.post(ENDPOINTS.CREATE_EVENT, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      console.log('📤 Sending create event as JSON:', payload);
      response = await apiClient.post(ENDPOINTS.CREATE_EVENT, payload);
    }

    console.log('📥 Create event response:', response.data);

    let createdEvent = response.data.event || response.data.data || response.data;

    if (createdEvent && createdEvent.id) {
      console.log(`✅ Created event with ID: ${createdEvent.id}`);
      return mapBackendEventToFrontend(createdEvent);
    }

    if (response.data.id) {
      const event = await eventsService.getById(response.data.id);
      if (event) return event;
    }

    throw new Error('Failed to get created event data');
  },

  /**
   * Update an existing event (admin only)
   * POST /api/manage_event with function_type: "update"
   */
  update: async (id: string, payload: Record<string, any>): Promise<Event> => {
    console.log(`📤 Sending update event for ${id}:`, payload);
    const response = await apiClient.post(ENDPOINTS.MANAGE_EVENT, payload);
    console.log(`📥 Update event response:`, response.data);

    const updated = await eventsService.getById(id);
    if (!updated) {
      throw new Error('Failed to fetch updated event');
    }

    console.log(`✅ Successfully updated event ${id}`);
    return updated;
  },

  /**
   * Delete an event (admin only)
   * POST /api/manage_event with function_type: "delete"
   */
  delete: async (id: string): Promise<void> => {
    const payload = mapEventToDeletePayload(id);
    console.log(`🗑️ Deleting event ${id}`);
    await apiClient.post(ENDPOINTS.MANAGE_EVENT, payload);
    console.log(`✅ Successfully deleted event ${id}`);
  },

  /**
   * Register for an event (RSVP)
   * POST /api/register_event
   */
  register: async (
    eventId: string,
    userId: string,
    status: 'going' | 'maybe' | 'not_going' = 'going',
  ): Promise<void> => {
    const payload = mapRegisterEventPayload(userId, eventId, status);
    console.log(`📤 Registering user ${userId} for event ${eventId} with status: ${status}`);
    await apiClient.post(ENDPOINTS.REGISTER_EVENT, payload);
    console.log(`✅ Successfully registered for event ${eventId}`);
  },

  /**
   * Cancel event registration
   * POST /api/manage_event_rsvp with function_type: "cancel"
   */
  cancelRegistration: async (eventId: string, userId: string): Promise<void> => {
    const payload = mapCancelRegistrationPayload(userId, eventId);
    console.log(`📤 Cancelling registration for user ${userId} from event ${eventId}`);
    await apiClient.post(ENDPOINTS.MANAGE_EVENT_RSVP, payload);
    console.log(`✅ Successfully cancelled registration for event ${eventId}`);
  },

  /**
   * Update RSVP status
   * POST /api/manage_event_rsvp with function_type: "update"
   */
  updateRSVP: async (
    eventId: string,
    userId: string,
    status: 'going' | 'maybe' | 'not_going',
  ): Promise<void> => {
    const payload = mapUpdateRSVPPayload(userId, eventId, status);
    console.log(`📤 Updating RSVP for user ${userId} to ${status} for event ${eventId}`);
    await apiClient.post(ENDPOINTS.MANAGE_EVENT_RSVP, payload);
    console.log(`✅ Successfully updated RSVP for event ${eventId}`);
  },

  /**
   * Get event attendees
   * POST /api/get_event_attendees
   */
  getAttendees: async (eventId: string, status?: string): Promise<any[]> => {
    try {
      const payload = mapGetEventAttendeesPayload(eventId, status);
      console.log(`🔍 Fetching attendees for event ${eventId}`);
      const response = await apiClient.post(ENDPOINTS.GET_EVENT_ATTENDEES, payload);

      let attendees = [];
      if (response.data.attendees && Array.isArray(response.data.attendees)) {
        attendees = response.data.attendees;
      } else if (Array.isArray(response.data)) {
        attendees = response.data;
      }

      return attendees;
    } catch (error) {
      console.error(`Failed to fetch attendees for event ${eventId}:`, error);
      return [];
    }
  },
};
