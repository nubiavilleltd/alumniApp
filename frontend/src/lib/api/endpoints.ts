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
    FORGOT_PASSWORD: '/api/forgot_password',
    RESET_PASSWORD: '/api/reset_password',
    VERIFY_EMAIL: '/api/verify_email',
    RESEND_VERIFY_EMAIL: '/api/resend_verify_email',
    GET_VOUCHERS: '/api/get_vouchers',
    GET_CITIES: '/api/get_cities',
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


  LIVENEWS: {
    GET_LIVE_NEWS: '/news/feeds',
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
    GET_PROFILE_VISIBILITY: '/api/get_profile_visibility',
    UPDATE_PROFILE_VISIBILITY: '/api/update_profile_visibility',
    GET_USER_PROFILE: '/api/get_user_profile',
    GET_USERS_BY_ACTION: '/api/get_users_by_action',
    CHANGE_PASSWORD: '/api/change_user_password',
    MANAGE_ACCOUNT: '/api/manage_user_account',
  },

  // ─── Messages ──────────────────────────────────────────────────────────────
  MESSAGES: {
    THREADS: '/chat_api/v2_get_threads',
    THREAD_DETAIL: '/chat_api/v2_get_thread',
    DIRECT_THREAD: '/chat_api/v2_send_direct',
    GROUP_THREAD: '/chat_api/v2_create_group',
    SEND_MESSAGE: '/chat_api/v2_send_message',
    DELETE_MESSAGE: '/chat_api/v2_delete_message',
    MARK_READ: '/chat_api/v2_mark_read',
    ATTACHMENTS: '/chat_api/v2_upload_attachment',
    POLL: '/chat_api/v2_get_threads',
  },

  WELFARE: {
    GET_ZONES: '/api/get_zones',
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  ADMIN: {
    MEMBER_LIST: '/api/admin/members/list',
    APPROVE_USER: '/api/approve_user',
  },

  // ─── Projects ─────────────────────────────────────────────────────────────
  PROJECTS: {
    LIST: '/api/get_projects',
    CREATE: '/api/create_project',
    MANAGE: '/api/manage_project',
    // keep donate if it's separate
    DONATE: (id: string) => `/projects/${id}/donate`,
  },

  // ─── Contact ─────────────────────────────────────────────────────────────
  CONTACT: {
    CREATE: '/api/contact_us',
  },

  // ─── JOB VACANCIES ─────────────────────────────────────────────────────────────
  JOB_VACANCIES: {
    GET: '/api/get_vacancies',
    CREATE: '/api/create_vacancy',
    MANAGE: '/api/manage_vacancy',
  },

  // ─── Leadership ───────────────────────────────────────────────────────────
  LEADERSHIP: {
    GET_LEADERSHIP: '/api/get_leadership',
    // CMS endpoints (future):
    // CREATE_LEADER: '/create_leader',
    // MANAGE_LEADER: '/manage_leader',
  },

  // ─── Announcements ────────────────────────────────────────────────────────
  ANNOUNCEMENTS: {
    LIST: '/api/get_announcements',
    CREATE: '/api/create_announcement',
    MANAGE: '/api/manage_announcement',
  },

  ADMIN_ENDPOINTS: {
    MEMBER_LIST: '/api/get_users_by_action', // POST — action_type flag in body
    APPROVE_USER: '/api/approve_user', // POST — action: approve | reject
  },

  VOUCHER: {
    GET_PENDING: '/api/voucher_pending',
    ACTION: '/api/vouch_action',
  },
} as const;
