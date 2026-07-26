export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  MEMBERS: '/admin/members',
  EVENTS: '/admin/events',
  EVENT_REGISTRATIONS: '/admin/event-registrations',
  ANNOUNCEMENTS: '/admin/announcements',
  PROJECTS: '/admin/projects',
  PAGES_CONTENT: '/admin/pages-content',
} as const;


// Existing admin routes — add ADMIN_STORE_ROUTES here
// This file extends the existing features/admin/routes.ts

export const ADMIN_STORE_ROUTES = {
  ROOT: '/admin/store',
  PRODUCT_CREATE: '/admin/store/new',
  PRODUCT_EDIT: (id: string) => `/admin/store/${id}/edit`,
  PRODUCT_EDIT_PATH: '/admin/store/:id/edit',
} as const;

export const ADMIN_ORDER_ROUTES = {
  ROOT: '/admin/orders',
} as const;

