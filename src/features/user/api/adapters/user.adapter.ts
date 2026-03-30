import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import { safeParseInt, stringToBoolean } from '@/lib/utils/adapters';

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEND → BACKEND
// ─────────────────────────────────────────────────────────────────────────────

export function mapFrontendUserToBackendPayload(user: Partial<AuthSessionUser>) {
  return {
    // Core
    first_name: user.otherNames,
    last_name: user.surname,
    email: user.email,
    phone: user.whatsappPhone,
    alternative_phone: user.alternativePhone || '',

    // School
    name_in_school: user.nameInSchool,
    graduation_year: user.graduationYear ? String(user.graduationYear) : '',
    house_color: user.houseColor || '',
    department: '',

    // Personal
    birth_date: user.birthDate || '',

    // Location
    residential_address: user.residentialAddress || '',
    area: user.area || '',
    city: user.city || '',

    // Professional
    employment_status: user.employmentStatus || '',
    occupation: user.occupations?.[0] || '',
    industry_sector: user.industrySectors?.[0] || '',
    years_of_experience: user.yearsOfExperience ? String(user.yearsOfExperience) : '',

    // Flags
    is_coordinator: user.isClassCoordinator ? '1' : '0',
    is_volunteer: user.isVolunteer ? '1' : '0',

    // Nested profile object
    profile: {
      linkedin: user.linkedin || '',
      twitter: user.twitter || '',
      instagram: user.instagram || '',
      current_company: user.company || '',
      current_position: user.position || '',
      city: user.city || '',
      facebook: '',
      website: '',
      country: '',
      skills: '',
      achievements: '',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND → FRONTEND
// ─────────────────────────────────────────────────────────────────────────────

export function mapBackendResponseToFrontendUser(raw: unknown): Partial<AuthSessionUser> {
  const d = raw as Record<string, any>;
  const user = d.user || d;
  const profile = user.profile || d.profile || {};

  const DEFAULT_AVATAR = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    `${user.first_name} ${user.last_name}`,
  )}&background=E5E7EB&color=6B7280&size=256`;

  return {
    // Identity
    id: String(user.id),

    // Basic info
    otherNames: user.first_name || undefined,
    surname: user.last_name || undefined,
    fullName:
      user.fullname ||
      user.full_name ||
      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
      undefined,

    nameInSchool: user.name_in_school || undefined,
    email: user.email || undefined,

    // Contact
    whatsappPhone: user.phone || undefined,
    alternativePhone: user.alternative_phone || undefined,

    // Profile
    // photo: user.avatar && user.avatar !== 'default.png' ? user.avatar : undefined,
    photo: d.avatar && d.avatar !== 'default.png' ? String(d.avatar) : DEFAULT_AVATAR,

    birthDate: user.birth_date || undefined,

    // School
    graduationYear: safeParseInt(user.graduation_year),
    houseColor: user.house_color || undefined,

    // Location
    residentialAddress: user.residential_address || undefined,
    area: user.area || undefined,
    city: profile.city || user.city || undefined,

    // Professional
    employmentStatus: user.employment_status || undefined,
    position: profile.current_position || undefined,
    company: profile.current_company || undefined,

    occupations: user.occupation ? [user.occupation] : undefined,
    industrySectors: user.industry_sector ? [user.industry_sector] : undefined,

    yearsOfExperience: safeParseInt(user.years_of_experience),

    // Social
    linkedin: profile.linkedin || undefined,
    twitter: profile.twitter || undefined,
    instagram: profile.instagram || undefined,

    // Flags
    isClassCoordinator: stringToBoolean(user.is_coordinator),
    isVolunteer: stringToBoolean(user.is_volunteer),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE UPDATE PAYLOADS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create FormData payload for profile update WITH optional photo.
 * Used when uploading avatar.
 */
export function createProfileUpdateFormData(
  userId: string,
  updates: Partial<AuthSessionUser>,
  photoFile?: File,
): FormData {
  const formData = new FormData();

  formData.append('user_id', userId);

  if (photoFile) {
    formData.append('avatar', photoFile);
  }

  const payload = mapFrontendUserToBackendPayload(updates);

  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'profile') {
      Object.entries(value as Record<string, unknown>).forEach(([profileKey, profileValue]) => {
        formData.append(`profile[${profileKey}]`, String(profileValue ?? ''));
      });
    } else {
      formData.append(key, String(value ?? ''));
    }
  });

  return formData;
}

/**
 * Create JSON payload for profile update WITHOUT photo.
 */
export function createProfileUpdatePayload(
  userId: string,
  updates: Partial<AuthSessionUser>,
): Record<string, unknown> {
  const payload = mapFrontendUserToBackendPayload(updates);

  return {
    user_id: userId,
    ...payload,
  };
}
