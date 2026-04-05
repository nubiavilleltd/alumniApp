// // features/alumni/types/alumni.types.ts

// type AlumniProject = {
//   name: string;
//   description: string;
//   url: string;
// };

// type WorkExperience = {
//   company: string;
//   position: string;
//   duration: string;
//   description: string;
// };

// type Education = {
//   degree: string;
//   institution: string;
//   year: number;
//   gpa: string;
// };

// export type Alumni = {
//   // ── Relational keys ──────────────────────────────────────────────────────
//   memberId: string; // FK → MockAuthAccount.memberId
//   chapterId?: string; // FK → Chapter.chapterId

//   // ── Identity ──────────────────────────────────────────────────────────────
//   name: string;
//   slug: string; // URL only
//   year: number; // graduation year

//   // ── Profile ───────────────────────────────────────────────────────────────
//   short_bio: string;
//   long_bio: string;
//   photo: string;
//   email: string;
//   location: string;
//   company: string;
//   position: string;
//   skills: string[];
//   projects: AlumniProject[];
//   work_experience: WorkExperience[];
//   education: Education[];
//   achievements: string[];
//   interests: string[];
//   houseColor: string;

//   phone: string;

//   isCoordinator: boolean;
//   isEmailVerified: boolean;
//   isApproved: boolean;
//   isActive: boolean;
//   isVisible: boolean;

//   // ═══════════════════════════════════════════════════════════════════
//   // TIMESTAMPS
//   // ═══════════════════════════════════════════════════════════════════
//   createdAt: string;
//   updatedAt: string;
//   lastLogin: string;

//   // ── Extended Profile Fields (from AuthSessionUser) ───────────────────────
//   // These fields allow merging session data when viewing own profile
//   alternativePhone?: string;
//   birthDate?: string;
//   residentialAddress?: string;
//   area?: string;
//   city?: string;
//   employmentStatus?: string;
//   occupations?: string[];
//   industrySectors?: string[];
//   yearsOfExperience?: number;
//   isVolunteer?: boolean;
//   nameInSchool: string;

//   // ── Social Links (direct fields) ─────────────────────────────────────────
//   linkedin?: string;
//   twitter?: string;
//   instagram?: string;
//   facebook?: string;
//   website?: string;
// };

// features/alumni/types/alumni.types.ts

import type { PrivacySettings } from '@/features/authentication/types/auth.types';

export interface Alumni {
  // ── Relational keys ──────────────────────────────────────────────────────
  id: string;
  memberId: string;
  chapterId?: string;

  // ── Identity ──────────────────────────────────────────────────────────────
  slug: string;
  name: string;
  email: string;

  // ── School ────────────────────────────────────────────────────────────────
  graduationYear: number;
  nameInSchool: string;
  houseColor?: string;

  // ── Contact ───────────────────────────────────────────────────────────────
  phone: string;
  alternativePhone?: string;

  // ── Profile ───────────────────────────────────────────────────────────────
  photo: string;
  bio: string;
  birthDate?: string;

  // ── Location ──────────────────────────────────────────────────────────────
  location: string;
  city?: string;
  area?: string;
  residentialAddress?: string;

  // ── Professional ──────────────────────────────────────────────────────────
  position: string;
  company: string;
  employmentStatus?: string;
  occupations?: string[];
  industrySectors?: string[];
  yearsOfExperience?: number;

  // ── Social Links ──────────────────────────────────────────────────────────
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  instagram?: string;

  // ── Status ────────────────────────────────────────────────────────────────
  isCoordinator: boolean;
  isVolunteer?: boolean;
  isApproved: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  isVisible: boolean;

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;

  // ═══════════════════════════════════════════════════════════════════════
  // ✅ NEW: Privacy Settings
  // ═══════════════════════════════════════════════════════════════════════
  privacy?: PrivacySettings;
}
