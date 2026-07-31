// features/user/api/adapters/privacy.adapter.ts

import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';

function parseValue(value: unknown): Record<string, any> {
  if (!value) return {};

  // Already parsed object from backend
  if (typeof value === 'object') {
    return value as Record<string, any>;
  }

  // Serialized JSON string
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Failed to parse field_visibility', error);
      return {};
    }
  }

  return {};
}
export function mapBackendPrivacyToFrontend(raw: any): PrivacySettings {
  // ✅ Handle missing field_visibility gracefully
  const visibility = parseValue(raw?.field_visibility) || {};


  const normalize = (value: any, fallback: FieldVisibility = 'private'): FieldVisibility => {
    if (value === 'members') {
      return 'members';
    }

    if (value === 'public' || value === true || value === 'true' || value === 1 || value === '1') {
      return 'public';
    }

    if (
      value === 'private' ||
      value === false ||
      value === 'false' ||
      value === 0 ||
      value === '0'
    ) {
      return 'private';
    }

    return fallback;
  };

  return {
    photo: normalize(visibility.avatar),
    whatsappPhone: normalize(visibility.phone),
    alternativePhone: normalize(visibility.alternative_phone),
    birthDate: normalize(visibility.birth_date),
    residentialAddress: normalize(visibility.residential_address),
    area: normalize(visibility.area),
    city: normalize(visibility.city),
    state: normalize(visibility.state),
    employmentStatus: normalize(visibility.employment_status),
    socials: normalize(visibility.socials),
    // occupations: normalize(visibility.occupation),
    // industrySectors: normalize(visibility.industry_sector),
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
    state: 'state_visible',
    employmentStatus: 'employment_status_visible',
    socials: 'socials_visible',
    // occupations: 'occupation_visible',
    // industrySectors: 'industry_sector_visible',
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
