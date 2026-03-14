

export const API_ENDPOINTS = {
  // ─── Tenant ───────────────────────────────────────────────────────────────
  TENANT_CONFIG: (slug: string) => `/tenant/${slug}/config`,

  // ─── Auth ─────────────────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // ─── Alumni ───────────────────────────────────────────────────────────────
  ALUMNI: {
    LIST: '/alumni',
    SEARCH: '/alumni/search',
    DETAIL: (slug: string) => `/alumni/${slug}`,
    UPDATE: (id: string) => `/alumni/${id}`,
  },

  // ─── Events ───────────────────────────────────────────────────────────────
  EVENTS: {
    LIST: '/events',
    DETAIL: (slug: string) => `/events/${slug}`,
    REGISTER: (slug: string) => `/events/${slug}/register`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },

  // ─── Marketplace ──────────────────────────────────────────────────────────
  MARKETPLACE: {
    LIST: '/marketplace',
    CATEGORIES: '/marketplace/categories',
    DETAIL: (id: string) => `/marketplace/${id}`,
    CREATE: '/marketplace',
    UPDATE: (id: string) => `/marketplace/${id}`,
    DELETE: (id: string) => `/marketplace/${id}`,
  },

  // ─── Projects ─────────────────────────────────────────────────────────────
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    DONATE: (id: string) => `/projects/${id}/donate`,
  },

  // ─── Leadership ───────────────────────────────────────────────────────────
  LEADERSHIP: {
    LIST: '/leadership',
    DETAIL: (id: string) => `/leadership/${id}`,
  },

  // ─── Messages ─────────────────────────────────────────────────────────────
  MESSAGES: {
    LIST: '/messages',
    THREAD: (id: string) => `/messages/${id}`,
    SEND: '/messages',
    MARK_READ: (id: string) => `/messages/${id}/read`,
  },

  // ─── Profile ──────────────────────────────────────────────────────────────
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    UPDATE_PASSWORD: '/profile/password',
    UPLOAD_AVATAR: '/profile/avatar',
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    USER: (id: string) => `/admin/users/${id}`,
  },
} as const;
