// import type { z } from 'zod';
// import type { SupportedPhoneCountry } from '../constants/phoneCountries';
// import type {
//   emailVerificationSchema,
//   forgotPasswordSchema,
//   loginSchema,
//   registerDetailsSchema,
//   resetPasswordSchema,
// } from '../schemas/authSchema';

// export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

// // ─── Privacy visibility flag ──────────────────────────────────────────────────
// export type FieldVisibility = 'public' | 'members' | 'private';

// export interface PrivacySettings {
//   birthDate: FieldVisibility;
//   address: FieldVisibility;
//   alternativePhone: FieldVisibility;
//   whatsappPhone: FieldVisibility;
//   occupation: FieldVisibility;
//   industrySector: FieldVisibility;
//   yearsOfExperience: FieldVisibility;
// }

// // ─── Logged-in session user ───────────────────────────────────────────────────
// export interface AuthSessionUser {
//   // System
//   id: string;
//   slug: string;
//   avatarInitials: string;
//   profileHref: string;
//   createdAt: string;

//   // Registration fields
//   surname: string;
//   otherNames: string;
//   fullName: string; // derived: otherNames + surname
//   nameInSchool: string; // First Name + Surname as used in FGGC
//   email: string;
//   whatsappPhone: string;
//   graduationYear: number;

//   // Profile fields (filled after registration)
//   photo?: string;
//   alternativePhone?: string;
//   birthDate?: string;
//   houseColor?: string;
//   isClassCoordinator?: boolean;
//   residentialAddress?: string;
//   area?: string;
//   city?: string;
//   employmentStatus?: string;
//   occupations?: string[];
//   industrySectors?: string[];
//   yearsOfExperience?: number;
//   isVolunteer?: boolean;

//   // Privacy
//   privacy?: PrivacySettings;

//   // Role
//   role: 'member' | 'admin';
// }

// // ─── Form value types — derived from schemas ──────────────────────────────────
// // Using z.input<> (not z.infer<>) so the types match what react-hook-form
// // sees before Zod transforms/defaults are applied. This prevents resolver
// // type mismatches (e.g. rememberMe: boolean vs boolean | undefined).

// export type LoginFormValues = z.input<typeof loginSchema>;
// export type ForgotPasswordFormValues = z.input<typeof forgotPasswordSchema>;
// export type RegisterDetailsFormValues = z.input<typeof registerDetailsSchema>;
// export type ResetPasswordFormValues = z.input<typeof resetPasswordSchema>;
// export type EmailVerificationFormValues = z.input<typeof emailVerificationSchema>;

// // Keep SupportedPhoneCountry available for consumers of RegisterDetailsFormValues
// export type { SupportedPhoneCountry };

// // ─── API payloads / responses ─────────────────────────────────────────────────
// export interface AuthUserSummary {
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   graduationYear: number;
// }

// export interface LoginResponse {
//   status: 'success';
//   message: string;
//   user: AuthSessionUser;
// }

// export interface ForgotPasswordResponse {
//   status: 'email_sent';
//   message: string;
//   email: string;
//   expiresInMinutes: number;
//   resetLink?: string;
// }

// export interface StartRegistrationResponse {
//   status: 'verification_required';
//   message: string;
//   expiresInMinutes: number;
//   draft: AuthUserSummary;
// }

// export interface VerifyRegistrationRequest {
//   draft: RegisterDetailsFormValues;
//   code: string;
// }

// export interface ResetPasswordRequest {
//   token: string;
//   email?: string;
//   password: string;
// }

// export interface CompleteRegistrationResponse {
//   status: 'pending_admin_approval';
//   message: string;
//   draft: AuthUserSummary;
// }

// export interface ResetPasswordResponse {
//   status: 'success';
//   message: string;
//   email?: string;
// }





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
export type FieldVisibility = 'public' | 'members' | 'private';

export interface PrivacySettings {
  birthDate:         FieldVisibility;
  address:           FieldVisibility;
  alternativePhone:  FieldVisibility;
  whatsappPhone:     FieldVisibility;
  occupation:        FieldVisibility;
  industrySector:    FieldVisibility;
  yearsOfExperience: FieldVisibility;
}

// ─── Logged-in session user ───────────────────────────────────────────────────
export interface AuthSessionUser {
  // ── Identity ─────────────────────────────────────────────────────────────
  memberId:        string;   // 'MBR-{year}-{hex}' — primary relational key
  id:              string;   // legacy internal ref
  slug:            string;   // URL-only
  avatarInitials:  string;
  profileHref:     string;
  createdAt:       string;
  chapterId?:      string;   // assigned by admin after approval

  // ── Auth ──────────────────────────────────────────────────────────────────
  role: 'member' | 'admin';

  // ── Verification ──────────────────────────────────────────────────────────
  isEmailVerified:  boolean;
  emailVerifiedAt?: string;

  // ── Approval ──────────────────────────────────────────────────────────────
  approvalStatus: ApprovalStatus;
  approvedAt?:    string;
  approvedBy?:    string;

  // ── Account ───────────────────────────────────────────────────────────────
  accountStatus: AccountStatus;

  // ── Dues ──────────────────────────────────────────────────────────────────
  duesStatus:       DuesStatus;
  duesLastPaidAt?:  string;
  duesAmountOwing?: number;

  // ── Registration fields (always present) ─────────────────────────────────
  surname:        string;
  otherNames:     string;
  fullName:       string;       // derived: otherNames + surname
  nameInSchool:   string;
  email:          string;
  whatsappPhone:  string;
  graduationYear: number;

  // ── Profile fields (optional, filled after registration) ─────────────────
  photo?:               string;
  alternativePhone?:    string;
  birthDate?:           string;
  houseColor?:          string;
  isClassCoordinator?:  boolean;
  residentialAddress?:  string;
  area?:                string;
  city?:                string;
  employmentStatus?:    string;
  occupations?:         string[];
  industrySectors?:     string[];
  yearsOfExperience?:   number;
  isVolunteer?:         boolean;

  // ── Privacy ───────────────────────────────────────────────────────────────
  privacy?: PrivacySettings;
}

// ─── Form value types — derived from schemas ──────────────────────────────────
export type LoginFormValues             = z.input<typeof loginSchema>;
export type ForgotPasswordFormValues    = z.input<typeof forgotPasswordSchema>;
export type RegisterDetailsFormValues   = z.input<typeof registerDetailsSchema>;
export type ResetPasswordFormValues     = z.input<typeof resetPasswordSchema>;
export type EmailVerificationFormValues = z.input<typeof emailVerificationSchema>;

// ─── API payloads / responses ─────────────────────────────────────────────────
export interface AuthUserSummary {
  fullName:       string;
  email:          string;
  phoneNumber:    string;
  graduationYear: number;
}

export interface LoginResponse {
  status:  'success';
  message: string;
  user:    AuthSessionUser;
}

export interface ForgotPasswordResponse {
  status:           'email_sent';
  message:          string;
  email:            string;
  expiresInMinutes: number;
  resetLink?:       string;
}

export interface StartRegistrationResponse {
  status:           'verification_required';
  message:          string;
  expiresInMinutes: number;
  draft:            AuthUserSummary;
}

export interface VerifyRegistrationRequest {
  draft: RegisterDetailsFormValues;
  code:  string;
}

export interface ResetPasswordRequest {
  token:     string;
  email?:    string;
  password:  string;
}

export interface CompleteRegistrationResponse {
  status:  'pending_admin_approval';
  message: string;
  draft:   AuthUserSummary;
}

export interface ResetPasswordResponse {
  status:  'success';
  message: string;
  email?:  string;
}
