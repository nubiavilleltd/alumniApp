/**
 * ============================================================================
 * LEADERSHIP ADAPTER
 * ============================================================================
 *
 * Transforms between backend leadership data and frontend LeadershipMember type
 *
 * BACKEND STRUCTURE:
 * - user_id (ID of the user assigned to this position)
 * - position_title (e.g., "President", "Vice President")
 * - message (President's welcome message)
 * - photo (resolved: leadership_photo > user avatar > null)
 * - is_featured (1 = President/featured, 0 = regular team member)
 * - sort_order (display order)
 *
 * FRONTEND STRUCTURE:
 * - LeadershipMember with clean field names
 * - featured boolean instead of 0/1
 * - role instead of position_title
 *
 * ============================================================================
 */

import type { LeadershipMember } from '../types/leadership.types';

/**
 * Helper: Generate initials avatar as fallback
 */
function generateInitialsAvatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=E5E7EB&color=6B7280&size=256`;
}

/**
 * Helper: Resolve photo URL
 * Priority: leadership_photo > user avatar > initials
 */
function resolvePhotoUrl(photoField: any, name: string): string {
  const hasRealPhoto =
    photoField &&
    photoField !== 'default.png' &&
    photoField !== '' &&
    !String(photoField).includes('ui-avatars.com');

  return hasRealPhoto ? String(photoField) : generateInitialsAvatar(name);
}

/**
 * Map single backend leader to frontend LeadershipMember
 */
export function mapBackendLeaderToFrontend(raw: any): LeadershipMember {
  const fullname = raw.fullname || raw.full_name || raw.name || 'Unknown';

  return {
    // ═══════════════════════════════════════════════════════════════════
    // IDs & Relations
    // ═══════════════════════════════════════════════════════════════════
    id: Number(raw.id),
    memberId: String(raw.user_id),
    chapterId: raw.chapter_id ? String(raw.chapter_id) : undefined,

    // ═══════════════════════════════════════════════════════════════════
    // Identity
    // ═══════════════════════════════════════════════════════════════════
    name: fullname,
    role: raw.position_title || raw.role || 'Member',
    image: resolvePhotoUrl(raw.photo, fullname),

    // ═══════════════════════════════════════════════════════════════════
    // Optional Fields
    // ═══════════════════════════════════════════════════════════════════
    featured: raw.is_featured === 1 || raw.is_featured === '1' || raw.is_featured === true,
    bio: raw.message || raw.bio || undefined,
    since: raw.created_at || raw.year || undefined,
  };
}

/**
 * Map array of backend leaders to frontend LeadershipMembers
 */
export function mapBackendLeadersToFrontend(raw: any[]): LeadershipMember[] {
  if (!Array.isArray(raw)) {
    console.error('Expected array of leaders, got:', typeof raw);
    return [];
  }

  return raw
    .map((leader) => {
      try {
        return mapBackendLeaderToFrontend(leader);
      } catch (error) {
        console.error('Failed to map leader:', leader, error);
        return null;
      }
    })
    .filter((item): item is LeadershipMember => item !== null);
}

/**
 * Extract featured leader and team from backend response
 *
 * Backend returns:
 * {
 *   featured: [{ ...president }],
 *   team: [{ ...otherLeaders }],
 *   all: [{ ...allLeaders }]
 * }
 */
export function extractLeadershipFromResponse(data: any): {
  featured: LeadershipMember | null;
  team: LeadershipMember[];
  all: LeadershipMember[];
} {
  // Handle different response structures
  let rawData = data;

  // Unwrap if nested in 'data' or 'leadership'
  if (data.data) rawData = data.data;
  if (data.leadership) rawData = data.leadership;

  // If response has 'featured', 'team', and 'all' keys (backend structure)
  if (rawData.featured || rawData.team || rawData.all) {
    const featuredArray = Array.isArray(rawData.featured)
      ? rawData.featured
      : rawData.featured
        ? [rawData.featured]
        : [];

    return {
      featured: featuredArray.length > 0 ? mapBackendLeaderToFrontend(featuredArray[0]) : null,
      team: mapBackendLeadersToFrontend(rawData.team || []),
      all: mapBackendLeadersToFrontend(rawData.all || []),
    };
  }

  // If response is just an array of leaders
  if (Array.isArray(rawData)) {
    const mapped = mapBackendLeadersToFrontend(rawData);
    const featured = mapped.find((m) => m.featured) || null;
    const team = mapped.filter((m) => !m.featured);

    return {
      featured,
      team,
      all: mapped,
    };
  }

  // Fallback: empty response
  console.warn('Unexpected leadership response structure:', data);
  return {
    featured: null,
    team: [],
    all: [],
  };
}
