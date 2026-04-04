// features/authentication/constants/mockAccounts.ts

import { DEFAULT_CHAPTER_ID } from '@/data/chapters';
import type { PrivacySettings } from '../types/auth.types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'closed';
// export type DuesStatus = 'paid' | 'owing' | 'exempt';
export type DuesStatus = 'paid' | 'owing' | 'overdue' | 'exempt' | 'unknown';

export interface MockAuthAccount {
  // ── Identity ───────────────────────────────────────────────────────────────
  memberId: string; // 'MBR-{year}-{hex}' — primary relational key, never changes
  id: string; // legacy internal ref — keep for backward compat
  slug: string; // URL-only, can change on name change
  chapterId?: string; // assigned by admin after approval

  // ── Auth ───────────────────────────────────────────────────────────────────
  email: string;
  password: string;
  role: 'member' | 'admin';
  createdAt: string;

  // ── Verification (user action — email link) ────────────────────────────────
  isEmailVerified: boolean;
  emailVerifiedAt?: string;

  // ── Approval (admin action) ────────────────────────────────────────────────
  approvalStatus: ApprovalStatus;
  approvedAt?: string;
  approvedBy?: string; // memberId of the admin who approved

  // ── Account ────────────────────────────────────────────────────────────────
  accountStatus: AccountStatus;

  // ── Dues (placeholder — payment system coming later) ──────────────────────
  duesStatus: DuesStatus;
  duesLastPaidAt?: string;
  duesAmountOwing?: number;

  // ── Registration fields (collected at signup) ──────────────────────────────
  surname: string;
  otherNames: string;
  nameInSchool: string;
  whatsappPhone: string;
  graduationYear: number;

  // ── Profile fields (filled after registration) ────────────────────────────
  photo?: string;
  bio: string;
  alternativePhone?: string;
  birthDate?: string;
  houseColor?: string;
  isClassCoordinator?: boolean;
  residentialAddress?: string;
  area?: string;
  city?: string;
  employmentStatus?: string;
  occupations?: string[];
  industrySectors?: string[];
  yearsOfExperience?: number;
  isVolunteer?: boolean;
  privacy?: PrivacySettings;
}

// ─── ID generator ─────────────────────────────────────────────────────────────
// Deterministic — same email + year always produces the same memberId.
// Safe to re-run on historical data imports.

function generateMemberId(graduationYear: number, email: string): string {
  let hash = 0;
  for (const char of email.toLowerCase().trim()) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(6, '0').slice(0, 6);
  return `MBR-${graduationYear}-${hex}`;
}

// ─── Mock accounts ────────────────────────────────────────────────────────────
// Three primary test accounts (can log in: password Alumni123!)
// Twelve historical members (pre-loaded, approved, active — no login needed for testing)

