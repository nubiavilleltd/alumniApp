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
  Voucher,
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
import {
  mapResetPasswordError,
  mapResetPasswordPayload,
} from '../api/adapters/resetpassword.adapter';
import {
  mapChangePasswordError,
  mapChangePasswordPayload,
} from '../../user/api/adapters/changepassword.adapter';
import {
  mapBackendVoucherList,
  mapBackendVoucherToFrontend,
} from '../api/adapters/voucher.adapter';
import { extractList } from '@/lib/utils/adapters';
import { useTokenStore } from '../stores/useTokenStore';

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
      throw handleApiError(error, mapLoginError(error), 'authApi.login');
    }
  },

  /** POST /logout */
  async logout(): Promise<void> {
    try {
      const { refreshToken } = useTokenStore.getState();
      await apiClient.post(
        API_ENDPOINTS.AUTH.LOGOUT,
        refreshToken ? { refresh_token: refreshToken } : {},
      );
    } catch (error) {
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

  /** POST /register — step 1 */
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

  /** POST /verify_email — step 2 */
  async verifyRegistrationEmail(
    values: VerifyRegistrationRequest,
  ): Promise<CompleteRegistrationResponse> {
    try {
      const email = values.email ?? values.draft?.email;
      if (!email) {
        throw new Error('Missing verification email.');
      }

      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        mapVerificationPayload(email, values.code, values.userId),
      );
      if (response.data?.status === 400 || response.data?.status === 'error') {
        throw new Error(response.data.message || 'Invalid verification code');
      }
      return mapVerificationResponse(response.data);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Verification failed. Please check the code and try again.';
      throw new Error(msg);
    }
  },

  /** POST /resend_verify_email */
  async resendVerificationEmail(values: { email: string; userId: string }): Promise<string> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFY_EMAIL, {
        email: values.email,
        user_id: values.userId,
      });

      return data?.message ?? 'A new verification code has been sent to your email.';
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Could not resend the verification code right now.';
      throw new Error(msg);
    }
  },

  /** POST /api/reset_password */
  async resetPassword(values: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      const payload = mapResetPasswordPayload({
        code: values.token,
        password: values.password,
        confirmPassword: values.confirmPassword ?? values.password,
      });
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
      return { status: 'success', message: data?.message ?? 'Password reset successfully.' };
    } catch (error) {
      throw handleApiError(error, mapResetPasswordError(error), 'authApi.resetPassword');
    }
  },

  /**
   * Fetch the raw backend user profile response.
   * Used by LoginForm at login time to build the full AuthSessionUser
   * that gets stored in localStorage — avoids post-login nav flicker.
   * Returns the raw API data object (not yet mapped to AuthSessionUser).
   */
  async getCurrentUserRaw(userId: string): Promise<unknown> {
    const { data } = await apiClient.post(API_ENDPOINTS.USER.GET_USER_PROFILE, {
      user_id: userId,
    });
    return data;
  },

  /**
   * Fetch and map the current user's profile to AuthSessionUser.
   * Used by useCurrentUser() hook for background refresh and AdminRoute check.
   */
  async getCurrentUser(userId: string): Promise<AuthSessionUser> {
    try {
      const data = await authApi.getCurrentUserRaw(userId);

      console.log('RAW DATA', { data }, { mappedData: mapCurrentUserResponse(data) });
      return mapCurrentUserResponse(data);
    } catch (error) {
      throw handleApiError(error, 'Unable to fetch user profile', 'authApi.getCurrentUser');
    }
  },

  /** GET /api/get_vouchers - fetch all vouchers */
  async getVouchers(): Promise<Voucher[]> {
    try {
      // Use GET request - the apiClient will automatically add the token
      const { data } = await apiClient.post(API_ENDPOINTS.AUTH.GET_VOUCHERS);

      const vouchers = extractList(data, ['vouchers', 'data']);

      return mapBackendVoucherList(vouchers);
    } catch (error) {
      console.error('Failed to fetch vouchers:', error);
      // Don't throw - just return empty array so form still works
      return [];
    }
  },
};
