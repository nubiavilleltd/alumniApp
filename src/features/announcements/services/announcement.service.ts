// features/announcements/services/announcement.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import {
  extractAnnouncementFromResponse,
  extractAnnouncementIdFromSlug,
  mapAnnouncementToCreatePayload,
  mapAnnouncementToDeletePayload,
  mapAnnouncementToUpdatePayload,
  mapBackendAnnouncementList,
  mapGetAnnouncementsPayload,
} from '@/features/announcements/api/adapters/announcement.adapter';
import type {
  AnnouncementMutationInput,
  GetAnnouncementsParams,
  NewsItem,
} from '@/features/announcements/types/announcement.types';

export const announcementService = {
  async getAll(params?: GetAnnouncementsParams): Promise<NewsItem[]> {
    const accessToken = useTokenStore.getState().accessToken;
    if (!accessToken) return [];

    try {
      const payload = mapGetAnnouncementsPayload(params);
      const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.LIST, payload);
      return mapBackendAnnouncementList(data);
    } catch (error) {
      throw handleApiError(error, 'Unable to load announcements.', 'announcementService.getAll');
    }
  },

  async getBySlug(slug: string): Promise<NewsItem | undefined> {
    const accessToken = useTokenStore.getState().accessToken;
    if (!accessToken) return undefined;

    try {
      const id = extractAnnouncementIdFromSlug(slug);
      if (id) {
        const items = await announcementService.getAll({ id });
        return items[0];
      }

      const items = await announcementService.getAll();
      return items.find((item) => item.slug === slug);
    } catch (error: any) {
      if (error.response?.status === 404) return undefined;
      throw handleApiError(
        error,
        'Unable to load this announcement.',
        'announcementService.getBySlug',
      );
    }
  },

  async create(input: AnnouncementMutationInput): Promise<NewsItem> {
    try {
      const payload = mapAnnouncementToCreatePayload(input);
      const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, payload);
      const created = extractAnnouncementFromResponse(data);

      if (created) return created;

      const createdId = data?.data?.id ?? data?.id;
      if (createdId) {
        const items = await announcementService.getAll({ id: String(createdId) });
        if (items[0]) return items[0];
      }

      throw new Error('Announcement created but the response did not include announcement data.');
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to create the announcement.',
        'announcementService.create',
      );
    }
  },

  async update(id: string, input: Partial<AnnouncementMutationInput>): Promise<NewsItem> {
    try {
      const payload = mapAnnouncementToUpdatePayload(id, input);
      const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.MANAGE, payload);
      const updated = extractAnnouncementFromResponse(data);

      if (updated) return updated;

      const items = await announcementService.getAll({ id });
      if (items[0]) return items[0];

      throw new Error('Announcement updated but could not be reloaded.');
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to update the announcement.',
        'announcementService.update',
      );
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.MANAGE, mapAnnouncementToDeletePayload(id), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to delete the announcement.',
        'announcementService.delete',
      );
    }
  },
};
