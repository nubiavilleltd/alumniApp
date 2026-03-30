// /**
//  * ============================================================================
//  * USER PROFILE ADAPTER
//  * ============================================================================
//  *
//  * Transforms between frontend AuthSessionUser and backend user/profile format.
//  *
//  * BACKEND STRUCTURE:
//  * - Core fields in `user` object
//  * - Social/professional fields in nested `profile` object
//  * - Avatar handled separately via FormData
//  *
//  * FRONTEND STRUCTURE:
//  * - Flat AuthSessionUser object
//  * - Privacy settings stored separately (NOT sent to backend)
//  *
//  * WHEN BACKEND CHANGES:
//  * - Update mappings here only
//  * - Rest of app stays unchanged
//  *
//  * ============================================================================
//  */

// import type { AuthSessionUser } from '@/features/authentication/types/auth.types';

// /**
//  * Map frontend AuthSessionUser to backend profile update payload
//  *
//  * NOTE: This creates the JSON payload. Photo is sent separately via FormData.
//  */
// export function mapFrontendUserToBackendPayload(user: Partial<AuthSessionUser>) {
//   return {
//     // ═══════════════════════════════════════════════════════════════════
//     // CORE USER FIELDS
//     // ═══════════════════════════════════════════════════════════════════
//     first_name: user.otherNames,
//     last_name: user.surname,
//     email: user.email,
//     phone: user.whatsappPhone,
//     alternative_phone: user.alternativePhone || '',

//     // ═══════════════════════════════════════════════════════════════════
//     // SCHOOL INFO
//     // ═══════════════════════════════════════════════════════════════════
//     name_in_school: user.nameInSchool,
//     graduation_year: user.graduationYear ? String(user.graduationYear) : '',
//     house_color: user.houseColor || '',
//     department: '', // Not in frontend - send empty

//     // ═══════════════════════════════════════════════════════════════════
//     // PERSONAL
//     // ═══════════════════════════════════════════════════════════════════
//     birth_date: user.birthDate || '',

//     // ═══════════════════════════════════════════════════════════════════
//     // LOCATION
//     // ═══════════════════════════════════════════════════════════════════
//     residential_address: user.residentialAddress || '',
//     area: user.area || '',
//     city: user.city || '',

//     // ═══════════════════════════════════════════════════════════════════
//     // PROFESSIONAL (sent in profile object to backend)
//     // ═══════════════════════════════════════════════════════════════════
//     employment_status: user.employmentStatus || '',
//     occupation:
//       user.occupations && user.occupations.length > 0
//         ? user.occupations[0] // Backend stores single value
//         : '',
//     industry_sector:
//       user.industrySectors && user.industrySectors.length > 0
//         ? user.industrySectors[0] // Backend stores single value
//         : '',
//     years_of_experience: user.yearsOfExperience ? String(user.yearsOfExperience) : '',

//     // ═══════════════════════════════════════════════════════════════════
//     // FLAGS
//     // ═══════════════════════════════════════════════════════════════════
//     is_coordinator: user.isClassCoordinator ? '1' : '0',
//     is_volunteer: user.isVolunteer ? '1' : '0',

//     // ═══════════════════════════════════════════════════════════════════
//     // SOCIAL LINKS (nested in profile object for backend)
//     // ═══════════════════════════════════════════════════════════════════
//     profile: {
//       linkedin: user.linkedin || '',
//       twitter: user.twitter || '',
//       instagram: user.instagram || '',
//       current_company: user.company || '',
//       current_position: user.position || '',
//       city: user.city || '',
//       // Backend might expect these - send empty if not in frontend
//       facebook: '',
//       website: '',
//       country: '',
//       skills: '',
//       achievements: '',
//     },
//   };
// }

// /**
//  * Map backend user response to frontend AuthSessionUser
//  *
//  * Merges `user` and nested `profile` objects into flat structure
//  */
// export function mapBackendResponseToFrontendUser(backendData: any): Partial<AuthSessionUser> {
//   const user = backendData.user || backendData;
//   const profile = user.profile || backendData.profile || {};

//   return {
//     // ═══════════════════════════════════════════════════════════════════
//     // IDENTITY (don't update these - they're set at registration)
//     // ═══════════════════════════════════════════════════════════════════
//     id: String(user.id),

//     // ═══════════════════════════════════════════════════════════════════
//     // BASIC INFO
//     // ═══════════════════════════════════════════════════════════════════
//     otherNames: user.first_name || undefined,
//     surname: user.last_name || undefined,
//     fullName:
//       user.fullname ||
//       user.full_name ||
//       `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
//       undefined,
//     nameInSchool: user.name_in_school || undefined,
//     email: user.email || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // CONTACT
//     // ═══════════════════════════════════════════════════════════════════
//     whatsappPhone: user.phone || undefined,
//     alternativePhone: user.alternative_phone || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // PROFILE
//     // ═══════════════════════════════════════════════════════════════════
//     photo: user.avatar && user.avatar !== 'default.png' ? user.avatar : undefined,
//     birthDate: user.birth_date || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // SCHOOL
//     // ═══════════════════════════════════════════════════════════════════
//     graduationYear: safeParseInt(user.graduation_year),
//     houseColor: user.house_color || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // LOCATION
//     // ═══════════════════════════════════════════════════════════════════
//     residentialAddress: user.residential_address || undefined,
//     area: user.area || undefined,
//     city: profile.city || user.city || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // PROFESSIONAL
//     // ═══════════════════════════════════════════════════════════════════
//     employmentStatus: user.employment_status || undefined,
//     position: profile.current_position || undefined,
//     company: profile.current_company || undefined,

