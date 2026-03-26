/**
 * ============================================================================
 * USER PROFILE ADAPTER
 * ============================================================================
 * 
 * Transforms between frontend AuthSessionUser and backend user/profile format.
 * 
 * BACKEND STRUCTURE:
 * - Core fields in `user` object
 * - Social/professional fields in nested `profile` object
 * - Avatar handled separately via FormData
 * 
 * FRONTEND STRUCTURE:
 * - Flat AuthSessionUser object
 * - Privacy settings stored separately (NOT sent to backend)
 * 
 * WHEN BACKEND CHANGES:
 * - Update mappings here only
 * - Rest of app stays unchanged
 * 
 * ============================================================================
 */

import type { AuthSessionUser } from '@/features/authentication/types/auth.types';

/**
 * Map frontend AuthSessionUser to backend profile update payload
 * 
 * NOTE: This creates the JSON payload. Photo is sent separately via FormData.
 */
export function mapFrontendUserToBackendPayload(user: Partial<AuthSessionUser>) {
  return {
    // ═══════════════════════════════════════════════════════════════════
    // CORE USER FIELDS
    // ═══════════════════════════════════════════════════════════════════
    first_name: user.otherNames,
    last_name: user.surname,
    email: user.email,
    phone: user.whatsappPhone,
    alternative_phone: user.alternativePhone || '',
    
    // ═══════════════════════════════════════════════════════════════════
    // SCHOOL INFO
    // ═══════════════════════════════════════════════════════════════════
    name_in_school: user.nameInSchool,
    graduation_year: user.graduationYear ? String(user.graduationYear) : '',
    house_color: user.houseColor || '',
    department: '', // Not in frontend - send empty
    
    // ═══════════════════════════════════════════════════════════════════
    // PERSONAL
    // ═══════════════════════════════════════════════════════════════════
    birth_date: user.birthDate || '',
    
    // ═══════════════════════════════════════════════════════════════════
    // LOCATION
    // ═══════════════════════════════════════════════════════════════════
    residential_address: user.residentialAddress || '',
    area: user.area || '',
    city: user.city || '',
    
    // ═══════════════════════════════════════════════════════════════════
    // PROFESSIONAL (sent in profile object to backend)
    // ═══════════════════════════════════════════════════════════════════
    employment_status: user.employmentStatus || '',
    occupation: user.occupations && user.occupations.length > 0 
      ? user.occupations[0] // Backend stores single value
      : '',
    industry_sector: user.industrySectors && user.industrySectors.length > 0
      ? user.industrySectors[0] // Backend stores single value
      : '',
    years_of_experience: user.yearsOfExperience ? String(user.yearsOfExperience) : '',
    
    // ═══════════════════════════════════════════════════════════════════
    // FLAGS
    // ═══════════════════════════════════════════════════════════════════
    is_coordinator: user.isClassCoordinator ? '1' : '0',
    is_volunteer: user.isVolunteer ? '1' : '0',
    
    // ═══════════════════════════════════════════════════════════════════
    // SOCIAL LINKS (nested in profile object for backend)
    // ═══════════════════════════════════════════════════════════════════
    profile: {
      linkedin: user.linkedin || '',
      twitter: user.twitter || '',
      instagram: user.instagram || '',
      current_company: user.company || '',
      current_position: user.position || '',
      city: user.city || '',
      // Backend might expect these - send empty if not in frontend
      facebook: '',
      website: '',
      country: '',
      skills: '',
      achievements: '',
    },
  };
}

/**
 * Map backend user response to frontend AuthSessionUser
 * 
 * Merges `user` and nested `profile` objects into flat structure
 */
export function mapBackendResponseToFrontendUser(backendData: any): Partial<AuthSessionUser> {
  const user = backendData.user || backendData;
  const profile = user.profile || backendData.profile || {};
  
  return {
    // ═══════════════════════════════════════════════════════════════════
    // IDENTITY (don't update these - they're set at registration)
    // ═══════════════════════════════════════════════════════════════════
    id: String(user.id),
    
    // ═══════════════════════════════════════════════════════════════════
    // BASIC INFO
    // ═══════════════════════════════════════════════════════════════════
    otherNames: user.first_name || undefined,
    surname: user.last_name || undefined,
    fullName: user.fullname || 
              user.full_name ||
              `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
              undefined,
    nameInSchool: user.name_in_school || undefined,
    email: user.email || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // CONTACT
    // ═══════════════════════════════════════════════════════════════════
    whatsappPhone: user.phone || undefined,
    alternativePhone: user.alternative_phone || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // PROFILE
    // ═══════════════════════════════════════════════════════════════════
    photo: user.avatar && user.avatar !== 'default.png' 
      ? user.avatar 
      : undefined,
    birthDate: user.birth_date || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // SCHOOL
    // ═══════════════════════════════════════════════════════════════════
    graduationYear: safeParseInt(user.graduation_year),
    houseColor: user.house_color || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // LOCATION
    // ═══════════════════════════════════════════════════════════════════
    residentialAddress: user.residential_address || undefined,
    area: user.area || undefined,
    city: profile.city || user.city || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // PROFESSIONAL
    // ═══════════════════════════════════════════════════════════════════
    employmentStatus: user.employment_status || undefined,
    position: profile.current_position || undefined,
    company: profile.current_company || undefined,
    
    // Convert singular backend values to frontend arrays
    occupations: user.occupation 
      ? [user.occupation]
      : undefined,
    industrySectors: user.industry_sector
      ? [user.industry_sector]
      : undefined,
    
    yearsOfExperience: safeParseInt(user.years_of_experience),
    
    // ═══════════════════════════════════════════════════════════════════
    // SOCIAL LINKS (from nested profile)
    // ═══════════════════════════════════════════════════════════════════
    linkedin: profile.linkedin || undefined,
    twitter: profile.twitter || undefined,
    instagram: profile.instagram || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // FLAGS
    // ═══════════════════════════════════════════════════════════════════
    isClassCoordinator: stringToBoolean(user.is_coordinator),
    isVolunteer: stringToBoolean(user.is_volunteer),
  };
}

/**
 * Create FormData payload for profile update with optional photo
 * 
 * This is used when photo is being uploaded
 */
export function createProfileUpdateFormData(
  userId: string,
  updates: Partial<AuthSessionUser>,
  photoFile?: File
): FormData {
  const formData = new FormData();
  
  // Add user_id
  formData.append('user_id', userId);
  
  // Add photo if provided
  if (photoFile) {
    formData.append('avatar', photoFile);
  }
  
  // Convert user updates to backend payload
  const payload = mapFrontendUserToBackendPayload(updates);
  
  // Add all fields to FormData
  // Core fields
  Object.entries(payload).forEach(([key, value]) => {
    if (key === 'profile') {
      // Handle nested profile object
      Object.entries(value as object).forEach(([profileKey, profileValue]) => {
        formData.append(`profile[${profileKey}]`, String(profileValue || ''));
      });
    } else {
      formData.append(key, String(value || ''));
    }
  });
  
  return formData;
}

/**
 * Create JSON payload for profile update without photo
 * 
 * This is used when NO photo is being uploaded
 */
export function createProfileUpdatePayload(
  userId: string,
  updates: Partial<AuthSessionUser>
) {
  const payload = mapFrontendUserToBackendPayload(updates);
  
  return {
    user_id: userId,
    ...payload,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function stringToBoolean(value: any): boolean | undefined {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return undefined;
}

function safeParseInt(value: any): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  return isNaN(parsed) ? undefined : parsed;
}