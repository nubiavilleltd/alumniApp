// features/authentication/utils/authUtils.ts
//
// Pure transformation utilities — not mock-specific.
// These stay when mockAuth.ts is deleted.

import type { MockAuthAccount } from '../constants/mockAccounts';
import type { AuthSessionUser } from '../types/auth.types';
import { defaultPrivacySettings } from '../types/auth.types';

export function getInitials(surname: string, otherNames: string): string {
  const first = otherNames.trim().split(' ')[0]?.[0]?.toUpperCase() ?? '';
  const last = surname.trim()[0]?.toUpperCase() ?? '';
  return `${first}${last}`;
}

/**
 * Maps a raw account (mock or real API response) into AuthSessionUser.
 *
 * 🔴 TODO: When the real backend is ready, update the parameter type from
 * MockAuthAccount to the API response shape and adjust mappings below.
 * The return type (AuthSessionUser) stays the same.
 */
export function toAuthSessionUser(account: MockAuthAccount): AuthSessionUser {
  const fullName = `${account.otherNames} ${account.surname}`.trim();

  return {
    // ── Identity ─────────────────────────────────────────────────────────
    memberId: account.memberId,
    id: account.id,
    slug: account.slug,
    avatarInitials: getInitials(account.surname, account.otherNames),
    profileHref: `/alumni/profiles/${account.slug}`,
    createdAt: account.createdAt,
    chapterId: account.chapterId,

    // ── Auth ─────────────────────────────────────────────────────────────
    role: account.role,

    // ── Verification ─────────────────────────────────────────────────────
    isEmailVerified: account.isEmailVerified,
    emailVerifiedAt: account.emailVerifiedAt,

    // ── Approval ─────────────────────────────────────────────────────────
    approvalStatus: account.approvalStatus,
    approvedAt: account.approvedAt,
    approvedBy: account.approvedBy,

    // ── Account ───────────────────────────────────────────────────────────
    accountStatus: account.accountStatus,

    // ── Dues ──────────────────────────────────────────────────────────────
    duesStatus: account.duesStatus,
    duesLastPaidAt: account.duesLastPaidAt,
    duesAmountOwing: account.duesAmountOwing,

    // ── Registration fields ───────────────────────────────────────────────
    surname: account.surname,
    otherNames: account.otherNames,
    fullName,
    nameInSchool: account.nameInSchool,
    email: account.email,
    whatsappPhone: account.whatsappPhone,
    graduationYear: account.graduationYear,

    // ── Profile fields ────────────────────────────────────────────────────
    photo: account.photo,
    alternativePhone: account.alternativePhone,
    birthDate: account.birthDate,
    houseColor: account.houseColor,
    isClassCoordinator: account.isClassCoordinator,
    residentialAddress: account.residentialAddress,
    area: account.area,
    city: account.city,
    employmentStatus: account.employmentStatus,
    occupations: account.occupations,
    industrySectors: account.industrySectors,
    yearsOfExperience: account.yearsOfExperience,
    isVolunteer: account.isVolunteer,

    // ── Privacy — merge stored settings over defaults ─────────────────────
    privacy: { ...defaultPrivacySettings, ...account.privacy },
  };
}
