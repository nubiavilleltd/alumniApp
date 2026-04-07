// /**
//  * ============================================================================
//  * PRIVACY ADAPTER
//  * ============================================================================
//  *
//  * Transforms privacy settings between backend and frontend formats
//  *
//  * BACKEND INCONSISTENCIES HANDLED:
//  * - Field names: avatar vs photo, birth_date vs birthDate
//  * - Value types: "public"/"private" vs true/false vs "true"/"false"
//  * - Missing fields: defaults to "private" for safety
//  *
//  * ============================================================================
//  */

// import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';

// /**
//  * Normalize any backend privacy value to "public" | "private"
//  *
//  * Handles:
//  * - Strings: "public", "private"
//  * - Booleans: true (public), false (private)
//  * - Boolean strings: "true", "false"
//  * - Numbers: 1 (public), 0 (private)
//  * - Null/undefined: defaults to "private"
//  */
// function normalizeVisibility(value: any): FieldVisibility {
//   // Public values
//   if (
//     value === 'public' ||
//     value === true ||
//     value === 'true' ||
//     value === 1 ||
//     value === '1'
//   ) {
//     return 'public';
//   }

//   // Everything else defaults to private (safer)
//   return 'private';
// }

// /**
//  * Map backend privacy response to frontend PrivacySettings
//  *
//  * USAGE:
//  * ```typescript
//  * const backendResponse = {
//  *   field_visibility: {
//  *     avatar: "private",
//  *     phone: false,  // boolean
//  *     alternative_phone: "public"
//  *   }
//  * };
//  *
//  * const privacy = mapBackendPrivacyToFrontend(backendResponse);
//  * // {
//  * //   photo: "private",
//  * //   whatsappPhone: "private",
//  * //   alternativePhone: "public",
//  * //   ...
//  * // }
//  * ```
//  */
// export function mapBackendPrivacyToFrontend(raw: any): PrivacySettings {
//   // Handle different response structures
//   const visibility = raw.field_visibility || raw.privacy || raw || {};

//   return {
//     photo: normalizeVisibility(visibility.avatar || visibility.photo),
//     whatsappPhone: normalizeVisibility(visibility.phone || visibility.whatsappPhone),
//     alternativePhone: normalizeVisibility(
//       visibility.alternative_phone || visibility.alternativePhone
//     ),
//     birthDate: normalizeVisibility(visibility.birth_date || visibility.birthDate),
//     residentialAddress: normalizeVisibility(
//       visibility.residential_address || visibility.residentialAddress
//     ),
//     area: normalizeVisibility(visibility.area),
//     city: normalizeVisibility(visibility.city),
//     employmentStatus: normalizeVisibility(
//       visibility.employment_status || visibility.employmentStatus
//     ),
//     occupations: normalizeVisibility(visibility.occupation || visibility.occupations),
//     industrySectors: normalizeVisibility(
//       visibility.industry_sector || visibility.industrySectors
//     ),
//     yearsOfExperience: normalizeVisibility(
//       visibility.years_of_experience || visibility.yearsOfExperience
//     ),
//   };
// }

// /**
//  * Map frontend PrivacySettings to backend payload
//  *
//  * USAGE:
//  * ```typescript
//  * const frontendPrivacy: PrivacySettings = {
//  *   photo: "public",
//  *   whatsappPhone: "private",
//  *   ...
//  * };
//  *
//  * const payload = mapFrontendPrivacyToBackend(frontendPrivacy);
//  * // {
//  * //   avatar: "public",
//  * //   phone: "private",
//  * //   alternative_phone: "private",
//  * //   ...
//  * // }
//  * ```
//  */
// export function mapFrontendPrivacyToBackend(privacy: PrivacySettings): Record<string, string> {
//   return {
//     avatar: privacy.photo,
//     phone: privacy.whatsappPhone,
//     alternative_phone: privacy.alternativePhone,
//     birth_date: privacy.birthDate,
//     residential_address: privacy.residentialAddress,
//     area: privacy.area,
//     city: privacy.city,
//     employment_status: privacy.employmentStatus,
//     occupation: privacy.occupations,
//     industry_sector: privacy.industrySectors,
//     years_of_experience: privacy.yearsOfExperience,
//   };
// }

// /**
//  * Merge privacy settings with defaults
//  *
//  * Ensures all fields have a value (no undefined)
//  * Useful when backend returns partial privacy data
//  */
// export function mergeWithDefaults(
//   privacy: Partial<PrivacySettings> | undefined,
//   defaults: PrivacySettings
// ): PrivacySettings {
//   return {
//     ...defaults,
//     ...privacy,
//   };
// }

