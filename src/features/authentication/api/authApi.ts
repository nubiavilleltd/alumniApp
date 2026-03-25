// import { API_ENDPOINTS } from '@/lib/api/endpoints';
// import { formatPhoneNumberWithCountryCode } from '../constants/phoneCountries';
// import {
//   authenticateMockAccount,
//   findMockAccountByEmail,
//   toAuthSessionUser,
//   updateMockAccountPassword,
// } from '../lib/mockAuth';
// import type {
//   AuthUserSummary,
//   CompleteRegistrationResponse,
//   ForgotPasswordFormValues,
//   ForgotPasswordResponse,
//   LoginFormValues,
//   LoginResponse,
//   RegisterDetailsFormValues,
//   ResetPasswordRequest,
//   ResetPasswordResponse,
//   StartRegistrationResponse,
//   VerifyRegistrationRequest,
// } from '../types/auth.types';

// const MOCK_DELAY_MS = 900;

// function wait(duration = MOCK_DELAY_MS): Promise<void> {
//   return new Promise((resolve) => {
//     window.setTimeout(resolve, duration);
//   });
// }

// function toUserSummary(values: RegisterDetailsFormValues): AuthUserSummary {
//   return {
//     fullName: `${values.otherNames} ${values.surname}`.trim(),
//     email: values.email,
//     phoneNumber: formatPhoneNumberWithCountryCode(values.phoneCountry, values.whatsappPhone),
//     graduationYear: Number(values.graduationYear),
//   };
// }

// export const authApi = {
//   async login(values: LoginFormValues): Promise<LoginResponse> {
//     await wait();
//     const account = authenticateMockAccount(values.email, values.password);
//     console.log('account', { account });
//     if (!account) {
//       throw new Error('Invalid email or password');
//     }
//     return {
//       status: 'success',
//       message: `Login request validated. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.LOGIN} when the API is available.`,
//       user: toAuthSessionUser(account),
//     };
//   },

//   async requestPasswordReset(values: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> {
//     await wait();
//     const account = findMockAccountByEmail(values.email);
//     const token = `reset-${Math.random().toString(36).slice(2, 12)}`;
//     const resetLink = account
//       ? `/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(values.email)}`
//       : undefined;
//     return {
//       status: 'email_sent',
//       message: `If an account exists for ${values.email}, a password reset email has been simulated. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.FORGOT_PASSWORD} when the API is available.`,
//       email: values.email,
//       expiresInMinutes: 30,
//       resetLink,
//     };
//   },

//   async startRegistration(values: RegisterDetailsFormValues): Promise<StartRegistrationResponse> {
//     await wait();
//     return {
//       status: 'verification_required',
//       message: `A verification step is ready for ${values.email}. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.REGISTER} or a dedicated verification-start endpoint later.`,
//       expiresInMinutes: 10,
//       draft: toUserSummary(values),
//     };
//   },

//   async verifyRegistrationEmail(
//     values: VerifyRegistrationRequest,
//   ): Promise<CompleteRegistrationResponse> {
//     await wait();
//     return {
//       status: 'pending_admin_approval',
//       message:
//         'Email verification completed. The account is now waiting for admin approval before sign-in is enabled.',
//       draft: toUserSummary(values.draft),
//     };
//   },

