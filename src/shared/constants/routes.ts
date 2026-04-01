import { EVENT_ROUTES } from '@/features/events/routes';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';
import { USER_ROUTES } from '@/features/user/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  PROJECTS: '/projects',
  LEADERSHIP: '/leadership',

  EVENTS: EVENT_ROUTES,
  AUTH: AUTH_ROUTES,
  ALUMNI: ALUMNI_ROUTES,
  USER: USER_ROUTES,
  ADMIN: ADMIN_ROUTES,
  MARKETPLACE: MARKETPLACE_ROUTES,
} as const;