/**
 * ============================================================================
 * PRIVACY ADAPTER - ACTUAL BACKEND FORMAT
 * ============================================================================
 *
 * Based on real backend response:
 * {
 *   field_visibility: {
 *     avatar: "public",
 *     phone: "public",
 *     alternative_phone: "public",
 *     ...
 *   }
 * }
 *
 * All values are "public" | "private" strings
 * ============================================================================
 */

import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';

/**
 * Map backend privacy response to frontend PrivacySettings
 *
 * Backend format:
 * {
 *   status: 200,
 *   user_id: 39,
 *   is_visible: true,
 *   field_visibility: {
 *     avatar: "public",
 *     phone: "public",
 *     ...
 *   }
 * }
 */

// export function mapBackendPrivacyToFrontend(raw: any): PrivacySettings {
//   const visibility = raw.field_visibility || {};

//   // Helper: Ensure value is "public" or "private"
//   const normalize = (value: any): FieldVisibility => {
//     // if (value === 'public') return 'public';
//     // if (value === 'private') return 'private';

//     if (value === 'public' || value === true || value === 'true' || value === 1 || value === '1') {
//       return 'public';
//     }

//     // Fallback for any unexpected values
//     return 'private'; // Default to private for safety
//   };

//   return {
//     photo: normalize(visibility.avatar),
//     whatsappPhone: normalize(visibility.phone),
//     alternativePhone: normalize(visibility.alternative_phone),
//     birthDate: normalize(visibility.birth_date),
//     residentialAddress: normalize(visibility.residential_address),
//     area: normalize(visibility.area),
//     city: normalize(visibility.city),
//     employmentStatus: normalize(visibility.employment_status),
//     occupations: normalize(visibility.occupation),
//     industrySectors: normalize(visibility.industry_sector),
//     yearsOfExperience: normalize(visibility.years_of_experience),
//   };
// }

// features/user/api/adapters/privacy.adapter.ts

export function mapBackendPrivacyToFrontend(raw: any): PrivacySettings {
  console.log('my raw', { raw });
  // ✅ Handle missing field_visibility gracefully
  const visibility = raw?.field_visibility || raw || {};

  const normalize = (value: any): FieldVisibility => {
    if (!raw.field_visibility) return 'public'; ///This line should be removed!!!!!!!!. This is just a workaround before the backend dev does the right thing
    if (value === 'public' || value === true || value === 'true' || value === 1 || value === '1') {
      return 'public';
    }
    return 'private';
  };

  return {
    photo: normalize(visibility.avatar),
    whatsappPhone: normalize(visibility.phone),
    alternativePhone: normalize(visibility.alternative_phone),
    birthDate: normalize(visibility.birth_date),
    residentialAddress: normalize(visibility.residential_address),
    area: normalize(visibility.area),
    city: normalize(visibility.city),
    employmentStatus: normalize(visibility.employment_status),
    occupations: normalize(visibility.occupation),
    industrySectors: normalize(visibility.industry_sector),
    yearsOfExperience: normalize(visibility.years_of_experience),
  };
}

/**
 * Map frontend field name to backend visibility key
 *
 * Frontend: photo → Backend: avatar_visible
 */
export function frontendFieldToBackendKey(field: keyof PrivacySettings): string {
  const mapping: Record<keyof PrivacySettings, string> = {
    photo: 'avatar_visible',
    whatsappPhone: 'phone_visible',
    alternativePhone: 'alternative_phone_visible',
    birthDate: 'birth_date_visible',
    residentialAddress: 'residential_address_visible',
    area: 'area_visible',
    city: 'city_visible',
    employmentStatus: 'employment_status_visible',
    occupations: 'occupation_visible',
    industrySectors: 'industry_sector_visible',
    yearsOfExperience: 'years_of_experience_visible',
  };

  return mapping[field];
}

/**
 * Convert visibility to backend boolean format
 *
 * Frontend: "public" → Backend: true
 * Frontend: "private" → Backend: false
 */
export function visibilityToBackendBoolean(visibility: FieldVisibility): boolean {
  return visibility === 'public';
}

/**
 * Create payload for single field privacy update
 *
 * POST /api/update_profile_visibility
 * {
 *   user_id: "39",
 *   avatar_visible: true
 * }
 */
export function createPrivacyUpdatePayload(
  userId: string,
  field: keyof PrivacySettings,
  visibility: FieldVisibility,
): Record<string, any> {
  const backendKey = frontendFieldToBackendKey(field);
  const backendValue = visibilityToBackendBoolean(visibility);

  return {
    user_id: userId,
    [backendKey]: backendValue,
  };
}
