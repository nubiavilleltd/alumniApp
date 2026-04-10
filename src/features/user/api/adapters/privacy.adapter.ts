// features/user/api/adapters/privacy.adapter.ts

import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';

export function mapBackendPrivacyToFrontend(raw: any): PrivacySettings {
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
