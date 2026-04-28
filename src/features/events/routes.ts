// features/events/routes.ts
// Central route constants for the events feature.

export const EVENT_ROUTES = {
  ROOT: '/events',
  CREATE: '/events/create',
  MY_EVENTS: '/my-events',
  DETAIL: (id: string) => `/events/${id}`,
  EDIT: (id: string) => `/events/${id}/edit`,
} as const;
