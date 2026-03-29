// import type { Alumni } from '../../types/alumni.types';

// /**
//  * ============================================================================
//  * ALUMNI DATA ADAPTER
//  * ============================================================================
//  *
//  * This adapter transforms the messy backend alumni data into clean frontend format.
//  *
//  * WHEN BACKEND CHANGES:
//  * - Just update the mappings in mapBackendAlumniToFrontend()
//  * - Rest of your app stays unchanged
//  *
//  * HANDLES:
//  * - Numeric strings → numbers (e.g., "2026" → 2026)
//  * - Boolean strings → booleans (e.g., "0"/"1" → false/true)
//  * - Unix timestamps → ISO dates (e.g., "1773214575" → "2026-03-11T08:36:15.000Z")
//  * - null → undefined
//  * - Nested profile object → flattened fields
//  * - Missing fields → sensible defaults
//  *
//  * ============================================================================
//  */

// /**
//  * Convert a single backend alumni object to frontend Alumni type
//  */
// export function mapBackendAlumniToFrontend(backendData: any): Alumni {
//   // Extract nested profile data
//   const profile = backendData.profile || {};

//   // Generate slug from name
//   const slug = generateSlug(
//     backendData.fullname || `${backendData.first_name || ''} ${backendData.last_name || ''}`,
//     backendData.id,
//   );

//   return {
//     // ═══════════════════════════════════════════════════════════════════
//     // IDENTITY
//     // ═══════════════════════════════════════════════════════════════════
//     memberId: String(backendData.id),
//     slug,

//     // ═══════════════════════════════════════════════════════════════════
//     // BASIC INFO
//     // ═══════════════════════════════════════════════════════════════════
//     name:
//       backendData.fullname ||
//       `${backendData.first_name || ''} ${backendData.last_name || ''}`.trim() ||
//       'Unknown',

//     email: backendData.email || '',

//     // ═══════════════════════════════════════════════════════════════════
//     // SCHOOL INFO
//     // ═══════════════════════════════════════════════════════════════════
//     year: safeParseInt(backendData.graduation_year) || new Date().getFullYear(),
//     // graduationYear: safeParseInt(backendData.graduation_year),
//     nameInSchool: backendData.name_in_school || undefined,
//     // department: backendData.department || undefined,
//     houseColor: backendData.house_color || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // CONTACT
//     // ═══════════════════════════════════════════════════════════════════
//     phone: backendData.phone || undefined,
//     alternativePhone: backendData.alternative_phone || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // PROFILE
//     // ═══════════════════════════════════════════════════════════════════
//     photo:
//       backendData.avatar && backendData.avatar !== 'default.png' ? backendData.avatar : undefined,

//     short_bio: backendData.bio || undefined,
//     long_bio: backendData.bio || undefined,
//     birthDate: backendData.birth_date || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // LOCATION
//     // ═══════════════════════════════════════════════════════════════════
//     city: profile.city || backendData.city || undefined,
//     location: profile.city || backendData.city || undefined,
//     area: backendData.area || undefined,
//     residentialAddress: backendData.residential_address || undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // PROFESSIONAL
//     // ═══════════════════════════════════════════════════════════════════
//     position: profile.current_position || undefined,
//     company: profile.current_company || undefined,
//     employmentStatus: backendData.employment_status || undefined,

//     // Convert singular to array for consistency with frontend
//     occupations: backendData.occupation || undefined,
//     industrySectors: backendData.industry_sector || undefined,

//     yearsOfExperience: backendData.years_of_experience
//       ? safeParseInt(backendData.years_of_experience)
//       : undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // SOCIAL LINKS (from nested profile object)
//     // ═══════════════════════════════════════════════════════════════════
//     linkedin: profile.linkedin || undefined,
//     twitter: profile.twitter || undefined,
//     facebook: profile.facebook || undefined,
//     website: profile.website || undefined,
//     // Instagram missing from backend - set to undefined
//     instagram: undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // ACHIEVEMENTS & SKILLS
//     // ═══════════════════════════════════════════════════════════════════
//     skills: parseCommaSeparatedString(profile.skills) as string[],
//     achievements: parseCommaSeparatedString(profile.achievements) as string[],

//     projects: [],
//     work_experience: [],
//     education: [],
//     interests: [],

//     // ═══════════════════════════════════════════════════════════════════
//     // FLAGS (convert "0"/"1" strings to booleans)
//     // ═══════════════════════════════════════════════════════════════════
//     isCoordinator: stringToBoolean(backendData.is_coordinator),
//     isVolunteer: stringToBoolean(backendData.is_volunteer),
//     isApproved: stringToBoolean(backendData.is_approved),
//     isEmailVerified: stringToBoolean(backendData.email_verified),
//     isActive: stringToBoolean(backendData.active),
//     isVisible: profile.is_visible !== false, // Default true

