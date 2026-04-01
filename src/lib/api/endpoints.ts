// lib/api/endpoints.ts
//
// Single source of truth for all API endpoint paths.
// When a backend URL changes, update it here only.

export const API_ENDPOINTS = {
  // ─── Auth ─────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    LOGOUT: '/api/logout',
    REFRESH_TOKEN: '/api/refresh_token',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/api/forgot_password',
    RESET_PASSWORD: '/api/reset_password',
    VERIFY_EMAIL: '/api/verify_email',
    RESEND_VERIFY_EMAIL: '/api/resend_verify_email',
  },

  // ─── Alumni ───────────────────────────────────────────────────────────────
  ALUMNI: {
    LIST: '/api/get_users_by_action',
    DETAIL: (slug: string) => `/api/alumni/${slug}`,
    UPDATE: (id: string) => `/api/alumni/${id}`,
  },

  // ─── Marketplace ──────────────────────────────────────────────────────────
  // All three backend endpoints live here. The service no longer defines
  // its own local ENDPOINTS object.
  MARKETPLACE: {
    GET_LISTINGS: '/api/get_listings',
    CREATE_LISTING: '/api/create_listing',
    MANAGE_LISTING: '/api/manage_listing', // update + delete via function_type flag
  },

  // ─── Events ───────────────────────────────────────────────────────────────
  EVENTS: {
    GET_EVENTS: '/api/get_events',
    CREATE_EVENT: '/api/create_event',
    MANAGE_EVENT: '/api/manage_event',
    REGISTER_EVENT: '/api/register_event',
    MANAGE_EVENT_RSVP: '/api/manage_event_rsvp',
    GET_ATTENDEES: '/api/get_event_attendees',
  },

  // ─── User / Profile ───────────────────────────────────────────────────────
  USER: {
    UPDATE_PROFILE: '/api/update_profile',
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

  ADMIN_ENDPOINTS: {
    MEMBER_LIST: '/api/get_users_by_action', // POST — action_type flag in body
    APPROVE_USER: '/api/approve_user', // POST — action: approve | reject
  },
} as const;
