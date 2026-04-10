/**
 * ============================================================================
 * EVENT ATTENDEES ADAPTER (ADMIN)
 * ============================================================================
 *
 * Maps backend event attendee data to clean frontend types.
 * Used by admin to view and manage event registrations.
 *
 * Backend: POST /api/get_event_attendees { event_id: "1", status?: "going" }
 *
 * ============================================================================
 */

export type AttendeeStatus = 'going' | 'maybe' | 'not_going' | '';

export interface EventAttendee {
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  graduationYear?: number;
  status: AttendeeStatus;
  registeredAt: string; // ISO date
  guestCount?: number;
}

export interface EventAttendeeSummary {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  totalRegistrations: number;
  goingCount: number;
  maybeCount: number;
  notGoingCount: number;
  attendees: EventAttendee[];
}

// ═══════════════════════════════════════════════════════════════════════════
// OUTBOUND (Frontend → Backend)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Payload for getting event attendees
 *
 * POST /api/get_event_attendees
 * {
 *   "event_id": "1",
 *   "status": "going"  // optional
 * }
 */
export function createGetAttendeesPayload(eventId: string, status?: AttendeeStatus) {
  const payload: Record<string, any> = {
    event_id: eventId,
  };

  //   if (status && status !== '') {
  if (status) {
    payload.status = status;
  }

  return payload;
}

// ═══════════════════════════════════════════════════════════════════════════
// INBOUND (Backend → Frontend)
// ═══════════════════════════════════════════════════════════════════════════

export function mapBackendAttendee(raw: any): EventAttendee | null {
  try {
    const userId = raw?.user_id ?? raw?.userId ?? raw?.id;
    if (!userId) return null;

    return {
      userId: String(userId),
      fullName: raw?.fullname ?? raw?.full_name ?? raw?.name ?? 'Unknown',
      email: raw?.email ?? '',
      phone: raw?.phone || undefined,
      graduationYear: safeParseInt(raw?.graduation_year ?? raw?.graduationYear),
      status: normalizeStatus(raw?.status ?? raw?.rsvp_status),
      registeredAt: safeParseDate(raw?.registered_at ?? raw?.registeredAt ?? raw?.created_at),
      guestCount: safeParseInt(raw?.guest_count ?? raw?.guestCount),
    };
  } catch (error) {
    console.error('Failed to map attendee:', error);
    return null;
  }
}

export function mapAttendeesResponse(raw: any): EventAttendeeSummary | null {
  try {
    const event = raw?.event ?? {};
    const summary = raw?.summary ?? {};
    const attendeesList = raw?.attendees ?? raw?.data ?? [];

    const attendees = (Array.isArray(attendeesList) ? attendeesList : [])
      .map(mapBackendAttendee)
      .filter((a): a is EventAttendee => a !== null);

    return {
      eventId: String(event?.id ?? event?.event_id ?? ''),
      eventTitle: event?.title ?? event?.name ?? 'Unknown Event',
      eventDate: event?.date ?? event?.event_date ?? '',
      totalRegistrations: safeParseInt(summary?.total) ?? attendees.length,
      goingCount: safeParseInt(summary?.going) ?? 0,
      maybeCount: safeParseInt(summary?.maybe) ?? 0,
      notGoingCount: safeParseInt(summary?.not_going) ?? 0,
      attendees,
    };
  } catch (error) {
    console.error('Failed to map attendees response:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function safeParseInt(value: any): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? undefined : parsed;
}

function safeParseDate(value: any): string {
  if (!value) return new Date().toISOString();

  // Already ISO string
  if (typeof value === 'string' && value.includes('T')) return value;

  // Unix timestamp (seconds)
  const asInt = parseInt(String(value), 10);
  if (!isNaN(asInt) && asInt > 1_000_000_000) {
    return new Date(asInt * 1000).toISOString();
  }

  // Try native parsing
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

/**
 * Normalize status from backend
 */
function normalizeStatus(status: any): AttendeeStatus {
  if (!status || status === '') return 'not_going';
  const normalized = String(status).toLowerCase();
  if (normalized === 'going') return 'going';
  if (normalized === 'maybe') return 'maybe';
  if (normalized === 'not_going' || normalized === 'not-going') return 'not_going';
  return '';
}
