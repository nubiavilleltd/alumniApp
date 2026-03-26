// features/admin/api/adapters/adminDashboard.adapter.ts
//
// Maps between the backend's admin API responses and the clean frontend types.
//
// UPDATE THIS FILE when the backend changes — nothing else needs to touch.
//
// Backend contract (current — unstable, subject to change):
//   POST /api/approve_user         → approve or reject a member
//   POST /api/admin/members/list   → get members by action_type flag
//     payload: { action_type: "pending Approval" | "approved" }
//
// ─── Notes on known backend quirks ───────────────────────────────────────────
//   • user_id comes back as a number or numeric string — we always stringify
//   • The approve/reject endpoint wants jwt in the body, but our axios
//     interceptor injects it as `token`. We rename it here so we don't break
//     the interceptor which other calls depend on.
//   • submittedAt / joinedAt may be a Unix timestamp (seconds), an ISO string,
//     or missing entirely — safeParseDate handles all three cases.
//   • The member list response may come back as { users: [...] } or as a bare
//     array — mapMembersResponse handles both.
// ─────────────────────────────────────────────────────────────────────────────

import type { PendingMember, RecentMember } from '../adminDashboardApi';

// ─── Outbound payloads (frontend → backend) ───────────────────────────────────

export type MemberActionType = 'pending Approval' | 'approved';

/** Body sent to POST /api/admin/members/list */
export function buildMemberListPayload(actionType: MemberActionType) {
  return {
    action_type: actionType,
    // jwt is intentionally absent — the axios interceptor injects `token`
    // which the backend reads. If the backend later requires `jwt` instead,
    // add: jwt: <token from store> and remove from interceptor.
  };
}

/** Body sent to POST /api/approve_user */
export function buildApprovePayload(userId: string, rejectReason?: string) {
  return {
    user_id: userId,
    action: 'approve',
    // jwt injected automatically by axios interceptor as `token`
    ...(rejectReason ? {} : {}), // no extra fields for approve
  };
}

export function buildRejectPayload(userId: string, rejectReason?: string) {
  return {
    user_id: userId,
    action: 'reject',
    // jwt injected automatically by axios interceptor as `token`
    ...(rejectReason ? { reject_reason: rejectReason } : {}),
  };
}

// ─── Inbound responses (backend → frontend) ───────────────────────────────────

/**
 * Maps a single raw member object from the backend into PendingMember.
 * Handles numeric IDs, missing names, and various date formats.
 */
export function mapBackendMemberToPending(raw: any): PendingMember | null {
  try {
    const id = raw?.user_id ?? raw?.id ?? raw?.userId;
    if (!id) return null;

    const firstName = raw?.first_name ?? raw?.firstName ?? raw?.otherNames ?? '';
    const lastName = raw?.last_name ?? raw?.lastName ?? raw?.surname ?? '';
    const fullName =
      (raw?.fullname ?? raw?.full_name ?? raw?.fullName ?? `${firstName} ${lastName}`.trim()) ||
      'Unknown';

    return {
      id: String(id),
      fullName,
      nameInSchool: raw?.name_in_school ?? raw?.nameInSchool ?? fullName,
      email: raw?.email ?? '',
      graduationYear: safeParseInt(raw?.graduation_year ?? raw?.graduationYear) ?? 0,
      submittedAt: safeParseDate(
        raw?.submitted_at ?? raw?.submittedAt ?? raw?.created_at ?? raw?.created_on,
      ),
    };
  } catch {
    return null;
  }
}

/**
 * Maps a single raw member object into RecentMember (approved members list).
 */
export function mapBackendMemberToRecent(raw: any): RecentMember | null {
  try {
    const id = raw?.user_id ?? raw?.id ?? raw?.userId;
    if (!id) return null;

    const firstName = raw?.first_name ?? raw?.firstName ?? raw?.otherNames ?? '';
    const lastName = raw?.last_name ?? raw?.lastName ?? raw?.surname ?? '';
    const fullName =
      (raw?.fullname ?? raw?.full_name ?? raw?.fullName ?? `${firstName} ${lastName}`.trim()) ||
      'Unknown';

    const slug =
      (raw?.slug ??
        fullName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')) ||
      `member-${id}`;

    return {
      name: fullName,
      email: raw?.email ?? '',
      joinedAt: safeParseDate(
        raw?.approved_at ?? raw?.approvedAt ?? raw?.created_at ?? raw?.created_on,
      ),
      slug,
    };
  } catch {
    return null;
  }
}

/**
 * Handles both { users: [...] } and bare array responses.
 * Filters out any nulls from failed mappings.
 */
export function mapMemberListResponse(
  rawResponse: any,
  mapper: (raw: any) => PendingMember | RecentMember | null,
): (PendingMember | RecentMember)[] {
  const list: any[] = Array.isArray(rawResponse)
    ? rawResponse
    : Array.isArray(rawResponse?.users)
      ? rawResponse.users
      : Array.isArray(rawResponse?.data)
        ? rawResponse.data
        : Array.isArray(rawResponse?.members)
          ? rawResponse.members
          : [];

  return list
    .map((item) => {
      try {
        return mapper(item);
      } catch {
        return null;
      }
    })
    .filter((item): item is PendingMember | RecentMember => item !== null);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeParseInt(value: any): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? undefined : parsed;
}

/**
 * Accepts ISO strings, Unix timestamps (seconds), or returns a fallback.
 */
function safeParseDate(value: any): string {
  if (!value) return new Date().toISOString();

  // Already an ISO-looking string
  if (typeof value === 'string' && value.includes('T')) return value;

  // Unix timestamp (seconds)
  const asInt = parseInt(String(value), 10);
  if (!isNaN(asInt) && asInt > 1_000_000_000) {
    return new Date(asInt * 1000).toISOString();
  }

  // Try native Date parsing as last resort
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}
