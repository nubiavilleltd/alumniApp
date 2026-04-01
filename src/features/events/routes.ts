export const EVENT_ROUTES = {
  ROOT: '/events',
  DETAIL: (slug: string) => `/events/${slug}`,
  CREATE: '/events/create',
  EDIT: (id: string | number) => `/events/${id}/edit`,
  MY_EVENTS: '/my-events',
} as const;
