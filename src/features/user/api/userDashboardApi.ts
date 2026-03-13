// features/user/api/userDashboardApi.ts
//
// Replaces features/dashboard/api/dashboardApi.ts
// Only user-facing dashboard data lives here.
// Admin dashboard data lives in features/admin/api/adminDashboardApi.ts

import { getAlumni, getAnnouncements, getEvents } from '@/data/site-data';
import { getBlogPosts } from '@/data/site-data';

const MOCK_DELAY_MS = 1200;

export interface UserDashboardStat {
  id: 'events' | 'announcements' | 'dues' | 'messages';
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'primary' | 'accent' | 'secondary';
}

export interface UserDashboardListItem {
  title: string;
  subtitle: string;
  href: string;
  cta?: string;
}

export interface UserDashboardQuickLink {
  label: string;
  href: string;
  icon: string;
}

export interface UserDashboardData {
  stats: UserDashboardStat[];
  announcements: UserDashboardListItem[];
  upcomingEvents: UserDashboardListItem[];
  suggestedAlumni: UserDashboardListItem[];
  profileTasks: string[];
  communityUpdates: UserDashboardListItem[];
  quickLinks: UserDashboardQuickLink[];
}

function wait(duration = MOCK_DELAY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function formatEventDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatPostDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function buildUserDashboardData(userSlug?: string): UserDashboardData {
  const alumni   = getAlumni();
  const posts    = getBlogPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  const allEvents     = getEvents().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const today         = new Date();
  const upcomingEvents = allEvents.filter((e) => new Date(e.date).getTime() >= today.getTime());
  const dashboardEvents = (upcomingEvents.length > 0 ? upcomingEvents : allEvents).slice(0, 3);

  const suggestedAlumni = alumni
    .filter((a) => a.slug !== userSlug)
    .slice(0, 2);

  return {
    stats: [
      {
        id: 'events',
        label: 'Upcoming Events',
        value: String(dashboardEvents.length),
        detail: 'RSVPs waiting this month',
        icon: 'mdi:calendar-star',
        tone: 'primary',
      },
      {
        id: 'announcements',
        label: 'Announcements',
        value: String(posts.slice(0, 3).length),
        detail: 'Fresh updates to review',
        icon: 'mdi:bullhorn-outline',
        tone: 'accent',
      },
      {
        id: 'dues',
        label: 'Dues Status',
        value: 'Pending',
        detail: 'Q2 community dues: ₦120,000',
        icon: 'mdi:credit-card-outline',
        tone: 'secondary',
      },
      {
        id: 'messages',
        label: 'Messages',
        value: '4 unread',
        detail: 'New replies from your network',
        icon: 'mdi:message-text-outline',
        tone: 'primary',
      },
    ],
    announcements: posts.slice(0, 3).map((post) => ({
      title: post.title,
      subtitle: `${post.category} • ${formatPostDate(post.publishDate)}`,
      href: `/blog/${post.slug}`,
    })),
    upcomingEvents: dashboardEvents.map((event) => ({
      title: event.title,
      subtitle: `${formatEventDate(event.date)} • ${event.location}`,
      href: `/events/${event.slug}`,
      cta: 'RSVP',
    })),
    suggestedAlumni: suggestedAlumni.map((alumnus) => ({
      title: alumnus.name,
      subtitle: `${alumnus.position} • Class of ${alumnus.year}`,
      href: `/alumni/profiles/${alumnus.slug}`,
    })),
    profileTasks: [
      'Add your work / occupation details',
      'Upload a profile photo',
      'Add your social links',
    ],
    communityUpdates: [
      {
        title: 'Mentorship circle opens next week',
        subtitle: 'Join a cross-year mentoring group before seats fill up.',
        href: '/about',
      },
      {
        title: 'Regional meetup planning has started',
        subtitle: 'See the latest planning note and volunteer opportunities.',
        href: '/events',
      },
      {
        title: 'Community directory refresh underway',
        subtitle: 'Profiles with complete details will be featured more often.',
        href: '/alumni/profiles',
      },
    ],
    quickLinks: [
      { label: 'Edit Profile',     href: '/user/profile',         icon: 'mdi:account-edit-outline' },
      { label: 'View Directory',   href: '/alumni/profiles',      icon: 'mdi:account-group-outline' },
      { label: 'Browse Events',    href: '/events',               icon: 'mdi:calendar-month-outline' },
      { label: 'My Business',      href: '/marketplace/my-business', icon: 'mdi:store-outline' },
    ],
  };
}

// 🔴 TODO: Replace with real API call when backend is ready
//   POST /api/dashboard/user   → returns UserDashboardData
export const userDashboardApi = {
  async getDashboard(userSlug?: string): Promise<UserDashboardData> {
    await wait();
    return buildUserDashboardData(userSlug);
  },
};