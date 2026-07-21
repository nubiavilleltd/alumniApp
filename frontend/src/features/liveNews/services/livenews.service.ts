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

      console.log("jdffd", {data, list})
      return mapBackendLiveNewsList(list);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load live news. Please try again.',
        'liveNewsService.getAll',
      );
    }
  },

  /**
   * Fetch a single listing by its backend ID.
   * POST /get_listings  { id: "1" }
   */
//   async getById(id: string): Promise<LiveNewsItem | null> {
//     try {
//       const payload = mapGetSingleListingPayload(id);
//       const { data } = await apiClient.post(API_ENDPOINTS.MARKETPLACE.GET_LISTINGS, payload);

//       // Response may be a single object or a one-item list
//       const raw =
//         (data as Record<string, unknown>).listing ??
//         (data as Record<string, unknown>).data ??
//         extractList(data, ['listings'])[0] ??
//         null;

//       if (!raw) return null;
//       return mapBackendListingToBusiness(raw);
//     } catch (error: any) {
//       if (error.response?.status === 404) return null;
//       throw handleApiError(
//         error,
//         'Unable to load this business. Please try again.',
//         'marketplaceService.getById',
//       );
//     }
//   },


};
