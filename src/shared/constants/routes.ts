import { EVENT_ROUTES } from '@/features/events/routes';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';
import { USER_ROUTES } from '@/features/user/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';
import { PROJECT_ROUTES } from '@/features/projects/routes';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  DONATION: '/donation',
  NEWS: ANNOUNCEMENT_ROUTES.ROOT,
  RESOURCES: '/resources',
  WELFARE: '/welfare',
  WELFARE_ZONES: '/welfare/zones',
  JOB_VACANCIES: '/job-vacancies',
  MESSAGES: '/messages',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  LEADERSHIP: '/leadership',
  PROJECTS: PROJECT_ROUTES,
  EVENTS: EVENT_ROUTES,
  AUTH: AUTH_ROUTES,
  ALUMNI: ALUMNI_ROUTES,
  USER: USER_ROUTES,
  ADMIN: ADMIN_ROUTES,
  MARKETPLACE: MARKETPLACE_ROUTES,
} as const;