//     // ═══════════════════════════════════════════════════════════════════
//     // TIMESTAMPS
//     // ═══════════════════════════════════════════════════════════════════
//     createdAt: backendData.created_at || unixToISO(backendData.created_on),
//     updatedAt: backendData.updated_at || undefined,
//     lastLogin: backendData.last_login || undefined,
//   };
// }

// /**
//  * Convert array of backend alumni to frontend format
//  */
// export function mapBackendAlumniList(backendList: any[]): Alumni[] {
//   if (!Array.isArray(backendList)) {
//     console.error('Expected array of alumni, got:', typeof backendList);
//     return [];
//   }

//   return backendList
//     .map((item) => {
//       try {
//         return mapBackendAlumniToFrontend(item);
//       } catch (error) {
//         console.error('Failed to map alumni:', item, error);
//         return null;
//       }
//     })
//     .filter((item): item is Alumni => item !== null);
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // HELPER FUNCTIONS
// // ═══════════════════════════════════════════════════════════════════════════

// /**
//  * Generate URL-friendly slug from name and ID
//  */
// function generateSlug(name: string, id: string): string {
//   if (!name || !name.trim()) {
//     return `alumni-${id}`;
//   }

//   return (
//     name
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '')
//       .substring(0, 50) || // Limit length
//     `alumni-${id}`
//   ); // Fallback if slug is empty
// }

// /**
//  * Convert "0"/"1" or 0/1 to boolean
//  */
// function stringToBoolean(value: any): boolean {
//   if (value === true || value === 1 || value === '1') return true;
//   if (value === false || value === 0 || value === '0') return false;
//   return false; // Default to false for null/undefined/empty
// }

// /**
//  * Safely parse string to integer
//  */
// function safeParseInt(value: any): number | undefined {
//   if (value === null || value === undefined || value === '') return undefined;

//   const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
//   return isNaN(parsed) ? undefined : parsed;
// }

// /**
//  * Convert Unix timestamp (seconds) to ISO string
//  */
// function unixToISO(timestamp: any): string | undefined {
//   if (!timestamp) return undefined;

//   const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
//   if (isNaN(ts)) return undefined;

//   return new Date(ts * 1000).toISOString();
// }

// /**
//  * Parse comma-separated string to array
//  */
// function parseCommaSeparatedString(value: any): string[] | undefined {
//   if (!value) return undefined;

//   if (Array.isArray(value)) return value;

//   if (typeof value === 'string') {
//     const parsed = value
//       .split(',')
//       .map((s) => s.trim())
//       .filter((s) => s.length > 0);

//     return parsed.length > 0 ? parsed : undefined;
//   }

//   return undefined;
// }

// /**
//  * ============================================================================
//  * TESTING / DEBUGGING
//  * ============================================================================
//  *
//  * Uncomment this to test the adapter with sample data:
//  *
//  * const sampleBackendData = {
//  *   id: "16",
//  *   email: "test@example.com",
//  *   first_name: "Ochai",
//  *   last_name: "Ohemu",
//  *   graduation_year: "2026",
//  *   is_coordinator: "1",
//  *   // ... rest of backend fields
//  * };
//  *
//  * const frontendData = mapBackendAlumniToFrontend(sampleBackendData);
//  * console.log('Transformed:', frontendData);
//  *
//  * ============================================================================
//  */

// import type { Alumni } from '../../types/alumni.types';

// /**
//  * ============================================================================
//  * STRICT ALUMNI DATA ADAPTER (UI-SAFE)
//  * ============================================================================
//  *
//  * Guarantees:
//  * - No undefined for UI-critical fields (strings, arrays)
//  * - Consistent data shape across app
//  * - Backend inconsistencies handled here ONLY
//  *
//  * ============================================================================
//  */

// // ────────────────────────────────────────────────────────────────────────────
// // MAIN MAPPER
// // ────────────────────────────────────────────────────────────────────────────
// export function mapBackendAlumniToFrontend(backendData: any): Alumni {
//   const profile = backendData.profile || {};

//   const name = safeString(
//     backendData.fullname || `${backendData.first_name || ''} ${backendData.last_name || ''}`.trim(),
//     'Unknown',
//   );

//   const slug = generateSlug(name, backendData.id);

//   const city = safeString(profile.city || backendData.city);

//   return {
//     // ═══════════════════════════════════════════════════════════════════
//     // IDENTITY
//     // ═══════════════════════════════════════════════════════════════════
//     memberId: safeString(backendData.id),
//     slug,

//     // ═══════════════════════════════════════════════════════════════════
//     // BASIC INFO
//     // ═══════════════════════════════════════════════════════════════════
//     name,
//     email: safeString(backendData.email),

