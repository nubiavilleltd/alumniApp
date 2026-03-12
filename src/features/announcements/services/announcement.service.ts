import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { getAnnouncements, getAnnouncementBySlug } from '@/data/site-data';
import type { NewsItem } from '@/features/announcements/types/announcement.types';

export interface GetAnnouncementsParams {
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export const announcementService = {
  getAll: async (params?: GetAnnouncementsParams): Promise<NewsItem[]> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.ANNOUNCEMENTS.LIST, { params });
    // return data;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 🟢 MOCK — delete when API is ready
    return getAnnouncements();
  },

  getBySlug: async (slug: string): Promise<NewsItem | undefined> => {
    // 🔴 TODO: replace with real API call
    // const { data } = await apiClient.get(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(slug));
    // return data;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 🟢 MOCK — delete when API is ready
    return getAnnouncementBySlug(slug);
  },
};
