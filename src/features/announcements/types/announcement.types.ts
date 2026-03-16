// export interface NewsItem {
//   id: number;
//   title: string;
//   slug: string;
//   date: string;
//   image: string;
//   tag?: string;
//   excerpt?: string;
//   featured?: boolean;
// }

// features/announcements/types/announcement.types.ts

export interface NewsItem {
  // ── Relational keys ──────────────────────────────────────────────────────
  createdBy?: string; // FK → MockAuthAccount.memberId (admin who created it)

  // ── Identity ──────────────────────────────────────────────────────────────
  id: number;
  slug: string;
  title: string;
  date: string; // ISO date string: '2026-03-01'

  // ── Content ───────────────────────────────────────────────────────────────
  image: string;
  tag?: string;
  excerpt?: string;
  featured?: boolean;
}