//     // ═══════════════════════════════════════════════════════════════════
//     // SCHOOL INFO
//     // ═══════════════════════════════════════════════════════════════════
//     year: safeNumber(backendData.graduation_year, new Date().getFullYear()),
//     nameInSchool: safeString(backendData.name_in_school),
//     houseColor: safeString(backendData.house_color),

//     // ═══════════════════════════════════════════════════════════════════
//     // CONTACT
//     // ═══════════════════════════════════════════════════════════════════
//     phone: safeString(backendData.phone),
//     alternativePhone: optionalString(backendData.alternative_phone),

//     // ═══════════════════════════════════════════════════════════════════
//     // PROFILE (UI-SAFE STRINGS)
//     // ═══════════════════════════════════════════════════════════════════
//     photo:
//       backendData.avatar && backendData.avatar !== 'default.png' ? backendData.avatar : undefined,

//     short_bio: safeString(backendData.bio),
//     long_bio: safeString(backendData.bio),
//     birthDate: optionalString(backendData.birth_date),

//     // ═══════════════════════════════════════════════════════════════════
//     // LOCATION (UI-SAFE)
//     // ═══════════════════════════════════════════════════════════════════
//     city,
//     location: city,
//     area: optionalString(backendData.area),
//     residentialAddress: optionalString(backendData.residential_address),

//     // ═══════════════════════════════════════════════════════════════════
//     // PROFESSIONAL
//     // ═══════════════════════════════════════════════════════════════════
//     position: safeString(profile.current_position),
//     company: safeString(profile.current_company),
//     employmentStatus: optionalString(backendData.employment_status),

//     occupations: optionalStringArray(backendData.occupation),
//     industrySectors: optionalStringArray(backendData.industry_sector),

//     yearsOfExperience: safeOptionalNumber(backendData.years_of_experience),

//     // ═══════════════════════════════════════════════════════════════════
//     // SOCIAL LINKS
//     // ═══════════════════════════════════════════════════════════════════
//     linkedin: optionalString(profile.linkedin),
//     twitter: optionalString(profile.twitter),
//     facebook: optionalString(profile.facebook),
//     website: optionalString(profile.website),
//     instagram: undefined,

//     // ═══════════════════════════════════════════════════════════════════
//     // ARRAYS (ALWAYS SAFE)
//     // ═══════════════════════════════════════════════════════════════════
//     skills: safeArray(parseCommaSeparatedString(profile.skills)),
//     achievements: safeArray(parseCommaSeparatedString(profile.achievements)),

//     projects: [],
//     work_experience: [],
//     education: [],
//     interests: [],

//     // ═══════════════════════════════════════════════════════════════════
//     // FLAGS
//     // ═══════════════════════════════════════════════════════════════════
//     isCoordinator: stringToBoolean(backendData.is_coordinator),
//     isVolunteer: stringToBoolean(backendData.is_volunteer),
//     isApproved: stringToBoolean(backendData.is_approved),
//     isEmailVerified: stringToBoolean(backendData.email_verified),
//     isActive: stringToBoolean(backendData.active),
//     isVisible: profile.is_visible !== false,

//     // ═══════════════════════════════════════════════════════════════════
//     // TIMESTAMPS
//     // ═══════════════════════════════════════════════════════════════════
//     createdAt: safeString(backendData.created_at || unixToISO(backendData.created_on)),
//     updatedAt: safeString(backendData.updated_at),
//     lastLogin: safeString(backendData.last_login),
//   };
// }

// // ────────────────────────────────────────────────────────────────────────────
// // LIST MAPPER
// // ────────────────────────────────────────────────────────────────────────────
// export function mapBackendAlumniList(backendList: any[]): Alumni[] {
//   if (!Array.isArray(backendList)) return [];

//   return backendList
//     .map((item) => {
//       try {
//         return mapBackendAlumniToFrontend(item);
//       } catch (error) {
//         console.error('Failed to map alumni:', item, error);
//         return null;
//       }
//     })
//     .filter((item): item is Alumni => item !== null);
// }

// // ────────────────────────────────────────────────────────────────────────────
// // HELPERS (STRICT + REUSABLE)
// // ────────────────────────────────────────────────────────────────────────────

// function safeString(value: any, fallback = ''): string {
//   if (value === null || value === undefined) return fallback;
//   return String(value).trim();
// }

// function optionalString(value: any): string | undefined {
//   if (value === null || value === undefined || value === '') return undefined;
//   return String(value).trim();
// }

// function safeNumber(value: any, fallback: number): number {
//   const parsed = Number(value);
//   return isNaN(parsed) ? fallback : parsed;
// }

