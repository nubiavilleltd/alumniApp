import type { SupportedPhoneCountry } from '../constants/phoneCountries';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

export interface AuthSessionUser {
  id: string;
  fullName: string;
  email: string;
  avatarInitials: string;
  profileHref: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface RegisterDetailsFormValues {
  fullName: string;
  email: string;
  phoneCountry: SupportedPhoneCountry;
  phoneNumber: string;
  graduationYear: number;
  password: string;
  confirmPassword: string;
}

export interface EmailVerificationFormValues {
  code: string;
}

export interface AuthUserSummary {
  fullName: string;
  email: string;
  phoneNumber: string;
  graduationYear: number;
}

export interface LoginResponse {
  status: 'success';
  message: string;
  user: AuthSessionUser;
}

export interface ForgotPasswordResponse {
  status: 'email_sent';
  message: string;
  email: string;
  expiresInMinutes: number;
  resetLink?: string;
}

export interface StartRegistrationResponse {
  status: 'verification_required';
  message: string;
  expiresInMinutes: number;
  draft: AuthUserSummary;
}

export interface VerifyRegistrationRequest {
  draft: RegisterDetailsFormValues;
  code: string;
}

export interface ResetPasswordRequest {
  token: string;
  email?: string;
  password: string;
}

export interface CompleteRegistrationResponse {
  status: 'pending_admin_approval';
  message: string;
  draft: AuthUserSummary;
}

export interface ResetPasswordResponse {
  status: 'success';
  message: string;
  email?: string;
}
