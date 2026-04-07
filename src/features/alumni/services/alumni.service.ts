// features/alumni/services/alumni.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { extractList } from '@/lib/utils/adapters';
import { mapBackendAlumniToFrontend, mapBackendAlumniList } from '../api/adapters/alumni.adapter';
import type { Alumni } from '../types/alumni.types';
import { parseFieldVisibility } from '../utils/privacyHelpers';

export interface GetAlumniParams {
  search?: string;
  year?: string;
  page?: number;
  limit?: number;
  action_type?: string;
}

export const alumniService = {
  /** Fetch all approved alumni. POST /get_users_by_action */
  async getAll(params?: GetAlumniParams): Promise<Alumni[]> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, params ?? {});
      const list = extractList(data, ['users', 'data']);
      return mapBackendAlumniList(list);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load the alumni directory. Please try again.',
        'alumniService.getAll',
      );
    }
  },

  /** Fetch a single alumnus by backend numeric ID. POST /get_users_by_action { user_id } */
  async getById(id: string): Promise<Alumni | null> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.ALUMNI.LIST, { user_id: id });

      const list = extractList(data, ['users', 'data']);
      const match =
        list.find((u: any) => String(u.id) === String(id)) ??
        (!Array.isArray(data) && (data as any).user?.id === id ? (data as any).user : null);

      if (!match) return null;
      console.log('match', { match });

      //Stop formatting once the backend is sending the correct format!!!!!!!. Just pass in the match directly to mapBackendAlumniToFrontend()
      const formattedData = {
        ...match,
        profile: {
          ...match.profile,
          field_visibility: parseFieldVisibility(match.profile.field_visibility),
        },
      };
      console.log('formattedData', { formattedData });
      return mapBackendAlumniToFrontend(formattedData);
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw handleApiError(
        error,
        'Unable to load this profile. Please try again.',
        'alumniService.getById',
      );
    }
  },

  /** Update alumni profile. POST /update_profile (FormData) */
  async update(id: string, payload: FormData): Promise<Alumni> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.USER.UPDATE_PROFILE, payload);
      const raw = (data as any).user ?? (data as any).data ?? data;
      return mapBackendAlumniToFrontend(raw);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to update your profile. Please check your information and try again.',
        'alumniService.update',
      );
    }
  },
};
