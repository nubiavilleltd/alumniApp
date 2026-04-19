import { mapBackendPrivacyToFrontend } from '@/features/user/api/adapters/privacy.adapter';

import {
  type LoginFormValues,
  type AuthSessionUser,
  defaultPrivacySettings,
  LoginResponse,
} from '../../types/auth.types';
import { generateSlug, safeParseInt, stringToBoolean } from '@/lib/utils/adapters';

export type DuesStatus = 'paid' | 'owing' | 'overdue' | 'exempt' | 'unknown';

export function mapLoginPayload(values: LoginFormValues) {
  return {
    identity: values.email,
    password: values.password,
  };
}

export function mapLoginResponse(res: any): LoginResponse {
  return {
    accessToken: res.access_token || '',
    refreshToken: res.refresh_token || '',

    user: {
      id: String(res.user_id ?? ''),
      memberId: String(res.user_id ?? ''),
      role: res.user_role === 'admin' ? 'admin' : 'member',
    },
  };
}

export function mapCurrentUserResponse(res: any): AuthSessionUser {
  const firstName = res.first_name || '';
  const lastName = res.last_name || '';
  const fullName = res.fullname || `${firstName} ${lastName}`.trim();

  const slug = generateSlug(res.email?.split('@')[0] || '', res.user_id, 'user');

  const DEFAULT_AVATAR = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${firstName} ${lastName}`,
  )}&background=E5E7EB&color=6B7280&size=256`;

  return {
    id: String(res.user_id ?? ''),
    memberId: String(res.user_id ?? ''),
    userCode: res.user_code || undefined,
    slug,
    avatarInitials:
      [firstName[0], lastName[0]].filter(Boolean).join('').toUpperCase() ||
      res.email?.[0]?.toUpperCase() ||
      '?',
    profileHref: `/alumni/profiles/${res.user_id}`,
    createdAt: new Date().toISOString(),

    chapterId: res.chapter_id ? String(res.chapter_id) : undefined,
    role: res.user_role === 'admin' ? 'admin' : 'member',
    isEmailVerified: stringToBoolean(res.email_verified) ?? false,
    approvalStatus: res.is_approved ? 'approved' : 'pending',
    accountStatus: res.active ? 'active' : 'deactivated',
    duesStatus: mapBackendDues(res.dues_status),
    fullName: res.fullname || fullName,
    surname: lastName,
    otherNames: firstName,
    nameInSchool: res.name_in_school || '',
    nickName: res.nick_name || '',
    email: res.email || '',
    whatsappPhone: res.phone || '',
    alternativePhone: res.alternative_phone || undefined,
    birthDate: res.birth_date || undefined,

    graduationYear: safeParseInt(res.graduation_year) ?? 0,
    houseColor: res.house_color || undefined,

    photo: res.avatar && !res.avatar.includes('default.png') ? res.avatar : DEFAULT_AVATAR,

    bio: res.bio || '',
    residentialAddress: res.residential_address || undefined,
    area: res.area || undefined,
    city: res.profile?.city || res.city || undefined,
    state: res.state || res.state || undefined,

    employmentStatus: res.employment_status || undefined,
    occupations: res.occupation ? [res.occupation] : undefined,
    industrySectors: res.industry_sector ? [res.industry_sector] : undefined,
    yearsOfExperience: safeParseInt(res.years_of_experience),

    isClassCoordinator: stringToBoolean(res.is_coordinator),
    isVolunteer: stringToBoolean(res.is_volunteer),

    company: res.profile?.current_company || undefined,
    position: res.profile?.current_position || undefined,
    linkedin: res.profile?.linkedin || undefined,
    twitter: res.profile?.twitter || undefined,
    instagram: res.profile?.instagram || undefined,
    facebook: res.profile?.facebook || undefined,
    website: res.profile?.website || undefined,
    country: res.profile?.country || undefined,

    // ✅ Always include privacy with defaults
    privacy: mapBackendPrivacyToFrontend(res.profile),
  };
}

export function mapLoginError(error: any): string {
  const status = error.response?.status;
  const msg =
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;

  switch (status) {
    case 400:
      return 'Incorrect password.';
    case 401:
      return 'Authentication failed.';
    case 403:
      return 'EMAIL_NOT_VERIFIED';
    case 404:
      return 'No account found.';
    case 406:
      return 'AWAITING_APPROVAL';
    case 422:
      return 'Invalid email.';
    case 423:
      return 'ACCOUNT_DEACTIVATED';
    default:
      return msg || 'Login failed.';
  }
}

function mapBackendDues(v: any): DuesStatus {
  return ['paid', 'owing', 'overdue'].includes(v) ? v : 'unknown';
}
