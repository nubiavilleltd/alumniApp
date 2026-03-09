// lib/api/endpoints.ts

export const API_ENDPOINTS = {
  // Tenant
  TENANT_CONFIG: (slug: string) => `/tenant/${slug}/config`,

  // Alumni
  ALUMNI_LIST: '/alumni',
  ALUMNI_DETAIL: (id: string) => `/alumni/${id}`,
  ALUMNI_SEARCH: '/alumni/search',

  // Events
  EVENTS_LIST: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_RSVP: (id: string) => `/events/${id}/rsvp`,

  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',

  // Profile
  PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/update',

  // Admin
  ADMIN_STATS: '/admin/stats',
  ADMIN_USERS: '/admin/users',
} as const;
