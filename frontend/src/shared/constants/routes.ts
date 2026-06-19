import { EVENT_ROUTES } from '@/features/events/routes';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { ALUMNI_ROUTES } from '@/features/alumni/routes';
import { USER_ROUTES } from '@/features/user/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { MARKETPLACE_ROUTES } from '@/features/marketplace/routes';
import { PROJECT_ROUTES } from '@/features/projects/routes';
import { ANNOUNCEMENT_ROUTES } from '@/features/announcements/routes';
import { LIVE_NEWS_ROUTES } from '@/features/liveNews/routes';

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  WELFARE_COMMITTEE_CONTACT: '/welfare-committee-contact',
  DONATION: '/donation',
  NEWS: ANNOUNCEMENT_ROUTES.ROOT,
  RESOURCES: '/resources',
  WELFARE: '/welfare',
  WELFARE_ZONES: '/welfare/zones',
  JOB_VACANCIES: '/job-vacancies',
  JOB_VACANCY_DETAIL_PATH: '/job-vacancies/:id',
  JOB_VACANCY_DETAIL: (id: string | number) => `/job-vacancies/${id}`,
  MY_JOB_POSTS: '/job-vacancies/my-posts',
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
  LIVE_NEWS: LIVE_NEWS_ROUTES,
} as const;
