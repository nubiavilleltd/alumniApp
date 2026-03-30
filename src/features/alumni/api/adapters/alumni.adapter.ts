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
