// features/authentication/services/auth.service.ts

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import { formatPhoneNumberWithCountryCode } from '../constants/phoneCountries';
import type {
  AuthSessionUser,
  AuthUserSummary,
  CompleteRegistrationResponse,
  ForgotPasswordFormValues,
  ForgotPasswordResponse,
  LoginFormValues,
  LoginResponse,
  RegisterDetailsFormValues,
  ResetPasswordRequest,
  ResetPasswordResponse,
  StartRegistrationResponse,
  VerifyRegistrationRequest,
} from '../types/auth.types';
import {
  mapRegistrationPayload,
  mapRegistrationResponse,
  mapVerificationPayload,
  mapVerificationResponse,
} from '../api/adapters/register.adapter';
import {
  mapCurrentUserResponse,
  mapLoginError,
  mapLoginPayload,
  mapLoginResponse,
} from '../api/adapters/login.adapter';
import {
  mapForgotPasswordError,
  mapForgotPasswordPayload,
  mapForgotPasswordResponse,
} from '../api/adapters/forgotpassword.adapter';

function toUserSummary(values: RegisterDetailsFormValues): AuthUserSummary {
  return {
    fullName: `${values.otherNames} ${values.surname}`.trim(),
    email: values.email,
    phoneNumber: formatPhoneNumberWithCountryCode(values.phoneCountry, values.whatsappPhone),
    graduationYear: Number(values.graduationYear),
  };
}

export const authApi = {
  /** POST /login */
  async login(values: LoginFormValues): Promise<LoginResponse> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, mapLoginPayload(values));
      return mapLoginResponse(data);
    } catch (error) {
      // Login uses a custom error mapper for specific messages (wrong password, etc.)
      throw handleApiError(error, mapLoginError(error), 'authApi.login');
    }
  },

  /** POST /logout */
  async logout(userId: string): Promise<void> {
    try {
      await apiClient.post('/logout', { user_id: userId });
    } catch (error) {
      // Don't throw — always clear the local session regardless of server response
      if (import.meta.env.DEV) console.warn('[authApi.logout]', error);
    }
  },

  /** POST /forgot_password */
  async requestPasswordReset(values: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> {
    try {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        mapForgotPasswordPayload(values),
      );
      return mapForgotPasswordResponse(data);
    } catch (error) {
      throw handleApiError(error, mapForgotPasswordError(error), 'authApi.requestPasswordReset');
    }
  },

  /** POST /register — step 1: submit details, receive OTP */
  async startRegistration(values: RegisterDetailsFormValues): Promise<StartRegistrationResponse> {
    try {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER,
        mapRegistrationPayload(values),
      );
      return mapRegistrationResponse(data);
    } catch (error) {
      throw handleApiError(
        error,
        'Registration failed. Please check your details and try again.',
        'authApi.startRegistration',
      );
    }
  },

  /** POST /verify_email — step 2: verify OTP */
  async verifyRegistrationEmail(
    values: VerifyRegistrationRequest,
  ): Promise<CompleteRegistrationResponse> {
    try {
      const { data } = await apiClient.post(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        mapVerificationPayload(values.draft.email, values.code, values.userId),
      );
      return mapVerificationResponse(data);
    } catch (error) {
      throw handleApiError(
        error,
        'Verification failed. Please check the code and try again.',
        'authApi.verifyRegistrationEmail',
      );
    }
  },

  /** Password reset — still mocked; backend endpoint not yet available */
  async resetPassword(values: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const updatedAccount = values.email
      ? updateMockAccountPassword(values.email, values.password)
      : null;
    if (!updatedAccount) throw new Error('Password reset failed for this account');
    return {
      status: 'success',
      message: 'Password reset successfully.',
      email: updatedAccount.email,
    };
  },

  /**
   * GET /api/me - Get current user's profile
   *
   * Call this to get real-time user data instead of
   * reading stale data from Zustand store
   */

  async getCurrentUser(userId: string): Promise<AuthSessionUser> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.USER.GET_USER_PROFILE, {
        user_id: userId,
      });

      console.log('res res', { data });

      return mapCurrentUserResponse(data);
    } catch (error) {
      throw handleApiError(error, 'Unable to fetch user profile', 'authApi.getCurrentUser');
    }
  },
};
