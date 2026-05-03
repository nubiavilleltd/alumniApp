// utils/dateHelpers.ts

/**
 * Get a date that is N years ago from today in YYYY-MM-DD format
 * Useful for DatePicker max/min constraints
 */
export function getDateYearsAgo(years: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split('T')[0];
}

/**
 * Get a date that is N years from today in YYYY-MM-DD format
 */
export function getDateYearsFromNow(years: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().split('T')[0];
}

/**
 * Calculate age from a date of birth string (YYYY-MM-DD)
 */
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Check if a person is at least a certain age
 */
export function isAtLeastAge(birthDate: string, minAge: number): boolean {
  return calculateAge(birthDate) >= minAge;
}
