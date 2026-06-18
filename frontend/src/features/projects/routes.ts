export const PROJECT_ROUTES = {
  ROOT: '/projects',
  DETAIL: (slug: string) => `/projects/${slug}`,
  DETAIL_PATH: '/projects/:id',
} as const;
