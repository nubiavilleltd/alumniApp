// // features/admin/api/adminDashboardApi.ts
// //
// // Admin-only dashboard data. Completely separate from userDashboardApi.
// // Only accessible via AdminRoute.

// import { getAlumni, getEvents } from '@/data/site-data';

// const MOCK_DELAY_MS = 1000;

// export interface AdminStat {
//   id: 'members' | 'pending' | 'events' | 'revenue';
//   label: string;
//   value: string;
//   detail: string;
//   icon: string;
//   tone: 'primary' | 'accent' | 'secondary' | 'warning';
// }

// export interface PendingMember {
//   id: string;
//   fullName: string;
//   nameInSchool: string;
//   email: string;
//   graduationYear: number;
//   submittedAt: string;
// }

// export interface AdminDashboardData {
//   stats: AdminStat[];
//   pendingApprovals: PendingMember[];
//   recentMembers: { name: string; email: string; joinedAt: string; slug: string }[];
//   upcomingEvents: { title: string; date: string; location: string; href: string }[];
// }

// function wait(duration = MOCK_DELAY_MS) {
//   return new Promise<void>((resolve) => {
//     window.setTimeout(resolve, duration);
//   });
// }

// function formatDate(date: string) {
//   return new Date(date).toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//     year: 'numeric',
//   });
// }

// // Mock pending approvals — replace with real API data
// const MOCK_PENDING: PendingMember[] = [
//   {
//     id: 'pending-001',
//     fullName: 'Kelechi Nwachukwu',
//     nameInSchool: 'Kelechi Obi',
//     email: 'kelechi.nwachukwu@gmail.com',
//     graduationYear: 2001,
//     submittedAt: '2026-03-10T09:14:00Z',
//   },
//   {
//     id: 'pending-002',
//     fullName: 'Ifeoma Eze',
//     nameInSchool: 'Ifeoma Eze',
//     email: 'ifeoma.eze@yahoo.com',
//     graduationYear: 2008,
//     submittedAt: '2026-03-11T14:32:00Z',
//   },
//   {
//     id: 'pending-003',
//     fullName: 'Amaka Okonkwo',
//     nameInSchool: 'Amaka Nwosu',
//     email: 'amaka.ok@outlook.com',
//     graduationYear: 1995,
//     submittedAt: '2026-03-12T08:55:00Z',
//   },
// ];

// function buildAdminDashboardData(): AdminDashboardData {
//   const alumni = getAlumni();
//   const allEvents = getEvents()
//     .filter((e) => new Date(e.date).getTime() >= new Date().getTime())
//     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//     .slice(0, 4);

//   return {
//     stats: [
//       {
//         id: 'members',
//         label: 'Total Members',
//         value: String(alumni.length),
//         detail: 'Approved & active',
//         icon: 'mdi:account-group-outline',
//         tone: 'primary',
//       },
//       {
//         id: 'pending',
//         label: 'Pending Approvals',
//         value: String(MOCK_PENDING.length),
//         detail: 'Awaiting your review',
//         icon: 'mdi:account-clock-outline',
//         tone: 'warning',
//       },
//       {
//         id: 'events',
//         label: 'Upcoming Events',
//         value: String(allEvents.length),
//         detail: 'Scheduled this quarter',
//         icon: 'mdi:calendar-star',
//         tone: 'accent',
//       },
//       {
//         id: 'revenue',
//         label: 'Dues Collected',
//         value: '₦480,000',
//         detail: 'Q1 2026 total',
//         icon: 'mdi:cash-multiple',
//         tone: 'secondary',
//       },
//     ],
//     pendingApprovals: MOCK_PENDING,
//     recentMembers: alumni.slice(0, 5).map((a) => ({
//       name: a.name,
//       email: a.email ?? '',
//       joinedAt: formatDate('2026-01-15'), // mock — replace with real join date from API
//       slug: a.slug,
//     })),
//     upcomingEvents: allEvents.map((e) => ({
//       title: e.title,
//       date: formatDate(e.date),
//       location: e.location,
//       href: `/events/${e.slug}`,
//     })),
//   };
// }

// // 🔴 TODO: Replace with real API calls when backend is ready
// //   POST /api/admin/dashboard  → returns AdminDashboardData
// //   POST /api/admin/approve    → { memberId } → approves a pending member
// //   POST /api/admin/reject     → { memberId } → rejects a pending member
// export const adminDashboardApi = {
//   async getDashboard(): Promise<AdminDashboardData> {
//     await wait();
//     return buildAdminDashboardData();
//   },

