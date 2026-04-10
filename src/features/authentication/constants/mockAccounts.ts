// features/authentication/constants/mockAccounts.ts

import { DEFAULT_CHAPTER_ID } from '@/data/chapters';
import type { PrivacySettings } from '../types/auth.types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type AccountStatus = 'active' | 'suspended' | 'closed' | 'deactivated';
// export type DuesStatus = 'paid' | 'owing' | 'exempt';
export type DuesStatus = 'paid' | 'owing' | 'overdue' | 'exempt' | 'unknown';

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

// ─── Helper — export the generateMemberId so site-data.ts can use it ──────────
export { generateMemberId };
