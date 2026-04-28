export const ANNOUNCEMENT_ROUTES = {
  ROOT: '/news',
  DETAIL: (slug: string) => `/news/${slug}`,
  DETAIL_PATH: '/news/:slug',
} as const;
