

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
  async login(values: LoginFormValues): Promise<LoginResponse> {
    await wait();
    const account = authenticateMockAccount(values.email, values.password);
    if (!account) {
      throw new Error('Invalid email or password');
    }
    return {
      status: 'success',
      message: `Login request validated. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.LOGIN} when the API is available.`,
      user: toAuthSessionUser(account),
    };
  },

  async requestPasswordReset(values: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> {
    await wait();
    const account = findMockAccountByEmail(values.email);
    const token = `reset-${Math.random().toString(36).slice(2, 12)}`;
    const resetLink = account
      ? `/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(values.email)}`
      : undefined;
    return {
      status: 'email_sent',
      message: `If an account exists for ${values.email}, a password reset email has been simulated. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.FORGOT_PASSWORD} when the API is available.`,
      email: values.email,
      expiresInMinutes: 30,
      resetLink,
    };
  },

  async startRegistration(values: RegisterDetailsFormValues): Promise<StartRegistrationResponse> {
    await wait();
    return {
      status: 'verification_required',
      message: `A verification step is ready for ${values.email}. Replace this mock with a POST to ${API_ENDPOINTS.AUTH.REGISTER} or a dedicated verification-start endpoint later.`,
      expiresInMinutes: 10,
      draft: toUserSummary(values),
    };
  },

  async verifyRegistrationEmail(
    values: VerifyRegistrationRequest,
  ): Promise<CompleteRegistrationResponse> {
    await wait();
    return {
      status: 'pending_admin_approval',
      message:
        'Email verification completed. The account is now waiting for admin approval before sign-in is enabled.',
      draft: toUserSummary(values.draft),
    };
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
