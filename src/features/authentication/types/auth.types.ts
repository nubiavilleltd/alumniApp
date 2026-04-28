// features/authentication/types/auth.types.ts
//
// NOTE: EmailVerificationFormValues no longer includes `userId`.
// userId is server-issued state — it belongs in the flow state object in
// RegisterForm, not in a form field. See RegisterForm.tsx for details.

import type { z } from 'zod';
import type {
  emailVerificationSchema,
  forgotPasswordSchema,
  loginSchema,
  registerDetailsSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../schemas/authSchema';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'closed' | 'deactivated';
// export type DuesStatus = 'paid' | 'owing' | 'exempt';
export type DuesStatus = 'paid' | 'owing' | 'overdue' | 'exempt' | 'unknown';

// ─── Privacy ──────────────────────────────────────────────────────────────────

export type FieldVisibility = 'public' | 'private';
// export type DuesStatus = 'paid' | 'owing' | 'overdue' | 'unknown';

export interface PrivacySettings {
  photo: FieldVisibility;
  whatsappPhone: FieldVisibility;
  alternativePhone: FieldVisibility;
  birthDate: FieldVisibility;
  residentialAddress: FieldVisibility;
  area: FieldVisibility;
  city: FieldVisibility;
  state: FieldVisibility;
  employmentStatus: FieldVisibility;
  occupations: FieldVisibility;
  industrySectors: FieldVisibility;
  yearsOfExperience: FieldVisibility;
}

export const defaultPrivacySettings: PrivacySettings = {
  photo: 'public',
  whatsappPhone: 'private',
  alternativePhone: 'private',
  birthDate: 'private',
  residentialAddress: 'private',
  area: 'public',
  city: 'public',
  state: 'public',
  employmentStatus: 'public',
  occupations: 'public',
  industrySectors: 'public',
  yearsOfExperience: 'public',
};

// ─── Logged-in session user ───────────────────────────────────────────────────

export interface AuthSessionUser {
  memberId: string;
  id: string;
  userCode: string;
  slug: string;
  avatarInitials: string;
  profileHref: string;
  createdAt: string;
  chapterId?: string;

  role: 'member' | 'admin';

  isEmailVerified: boolean;
  emailVerifiedAt?: string;

  approvalStatus: ApprovalStatus;
  approvedAt?: string;
  approvedBy?: string;

  accountStatus: AccountStatus;

  duesStatus: DuesStatus;
  duesLastPaidAt?: string;
  duesAmountOwing?: number;

  surname: string;
  otherNames: string;
  fullName: string;
  nameInSchool: string;
  nickName: string;
  email: string;
  whatsappPhone: string;
  graduationYear: number;

  photo?: string;
  alternativePhone?: string;
  birthDate?: string;
  bio: string;
  houseColor?: string;
  isClassCoordinator?: boolean;
  residentialAddress?: string;
  area?: string;
  city?: string;
  state?: string;
  employmentStatus?: string;
  occupations?: string[];
  industrySectors?: string[];
  yearsOfExperience?: number;
  isVolunteer?: boolean;

  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  country?: string;

  privacy?: PrivacySettings;

  position?: string;
  company?: string;
}

// ─── Form value types ─────────────────────────────────────────────────────────

export type LoginFormValues = z.input<typeof loginSchema>;
export type ForgotPasswordFormValues = z.input<typeof forgotPasswordSchema>;
export type RegisterDetailsFormValues = z.input<typeof registerDetailsSchema>;
export type ResetPasswordFormValues = z.input<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.input<typeof changePasswordSchema>;

// userId is intentionally absent — it is server state, not a form field.
// It lives in RegistrationFlowState inside RegisterForm.tsx.
export type EmailVerificationFormValues = z.input<typeof emailVerificationSchema>;

// ─── API payloads / responses ─────────────────────────────────────────────────

export interface AuthUserSummary {
  fullName: string;
  email: string;
  phoneNumber: string;
  graduationYear: number;
}

// export interface LoginResponse {
//   status: 'success';
//   message: string;
//   user: AuthSessionUser;
// }

// export interface LoginResponse {
//   user: { id: string; memberId: string; role: string };
//   accessToken: string;
//   refreshToken: string;
// }
export interface LoginResponse {
  user: AuthSessionUser;
  accessToken: string;
  refreshToken: string;
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
  userId: string; // Required — not optional. Backend must always return this.
  draft: AuthUserSummary;
}

export interface VerifyRegistrationRequest {
  email?: string;
  draft?: RegisterDetailsFormValues;
  code: string;
  userId: string; // Passed from flow state, not form state
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
export interface ResetPasswordResponse {
  status: 'success';
  message: string;
}

export interface CompleteRegistrationResponse {
  status: 'pending_admin_approval';
  message: string;
  draft: AuthUserSummary;
}

export interface Voucher {
  id: string;
  fullName: string;
  email: string;
  graduationYear: string;
  chapterId: string;
}
