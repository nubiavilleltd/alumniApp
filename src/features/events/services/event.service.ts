import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getEvents, getEventBySlug } from '@/data/site-data';
import type { Event } from '@/features/events/types/event.types';

export interface GetEventsParams {
  search?: string;
  location?: string;
  type?: 'upcoming' | 'past';
  token?: string;
}

export interface EventRegistrationPayload {
  name: string;
  email: string;
  location: string;
  graduationYear?: string;
  attending: 'yes' | 'no';
}

export const eventsService = {
  getAll: async (params?: GetEventsParams): Promise<Event[]> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.EVENTS.LIST, { params });
    // return data;


    // 🟢 MOCK — delete when API is ready
    return getEvents();
  },

  //This is just to test API integration. I will take it out
  // getSomeEvents: async (): Promise<Event[]> => {
  //   console.log("getting from DB...");
  //   const { data } = await apiClient.post("/get_events");

  //   console.log("data from DB", { data });
  //   return data;
  // },

  getBySlug: async (slug: string): Promise<Event | undefined> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.EVENTS.DETAIL(slug));
    // return data;

    // 🟢 MOCK — delete when API is ready
    return getEventBySlug(slug);
  },

  register: async (slug: string, payload: EventRegistrationPayload): Promise<void> => {
    const { data } = await apiClient.post(API_ENDPOINTS.EVENTS.REGISTER(slug), payload);
    return data;
  },

  create: async (payload: FormData): Promise<Event> => {
    const { data } = await apiClient.post(API_ENDPOINTS.EVENTS.CREATE, payload);
    return data;
  },

  update: async (id: string, payload: FormData): Promise<Event> => {
    const { data } = await apiClient.put(API_ENDPOINTS.EVENTS.UPDATE(id), payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EVENTS.DELETE(id));
  },
};
