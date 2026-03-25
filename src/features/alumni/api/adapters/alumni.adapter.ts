import type { Alumni } from '../../types/alumni.types';

/**
 * ============================================================================
 * ALUMNI DATA ADAPTER
 * ============================================================================
 * 
 * This adapter transforms the messy backend alumni data into clean frontend format.
 * 
 * WHEN BACKEND CHANGES:
 * - Just update the mappings in mapBackendAlumniToFrontend()
 * - Rest of your app stays unchanged
 * 
 * HANDLES:
 * - Numeric strings → numbers (e.g., "2026" → 2026)
 * - Boolean strings → booleans (e.g., "0"/"1" → false/true)
 * - Unix timestamps → ISO dates (e.g., "1773214575" → "2026-03-11T08:36:15.000Z")
 * - null → undefined
 * - Nested profile object → flattened fields
 * - Missing fields → sensible defaults
 * 
 * ============================================================================
 */

/**
 * Convert a single backend alumni object to frontend Alumni type
 */
export function mapBackendAlumniToFrontend(backendData: any): Alumni {
  // Extract nested profile data
  const profile = backendData.profile || {};
  
  // Generate slug from name
  const slug = generateSlug(
    backendData.fullname || `${backendData.first_name || ''} ${backendData.last_name || ''}`,
    backendData.id
  );
  
  return {
    // ═══════════════════════════════════════════════════════════════════
    // IDENTITY
    // ═══════════════════════════════════════════════════════════════════
    memberId: String(backendData.id),
    slug,
    
    // ═══════════════════════════════════════════════════════════════════
    // BASIC INFO
    // ═══════════════════════════════════════════════════════════════════
    name: backendData.fullname || 
          `${backendData.first_name || ''} ${backendData.last_name || ''}`.trim() ||
          'Unknown',
    
    email: backendData.email || '',
    
    // ═══════════════════════════════════════════════════════════════════
    // SCHOOL INFO
    // ═══════════════════════════════════════════════════════════════════
    year: safeParseInt(backendData.graduation_year) || new Date().getFullYear(),
    // graduationYear: safeParseInt(backendData.graduation_year),
    nameInSchool: backendData.name_in_school || undefined,
    // department: backendData.department || undefined,
    houseColor: backendData.house_color || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // CONTACT
    // ═══════════════════════════════════════════════════════════════════
    phone: backendData.phone || undefined,
    alternativePhone: backendData.alternative_phone || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // PROFILE
    // ═══════════════════════════════════════════════════════════════════
    photo: backendData.avatar && backendData.avatar !== 'default.png'
      ? backendData.avatar
      : undefined,
    
    short_bio: backendData.bio || undefined,
    long_bio: backendData.bio || undefined,
    birthDate: backendData.birth_date || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // LOCATION
    // ═══════════════════════════════════════════════════════════════════
    city: profile.city || backendData.city || undefined,
    location: profile.city || backendData.city || undefined,
    area: backendData.area || undefined,
    residentialAddress: backendData.residential_address || undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // PROFESSIONAL
    // ═══════════════════════════════════════════════════════════════════
    position: profile.current_position || undefined,
    company: profile.current_company || undefined,
    employmentStatus: backendData.employment_status || undefined,
    
    // Convert singular to array for consistency with frontend
    occupations: backendData.occupation || undefined,
    industrySectors: backendData.industry_sector || undefined,
    
    yearsOfExperience: backendData.years_of_experience
      ? safeParseInt(backendData.years_of_experience)
      : undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // SOCIAL LINKS (from nested profile object)
    // ═══════════════════════════════════════════════════════════════════
    linkedin: profile.linkedin || undefined,
    twitter: profile.twitter || undefined,
    facebook: profile.facebook || undefined,
    website: profile.website || undefined,
    // Instagram missing from backend - set to undefined
    instagram: undefined,
    
    // ═══════════════════════════════════════════════════════════════════
    // ACHIEVEMENTS & SKILLS
    // ═══════════════════════════════════════════════════════════════════
    skills: parseCommaSeparatedString(profile.skills) as string[],
    achievements: parseCommaSeparatedString(profile.achievements) as string[],

      projects: [],
  work_experience: [],
  education: [],
  interests: [],
    
    // ═══════════════════════════════════════════════════════════════════
    // FLAGS (convert "0"/"1" strings to booleans)
    // ═══════════════════════════════════════════════════════════════════
    isCoordinator: stringToBoolean(backendData.is_coordinator),
    isVolunteer: stringToBoolean(backendData.is_volunteer),
    isApproved: stringToBoolean(backendData.is_approved),
    isEmailVerified: stringToBoolean(backendData.email_verified),
    isActive: stringToBoolean(backendData.active),
    isVisible: profile.is_visible !== false, // Default true
    
    // ═══════════════════════════════════════════════════════════════════
    // TIMESTAMPS
    // ═══════════════════════════════════════════════════════════════════
    createdAt: backendData.created_at || unixToISO(backendData.created_on),
    updatedAt: backendData.updated_at || undefined,
    lastLogin: backendData.last_login || undefined,
  };
}

/**
 * Convert array of backend alumni to frontend format
 */
export function mapBackendAlumniList(backendList: any[]): Alumni[] {
  if (!Array.isArray(backendList)) {
    console.error('Expected array of alumni, got:', typeof backendList);
    return [];
  }
  
  return backendList
    .map((item) => {
      try {
        return mapBackendAlumniToFrontend(item);
      } catch (error) {
        console.error('Failed to map alumni:', item, error);
        return null;
      }
    })
    .filter((item): item is Alumni => item !== null);
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate URL-friendly slug from name and ID
 */
function generateSlug(name: string, id: string): string {
  if (!name || !name.trim()) {
    return `alumni-${id}`;
  }
  
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) // Limit length
    || `alumni-${id}`; // Fallback if slug is empty
}

/**
 * Convert "0"/"1" or 0/1 to boolean
 */
function stringToBoolean(value: any): boolean {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return false; // Default to false for null/undefined/empty
}

/**
 * Safely parse string to integer
 */
function safeParseInt(value: any): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  
  const parsed = typeof value === 'string' ? parseInt(value, 10) : Number(value);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Convert Unix timestamp (seconds) to ISO string
 */
function unixToISO(timestamp: any): string | undefined {
  if (!timestamp) return undefined;
  
  const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  if (isNaN(ts)) return undefined;
  
  return new Date(ts * 1000).toISOString();
}

/**
 * Parse comma-separated string to array
 */
function parseCommaSeparatedString(value: any): string[] | undefined {
  if (!value) return undefined;
  
  if (Array.isArray(value)) return value;
  
  if (typeof value === 'string') {
    const parsed = value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    return parsed.length > 0 ? parsed : undefined;
  }
  
  return undefined;
}

/**
 * ============================================================================
 * TESTING / DEBUGGING
 * ============================================================================
 * 
 * Uncomment this to test the adapter with sample data:
 * 
 * const sampleBackendData = {
 *   id: "16",
 *   email: "test@example.com",
 *   first_name: "Ochai",
 *   last_name: "Ohemu",
 *   graduation_year: "2026",
 *   is_coordinator: "1",
 *   // ... rest of backend fields
 * };
 * 
 * const frontendData = mapBackendAlumniToFrontend(sampleBackendData);
 * console.log('Transformed:', frontendData);
 * 
 * ============================================================================
 */