// function safeOptionalNumber(value: any): number | undefined {
//   if (value === null || value === undefined || value === '') return undefined;
//   const parsed = Number(value);
//   return isNaN(parsed) ? undefined : parsed;
// }

// function safeArray<T>(value: T[] | undefined): T[] {
//   return Array.isArray(value) ? value : [];
// }

// function optionalStringArray(value: any): string[] | undefined {
//   const parsed = parseCommaSeparatedString(value);
//   return parsed && parsed.length > 0 ? parsed : undefined;
// }

// function stringToBoolean(value: any): boolean {
//   return value === true || value === 1 || value === '1';
// }

// function unixToISO(timestamp: any): string | undefined {
//   if (!timestamp) return undefined;
//   const ts = Number(timestamp);
//   if (isNaN(ts)) return undefined;
//   return new Date(ts * 1000).toISOString();
// }

// function parseCommaSeparatedString(value: any): string[] | undefined {
//   if (!value) return undefined;

//   if (Array.isArray(value)) return value;

//   if (typeof value === 'string') {
//     const parsed = value
//       .split(',')
//       .map((s) => s.trim())
//       .filter(Boolean);

//     return parsed.length > 0 ? parsed : undefined;
//   }

//   return undefined;
// }

// function generateSlug(name: string, id: string): string {
//   return (
//     name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '')
//       .substring(0, 50) || `alumni-${id}`
//   );
// }

import type { Alumni } from '../../types/alumni.types';
import { generateSlug, safeParseInt, stringToBoolean, safeParseDate } from '@/lib/utils/adapters';

// ─── Helpers (local, minimal) ───────────────────────────────────────────────

const safeString = (v: unknown, fallback = '') => (v ? String(v).trim() : fallback);

const optionalString = (v: unknown) => (v ? String(v).trim() : undefined);

const parseArray = (v: unknown): string[] | undefined => {
  if (!v) return undefined;
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    const arr = v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return arr.length ? arr : undefined;
  }
  return undefined;
};

// ─── Inbound ────────────────────────────────────────────────────────────────

export function mapBackendAlumniToFrontend(raw: unknown): Alumni {
  const d = raw as Record<string, any>;
  const profile = d.profile || {};

  const name = d.fullname || `${d.first_name || ''} ${d.last_name || ''}`.trim() || 'Unknown';

  const city = profile.city || d.city || '';
  const DEFAULT_AVATAR = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=E5E7EB&color=6B7280&size=256`;

  return {
    memberId: String(d.id ?? ''),
    slug: generateSlug(name, d.id ?? '', 'alumni'),

    name,
    email: safeString(d.email),

    year: safeParseInt(d.graduation_year) ?? new Date().getFullYear(),
    nameInSchool: safeString(d.name_in_school),
    houseColor: safeString(d.house_color),

    phone: safeString(d.phone),
    alternativePhone: optionalString(d.alternative_phone),

    photo: d.avatar && d.avatar !== 'default.png' ? String(d.avatar) : DEFAULT_AVATAR,

    short_bio: safeString(d.bio),
    long_bio: safeString(d.bio),
    birthDate: optionalString(d.birth_date),

    city,
    location: city,
    area: optionalString(d.area),
    residentialAddress: optionalString(d.residential_address),

    position: safeString(profile.current_position),
    company: safeString(profile.current_company),
    employmentStatus: optionalString(d.employment_status),

    occupations: parseArray(d.occupation),
    industrySectors: parseArray(d.industry_sector),

    yearsOfExperience: safeParseInt(d.years_of_experience),

    linkedin: optionalString(profile.linkedin),
    twitter: optionalString(profile.twitter),
    facebook: optionalString(profile.facebook),
    website: optionalString(profile.website),
    instagram: undefined,

    skills: parseArray(profile.skills) ?? [],
    achievements: parseArray(profile.achievements) ?? [],

    projects: [],
    work_experience: [],
    education: [],
    interests: [],

    isCoordinator: stringToBoolean(d.is_coordinator) ?? false,
    isVolunteer: stringToBoolean(d.is_volunteer),
    isApproved: stringToBoolean(d.is_approved) ?? false,
    isEmailVerified: stringToBoolean(d.email_verified) ?? false,
    isActive: stringToBoolean(d.active) ?? false,
    isVisible: profile.is_visible !== false,

    createdAt: safeParseDate(d.created_at || d.created_on),
    updatedAt: safeParseDate(d.updated_at),
    lastLogin: safeParseDate(d.last_login),
  };
}

export function mapBackendAlumniList(raw: unknown): Alumni[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      try {
        return mapBackendAlumniToFrontend(item);
      } catch {
        return null;
      }
    })
    .filter((i): i is Alumni => i !== null);
}
