// /**
//  * ============================================================================
//  * PRIVACY SERVICE
//  * ============================================================================
//  *
//  * Manages user privacy settings
//  *
//  * STATUS: Future-ready - endpoints not yet available from backend
//  *
//  * When backend provides endpoints, uncomment the implementation
//  * and update API_ENDPOINTS configuration
//  *
//  * ============================================================================
//  */

// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { handleApiError } from '@/lib/errors/apiErrorHandler';
// import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';
// import {
//   mapBackendPrivacyToFrontend,
//   mapFrontendPrivacyToBackend,
// } from '../api/adapters/privacy.adapter';

// export const privacyService = {
//   /**
//    * Get privacy settings for a user
//    *
//    * POST /api/get_privacy_settings
//    *
//    * Response:
//    * {
//    *   status: 200,
//    *   message: "Profile visibility retrieved successfully",
//    *   user_id: 5,
//    *   field_visibility: {
//    *     avatar: "private",
//    *     phone: false,
//    *     alternative_phone: "private",
//    *     ...
//    *   }
//    * }
//    */
//   async getPrivacySettings(userId: string): Promise<PrivacySettings> {
//     // TODO: Implement when endpoint is available
//     throw new Error('Privacy settings endpoint not yet available from backend');

//     /*
//     // Future implementation:
//     try {
//       const response = await apiClient.post(API_ENDPOINTS.USER.GET_PRIVACY, {
//         user_id: userId,
//       });

//       return mapBackendPrivacyToFrontend(response.data);
//     } catch (error) {
//       throw handleApiError(
//         error,
//         'Unable to load privacy settings',
//         'privacyService.getPrivacySettings'
//       );
//     }
//     */
//   },

//   /**
//    * Update privacy for a single field
//    *
//    * POST /api/update_privacy
//    *
//    * Request:
//    * {
//    *   user_id: "5",
//    *   field: "avatar",
//    *   visibility: "public"
//    * }
//    */
//   async updateFieldPrivacy(
//     userId: string,
//     field: keyof PrivacySettings,
//     visibility: FieldVisibility
//   ): Promise<void> {
//     // TODO: Implement when endpoint is available
//     throw new Error('Privacy update endpoint not yet available from backend');

//     /*
//     // Future implementation:
//     try {
//       // Map frontend field name to backend field name
//       const backendFieldMap: Record<keyof PrivacySettings, string> = {
//         photo: 'avatar',
//         whatsappPhone: 'phone',
//         alternativePhone: 'alternative_phone',
//         birthDate: 'birth_date',
//         residentialAddress: 'residential_address',
//         area: 'area',
//         city: 'city',
//         employmentStatus: 'employment_status',
//         occupations: 'occupation',
//         industrySectors: 'industry_sector',
//         yearsOfExperience: 'years_of_experience',
//       };

//       await apiClient.post(API_ENDPOINTS.USER.UPDATE_PRIVACY, {
//         user_id: userId,
//         field: backendFieldMap[field],
//         visibility: visibility,
//       });

//       console.log(`✅ Privacy updated: ${field} → ${visibility}`);
//     } catch (error) {
//       throw handleApiError(
//         error,
//         'Unable to update privacy setting',
//         'privacyService.updateFieldPrivacy'
//       );
//     }
//     */
//   },

//   /**
//    * Update all privacy settings at once
//    *
//    * POST /api/update_privacy_bulk
//    *
//    * Request:
//    * {
//    *   user_id: "5",
//    *   avatar: "public",
//    *   phone: "private",
//    *   alternative_phone: "private",
//    *   ...
//    * }
//    */
//   async updatePrivacySettings(
//     userId: string,
//     privacy: PrivacySettings
//   ): Promise<void> {
//     // TODO: Implement when endpoint is available
//     throw new Error('Privacy bulk update endpoint not yet available from backend');

//     /*
//     // Future implementation:
//     try {
//       const payload = mapFrontendPrivacyToBackend(privacy);

//       await apiClient.post(API_ENDPOINTS.USER.UPDATE_PRIVACY_BULK, {
//         user_id: userId,
//         ...payload,
//       });

//       console.log('✅ All privacy settings updated');
//     } catch (error) {
//       throw handleApiError(
//         error,
//         'Unable to update privacy settings',
//         'privacyService.updatePrivacySettings'
//       );
//     }
//     */
//   },
// };

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

      console.log('📥 Privacy settings response:', response.data);

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

      console.log('📤 Updating privacy:', { field, visibility, payload });

      const response = await apiClient.post(API_ENDPOINTS.USER.UPDATE_PROFILE_VISIBILITY, payload);

      console.log('✅ Privacy updated:', response.data);

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
