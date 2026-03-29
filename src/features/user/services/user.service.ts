/**
 * ============================================================================
 * USER SERVICE
 * ============================================================================
 *
 * Handles all user profile operations with real backend API
 *
 * USES ADAPTER PATTERN:
 * - Transforms frontend → backend
 * - Transforms backend → frontend
 * - Isolates backend mess
 *
 * ============================================================================
 */

// import { apiClient } from '@/lib/api/client';
// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
// import {
//   createProfileUpdateFormData,
//   createProfileUpdatePayload,
//   mapBackendResponseToFrontendUser,
// } from '../api/adapters/user.adapter';

// export interface UpdateProfileParams {
//   userId: string;
//   updates: Partial<AuthSessionUser>;
//   photoFile?: File;
// }

// export const userService = {
//   /**
//    * Update user profile
//    *
//    * Handles both cases:
//    * 1. With photo: sends FormData with multipart/form-data
//    * 2. Without photo: sends JSON
//    *
//    * @returns Updated user data from backend
//    */
//   async updateProfile(params: UpdateProfileParams): Promise<Partial<AuthSessionUser>> {
//     const { userId, updates, photoFile } = params;

//     try {
//       let response;

//       if (photoFile) {
//         // ═══════════════════════════════════════════════════════════════
//         // WITH PHOTO: Use FormData + multipart/form-data
//         // ═══════════════════════════════════════════════════════════════
//         const formData = createProfileUpdateFormData(userId, updates, photoFile);

//         response = await apiClient.post(API_ENDPOINTS.USER.UPDATE_PROFILE, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//       } else {
//         // ═══════════════════════════════════════════════════════════════
//         // WITHOUT PHOTO: Use JSON
//         // ═══════════════════════════════════════════════════════════════
//         const payload = createProfileUpdatePayload(userId, updates);

//         response = await apiClient.post(API_ENDPOINTS.USER.UPDATE_PROFILE, payload);
//       }

//       // ═════════════════════════════════════════════════════════════════
//       // Transform backend response to frontend format
//       // ═════════════════════════════════════════════════════════════════
//       return mapBackendResponseToFrontendUser(response.data);
//     } catch (error: any) {
//       // Extract error message from backend
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.response?.data?.detail ||
//         'Failed to update profile. Please try again.';

//       console.error('Profile update error:', error.response?.data || error.message);

//       throw new Error(errorMessage);
//     }
//   },
// };

// features/user/services/user.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import {
  createProfileUpdateFormData,
  createProfileUpdatePayload,
  mapBackendResponseToFrontendUser,
} from '../api/adapters/user.adapter';

export interface UpdateProfileParams {
  userId: string;
  updates: Partial<AuthSessionUser>;
  photoFile?: File;
}

export const userService = {
  /**
   * Update user profile.
   * With photo → FormData + multipart/form-data
   * Without photo → JSON
   * POST /update_profile
   */
  async updateProfile(params: UpdateProfileParams): Promise<Partial<AuthSessionUser>> {
    const { userId, updates, photoFile } = params;
    try {
      const response = photoFile
        ? await apiClient.post(
            API_ENDPOINTS.USER.UPDATE_PROFILE,
            createProfileUpdateFormData(userId, updates, photoFile),
          )
        : await apiClient.post(
            API_ENDPOINTS.USER.UPDATE_PROFILE,
            createProfileUpdatePayload(userId, updates),
          );

      return mapBackendResponseToFrontendUser(response.data);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to save your profile. Please check your information and try again.',
        'userService.updateProfile',
      );
    }
  },
};
