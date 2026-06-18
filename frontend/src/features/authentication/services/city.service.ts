// features/alumni/services/city.service.ts
//
// Responsible for fetching the city list from the backend.
// GET /get_cities — Auth: X-API-Key only (no Bearer required by the backend doc).
// The API client already injects the X-API-Key header via the request interceptor.
//
// Pattern: matches the existing alumniService / userService conventions.

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { City } from '../types/city.types';
import { mapBackendCityList } from '../api/adapters/city.adapter';
// import { mapBackendCityList } from '../api/adapters/city.adapter';
// import type { City } from '../types/city.types';

export const cityService = {
  /**
   * Fetches all available cities (with their zones) from the backend.
   * GET /get_cities — body: none.
   */
  async getCities(): Promise<City[]> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.GET_CITIES);

      // Backend returns: { status: 200, message: "...", data: [...] }
      const list = Array.isArray(data?.data) ? data.data : data;

      return mapBackendCityList(list);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load cities. Please try again.',
        'cityService.getCities',
      );
    }
  },
};
