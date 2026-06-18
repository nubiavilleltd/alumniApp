export const NIGERIAN_PHONE_LENGTH = 11;
export const NIGERIAN_PHONE_PLACEHOLDER = '08012345678';
export const NIGERIAN_PHONE_PATTERN = /^0[789]\d{9}$/;
export const NIGERIAN_PHONE_VALIDATION_MESSAGE =
  'Enter a valid 11-digit Nigerian phone number starting with 0';

export function extractPhoneDigits(value: string | null | undefined) {
  return String(value ?? '').replace(/\D/g, '');
}

function normalizeDigitsToLocalNigerianPhone(digits: string) {
  if (!digits) {
    return '';
  }

  if (digits.startsWith('2340') && digits.length >= NIGERIAN_PHONE_LENGTH + 3) {
    return `0${digits.slice(4)}`.slice(0, NIGERIAN_PHONE_LENGTH);
  }

  if (digits.startsWith('234') && digits.length >= NIGERIAN_PHONE_LENGTH + 2) {
    return `0${digits.slice(3)}`.slice(0, NIGERIAN_PHONE_LENGTH);
  }

  if (digits.length === NIGERIAN_PHONE_LENGTH - 1 && /^[789]/.test(digits)) {
    return `0${digits}`.slice(0, NIGERIAN_PHONE_LENGTH);
  }

  if (digits.startsWith('0')) {
    return digits.slice(0, NIGERIAN_PHONE_LENGTH);
  }

  return digits.slice(0, NIGERIAN_PHONE_LENGTH);
}

export function normalizeNigerianPhoneNumber(value: string | null | undefined) {
  return normalizeDigitsToLocalNigerianPhone(extractPhoneDigits(value));
}

export function isValidNigerianPhoneNumber(value: string | null | undefined) {
  return NIGERIAN_PHONE_PATTERN.test(normalizeNigerianPhoneNumber(value));
}

export function validateNigerianPhoneNumber(
  value: string | null | undefined,
  options?: { required?: boolean },
) {
  const normalized = normalizeNigerianPhoneNumber(value);
  const required = options?.required ?? true;

  if (!normalized) {
    return required ? 'Phone number is required' : null;
  }

  if (!NIGERIAN_PHONE_PATTERN.test(normalized)) {
    return NIGERIAN_PHONE_VALIDATION_MESSAGE;
  }

  return null;
}

export function formatOptionalNigerianPhoneNumber(value: string | null | undefined) {
  const normalized = normalizeNigerianPhoneNumber(value);
  return normalized && NIGERIAN_PHONE_PATTERN.test(normalized) ? normalized : '';
}

export function parseStoredNigerianPhoneNumber(value: string | null | undefined) {
  return normalizeNigerianPhoneNumber(value);
}

export function isNumericEditingKey(event: React.KeyboardEvent<HTMLInputElement>) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return true;
  }

  const allowedKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Enter',
    'Escape',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]);

  return allowedKeys.has(event.key) || /^\d$/.test(event.key);
}
