export const ALUMNI_ROUTES = {
  ROOT: '/alumni',
  PROFILES: '/alumni/profiles',
  PROFILE: (slug: string) => `/alumni/profiles/${slug}`,
} as const;
