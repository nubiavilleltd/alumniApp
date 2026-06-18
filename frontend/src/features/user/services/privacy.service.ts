/**
 * ============================================================================
 * PRIVACY SERVICE - REAL BACKEND INTEGRATION
 * ============================================================================
 *
 * Endpoints:
 * - POST /api/get_profile_visibility
 * - POST /api/update_profile_visibility
 *
 * ============================================================================
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';
import {
  mapBackendPrivacyToFrontend,
  createPrivacyUpdatePayload,
} from '../api/adapters/privacy.adapter';

export const privacyService = {
  /**
   * Get privacy settings for a user
   *
   * POST /api/get_profile_visibility
   * {
   *   user_id: "39"
   * }
   *
   * Response:
   * {
   *   status: 200,
   *   field_visibility: {
   *     avatar: "public",
   *     phone: "public",
   *     ...
   *   }
   * }
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER.GET_PROFILE_VISIBILITY, {
        user_id: userId,
      });

      return mapBackendPrivacyToFrontend(response.data);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to load privacy settings',
        'privacyService.getPrivacySettings',
      );
    }
  },

  /**
   * Update privacy for a single field
   *
   * POST /api/update_profile_visibility
   * {
   *   user_id: "39",
   *   avatar_visible: true  // or false
   * }
   */
  async updateFieldPrivacy(
    userId: string,
    field: keyof PrivacySettings,
    visibility: FieldVisibility,
  ): Promise<PrivacySettings> {
    try {
      const payload = createPrivacyUpdatePayload(userId, field, visibility);

      const response = await apiClient.post(API_ENDPOINTS.USER.UPDATE_PROFILE_VISIBILITY, payload);

      // Return updated privacy settings
      return mapBackendPrivacyToFrontend(response.data);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to update privacy setting',
        'privacyService.updateFieldPrivacy',
      );
    }
  },
};
