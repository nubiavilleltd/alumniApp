// import type { SupportedPhoneCountry } from '../constants/phoneCountries';

// export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

// export interface AuthSessionUser {
//   id: string;
//   fullName: string;
//   email: string;
//   avatarInitials: string;
//   profileHref: string;
//   photo: string;
// }

// export interface LoginFormValues {
//   email: string;
//   password: string;
//   rememberMe: boolean;
// }

// export interface ForgotPasswordFormValues {
//   email: string;
// }

// export interface ResetPasswordFormValues {
//   password: string;
//   confirmPassword: string;
// }

// export interface RegisterDetailsFormValues {
//   fullName: string;
//   email: string;
//   phoneCountry: SupportedPhoneCountry;
//   phoneNumber: string;
//   graduationYear: number;
//   password: string;
//   confirmPassword: string;
// }

// export interface EmailVerificationFormValues {
//   code: string;
// }

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






import type { SupportedPhoneCountry } from '../constants/phoneCountries';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

// ─── Privacy visibility flag ──────────────────────────────────────────────────
export type FieldVisibility = 'public' | 'members' | 'private';

export interface PrivacySettings {
  birthDate: FieldVisibility;
  address: FieldVisibility;
  alternativePhone: FieldVisibility;
  whatsappPhone: FieldVisibility;
  occupation: FieldVisibility;
  industrySector: FieldVisibility;
  yearsOfExperience: FieldVisibility;
}

// ─── Logged-in session user ───────────────────────────────────────────────────
export interface AuthSessionUser {
  // System
  id: string;
  slug: string;
  avatarInitials: string;
  profileHref: string;
  createdAt: string;

  // Registration fields
  surname: string;
  otherNames: string;
  fullName: string;          // derived: otherNames + surname
  nameInSchool: string;      // First Name + Surname as used in FGGC
  email: string;
  whatsappPhone: string;
  graduationYear: number;

  // Profile fields (filled after registration)
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

  // Privacy
  privacy?: PrivacySettings;

  // Role
  role: 'member' | 'admin';
}

// ─── Registration form ────────────────────────────────────────────────────────
export interface RegisterDetailsFormValues {
  surname: string;
  otherNames: string;
  nameInSchool: string;
  email: string;
  phoneCountry: SupportedPhoneCountry;
  whatsappPhone: string;
  graduationYear: number;
  password: string;
  confirmPassword: string;
}

// ─── Auth form values ─────────────────────────────────────────────────────────
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

export interface EmailVerificationFormValues {
  code: string;
}

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
