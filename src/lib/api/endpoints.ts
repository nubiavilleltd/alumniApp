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

  // ─── Messages ──────────────────────────────────────────────────────────────
  MESSAGES: {
    THREADS: '/messages/threads',
    THREAD_DETAIL: (threadId: string) => `/messages/threads/${threadId}`,
    DIRECT_THREAD: '/messages/threads/direct',
    GROUP_THREAD: '/messages/threads/group',
    SEND_MESSAGE: '/messages/messages',
    MARK_READ: (threadId: string) => `/messages/threads/${threadId}/read`,
    ATTACHMENTS: '/messages/attachments',
    POLL: '/messages/poll',
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
