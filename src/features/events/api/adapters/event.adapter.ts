// features/events/api/adapters/events.adapter.ts

import type { Event } from '../../types/event.types';

/**
 * ============================================================================
 * EVENTS DATA ADAPTER
 * ============================================================================
 *
 * This adapter transforms the backend event data into the frontend Event format.
 *
 * BACKEND (event) → FRONTEND (Event)
 * - id → id
 * - title → title
 * - event_banner → image
 * - description → description
 * - location → location
 * - event_date → date
 * - start_time → startTime
 * - end_time → endTime
 * - color → color (for calendar)
 * - status → status
 * - visibility → visibility
 * - max_attendees → capacity
 * - attendee_count → used for registration count
 * - created_by_name → createdBy (for display)
 * - is_approved → isApproved
 *
 * ============================================================================
 */

/**
 * Convert a single backend event to frontend Event type
 */
export function mapBackendEventToFrontend(backendData: any): Event {
  // Parse event_date (YYYY-MM-DD) to ISO string
  const eventDate = backendData.event_date
    ? new Date(backendData.event_date).toISOString()
    : new Date().toISOString();

  // Handle image URL - use event_banner or default
  const image =
    backendData.event_banner && backendData.event_banner !== '' ? backendData.event_banner : '';

  // Generate slug from title and id
  const slug = generateSlug(backendData.title || 'event', backendData.id);

  // Parse tags (could be comma-separated or JSON)
  const tags = parseTags(backendData.tags);

  return {
    id: String(backendData.id),
    slug,
    title: backendData.title || 'Untitled Event',
    description: backendData.description || '',
    content: backendData.description || '', // Content is same as description for now
    image,
    date: eventDate,
    startTime: backendData.start_time ? formatTime(backendData.start_time) : undefined,
    endTime: backendData.end_time ? formatTime(backendData.end_time) : undefined,
    location: backendData.location || '',
    isVirtual: false, // No virtual flag in backend yet
    virtualLink: undefined,
    attire: '', // Not in backend yet
    category: '', // Not in backend yet
    tags,
    featured: stringToBoolean(backendData.is_featured),
    status: mapStatus(backendData.status, backendData.event_date),
    capacity: safeParseInt(backendData.max_attendees),
    allowGuests: false, // Not in backend yet
    // createdBy: backendData.created_by_name || `User ${backendData.created_by}`,
    createdBy: backendData.created_by_name || backendData.created_by || 'Organizer',
    registrations: [], // Not populated in list view
    createdAt: backendData.created_at || new Date().toISOString(),
    publishedAt: backendData.created_at,
    updatedAt: backendData.updated_at,
    // Legacy
    type: backendData.category || 'event',
  };
}

/**
 * Convert array of backend events to frontend Event array
 */
// features/events/api/adapters/events.adapter.ts

/**
 * Convert array of backend events to frontend Event array with deduplication
 */
export function mapBackendEventList(backendList: any[]): Event[] {
  if (!Array.isArray(backendList)) {
    console.error('Expected array of events, got:', typeof backendList);
    return [];
  }

  console.log('Mapping backend events:', backendList.length);

  const mapped = backendList
    .map((item, index) => {
      try {
        return mapBackendEventToFrontend(item);
      } catch (error) {
        console.error('Failed to map event:', item, error);
        return null;
      }
    })
    .filter((item): item is Event => item !== null);

  // Deduplicate by title + date combination
  // This keeps the first occurrence of each unique event
  const uniqueKeyMap = new Map<string, Event>();

  mapped.forEach((event) => {
    // Create a unique key from title and date (ignore time)
    const eventDate = new Date(event.date);
    const dateKey = eventDate.toISOString().split('T')[0];
    const uniqueKey = `${event.title}|${dateKey}`;

    // Only keep the first occurrence of each unique event
    if (!uniqueKeyMap.has(uniqueKey)) {
      uniqueKeyMap.set(uniqueKey, event);
    } else {
      console.log(`Skipping duplicate event: ${event.title} on ${dateKey} (ID: ${event.id})`);
    }
  });

  const uniqueEvents = Array.from(uniqueKeyMap.values());
  console.log(`Original: ${mapped.length}, After dedup: ${uniqueEvents.length}`);
  console.log(
    'Unique events:',
    uniqueEvents.map((e) => ({ id: e.id, title: e.title, date: e.date })),
  );

  return uniqueEvents;
}

