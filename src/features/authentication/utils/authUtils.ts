// features/authentication/utils/authUtils.ts
//
// Pure utility functions for auth data transformation.
// These are NOT mock-specific — they stay when mockAuth.ts is deleted.

import type { MockAuthAccount } from '../constants/mockAccounts';
import type { AuthSessionUser } from '../types/auth.types';

/**
 * Derives avatar initials from surname + otherNames.
 * e.g. surname="Okonkwo" otherNames="Adaeze Chioma" → "AO"
 */
export function getInitials(surname: string, otherNames: string): string {
  const first = otherNames.trim().split(' ')[0]?.[0]?.toUpperCase() ?? '';
  const last  = surname.trim()[0]?.toUpperCase() ?? '';
  return `${first}${last}`;
}

/**
 * Maps a raw account object (mock or real API response) into the
 * consistent AuthSessionUser shape used throughout the app.
 *
 * 🔴 TODO: When the real backend is ready, update the parameter type from
 * MockAuthAccount to whatever shape the API returns, then adjust the
 * field mappings below accordingly. The return type stays the same.
 */
export function toAuthSessionUser(account: MockAuthAccount): AuthSessionUser {
  const fullName = `${account.otherNames} ${account.surname}`.trim();

  return {
    // ── System ──────────────────────────────────────────────────────────────
    id:             account.id,
    slug:           account.slug,
    avatarInitials: getInitials(account.surname, account.otherNames),
    profileHref:    `/alumni/profiles/${account.slug}`,
    createdAt:      account.createdAt,
    role:           account.role,

    // ── Registration fields (always present) ────────────────────────────────
    surname:        account.surname,
    otherNames:     account.otherNames,
    fullName,
    nameInSchool:   account.nameInSchool,
    email:          account.email,
    whatsappPhone:  account.whatsappPhone,
    graduationYear: account.graduationYear,

    // ── Profile fields (optional, filled after registration) ────────────────
    photo:              account.photo,
    alternativePhone:   account.alternativePhone,
    birthDate:          account.birthDate,
    houseColor:         account.houseColor,
    isClassCoordinator: account.isClassCoordinator,
    residentialAddress: account.residentialAddress,
    area:               account.area,
    city:               account.city,
    employmentStatus:   account.employmentStatus,
    occupations:        account.occupations,
    industrySectors:    account.industrySectors,
    yearsOfExperience:  account.yearsOfExperience,
    isVolunteer:        account.isVolunteer,
  };
}