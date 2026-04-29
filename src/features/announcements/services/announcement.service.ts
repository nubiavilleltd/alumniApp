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
  AnnouncementType,
  GetAnnouncementsParams,
  NewsItem,
} from '@/features/announcements/types/announcement.types';

const ANNOUNCEMENT_TYPES: AnnouncementType[] = ['info', 'warning', 'success', 'event'];

function serializeFormData(payload: FormData) {
  const serialized: Record<string, unknown> = {};

  payload.forEach((value, key) => {
    const nextValue =
      value instanceof File
        ? {
            name: value.name,
            size: value.size,
            type: value.type,
            lastModified: value.lastModified,
          }
        : value;

    const currentValue = serialized[key];
    if (currentValue === undefined) {
      serialized[key] = nextValue;
      return;
    }

    serialized[key] = Array.isArray(currentValue)
      ? [...currentValue, nextValue]
      : [currentValue, nextValue];
  });

  return serialized;
}

function serializePayload(payload: FormData | Record<string, unknown>) {
  return payload instanceof FormData ? serializeFormData(payload) : payload;
}

function logAnnouncementRequest(
  action: string,
  endpoint: string,
  payload: FormData | Record<string, unknown>,
) {
  console.log(`[announcementService] ${action} request`, {
    endpoint,
    payload: serializePayload(payload),
  });
}

function logAnnouncementResponse(action: string, data: unknown) {
  console.log(`[announcementService] ${action} response`, data);
}

function logAnnouncementError(action: string, error: unknown) {
  console.error(`[announcementService] ${action} error`, error);
}

async function fetchAnnouncements(params?: GetAnnouncementsParams): Promise<NewsItem[]> {
  const payload = mapGetAnnouncementsPayload(params);
  logAnnouncementRequest('getAll', API_ENDPOINTS.ANNOUNCEMENTS.LIST, payload);
  const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.LIST, payload);
  logAnnouncementResponse('getAll', data);
  return mapBackendAnnouncementList(data);
}

function dedupeAnnouncements(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = String(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchAnnouncementsByTypeFallback(
  params?: GetAnnouncementsParams,
): Promise<NewsItem[]> {
  const baseParams = params ? { ...params } : {};
  delete baseParams.type;

  const results = await Promise.all(
    ANNOUNCEMENT_TYPES.map((type) => fetchAnnouncements({ ...baseParams, type })),
  );

  return dedupeAnnouncements(results.flat());
}

export const announcementService = {
  async getAll(params?: GetAnnouncementsParams): Promise<NewsItem[]> {
    const accessToken = useTokenStore.getState().accessToken;
    if (!accessToken) return [];

    const canUseTypeFallback = !params?.type;

    try {
      const items = await fetchAnnouncements(params);

      // Some backend environments only return data when `type` is explicit.
      if (items.length > 0 || !canUseTypeFallback) return items;

      console.log('[announcementService] getAll fallback', {
        reason: 'empty unfiltered response',
        params,
      });
      return await fetchAnnouncementsByTypeFallback(params);
    } catch (error) {
      logAnnouncementError('getAll', error);
      if (canUseTypeFallback) {
        try {
          console.log('[announcementService] getAll fallback', {
            reason: 'request error on unfiltered response',
            params,
          });
          return await fetchAnnouncementsByTypeFallback(params);
        } catch (fallbackError) {
          logAnnouncementError('getAll fallback', fallbackError);
          throw handleApiError(
            fallbackError,
            'Unable to load announcements.',
            'announcementService.getAll',
          );
        }
      }

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
      logAnnouncementRequest('create', API_ENDPOINTS.ANNOUNCEMENTS.CREATE, payload);
      const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.CREATE, payload);
      logAnnouncementResponse('create', data);
      const created = extractAnnouncementFromResponse(data);

      if (created) return created;

      const createdId = data?.data?.id ?? data?.id;
      if (createdId) {
        const items = await announcementService.getAll({ id: String(createdId) });
        if (items[0]) return items[0];
      }

      throw new Error('Announcement created but the response did not include announcement data.');
    } catch (error) {
      logAnnouncementError('create', error);
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
      logAnnouncementRequest('update', API_ENDPOINTS.ANNOUNCEMENTS.MANAGE, payload);
      const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.MANAGE, payload);
      logAnnouncementResponse('update', data);
      const updated = extractAnnouncementFromResponse(data);

      if (updated) return updated;

      const items = await announcementService.getAll({ id });
      if (items[0]) return items[0];

      throw new Error('Announcement updated but could not be reloaded.');
    } catch (error) {
      logAnnouncementError('update', error);
      throw handleApiError(
        error,
        'Unable to update the announcement.',
        'announcementService.update',
      );
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const payload = mapAnnouncementToDeletePayload(id);
      logAnnouncementRequest('delete', API_ENDPOINTS.ANNOUNCEMENTS.MANAGE, payload);
      const { data } = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS.MANAGE, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      logAnnouncementResponse('delete', data);
    } catch (error) {
      logAnnouncementError('delete', error);
      throw handleApiError(
        error,
        'Unable to delete the announcement.',
        'announcementService.delete',
      );
    }
  },
};