/**
 * Convert frontend event form data to backend create event payload
 * POST /api/create_event
 */
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
    max_attendees?: number;
    event_banner?: File | null;
  },
  userId: string,
  chapterId?: string,
): FormData | Record<string, any> {
  const baseData: Record<string, any> = {
    user_id: userId,
    title: formData.title,
    description: formData.description,
    location: formData.location,
    event_date: formData.event_date,
    status: 'upcoming',
    visibility: formData.visibility || 'public',
    is_approved: '1', // Auto-approve for now
  };

  // Optional fields
  if (chapterId) baseData.chapter_id = chapterId;
  if (formData.start_time) baseData.start_time = formData.start_time;
  if (formData.end_time) baseData.end_time = formData.end_time;
  if (formData.color) baseData.color = formData.color;
  if (formData.max_attendees) baseData.max_attendees = String(formData.max_attendees);

  // Note: year is set by backend based on event_date, we don't need to send it

  // If there's a banner image, use FormData
  if (formData.event_banner) {
    const payload = new FormData();

    Object.entries(baseData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    });

    payload.append('event_banner', formData.event_banner);

    console.log('📦 Sending event FormData with banner');
    return payload;
  }

  console.log('📦 Sending event JSON:', baseData);
  return baseData;
}
/**
 * Convert frontend event form data to backend update event payload
 * POST /api/manage_event with function_type: "update"
 */
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
): any {
  const baseData: Record<string, any> = {
    id: eventId,
    function_type: 'update',
    title: formData.title,
    description: formData.description,
    location: formData.location,
    event_date: formData.event_date,
  };

  // Optional fields
  if (formData.start_time) baseData.start_time = formData.start_time;
  if (formData.end_time) baseData.end_time = formData.end_time;
  if (formData.color) baseData.color = formData.color;
  if (formData.visibility) baseData.visibility = formData.visibility;
  if (formData.max_attendees) baseData.max_attendees = String(formData.max_attendees);
  if (formData.status) baseData.status = formData.status;

  return baseData;
}

/**
 * Create payload for deleting an event
 */
export function mapEventToDeletePayload(eventId: string): any {
  return {
    id: eventId,
    function_type: 'delete',
  };
}

/**
 * Create payload for fetching a single event
 */
export function mapGetSingleEventPayload(eventId: string): any {
  return {
    id: eventId,
  };
}

/**
 * Create payload for fetching events with filters
 */
export function mapFilterEventsPayload(params: {
  search?: string;
  visibility?: string;
  status?: string;
  chapterId?: string;
  year?: string;
}): any {
  const payload: any = {};

  if (params.visibility) payload.visibility = params.visibility;
  if (params.status) payload.status = params.status;
  if (params.chapterId) payload.chapter_id = params.chapterId;
  if (params.year) payload.year = params.year;

  // Default to active/upcoming events
  if (!payload.status && !payload.visibility) {
    payload.status = 'upcoming';
  }

  return payload;
}

/**
 * Create payload for registering for an event (RSVP)
 * POST /api/register_event
 */
export function mapRegisterEventPayload(
  userId: string,
  eventId: string,
  status: 'going' | 'maybe' | 'not_going' = 'going',
): any {
  return {
    user_id: userId,
    event_id: eventId,
    status,
    year: new Date().getFullYear().toString(),
  };
}

/**
 * Create payload for cancelling event registration
 * POST /api/manage_event_rsvp with function_type: "cancel"
 */
export function mapCancelRegistrationPayload(userId: string, eventId: string): any {
  return {
    user_id: userId,
    event_id: eventId,
    function_type: 'cancel',
  };
}

/**
 * Create payload for updating RSVP status
 * POST /api/manage_event_rsvp with function_type: "update"
 */
export function mapUpdateRSVPPayload(
  userId: string,
  eventId: string,
  status: 'going' | 'maybe' | 'not_going',
): any {
  return {
    user_id: userId,
    event_id: eventId,
    function_type: 'update',
    status,
  };
}

/**
 * Create payload for getting event attendees
 * POST /api/get_event_attendees
 */
export function mapGetEventAttendeesPayload(eventId: string, status?: string): any {
  const payload: any = { event_id: eventId };
  if (status) payload.status = status;
  return payload;
}

/**
 * Create payload for getting user's events (My Events)
 * POST /api/get_events with user_id
 */
export function mapGetUserEventsPayload(userId: string): any {
  return {
    user_id: userId,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format time from HH:MM:SS to HH:MM
 */
function formatTime(time: string): string {
  if (!time) return '';
  // Remove seconds if present
  return time.split(':').slice(0, 2).join(':');
}

/**
 * Map backend status to frontend status
 */
function mapStatus(
  backendStatus: string,
  eventDate: string,
): 'draft' | 'published' | 'cancelled' | 'completed' | undefined {
  if (!backendStatus) {
    // If no status but date is in past, it's completed
    if (eventDate && new Date(eventDate) < new Date()) {
      return 'completed';
    }
    return 'published';
  }

  const statusMap: Record<string, any> = {
    upcoming: 'published',
    active: 'published',
    cancelled: 'cancelled',
    completed: 'completed',
    draft: 'draft',
  };

  return statusMap[backendStatus] || 'published';
}

/**
 * Parse tags from various formats
 */
function parseTags(tags: any): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return tags.split(',').map((t) => t.trim());
    }
  }
  return [];
}

/**
 * Convert "0"/"1" or 0/1 to boolean
 */
function stringToBoolean(value: any): boolean {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  return false;
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
 * Generate URL-friendly slug from title and ID
 */
function generateSlug(title: string, id: string): string {
  if (!title || !title.trim()) {
    return `event-${id}`;
  }

  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) || `event-${id}`
  );
}
