// features/authentication/routes.ts
// Central route constants for the authentication feature.

export const AUTH_ROUTES = {
  ROOT: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  // Route uses a path param for the reset code
  RESET_PASSWORD: '/auth/reset-password',
  RESET_PASSWORD_WITH_CODE: (code: string) => `/auth/reset-password/${code}`,
} as const;
