// features/marketplace/services/livenews.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { extractList } from '@/lib/utils/adapters';


import { LiveNewsItem } from '../types/livenews.types';
import { mapBackendLiveNewsList } from '../api/adapters/livenews.adapter';

export const liveNewsService = {
  /**
   * Fetch all active listings with optional filters.
   * POST /get_listings
   */
  async getAll(): Promise<LiveNewsItem[]> {
    try {
    
      const { data } = await apiClient.post(API_ENDPOINTS.LIVENEWS.GET_LIVE_NEWS);
      const list = extractList(data, ['articles']);

      return mapBackendLiveNewsList(list);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load live news. Please try again.',
        'liveNewsService.getAll',
      );
    }
  },



};