//   async resetPassword(values: ResetPasswordRequest): Promise<ResetPasswordResponse> {
//     await wait();
//     const updatedAccount = values.email
//       ? updateMockAccountPassword(values.email, values.password)
//       : null;
//     if (!updatedAccount) {
//       throw new Error('Password reset failed for this account');
//     }
//     return {
//       status: 'success',
//       message: `Password reset validated for ${updatedAccount.email}. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.RESET_PASSWORD} when the API is available.`,
//       email: updatedAccount.email,
//     };
//   },
// };

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { formatPhoneNumberWithCountryCode } from '../constants/phoneCountries';
import {
  authenticateMockAccount,
  findMockAccountByEmail,
  toAuthSessionUser,
  updateMockAccountPassword,
} from '../lib/mockAuth';
import type {
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
import { mapLoginError, mapLoginPayload, mapLoginResponse } from './adapters/login.adapter';
import { mapForgotPasswordError, mapForgotPasswordPayload, mapForgotPasswordResponse } from './adapters/forgotpassword.adapter';

const MOCK_DELAY_MS = 900;

function wait(duration = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function toUserSummary(values: RegisterDetailsFormValues): AuthUserSummary {
  return {
    fullName: `${values.otherNames} ${values.surname}`.trim(),
    email: values.email,
    phoneNumber: formatPhoneNumberWithCountryCode(values.phoneCountry, values.whatsappPhone),
    graduationYear: Number(values.graduationYear),
  };
}

export const authApi = {
  // async login(values: LoginFormValues): Promise<LoginResponse> {
  //   await wait();
  //   const account = authenticateMockAccount(values.email, values.password);
  //   console.log('account', { account });
  //   if (!account) {
  //     throw new Error('Invalid email or password');
  //   }
  //   return {
  //     status: 'success',
  //     message: `Login request validated. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.LOGIN} when the API is available.`,
  //     user: toAuthSessionUser(account),
  //   };
  // },

  /**
   * AUTHENTICATION: Login with email and password
   *
   * Real Backend Integration
   *
   * Endpoint: POST /login
   * - Sends identity (email) and password to backend
   * - Returns tokens + full user profile on success
   * - Throws mapped error messages for all known error codes
   */
  async login(values: LoginFormValues): Promise<LoginResponse> {
    try {
      const payload = mapLoginPayload(values);
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
      return mapLoginResponse(response.data);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(mapLoginError(error));
    }
  },

  // async requestPasswordReset(values: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> {
  //   await wait();
  //   const account = findMockAccountByEmail(values.email);
  //   const token = `reset-${Math.random().toString(36).slice(2, 12)}`;
  //   const resetLink = account
  //     ? `/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(values.email)}`
  //     : undefined;
  //   return {
  //     status: 'email_sent',
  //     message: `If an account exists for ${values.email}, a password reset email has been simulated. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.FORGOT_PASSWORD} when the API is available.`,
  //     email: values.email,
  //     expiresInMinutes: 30,
  //     resetLink,
  //   };
  // },




/**
   * FORGOT PASSWORD: Request a password reset email
   *
   * Real Backend Integration
   *
   * Endpoint: POST /auth/forgot-password
   * - Sends email to backend
   * - Backend emails reset instructions to the user
   * - Returns confirmation on success
   */
  async requestPasswordReset(values: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> {
    try {
      const payload = mapForgotPasswordPayload(values);
      console.log("payload => ", {payload})
      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
      return mapForgotPasswordResponse(response.data);
    } catch (error: any) {
      console.error('Forgot password error:', error.response?.data || error.message);
      throw new Error(mapForgotPasswordError(error));
    }
  },



  /**
   * REGISTRATION STEP 1: Submit registration details
   *
   * Real Backend Integration
   *
   * Endpoint: POST /auth/register
   * - Sends registration data to backend
   * - Backend sends 6-digit verification code to user's email
   * - Returns verification status and expiry time
   */
  async startRegistration(values: RegisterDetailsFormValues): Promise<StartRegistrationResponse> {
    try {
      // Map frontend form data to backend payload format
      const payload = mapRegistrationPayload(values);

      // Call real backend API
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);

      // Map backend response to frontend format
      return mapRegistrationResponse(response.data);
    } catch (error: any) {
      // Extract error message from backend response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Registration failed. Please try again.';

      // Log full error for debugging
      console.error('Registration error:', error.response?.data || error.message);

      throw new Error(errorMessage);
    }
  },

  /**
   * REGISTRATION STEP 2: Verify email with 6-digit code
   *
   * Real Backend Integration
   *
   * Endpoint: POST /auth/verify-email
   * - Sends email and verification code to backend
   * - Backend verifies code and creates account
   * - Account status: "pending_admin_approval"
   * - User cannot login until admin approves
   */
  async verifyRegistrationEmail(
    values: VerifyRegistrationRequest,
  ): Promise<CompleteRegistrationResponse> {
    try {
      // Map to backend format
      const payload = mapVerificationPayload(values.draft.email, values.code, values.userId);

      // Call real backend API
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);

      // Map backend response to frontend format
      return mapVerificationResponse(response.data);
    } catch (error: any) {
      // Extract error message from backend response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Verification failed. Please check the code and try again.';

      // Log full error for debugging
      console.error('Verification error:', error.response?.data || error.message);

      throw new Error(errorMessage);
    }
  },

  async resetPassword(values: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    await wait();
    const updatedAccount = values.email
      ? updateMockAccountPassword(values.email, values.password)
      : null;
    if (!updatedAccount) {
      throw new Error('Password reset failed for this account');
    }
    return {
      status: 'success',
      message: `Password reset validated for ${updatedAccount.email}. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.RESET_PASSWORD} when the API is available.`,
      email: updatedAccount.email,
    };
  },
};
