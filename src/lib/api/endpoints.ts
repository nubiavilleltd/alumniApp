// export const API_ENDPOINTS = {
//   // ─── Tenant ───────────────────────────────────────────────────────────────
//   TENANT_CONFIG: (slug: string) => `/tenant/${slug}/config`,

//   // ─── Auth ─────────────────────────────────────────────────────────────────
//   AUTH: {
//     // LOGIN: '/auth/login',
//     LOGIN: '/login',
//     REGISTER: '/register',
//     // REGISTER: '/auth/register',
//     LOGOUT: '/auth/logout',
//     REFRESH_TOKEN: '/auth/refresh',
//     ME: '/auth/me',
//     FORGOT_PASSWORD: '/forgot_password',
//     // FORGOT_PASSWORD: '/auth/forgot-password',
//     RESET_PASSWORD: '/auth/reset-password',
//     // VERIFY_EMAIL: '/auth/verify-email',
//     VERIFY_EMAIL: '/verify_email',
//   },

//   // ─── Alumni ───────────────────────────────────────────────────────────────
//   ALUMNI: {
//     LIST: '/get_users_by_action',
//     SEARCH: '/alumni/search',
//     DETAIL: (slug: string) => `/alumni/${slug}`,
//     UPDATE: (id: string) => `/alumni/${id}`,
//   },

//   // ─── Events ───────────────────────────────────────────────────────────────
//   EVENTS: {
//     LIST: '/events',
//     DETAIL: (slug: string) => `/events/${slug}`,
//     REGISTER: (slug: string) => `/events/${slug}/register`,
//     CREATE: '/events',
//     UPDATE: (id: string) => `/events/${id}`,
//     DELETE: (id: string) => `/events/${id}`,
//   },

//   // ─── Marketplace ──────────────────────────────────────────────────────────
//   MARKETPLACE: {
//     LIST: '/marketplace',
//     CATEGORIES: '/marketplace/categories',
//     DETAIL: (id: string) => `/marketplace/${id}`,
//     CREATE: '/marketplace',
//     UPDATE: (id: string) => `/marketplace/${id}`,
//     DELETE: (id: string) => `/marketplace/${id}`,
//   },

//   // ─── Projects ─────────────────────────────────────────────────────────────
//   PROJECTS: {
//     LIST: '/projects',
//     DETAIL: (id: string) => `/projects/${id}`,
//     DONATE: (id: string) => `/projects/${id}/donate`,
//   },

//   // ─── Leadership ───────────────────────────────────────────────────────────
//   LEADERSHIP: {
//     LIST: '/leadership',
//     DETAIL: (id: string) => `/leadership/${id}`,
//   },

//   // ─── Messages ─────────────────────────────────────────────────────────────
//   MESSAGES: {
//     LIST: '/messages',
//     THREAD: (id: string) => `/messages/${id}`,
//     SEND: '/messages',
//     MARK_READ: (id: string) => `/messages/${id}/read`,
//   },

//   // ─── Profile ──────────────────────────────────────────────────────────────
//   PROFILE: {
//     GET: '/profile',
//     UPDATE: '/profile',
//     UPDATE_PASSWORD: '/profile/password',
//     UPLOAD_AVATAR: '/profile/avatar',
//   },

//   USER: {
//     UPDATE_PROFILE: '/update_profile',
//   },

//   // ─── Admin ────────────────────────────────────────────────────────────────
//   ADMIN: {
//     STATS: '/admin/stats',
//     USERS: '/admin/users',
//     USER: (id: string) => `/admin/users/${id}`,
//   },
// } as const;

// lib/api/endpoints.ts
//
// Single source of truth for all API endpoint paths.
// When a backend URL changes, update it here only.

export const API_ENDPOINTS = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/forgot_password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/verify_email',
  },

  // ─── Alumni ───────────────────────────────────────────────────────────────
  ALUMNI: {
    LIST: '/get_users_by_action',
    DETAIL: (slug: string) => `/alumni/${slug}`,
    UPDATE: (id: string) => `/alumni/${id}`,
  },

  // ─── Marketplace ──────────────────────────────────────────────────────────
  // All three backend endpoints live here. The service no longer defines
  // its own local ENDPOINTS object.
  MARKETPLACE: {
    GET_LISTINGS: '/get_listings',
    CREATE_LISTING: '/create_listing',
    MANAGE_LISTING: '/manage_listing', // update + delete via function_type flag
  },

  // ─── Events ───────────────────────────────────────────────────────────────
  EVENTS: {
    GET_EVENTS: '/get_events',
    CREATE_EVENT: '/create_event',
    MANAGE_EVENT: '/manage_event',
    REGISTER_EVENT: '/register_event',
    MANAGE_EVENT_RSVP: '/manage_event_rsvp',
    GET_ATTENDEES: '/get_event_attendees',
  },

  // ─── User / Profile ───────────────────────────────────────────────────────
  USER: {
    UPDATE_PROFILE: '/update_profile',
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  ADMIN: {
    MEMBER_LIST: '/api/admin/members/list',
    APPROVE_USER: '/api/approve_user',
  },

  // ─── Projects ─────────────────────────────────────────────────────────────
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    DONATE: (id: string) => `/projects/${id}/donate`,
  },

  // ─── Announcements ────────────────────────────────────────────────────────
  ANNOUNCEMENTS: {
    LIST: '/announcements',
    DETAIL: (slug: string) => `/announcements/${slug}`,
  },

  // ─── Leadership ───────────────────────────────────────────────────────────
  LEADERSHIP: {
    LIST: '/leadership',
  },
} as const;