//   async approveMember(memberId: string): Promise<void> {
//     await wait(600);
//     console.log(`[mock] Approved member: ${memberId}`);
//   },

//   async rejectMember(memberId: string): Promise<void> {
//     await wait(600);
//     console.log(`[mock] Rejected member: ${memberId}`);
//   },
// };








// features/admin/api/adminDashboardApi.ts
//
// Admin-only dashboard data. Completely separate from userDashboardApi.
// Only accessible via AdminRoute.

const MOCK_DELAY_MS = 1000;

export interface AdminStat {
  id: 'members' | 'pending' | 'events' | 'revenue';
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'primary' | 'accent' | 'secondary' | 'warning';
}

export interface PendingMember {
  id: string;
  fullName: string;
  nameInSchool: string;
  email: string;
  graduationYear: number;
  submittedAt: string;
}

export interface AdminDashboardData {
  stats: AdminStat[];
  pendingApprovals: PendingMember[];
  recentMembers: { name: string; email: string; joinedAt: string; slug: string }[];
  upcomingEvents: { title: string; date: string; location: string; href: string }[];
}

function wait(duration = MOCK_DELAY_MS) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

// Mock pending approvals — replace with real API data
const MOCK_PENDING: PendingMember[] = [
  {
    id: 'pending-001',
    fullName: 'Kelechi Nwachukwu',
    nameInSchool: 'Kelechi Obi',
    email: 'kelechi.nwachukwu@gmail.com',
    graduationYear: 2001,
    submittedAt: '2026-03-10T09:14:00Z',
  },
  {
    id: 'pending-002',
    fullName: 'Ifeoma Eze',
    nameInSchool: 'Ifeoma Eze',
    email: 'ifeoma.eze@yahoo.com',
    graduationYear: 2008,
    submittedAt: '2026-03-11T14:32:00Z',
  },
  {
    id: 'pending-003',
    fullName: 'Amaka Okonkwo',
    nameInSchool: 'Amaka Nwosu',
    email: 'amaka.ok@outlook.com',
    graduationYear: 1995,
    submittedAt: '2026-03-12T08:55:00Z',
  },
];

function buildAdminDashboardData(): AdminDashboardData {
  return {
    stats: [
      {
        id:     'members',
        label:  'Total Members',
        value:  '—',           // 🔴 TODO: POST /api/admin/stats
        detail: 'Approved & active',
        icon:   'mdi:account-group-outline',
        tone:   'primary',
      },
      {
        id:     'pending',
        label:  'Pending Approvals',
        value:  String(MOCK_PENDING.length),
        detail: 'Awaiting your review',
        icon:   'mdi:account-clock-outline',
        tone:   'warning',
      },
      {
        id:     'events',
        label:  'Upcoming Events',
        value:  '—',           // 🔴 TODO: POST /api/admin/stats
        detail: 'Scheduled this quarter',
        icon:   'mdi:calendar-star',
        tone:   'accent',
      },
      {
        id:     'revenue',
        label:  'Dues Collected',
        value:  '₦480,000',   // 🔴 TODO: POST /api/admin/dues
        detail: 'Q1 2026 total',
        icon:   'mdi:cash-multiple',
        tone:   'secondary',
      },
    ],
    pendingApprovals: MOCK_PENDING,
    recentMembers:    [],      // 🔴 TODO: POST /api/admin/members/recent
    upcomingEvents:   [],      // 🔴 TODO: POST /api/admin/events/upcoming
  };
}

// 🔴 TODO: Replace with real API calls when backend is ready
//   POST /api/admin/dashboard  → returns AdminDashboardData
//   POST /api/admin/approve    → { memberId } → approves a pending member
//   POST /api/admin/reject     → { memberId } → rejects a pending member
export const adminDashboardApi = {
  async getDashboard(): Promise<AdminDashboardData> {
    await wait();
    return buildAdminDashboardData();
  },

  async approveMember(memberId: string): Promise<void> {
    await wait(600);
    console.log(`[mock] Approved member: ${memberId}`);
  },

  async rejectMember(memberId: string): Promise<void> {
    await wait(600);
    console.log(`[mock] Rejected member: ${memberId}`);
  },
};
