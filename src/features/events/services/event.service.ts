// features/events/services/event.service.ts

import { apiClient } from '@/lib/api/client';
import {
  mapBackendEventList,
  mapBackendEventToFrontend,
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
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export interface GetEventsParams {
  search?: string;
  location?: string;
  type?: 'upcoming' | 'past';
  visibility?: string;
  status?: string;
  chapterId?: string;
  year?: string;
}

const extractDataArray = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.events)) return data.events;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

export const eventsService = {
  // ─── GET ALL EVENTS ─────────────────────────────────────────────────────────
  getAll: async (params?: GetEventsParams): Promise<Event[]> => {
    try {
      // const payload = mapFilterEventsPayload(params);

      const payload = mapFilterEventsPayload({
        visibility: params?.visibility,
        status: params?.status,
        chapterId: params?.chapterId,
        year: params?.year,
      });
      // const response = await apiClient.post(API_ENDPOINTS.EVENTS.GET_EVENTS, payload);
      const response = await apiClient.post(API_ENDPOINTS.EVENTS.GET_EVENTS);
      console.log('response =>', { response });
      const events = extractDataArray(response.data);
      return mapBackendEventList(events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  },

  // ─── GET SINGLE EVENT ───────────────────────────────────────────────────────
  getById: async (id: string): Promise<Event | null> => {
    try {
      const payload = mapGetSingleEventPayload(id);
      const response = await apiClient.post(API_ENDPOINTS.EVENTS.GET_EVENTS, payload);

      const events = extractDataArray(response.data);
      const eventData = events.find((e) => String(e.id) === String(id));

      if (!eventData) return null;
      return mapBackendEventToFrontend(eventData);
    } catch (error) {
      console.error(`Failed to fetch event ${id}:`, error);
      return null;
    }
  },

  getBySlug: async (slug: string): Promise<Event | undefined> => {
    console.warn('getBySlug not implemented, use getById instead');
    return undefined;
  },

  // ─── USER EVENTS ────────────────────────────────────────────────────────────
  getUserEvents: async (userId: string): Promise<Event[]> => {
    try {
      const payload = mapGetUserEventsPayload(userId);
      const response = await apiClient.post(API_ENDPOINTS.EVENTS.GET_EVENTS, payload);
      const events = extractDataArray(response.data);

      return mapBackendEventList(events);
    } catch (error) {
      console.error(`Failed to fetch user events for ${userId}:`, error);
      return [];
    }
  },

  // ─── CREATE / UPDATE / DELETE EVENTS ───────────────────────────────────────
  create: async (payload: FormData | Record<string, any>): Promise<Event> => {
    const config =
      payload instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

    const response = await apiClient.post(API_ENDPOINTS.EVENTS.CREATE_EVENT, payload, config);
    const created = response.data.event || response.data.data || response.data;

    if (created?.id) return mapBackendEventToFrontend(created);
    if (response.data.id) return eventsService.getById(response.data.id) as Promise<Event>;

    throw new Error('Failed to get created event data');
  },

  update: async (id: string, payload: Record<string, any>): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.EVENTS.MANAGE_EVENT, payload);
    // return { id, ...payload };
    // const updated = await eventsService.getById(id);
    // if (!updated) throw new Error('Failed to fetch updated event');
    // return updated;
  },

  delete: async (id: string): Promise<void> => {
    const payload = mapEventToDeletePayload(id);
    await apiClient.post(API_ENDPOINTS.EVENTS.MANAGE_EVENT, payload);
  },

  // ─── REGISTRATION / RSVP ───────────────────────────────────────────────────
  register: async (
    eventId: string,
    userId: string,
    status: 'going' | 'maybe' | 'not_going' = 'going',
    additionalInfo: string,
  ): Promise<void> => {
    const payload = mapRegisterEventPayload(userId, eventId, status, additionalInfo);
    await apiClient.post(API_ENDPOINTS.EVENTS.REGISTER_EVENT, payload);
  },

  cancelRegistration: async (eventId: string, userId: string): Promise<void> => {
    const payload = mapCancelRegistrationPayload(userId, eventId);
    await apiClient.post(API_ENDPOINTS.EVENTS.MANAGE_EVENT_RSVP, payload);
  },

  updateRSVP: async (
    eventId: string,
    userId: string,
    status: 'going' | 'maybe' | 'not_going',
  ): Promise<void> => {
    const payload = mapUpdateRSVPPayload(userId, eventId, status);
    await apiClient.post(API_ENDPOINTS.EVENTS.MANAGE_EVENT_RSVP, payload);
  },

  // ─── ATTENDEES ─────────────────────────────────────────────────────────────
  getAttendees: async (eventId: string, status?: string): Promise<any[]> => {
    try {
      const payload = mapGetEventAttendeesPayload(eventId, status);
      const response = await apiClient.post(API_ENDPOINTS.EVENTS.GET_ATTENDEES, payload);
      return extractDataArray(response.data);
    } catch (error) {
      console.error(`Failed to fetch attendees for event ${eventId}:`, error);
      return [];
    }
  },
};
