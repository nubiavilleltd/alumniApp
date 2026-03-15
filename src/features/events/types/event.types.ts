// export type Event = {
//   title: string;
//   slug: string;
//   date: string; // or Date if you plan to convert it
//   description: string;
//   content: string;
//   location: string;
//   image: string;
//   category: string;
//   tags: string[];
//   featured: boolean;
//   isVirtual: boolean;
//   attire: string;
//   type?: string;
// };

// features/events/types/event.types.ts

export type Event = {
  // ── Relational keys ──────────────────────────────────────────────────────
  createdBy?: string; // FK → MockAuthAccount.memberId (admin who created it)
  registrations?: string[]; // FK[] → MockAuthAccount.memberId (members who RSVP'd)

  // ── Identity ──────────────────────────────────────────────────────────────
  slug: string;
  title: string;
  date: string; // ISO date string: '2026-12-12'
  type?: string; // 'upcoming' | 'past'

  // ── Content ───────────────────────────────────────────────────────────────
  description: string;
  content: string;
  image: string;
  location: string;
  category: string;
  tags: string[];
  featured: boolean;
  isVirtual: boolean;
  attire: string;
};
