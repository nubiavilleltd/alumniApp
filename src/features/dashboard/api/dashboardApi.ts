import { getAlumni, getBlogPosts, getEvents } from '@/data/site-data';

const MOCK_DELAY_MS = 1200;
const FALLBACK_USER_EMAIL = 'john.doe@email.com';

export interface DashboardStat {
  id: 'events' | 'announcements' | 'dues' | 'messages';
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'primary' | 'accent' | 'secondary';
}

export interface DashboardListItem {
  title: string;
  subtitle: string;
  href: string;
  cta?: string;
}

export interface DashboardQuickLink {
  label: string;
  href: string;
  icon: string;
}

export interface DashboardData {
  user: {
    name: string;
    email: string;
    initials: string;
    notifications: number;
    profileCompletion: number;
    profileHref: string;
  };
  stats: DashboardStat[];
  announcements: DashboardListItem[];
  upcomingEvents: DashboardListItem[];
  suggestedAlumni: DashboardListItem[];
  profileTasks: string[];
  communityUpdates: DashboardListItem[];
  quickLinks: DashboardQuickLink[];
}

function wait(duration = MOCK_DELAY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function formatDisplayName(email: string) {
  const localPart = email.split('@')[0] ?? 'alumni user';
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((chunk) => chunk[0]?.toUpperCase() + chunk.slice(1))
    .join(' ');
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
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

function buildDashboardData(userEmail?: string): DashboardData {
  const normalizedEmail = userEmail?.trim().toLowerCase() || FALLBACK_USER_EMAIL;
  const alumni = getAlumni();
  const posts = getBlogPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  const allEvents = getEvents().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const today = new Date();
  const upcomingEvents = allEvents.filter((event) => new Date(event.date).getTime() >= today.getTime());
  const dashboardEvents = (upcomingEvents.length > 0 ? upcomingEvents : allEvents).slice(0, 3);
  const matchedUser = alumni.find((alumnus) => alumnus.email.toLowerCase() === normalizedEmail);
  const userName = matchedUser?.name ?? formatDisplayName(normalizedEmail);
  const userSlug = matchedUser?.slug;
  const userProfileHref = userSlug ? `/alumni/profiles/${userSlug}` : '/alumni/profiles';
  const suggestedAlumni = alumni
    .filter((alumnus) => alumnus.slug !== matchedUser?.slug)
    .slice(0, 2);

  return {
    user: {
      name: userName,
      email: normalizedEmail,
      initials: getInitials(userName),
      notifications: 3,
      profileCompletion: 75,
      profileHref: userProfileHref,
    },
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
        detail: 'Q2 community dues: $120',
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
    profileTasks: ['Add work details', 'Upload a profile photo', 'Add your social links'],
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
      { label: 'Complete Profile', href: userProfileHref, icon: 'mdi:account-edit-outline' },
      { label: 'View Directory', href: '/alumni/profiles', icon: 'mdi:account-group-outline' },
      { label: 'Browse Events', href: '/events', icon: 'mdi:calendar-month-outline' },
      { label: 'Read News', href: '/blog', icon: 'mdi:newspaper-variant-outline' },
    ],
  };
}

export const dashboardApi = {
  async getDashboard(userEmail?: string): Promise<DashboardData> {
    await wait();
    return buildDashboardData(userEmail);
  },
};
