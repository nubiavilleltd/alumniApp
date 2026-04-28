// src/features/alumni/utils/privacyHelpers.tsx

import React from 'react';
import { Icon } from '@iconify/react';
import type { AuthSessionUser, PrivacySettings } from '@/features/authentication/types/auth.types';
import { Alumni } from '../types/alumni.types';

/**
 * Check if a field is visible to the current viewer
 *
 * @param fieldOwner - The user whose field we're checking
 * @param fieldName - The field to check (e.g., 'photo', 'phone')
 * @param currentViewer - The logged-in user viewing the field (or null if not logged in)
 * @returns true if the field should be visible, false otherwise
 */

export function isFieldVisible(
  fieldOwner: Alumni,
  fieldName: keyof PrivacySettings,
  currentViewer: Alumni | null,
): boolean {
  // User can always see their own fields
  if (currentViewer?.memberId === fieldOwner.id) {
    return true;
  }

  // Check privacy setting (default to 'public' if not set)
  const fieldPrivacy = fieldOwner.privacy?.[fieldName] ?? 'public';

  return fieldPrivacy === 'public';
}

/**
 * Get display value for a field, respecting privacy
 * Returns the actual value if visible, or a "Private" indicator if not
 *
 * @param value - The actual field value
 * @param isVisible - Whether the field is visible to the current viewer
 * @param emptyText - Text to show if value is empty/undefined (default: 'Not provided')
 * @returns The value to display (either actual value, "Private", or empty text)
 */
export function getPrivateFieldDisplay(
  value: string | number | string[] | undefined | null,
  isVisible: boolean,
  emptyText: string = 'Not provided',
): string | React.ReactElement {
  // If not visible, show private indicator
  if (!isVisible) {
    return (
      <span className="inline-flex items-center gap-1 text-gray-400 italic text-sm">
        <Icon icon="mdi:lock" className="w-4 h-4" />
        Private
      </span>
    );
  }

  // If visible but empty/undefined, show empty text
  if (value === null || value === undefined || value === '') {
    return emptyText;
  }

  // If it's an array, join with commas
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : emptyText;
  }

  // Return the actual value
  return value.toString();
}

/**
 * Get photo URL or null based on privacy
 * Used to determine whether to show the actual photo or just initials
 *
 * @param photoUrl - The photo URL
 * @param isVisible - Whether the photo is visible to the current viewer
 * @returns The photo URL if visible, null otherwise
 */
export function getPhotoDisplay(photoUrl: string | undefined, isVisible: boolean): string | null {
  if (!isVisible) {
    return null;
  }
  return photoUrl ?? null;
}

/**
 * Check if ANY contact info is visible
 * Useful for determining whether to show a "Contact" section at all
 */
export function hasVisibleContactInfo(fieldOwner: Alumni, currentViewer: Alumni | null): boolean {
  const contactFields: (keyof PrivacySettings)[] = ['whatsappPhone', 'alternativePhone'];

  return contactFields.some((field) => isFieldVisible(fieldOwner, field, currentViewer));
}

/**
 * Check if ANY location info is visible
 * Useful for determining whether to show a "Location" section at all
 */
export function hasVisibleLocationInfo(fieldOwner: Alumni, currentViewer: Alumni | null): boolean {
  const locationFields: (keyof PrivacySettings)[] = ['residentialAddress', 'area', 'city'];

  return locationFields.some((field) => isFieldVisible(fieldOwner, field, currentViewer));
}

/**
 * Check if ANY professional info is visible
 * Useful for determining whether to show a "Professional" section at all
 */
export function hasVisibleProfessionalInfo(
  fieldOwner: Alumni,
  currentViewer: Alumni | null,
): boolean {
  const professionalFields: (keyof PrivacySettings)[] = [
    'employmentStatus',
    'occupations',
    'industrySectors',
    'yearsOfExperience',
  ];

  return professionalFields.some((field) => isFieldVisible(fieldOwner, field, currentViewer));
}

export function parseFieldVisibility(value?: string | null) {
  if (!value) return {};

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}
