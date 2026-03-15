import type { z } from 'zod';
import type {
  emailVerificationSchema,
  forgotPasswordSchema,
  loginSchema,
  registerDetailsSchema,
  resetPasswordSchema,
} from '../schemas/authSchema';
import type { ApprovalStatus, AccountStatus, DuesStatus } from '../constants/mockAccounts';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

// ─── Privacy ──────────────────────────────────────────────────────────────────
// Simple public/private per field.
// public  → visible to everyone including logged-out visitors
// private → visible only to the user themselves

export type FieldVisibility = 'public' | 'private';

export interface PrivacySettings {
  // private by default
  photo: FieldVisibility;
  whatsappPhone: FieldVisibility;
  alternativePhone: FieldVisibility;
  birthDate: FieldVisibility;
  residentialAddress: FieldVisibility;
  // public by default
  area: FieldVisibility;
  city: FieldVisibility;
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
  employmentStatus: 'public',
  occupations: 'public',
  industrySectors: 'public',
  yearsOfExperience: 'public',
};

// ─── Logged-in session user ───────────────────────────────────────────────────
export interface AuthSessionUser {
  // ── Identity ─────────────────────────────────────────────────────────────
  memberId: string; // 'MBR-{year}-{hex}' — primary relational key
  id: string; // legacy internal ref
  slug: string; // URL-only
  avatarInitials: string;
  profileHref: string;
  createdAt: string;
  chapterId?: string; // assigned by admin after approval

  // ── Auth ──────────────────────────────────────────────────────────────────
  role: 'member' | 'admin';

  // ── Verification ──────────────────────────────────────────────────────────
  isEmailVerified: boolean;
  emailVerifiedAt?: string;

  // ── Approval ──────────────────────────────────────────────────────────────
  approvalStatus: ApprovalStatus;
  approvedAt?: string;
  approvedBy?: string;

  // ── Account ───────────────────────────────────────────────────────────────
  accountStatus: AccountStatus;

  // ── Dues ──────────────────────────────────────────────────────────────────
  duesStatus: DuesStatus;
  duesLastPaidAt?: string;
  duesAmountOwing?: number;

  // ── Registration fields (always present) ─────────────────────────────────
  surname: string;
  otherNames: string;
  fullName: string; // derived: otherNames + surname
  nameInSchool: string;
  email: string;
  whatsappPhone: string;
  graduationYear: number;

  // ── Profile fields (optional, filled after registration) ─────────────────
  photo?: string;
  alternativePhone?: string;
  birthDate?: string;
  houseColor?: string;
  isClassCoordinator?: boolean;
  residentialAddress?: string;
  area?: string;
  city?: string;
  employmentStatus?: string;
  occupations?: string[];
  industrySectors?: string[];
  yearsOfExperience?: number;
  isVolunteer?: boolean;

  // ── Privacy ───────────────────────────────────────────────────────────────
  privacy?: PrivacySettings;
}

// ─── Form value types — derived from schemas ──────────────────────────────────
export type LoginFormValues = z.input<typeof loginSchema>;
export type ForgotPasswordFormValues = z.input<typeof forgotPasswordSchema>;
export type RegisterDetailsFormValues = z.input<typeof registerDetailsSchema>;
export type ResetPasswordFormValues = z.input<typeof resetPasswordSchema>;
export type EmailVerificationFormValues = z.input<typeof emailVerificationSchema>;

// ─── API payloads / responses ─────────────────────────────────────────────────
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
