export const ANNOUNCEMENT_ROUTES = {
  ROOT: '/news',
  BLOG: '/news/blog',
  DETAIL: (slug: string) => `/news/${slug}`,
  DETAIL_PATH: '/news/:slug',
} as const;
