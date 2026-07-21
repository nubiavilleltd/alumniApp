export const ANNOUNCEMENT_ROUTES = {
  ROOT: '/news',
  BLOG: '/news/blog',
  BLOG_DETAIL: (slug: string) => `/news/blog/${slug}`,
  BLOG_DETAIL_PATH: '/news/blog/:slug',
  DETAIL: (slug: string) => `/news/${slug}`,
  DETAIL_PATH: '/news/:slug',
} as const;
