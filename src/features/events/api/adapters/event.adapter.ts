import type { Event } from '../../types/event.types';
import {
  generateSlug,
  safeParseInt,
  stringToBoolean,
  extractList,
  safeParseDate,
} from '@/lib/utils/adapters';

function mapRSVPStatus(status: unknown): 'going' | 'maybe' | 'not_going' | null {
  if (!status || status === '') return 'not_going'; // clean "unregistered"

  const map: Record<string, 'going' | 'maybe' | 'not_going'> = {
    going: 'going',
    maybe: 'maybe',
    not_going: 'not_going',
  };

  return map[String(status)] ?? null;
}

// ─────────────────────────────────────────────────────────────
// Inbound (backend → frontend)
// ─────────────────────────────────────────────────────────────

export function mapBackendEventToFrontend(raw: unknown): Event {
  const d = raw as Record<string, any>;

  return {
    id: String(d.id ?? ''),
    slug: generateSlug(d.title ?? 'event', d.id ?? '', 'event'),

    title: d.title ?? 'Untitled Event',
    description: d.description ?? '',
    content: d.description ?? '',

    image: d.event_banner || '',

    date: safeParseDate(d.event_date),

    startTime: d.start_time?.slice(0, 5),
    endTime: d.end_time?.slice(0, 5),

    location: d.location ?? '',

    isVirtual: stringToBoolean(d.is_virtual) ?? false,
    virtualLink: d.virtual_link || undefined,
    attire: d.attire || undefined,
    category: d.category || undefined,
    tags: parseTags(d.tags).map((tag) => tag.trim().toLowerCase()),

    featured: stringToBoolean(d.is_featured) ?? false,

    status: mapStatus(d.status, d.event_date),

    capacity: safeParseInt(d.max_attendees),
    allowGuests: stringToBoolean(d.allow_guests) ?? false,

    createdBy: d.created_by_name || d.created_by || 'Organizer',
    attendeeCount: safeParseInt(d.attendee_count),

    registrations: [],

    createdAt: safeParseDate(d.created_at),
    publishedAt: d.created_at,
    updatedAt: d.updated_at,

    type: d.category || 'event',
    rsvpStatus: mapRSVPStatus(d.my_rsvp),
  };
}

export function mapBackendEventList(raw: unknown): Event[] {
  const list = extractList(raw, ['events', 'data']);

  return list
    .map((i) => {
      try {
        return mapBackendEventToFrontend(i);
      } catch {
        return null;
      }
    })
    .filter((i): i is Event => i !== null);
}

// ─────────────────────────────────────────────────────────────
// Outbound (frontend → backend)
// ─────────────────────────────────────────────────────────────

export function mapEventToCreatePayload(
  formData: {
    title: string;
    description: string;
    location: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    color?: string;
    visibility?: string;
    status: string;
    max_attendees?: number;
    event_banner?: File | null;
  },
  userId: string,
  chapterId?: string,
): FormData | Record<string, unknown> {
  const base: Record<string, unknown> = {
    user_id: userId,
    chapter_id: chapterId,
    title: formData.title,
    description: formData.description,
    location: formData.location,
    event_date: formData.event_date,
    status: formData.status || 'upcoming',
    visibility: formData.visibility || 'public',
    is_approved: '1',
  };

  if (chapterId) base.chapter_id = chapterId;
  if (formData.start_time) base.start_time = formData.start_time;
  if (formData.end_time) base.end_time = formData.end_time;
  if (formData.color) base.color = formData.color;
  if (formData.max_attendees) base.max_attendees = String(formData.max_attendees);

  if (formData.event_banner) {
    const fd = new FormData();

    Object.entries(base).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        fd.append(k, String(v));
      }
    });

    fd.append('event_banner', formData.event_banner);
    fd.append('chapter_id', chapterId as string);

    return fd;
  }

  return base;
}

export function mapEventToUpdatePayload(
  eventId: string,
  formData: {
    title: string;
    description: string;
    location: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    color?: string;
    visibility?: string;
    max_attendees?: number;
    status?: string;
  },
): Record<string, unknown> {
  const base: Record<string, unknown> = {
    id: eventId,
    function_type: 'update',
    title: formData.title,
    description: formData.description,
    location: formData.location,
    event_date: formData.event_date,
  };

  if (formData.start_time) base.start_time = formData.start_time;
  if (formData.end_time) base.end_time = formData.end_time;
  if (formData.color) base.color = formData.color;
  if (formData.visibility) base.visibility = formData.visibility;
  if (formData.max_attendees) base.max_attendees = String(formData.max_attendees);
  if (formData.status) base.status = formData.status;

  return base;
}

export function mapEventToDeletePayload(eventId: string): Record<string, unknown> {
  return {
    id: eventId,
    function_type: 'delete',
  };
}

export function mapGetSingleEventPayload(eventId: string): Record<string, unknown> {
  return {
    id: eventId,
  };
}

export function mapFilterEventsPayload(params: {
  search?: string;
  visibility?: string;
  status?: string;
  chapterId?: string;
  year?: string;
}): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (params.visibility) payload.visibility = params.visibility;
  if (params.status) payload.status = params.status;
  if (params.chapterId) payload.chapter_id = params.chapterId;
  if (params.year) payload.year = params.year;

  if (!payload.status && !payload.visibility) {
    payload.status = 'upcoming';
  }

  return payload;
}

// ─────────────────────────────────────────────────────────────
// RSVP / Attendees
// ─────────────────────────────────────────────────────────────

export function mapRegisterEventPayload(
  userId: string,
  eventId: string,
  status: 'going' | 'maybe' | 'not_going' = 'going',
  additionalInfo: string,
): Record<string, unknown> {
  return {
    user_id: userId,
    event_id: eventId,
    status,
    year: new Date().getFullYear().toString(),
    additional_info: additionalInfo,
  };
}

export function mapCancelRegistrationPayload(
  userId: string,
  eventId: string,
): Record<string, unknown> {
  return {
    user_id: userId,
    event_id: eventId,
    function_type: 'cancel',
  };
}

export function mapUpdateRSVPPayload(
  userId: string,
  eventId: string,
  status: 'going' | 'maybe' | 'not_going',
): Record<string, unknown> {
  return {
    user_id: userId,
    event_id: eventId,
    function_type: 'update',
    status,
  };
}

export function mapGetEventAttendeesPayload(
  eventId: string,
  status?: string,
): Record<string, unknown> {
  const payload: Record<string, unknown> = { event_id: eventId };

  if (status) payload.status = status;

  return payload;
}

export function mapGetUserEventsPayload(userId: string): Record<string, unknown> {
  return {
    user_id: userId,
  };
}

// ─────────────────────────────────────────────────────────────
// Adapter-only helpers
// ─────────────────────────────────────────────────────────────

function mapStatus(status: string, date: string) {
  //   if (!status) {
  //     return new Date(date) < new Date() ? 'completed' : 'published';
  //   }

  if (!status) {
    return new Date(date + 'Z') < new Date() ? 'completed' : 'published';
  }

  const map: Record<string, any> = {
    upcoming: 'published',
    active: 'published',
    cancelled: 'cancelled',
    completed: 'completed',
    draft: 'draft',
  };

  return map[status] || 'published';
}

function parseTags(v: unknown): string[] {
  if (!v) return [];

  if (Array.isArray(v)) return v;

  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return v
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }

  return [];
}