export const defaultMockAccounts: MockAuthAccount[] = [
  // ── Primary test accounts ──────────────────────────────────────────────────

  {
    memberId: generateMemberId(1998, 'adaeze.okonkwo@email.com'), // MBR-1998-XXXXXX
    id: 'acct-adaeze-okonkwo',
    slug: 'adaeze-okonkwo',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'adaeze.okonkwo@email.com',
    password: 'Alumni123!',
    role: 'admin',
    createdAt: '2024-03-15T10:30:00Z',

    isEmailVerified: true,
    emailVerifiedAt: '2024-03-15T10:35:00Z',
    approvalStatus: 'approved',
    approvedAt: '2024-03-15T11:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'), // self-approved as first admin
    accountStatus: 'active',
    duesStatus: 'paid',
    duesLastPaidAt: '2026-01-10T00:00:00Z',

    surname: 'Okonkwo',
    otherNames: 'Adaeze Chioma',
    nameInSchool: 'Adaeze Eze',
    whatsappPhone: '+234 8031234567',
    graduationYear: 1998,
    photo: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=200&q=80',
    alternativePhone: '+234 9021234567',
    birthDate: '1980-06-12',
    houseColor: 'blue',
    isClassCoordinator: true,
    residentialAddress: '14 Admiralty Way, Lekki Phase 1',
    area: 'lekki',
    city: 'Lagos',
    employmentStatus: 'business-owner',
    occupations: ['entrepreneur', 'consultant'],
    industrySectors: ['banking-finance', 'nonprofit'],
    yearsOfExperience: 20,
    isVolunteer: true,

    // Privacy: All public (power user, very open)
    privacy: {
      photo: 'public',
      whatsappPhone: 'public',
      alternativePhone: 'public',
      birthDate: 'public',
      residentialAddress: 'public',
      area: 'public',
      city: 'public',
      employmentStatus: 'public',
      occupations: 'public',
      industrySectors: 'public',
      yearsOfExperience: 'public',
    },
  },

  {
    memberId: generateMemberId(2002, 'ngozi.ibrahim@email.com'),
    id: 'acct-ngozi-ibrahim',
    slug: 'ngozi-ibrahim',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'ngozi.ibrahim@email.com',
    password: 'Alumni123!',
    role: 'member',
    createdAt: '2024-04-02T09:15:00Z',

    isEmailVerified: true,
    emailVerifiedAt: '2024-04-02T09:20:00Z',
    approvalStatus: 'approved',
    approvedAt: '2024-04-02T14:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'owing',
    duesAmountOwing: 15000,

    surname: 'Ibrahim',
    otherNames: 'Ngozi Blessing',
    nameInSchool: 'Ngozi Okafor',
    whatsappPhone: '+234 8056789012',
    graduationYear: 2002,
    photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
    alternativePhone: '+234 7034567890',
    birthDate: '1984-11-03',
    houseColor: 'red',
    isClassCoordinator: false,
    residentialAddress: '5 Bode Thomas Street, Surulere',
    area: 'surulere',
    city: 'Lagos',
    employmentStatus: 'employed-full-time',
    occupations: ['doctor'],
    industrySectors: ['healthcare'],
    yearsOfExperience: 16,
    isVolunteer: false,

    // Privacy: Photo & contact info private, professional details public
    privacy: {
      photo: 'private',
      whatsappPhone: 'private',
      alternativePhone: 'private',
      birthDate: 'private',
      residentialAddress: 'private',
      area: 'public',
      city: 'public',
      employmentStatus: 'public',
      occupations: 'public',
      industrySectors: 'public',
      yearsOfExperience: 'public',
    },
  },

  {
    memberId: generateMemberId(2005, 'chidinma.eze@email.com'),
    id: 'acct-chidinma-eze',
    slug: 'chidinma-eze',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'chidinma.eze@email.com',
    password: 'Alumni123!',
    role: 'member',
    createdAt: '2024-04-20T14:45:00Z',

    isEmailVerified: true,
    emailVerifiedAt: '2024-04-20T14:50:00Z',
    approvalStatus: 'approved',
    approvedAt: '2024-04-20T16:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'paid',
    duesLastPaidAt: '2026-02-01T00:00:00Z',

    surname: 'Eze',
    otherNames: 'Chidinma Sandra',
    nameInSchool: 'Chidinma Eze',
    whatsappPhone: '+234 8078901234',
    graduationYear: 2005,
    photo: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80',
    birthDate: '1987-02-28',
    houseColor: 'green',
    isClassCoordinator: true,
    residentialAddress: '22 Wuse Zone 5',
    area: 'abuja',
    city: 'Abuja',
    employmentStatus: 'self-employed',
    occupations: ['software-developer', 'entrepreneur'],
    industrySectors: ['information-technology'],
    yearsOfExperience: 11,
    isVolunteer: true,

    // Privacy: Very private - only basic info public
    privacy: {
      photo: 'private',
      whatsappPhone: 'private',
      alternativePhone: 'private',
      birthDate: 'private',
      residentialAddress: 'private',
      area: 'private',
      city: 'private',
      employmentStatus: 'private',
      occupations: 'private',
      industrySectors: 'private',
      yearsOfExperience: 'private',
    },
  },

  // ── Historical members (Lagos Chapter — pre-loaded) ────────────────────────
  // These represent the client's existing member base.
  // Accounts are active and approved. Password is a placeholder — not used in testing.

  {
    memberId: generateMemberId(1990, 'abigal.ojo@email.com'),
    id: 'acct-abigal-ojo',
    slug: 'abigal-ojo',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.ojo@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'owing',
    duesAmountOwing: 15000,
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000001',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=200&q=80',
    city: 'Lagos',
    area: 'lekki',
    employmentStatus: 'self-employed',
    occupations: ['entrepreneur'],
    industrySectors: ['arts-culture'],
    isVolunteer: false,

    // Privacy: Default settings (testing defaults work correctly)
    privacy: {
      photo: 'public', // default
      whatsappPhone: 'private', // default
      alternativePhone: 'private', // default
      birthDate: 'private', // default
      residentialAddress: 'private', // default
      area: 'public', // default
      city: 'public', // default
      employmentStatus: 'public', // default
      occupations: 'public', // default
      industrySectors: 'public', // default
      yearsOfExperience: 'public', // default
    },
  },

  {
    memberId: generateMemberId(1990, 'precious.ojeka@email.com'),
    id: 'acct-precious-ojeka',
    slug: 'precious-ojeka',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'precious.ojeka@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'paid',
    duesLastPaidAt: '2026-01-15T00:00:00Z',
    surname: 'Ojeka',
    otherNames: 'Precious',
    nameInSchool: 'Precious Ojeka',
    whatsappPhone: '+234 8010000002',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&q=80',
    city: 'Lagos',
    area: 'lekki',
    employmentStatus: 'employed-full-time',
    occupations: ['banker'],
    industrySectors: ['banking-finance'],
    isVolunteer: true,

    // Privacy: Mixed approach - visible professionally, guards contact
    privacy: {
      photo: 'public',
      whatsappPhone: 'private',
      alternativePhone: 'private',
      birthDate: 'private',
      residentialAddress: 'private',
      area: 'public',
      city: 'public',
      employmentStatus: 'public',
      occupations: 'public',
      industrySectors: 'public',
      yearsOfExperience: 'public',
    },
  },

  {
    memberId: generateMemberId(1990, 'theresa.ojo@email.com'),
    id: 'acct-theresa-ojo',
    slug: 'theresa-ojo',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'theresa.ojo@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'owing',
    duesAmountOwing: 15000,
    surname: 'Ojo',
    otherNames: 'Theresa',
    nameInSchool: 'Theresa Ojo',
    whatsappPhone: '+234 8010000003',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80',
    city: 'Lagos',
    area: 'surulere',
    employmentStatus: 'employed-full-time',
    occupations: ['nurse'],
    industrySectors: ['healthcare'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1990, 'abigal.ceo@email.com'),
    id: 'acct-abigal-ojo-ceo',
    slug: 'abigal-ojo-ceo',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.ceo@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'paid',
    duesLastPaidAt: '2026-01-20T00:00:00Z',
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000004',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=200&q=80',
    city: 'Lagos',
    area: 'lekki',
    employmentStatus: 'business-owner',
    occupations: ['entrepreneur'],
    industrySectors: ['fashion-beauty'],
    isVolunteer: false,
  },

  {
    memberId: generateMemberId(1990, 'abigal.dev@email.com'),
    id: 'acct-abigal-ojo-dev',
    slug: 'abigal-ojo-dev',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.dev@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'owing',
    duesAmountOwing: 15000,
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000005',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&q=80',
    city: 'Lagos',
    area: 'yaba',
    employmentStatus: 'freelancer',
    occupations: ['software-developer'],
    industrySectors: ['information-technology'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1990, 'abigal.chef@email.com'),
    id: 'acct-abigal-ojo-chef',
    slug: 'abigal-ojo-chef',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.chef@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000006',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80',
    city: 'Lagos',
    area: 'victoria-island',
    employmentStatus: 'business-owner',
    occupations: ['entrepreneur'],
    industrySectors: ['food-beverage'],
    isVolunteer: false,
  },

  {
    memberId: generateMemberId(1990, 'abigal.artist2@email.com'),
    id: 'acct-abigal-ojo-artist-2',
    slug: 'abigal-ojo-artist-2',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.artist2@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'owing',
    duesAmountOwing: 15000,
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000007',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&q=80',
    city: 'Lagos',
    area: 'ikeja',
    employmentStatus: 'self-employed',
    occupations: ['entrepreneur'],
    industrySectors: ['arts-culture'],
    isVolunteer: false,
  },

  {
    memberId: generateMemberId(1990, 'abigal.artist3@email.com'),
    id: 'acct-abigal-ojo-artist-3',
    slug: 'abigal-ojo-artist-3',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.artist3@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'paid',
    duesLastPaidAt: '2026-02-10T00:00:00Z',
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000008',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&q=80',
    city: 'Lagos',
    area: 'gbagada',
    employmentStatus: 'employed-full-time',
    occupations: ['consultant'],
    industrySectors: ['media'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1990, 'abigal.artist4@email.com'),
    id: 'acct-abigal-ojo-artist-4',
    slug: 'abigal-ojo-artist-4',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.artist4@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'owing',
    duesAmountOwing: 15000,
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000009',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?w=200&q=80',
    city: 'Lagos',
    area: 'ikoyi',
    employmentStatus: 'employed-full-time',
    occupations: ['consultant'],
    industrySectors: ['fashion-beauty'],
    isVolunteer: false,
  },

  {
    memberId: generateMemberId(1990, 'abigal.artist5@email.com'),
    id: 'acct-abigal-ojo-artist-5',
    slug: 'abigal-ojo-artist-5',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.artist5@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'paid',
    duesLastPaidAt: '2026-01-05T00:00:00Z',
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000010',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1611432579699-484f7990b127?w=200&q=80',
    city: 'Lagos',
    area: 'maryland',
    employmentStatus: 'employed-full-time',
    occupations: ['consultant'],
    industrySectors: ['information-technology'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1990, 'abigal.artist6@email.com'),
    id: 'acct-abigal-ojo-artist-6',
    slug: 'abigal-ojo-artist-6',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.artist6@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'owing',
    duesAmountOwing: 15000,
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000011',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=200&q=80',
    city: 'Lagos',
    area: 'surulere',
    employmentStatus: 'employed-full-time',
    occupations: ['educator'],
    industrySectors: ['education'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1990, 'abigal.artist7@email.com'),
    id: 'acct-abigal-ojo-artist-7',
    slug: 'abigal-ojo-artist-7',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.artist7@email.com',
    password: 'HistoricalMember#1990!',
    role: 'member',
    createdAt: '2023-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2023-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2023-01-01T00:00:00Z',
    approvedBy: generateMemberId(1998, 'adaeze.okonkwo@email.com'),
    accountStatus: 'active',
    duesStatus: 'paid',
    duesLastPaidAt: '2026-03-01T00:00:00Z',
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8010000012',
    graduationYear: 1990,
    photo: 'https://images.unsplash.com/photo-1619441207978-3d326c46e2c9?w=200&q=80',
    city: 'Lagos',
    area: 'lekki',
    employmentStatus: 'freelancer',
    occupations: ['consultant'],
    industrySectors: ['arts-culture'],
    isVolunteer: false,
  },

  // ── Leadership accounts (excos are registered members) ────────────────────
  // These members hold leadership roles in the Lagos Chapter.
  // Their memberId is used in the leadership data in site-data.ts.

  {
    memberId: generateMemberId(1985, 'stella.alochi@email.com'),
    id: 'acct-stella-alochi',
    slug: 'stella-alochi',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'stella.alochi@email.com',
    password: 'HistoricalMember#1985!',
    role: 'admin',
    createdAt: '2022-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2022-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2022-01-01T00:00:00Z',
    approvedBy: generateMemberId(1985, 'stella.alochi@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Alochi',
    otherNames: 'Stella',
    nameInSchool: 'Stella Alochi',
    whatsappPhone: '+234 8020000001',
    graduationYear: 1985,
    photo: 'https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=200&q=80',
    city: 'Lagos',
    area: 'victoria-island',
    employmentStatus: 'employed-full-time',
    occupations: ['lawyer'],
    industrySectors: ['legal'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1987, 'abigal.vp@email.com'),
    id: 'acct-abigal-vp',
    slug: 'abigal-ojo-vp',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'abigal.vp@email.com',
    password: 'HistoricalMember#1987!',
    role: 'member',
    createdAt: '2022-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2022-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2022-01-01T00:00:00Z',
    approvedBy: generateMemberId(1985, 'stella.alochi@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Ojo',
    otherNames: 'Abigal',
    nameInSchool: 'Abigal Ojo',
    whatsappPhone: '+234 8020000002',
    graduationYear: 1987,
    city: 'Lagos',
    area: 'ikoyi',
    employmentStatus: 'business-owner',
    occupations: ['entrepreneur'],
    industrySectors: ['retail'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1989, 'josephine.adeka@email.com'),
    id: 'acct-josephine-adeka',
    slug: 'josephine-adeka',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'josephine.adeka@email.com',
    password: 'HistoricalMember#1989!',
    role: 'member',
    createdAt: '2022-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2022-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2022-01-01T00:00:00Z',
    approvedBy: generateMemberId(1985, 'stella.alochi@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Adeka',
    otherNames: 'Josephine',
    nameInSchool: 'Josephine Adeka',
    whatsappPhone: '+234 8020000003',
    graduationYear: 1989,
    city: 'Lagos',
    area: 'gbagada',
    employmentStatus: 'employed-full-time',
    occupations: ['journalist'],
    industrySectors: ['media'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1991, 'favour.adah@email.com'),
    id: 'acct-favour-adah',
    slug: 'favour-adah',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'favour.adah@email.com',
    password: 'HistoricalMember#1991!',
    role: 'member',
    createdAt: '2022-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2022-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2022-01-01T00:00:00Z',
    approvedBy: generateMemberId(1985, 'stella.alochi@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Adah',
    otherNames: 'Favour',
    nameInSchool: 'Favour Adah',
    whatsappPhone: '+234 8020000004',
    graduationYear: 1991,
    city: 'Lagos',
    area: 'surulere',
    employmentStatus: 'employed-full-time',
    occupations: ['civil-servant'],
    industrySectors: ['government'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1992, 'lilian.ojo@email.com'),
    id: 'acct-lilian-ojo',
    slug: 'lilian-ojo',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'lilian.ojo@email.com',
    password: 'HistoricalMember#1992!',
    role: 'member',
    createdAt: '2022-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2022-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2022-01-01T00:00:00Z',
    approvedBy: generateMemberId(1985, 'stella.alochi@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Ojo',
    otherNames: 'Lilian',
    nameInSchool: 'Lilian Ojo',
    whatsappPhone: '+234 8020000005',
    graduationYear: 1992,
    city: 'Lagos',
    area: 'ikeja',
    employmentStatus: 'employed-full-time',
    occupations: ['accountant'],
    industrySectors: ['banking-finance'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1993, 'goodness.adeka@email.com'),
    id: 'acct-goodness-adeka',
    slug: 'goodness-adeka',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'goodness.adeka@email.com',
    password: 'HistoricalMember#1993!',
    role: 'member',
    createdAt: '2022-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2022-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2022-01-01T00:00:00Z',
    approvedBy: generateMemberId(1985, 'stella.alochi@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Adeka',
    otherNames: 'Goodness',
    nameInSchool: 'Goodness Adeka',
    whatsappPhone: '+234 8020000006',
    graduationYear: 1993,
    city: 'Lagos',
    area: 'maryland',
    employmentStatus: 'employed-full-time',
    occupations: ['accountant'],
    industrySectors: ['banking-finance'],
    isVolunteer: true,
  },

  {
    memberId: generateMemberId(1994, 'bella.adah@email.com'),
    id: 'acct-bella-adah',
    slug: 'bella-adah',
    chapterId: DEFAULT_CHAPTER_ID,
    email: 'bella.adah@email.com',
    password: 'HistoricalMember#1994!',
    role: 'member',
    createdAt: '2022-01-01T00:00:00Z',
    isEmailVerified: true,
    emailVerifiedAt: '2022-01-01T00:00:00Z',
    approvalStatus: 'approved',
    approvedAt: '2022-01-01T00:00:00Z',
    approvedBy: generateMemberId(1985, 'stella.alochi@email.com'),
    accountStatus: 'active',
    duesStatus: 'exempt',
    surname: 'Adah',
    otherNames: 'Bella',
    nameInSchool: 'Bella Adah',
    whatsappPhone: '+234 8020000007',
    graduationYear: 1994,
    city: 'Lagos',
    area: 'lekki',
    employmentStatus: 'self-employed',
    occupations: ['entrepreneur'],
    industrySectors: ['hospitality'],
    isVolunteer: true,
  },
];

// ─── Helper — export the generateMemberId so site-data.ts can use it ──────────
export { generateMemberId };
