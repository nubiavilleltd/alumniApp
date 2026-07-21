// features/user/services/user.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import {
  createProfileUpdateFormData,
  createProfileUpdatePayload,
  createSocialOnboardingUpdatePayload,
  mapBackendResponseToFrontendUser,
} from '../api/adapters/user.adapter';
import { ChangePasswordRequest } from '../types/user.type';
import {
  mapChangePasswordError,
  mapChangePasswordPayload,
} from '../api/adapters/changepassword.adapter';

export interface UpdateProfileParams {
  userId: string;
  updates: Partial<AuthSessionUser>;
  photoFile?: File;
}

export interface CompleteSocialOnboardingParams {
  userId: string;
  updates: Partial<AuthSessionUser>;
  extraFields?: Record<string, unknown>;
  accessToken?: string;
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

      const mappedUser = mapBackendResponseToFrontendUser(response.data);

      return mappedUser;
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to save your profile. Please check your information and try again.',
        'userService.updateProfile',
      );
    }
  },

  async completeSocialOnboarding(
    params: CompleteSocialOnboardingParams,
  ): Promise<Partial<AuthSessionUser>> {
    const { userId, updates, extraFields, accessToken } = params;

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.USER.UPDATE_PROFILE,
        createSocialOnboardingUpdatePayload(userId, updates, extraFields),
        {
          _skipAuthRedirect: true,
          headers: accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
              }
            : undefined,
        } as any,
      );

      return mapBackendResponseToFrontendUser(response.data);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to complete your profile. Please check your information and try again.',
        'userService.completeSocialOnboarding',
      );
    }
  },

  /**
   * POST /api/change_user_password
   *
   * Called from the authenticated settings page.
   * Payload: { old_password, new_password, confirm_password }
   */
  async changePassword(values: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, mapChangePasswordPayload(values));
    } catch (error) {
      throw handleApiError(error, mapChangePasswordError(error), 'authApi.changePassword');
    }
  },
};