//     // Convert singular backend values to frontend arrays
//     occupations: user.occupation ? [user.occupation] : undefined,
//     industrySectors: user.industry_sector ? [user.industry_sector] : undefined,

//     yearsOfExperience: safeParseInt(user.years_of_experience),

//     // ═══════════════════════════════════════════════════════════════════
//     // SOCIAL LINKS (from nested profile)
//     // ═══════════════════════════════════════════════════════════════════
//     linkedin: profile.linkedin || undefined,
//     twitter: profile.twitter || undefined,
//     instagram: profile.instagram || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // FLAGS
//     // ═══════════════════════════════════════════════════════════════════
//     isClassCoordinator: stringToBoolean(user.is_coordinator),
//     isVolunteer: stringToBoolean(user.is_volunteer),
//   };
// }

// /**
//  * Create FormData payload for profile update with optional photo
//  *
//  * This is used when photo is being uploaded
//  */
// export function createProfileUpdateFormData(
//   userId: string,
//   updates: Partial<AuthSessionUser>,
//   photoFile?: File,
// ): FormData {
//   const formData = new FormData();

//   // Add user_id
//   formData.append('user_id', userId);

//   // Add photo if provided
//   if (photoFile) {
//     formData.append('avatar', photoFile);
//   }

//   // Convert user updates to backend payload
//   const payload = mapFrontendUserToBackendPayload(updates);

//   // Add all fields to FormData
//   // Core fields
//   Object.entries(payload).forEach(([key, value]) => {
//     if (key === 'profile') {
//       // Handle nested profile object
//       Object.entries(value as object).forEach(([profileKey, profileValue]) => {
//         formData.append(`profile[${profileKey}]`, String(profileValue || ''));
//       });
//     } else {
//       formData.append(key, String(value || ''));
//     }
//   });

//   return formData;
// }

// /**
//  * Create JSON payload for profile update without photo
//  *
//  * This is used when NO photo is being uploaded
//  */
// export function createProfileUpdatePayload(userId: string, updates: Partial<AuthSessionUser>) {
//   const payload = mapFrontendUserToBackendPayload(updates);

//   return {
//     user_id: userId,
//     ...payload,
//   };
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // HELPER FUNCTIONS
// // ═══════════════════════════════════════════════════════════════════════════

// function stringToBoolean(value: any): boolean | undefined {
//   if (value === true || value === 1 || value === '1') return true;
//   if (value === false || value === 0 || value === '0') return false;
//   return undefined;
// }

// function safeParseInt(value: any): number | undefined {
//   if (value === null || value === undefined || value === '') return undefined;
//   const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
//   return isNaN(parsed) ? undefined : parsed;
// }

// import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
// import { safeParseInt, stringToBoolean } from '@/lib/utils/adapters';

// export function mapFrontendUserToBackendPayload(user: Partial<AuthSessionUser>) {
//   return {
//     first_name: user.otherNames,
//     last_name: user.surname,
//     email: user.email,
//     phone: user.whatsappPhone,
//     alternative_phone: user.alternativePhone || '',

//     name_in_school: user.nameInSchool,
//     graduation_year: user.graduationYear ? String(user.graduationYear) : '',
//     house_color: user.houseColor || '',
//     department: '',

//     birth_date: user.birthDate || '',

//     residential_address: user.residentialAddress || '',
//     area: user.area || '',
//     city: user.city || '',

//     employment_status: user.employmentStatus || '',
//     occupation: user.occupations?.[0] || '',
//     industry_sector: user.industrySectors?.[0] || '',
//     years_of_experience: user.yearsOfExperience
//       ? String(user.yearsOfExperience)
//       : '',

//     is_coordinator: user.isClassCoordinator ? '1' : '0',
//     is_volunteer: user.isVolunteer ? '1' : '0',

//     profile: {
//       linkedin: user.linkedin || '',
//       twitter: user.twitter || '',
//       instagram: user.instagram || '',
//       current_company: user.company || '',
//       current_position: user.position || '',
//       city: user.city || '',
//       facebook: '',
//       website: '',
//       country: '',
//       skills: '',
//       achievements: '',
//     },
//   };
// }

// export function mapBackendResponseToFrontendUser(
//   raw: unknown,
// ): Partial<AuthSessionUser> {
//   const d = raw as any;
//   const user = d.user || d;
//   const profile = user.profile || d.profile || {};

//   return {
//     id: String(user.id),

//     otherNames: user.first_name,
//     surname: user.last_name,
//     fullName:
//       user.fullname ||
//       `${user.first_name || ''} ${user.last_name || ''}`.trim(),

//     nameInSchool: user.name_in_school,
//     email: user.email,

//     whatsappPhone: user.phone,
//     alternativePhone: user.alternative_phone,

//     photo:
//       user.avatar && user.avatar !== 'default.png'
//         ? user.avatar
//         : undefined,

//     birthDate: user.birth_date,

//     graduationYear: safeParseInt(user.graduation_year),
//     houseColor: user.house_color,

//     residentialAddress: user.residential_address,
//     area: user.area,
//     city: profile.city || user.city,

//     employmentStatus: user.employment_status,
//     position: profile.current_position,
//     company: profile.current_company,

//     occupations: user.occupation ? [user.occupation] : undefined,
//     industrySectors: user.industry_sector
//       ? [user.industry_sector]
//       : undefined,

//     yearsOfExperience: safeParseInt(user.years_of_experience),

//     linkedin: profile.linkedin,
//     twitter: profile.twitter,
//     instagram: profile.instagram,

//     isClassCoordinator: stringToBoolean(user.is_coordinator),
//     isVolunteer: stringToBoolean(user.is_volunteer),
//   };
// }

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

  console.log('my default avatar', { DEFAULT_AVATAR });

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
