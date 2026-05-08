// utils/dateHelpers.ts

type DateInput = string | Date | null | undefined;

type FormatDateValueOptions = {
  locale?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
};

type FormatDateRangeOptions = FormatDateValueOptions & {
  separator?: string;
  collapseSameDay?: boolean;
};

const DEFAULT_SHORT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

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

export function parseDateInput(date?: DateInput) {
  if (!date) return null;

  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : new Date(date.getTime());
  }

  const trimmedDate = date.trim();
  if (!trimmedDate) return null;

  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedDate);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsedDate = new Date(trimmedDate);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate;
}

function isSameCalendarDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function formatDateValue(date?: DateInput, options: FormatDateValueOptions = {}) {
  const parsedDate = parseDateInput(date);
  if (!parsedDate) return null;

  return parsedDate.toLocaleDateString(options.locale ?? 'en-US', {
    ...DEFAULT_SHORT_DATE_FORMAT,
    ...options.formatOptions,
  });
}

export function formatDateRange(
  startDate?: DateInput,
  endDate?: DateInput,
  options: FormatDateRangeOptions = {},
) {
  const parsedStartDate = parseDateInput(startDate);
  const parsedEndDate = parseDateInput(endDate);
  const startLabel = formatDateValue(parsedStartDate, options);
  const endLabel = formatDateValue(parsedEndDate, options);

  if (!startLabel && !endLabel) return null;
  if (!startLabel) return endLabel;
  if (!endLabel) return startLabel;

  if (
    options.collapseSameDay !== false &&
    parsedStartDate &&
    parsedEndDate &&
    isSameCalendarDay(parsedStartDate, parsedEndDate)
  ) {
    return startLabel;
  }

  return `${startLabel}${options.separator ?? ' - '}${endLabel}`;
}

export function formatDate(date?: string) {
  return formatDateValue(date, {
    locale: 'en-GB',
    formatOptions: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  });
}
