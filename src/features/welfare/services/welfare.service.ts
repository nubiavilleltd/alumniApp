// features/welfare/services/welfare.service.ts
//
// Fetches welfare zone data from the backend.
// POST /get_zones — no body required; X-API-Key injected by apiClient interceptor.

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { mapBackendZoneList } from '../api/adapters/welfare.adapter';
import { WelfareZone } from '../types/welfare.type';

export const welfareService = {
  /**
   * Fetches all welfare zones (with coordinator info) from the backend.
   * POST /get_zones — body: none.
   */
  async getZones(): Promise<WelfareZone[]> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.WELFARE.GET_ZONES);

      // Backend returns: { status: 200, message: "...", data: [...] }
      const list = Array.isArray(data?.data) ? data.data : data;

      return mapBackendZoneList(list);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load welfare zones. Please try again.',
        'welfareService.getZones',
      );
    }
  },
};
