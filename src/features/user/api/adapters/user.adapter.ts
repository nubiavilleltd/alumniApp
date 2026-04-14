import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import { safeParseInt, stringToBoolean } from '@/lib/utils/adapters';
import { stripUndefined } from '@/lib/utils/objectUtils';

// ─────────────────────────────────────────────────────────────────────────────
// FRONTEND → BACKEND
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map frontend field names to backend field names
 *
 * Only includes fields that have values (strips undefined)
 *
 * IMPORTANT: Backend uses partial updates via array_key_exists
 * Only send fields you want to update!
 */
export function mapFrontendUserToBackendPayload(user: Partial<AuthSessionUser>) {
  const payload: Record<string, any> = {};

  // ═══════════════════════════════════════════════════════════════════════
  // MAIN USER FIELDS (users table)
  // ═══════════════════════════════════════════════════════════════════════

  if (user.otherNames !== undefined) payload.first_name = user.otherNames;
  if (user.surname !== undefined) payload.last_name = user.surname;
  if (user.email !== undefined) payload.email = user.email;
  if (user.whatsappPhone !== undefined) payload.phone = user.whatsappPhone;
  if (user.alternativePhone !== undefined) payload.alternative_phone = user.alternativePhone || '';

  if (user.nameInSchool !== undefined) payload.name_in_school = user.nameInSchool;
  if (user.nickName !== undefined) payload.nick_name = user.nickName;
  if (user.graduationYear !== undefined) payload.graduation_year = String(user.graduationYear);
  if (user.houseColor !== undefined) payload.house_color = user.houseColor || '';

  if (user.birthDate !== undefined) payload.birth_date = user.birthDate || '';
  if (user.bio !== undefined) payload.bio = user.bio || '';

  if (user.residentialAddress !== undefined)
    payload.residential_address = user.residentialAddress || '';
  if (user.area !== undefined) payload.area = user.area || '';
  if (user.city !== undefined) payload.city = user.city || '';
  if (user.state !== undefined) payload.state = user.state || '';

  if (user.employmentStatus !== undefined) payload.employment_status = user.employmentStatus || '';
  if (user.occupations !== undefined) payload.occupation = user.occupations?.[0] || '';
  if (user.industrySectors !== undefined) payload.industry_sector = user.industrySectors?.[0] || '';
  if (user.yearsOfExperience !== undefined)
    payload.years_of_experience = String(user.yearsOfExperience || '');

  if (user.isClassCoordinator !== undefined)
    payload.is_coordinator = user.isClassCoordinator ? '1' : '0';
  if (user.isVolunteer !== undefined) payload.is_volunteer = user.isVolunteer ? '1' : '0';

  // ═══════════════════════════════════════════════════════════════════════
  // PROFILE FIELDS (user_profiles table)
  // ═══════════════════════════════════════════════════════════════════════

  const profile: Record<string, any> = {};

  if (user.linkedin !== undefined) profile.linkedin = user.linkedin || '';
  if (user.twitter !== undefined) profile.twitter = user.twitter || '';
  if (user.instagram !== undefined) profile.instagram = user.instagram || '';
  if (user.company !== undefined) profile.current_company = user.company || '';
  if (user.position !== undefined) profile.current_position = user.position || '';

  // Only include profile object if it has fields
  if (Object.keys(profile).length > 0) {
    payload.profile = profile;
  }

  return payload;
}

// ─────────────────────────────────────────────────────────────────────────────
// BACKEND → FRONTEND
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map backend response to frontend user format
 *
 * Returns undefined for missing photos to preserve existing
 */
export function mapBackendResponseToFrontendUser(raw: unknown): Partial<AuthSessionUser> {
  const d = raw as Record<string, any>;
  const user = d.user || d;
  const profile = user.profile || d.profile || {};

  // ✅ Photo handling: Only return if real URL exists
  const avatarField = d.avatar || user.avatar || profile.avatar;
  const hasRealPhoto =
    avatarField &&
    avatarField !== 'default.png' &&
    avatarField !== '' &&
    !avatarField.includes('ui-avatars.com');

  return {
    id: String(user.id),

    otherNames: user.first_name || undefined,
    surname: user.last_name || undefined,
    fullName:
      user.fullname ||
      user.full_name ||
      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
      undefined,

    nameInSchool: user.name_in_school || undefined,
    nickName: user.nick_name || undefined,
    email: user.email || undefined,

    whatsappPhone: user.phone || undefined,
    alternativePhone: user.alternative_phone || undefined,
    role: user.user_role === 'admin' ? 'admin' : 'member',

    // ✅ Photo: undefined preserves existing
    photo: hasRealPhoto ? String(avatarField) : undefined,

    birthDate: user.birth_date || undefined,
    bio: user.bio || undefined,

    graduationYear: safeParseInt(user.graduation_year),
    houseColor: user.house_color || undefined,

    residentialAddress: user.residential_address || undefined,
    area: user.area || undefined,
    city: profile.city || user.city || undefined,
    state: profile.state || user.state || undefined,

    employmentStatus: user.employment_status || undefined,
    position: profile.current_position || undefined,
    company: profile.current_company || undefined,

    occupations: user.occupation ? [user.occupation] : undefined,
    industrySectors: user.industry_sector ? [user.industry_sector] : undefined,

    yearsOfExperience: safeParseInt(user.years_of_experience),

    linkedin: profile.linkedin || undefined,
    twitter: profile.twitter || undefined,
    instagram: profile.instagram || undefined,

    isClassCoordinator: stringToBoolean(user.is_coordinator),
    isVolunteer: stringToBoolean(user.is_volunteer),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE UPDATE PAYLOADS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create FormData payload for profile update WITH optional photo
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
 * Create JSON payload for profile update WITHOUT photo
 *
 * ✅ IMPORTANT: Only includes fields with values
 * Undefined fields are completely excluded
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
