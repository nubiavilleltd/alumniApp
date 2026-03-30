// features/announcements/services/announcement.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { getAnnouncements, getAnnouncementBySlug } from '@/data/site-data';
import type { NewsItem } from '@/features/announcements/types/announcement.types';

export interface GetAnnouncementsParams {
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export const announcementService = {
  async getAll(params?: GetAnnouncementsParams): Promise<NewsItem[]> {
    // 🔴 TODO: replace mock with real API call when endpoint is available
    // try {
    //   const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.LIST, params ?? {});
    //   return data.announcements ?? data.data ?? data;
    // } catch (error) {
    //   throw handleApiError(error, 'Unable to load announcements.', 'announcementService.getAll');
    // }
    return getAnnouncements();
  },

  async getBySlug(slug: string): Promise<NewsItem | undefined> {
    // 🔴 TODO: replace mock with real API call when endpoint is available
    // try {
    //   const { data } = await apiClient.get(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(slug));
    //   return data.announcement ?? data.data ?? data;
    // } catch (error: any) {
    //   if (error.response?.status === 404) return undefined;
    //   throw handleApiError(error, 'Unable to load this announcement.', 'announcementService.getBySlug');
    // }
    return getAnnouncementBySlug(slug);
  },
};
