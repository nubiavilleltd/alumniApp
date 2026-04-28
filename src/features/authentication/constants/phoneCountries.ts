export const phoneCountryOptions = [
  {
    code: 'NG',
    label: 'Nigeria',
    dialCode: '+234',
    placeholder: '8012345678',
    minLength: 10,
    maxLength: 10,
    pattern: /^\d{10}$/,
    validationMessage: 'Enter a valid Nigerian phone number without the +234 country code',
  },
  {
    code: 'US',
    label: 'United States',
    dialCode: '+1',
    placeholder: '2015550123',
    minLength: 10,
    maxLength: 10,
    pattern: /^\d{10}$/,
    validationMessage: 'Enter a valid US phone number without the +1 country code',
  },
  {
    code: 'GB',
    label: 'United Kingdom',
    dialCode: '+44',
    placeholder: '7400123456',
    minLength: 10,
    maxLength: 10,
    pattern: /^\d{10}$/,
    validationMessage: 'Enter a valid UK phone number without the +44 country code',
  },
  {
    code: 'GH',
    label: 'Ghana',
    dialCode: '+233',
    placeholder: '241234567',
    minLength: 9,
    maxLength: 9,
    pattern: /^\d{9}$/,
    validationMessage: 'Enter a valid Ghanaian phone number without the +233 country code',
  },
  {
    code: 'KE',
    label: 'Kenya',
    dialCode: '+254',
    placeholder: '712345678',
    minLength: 9,
    maxLength: 9,
    pattern: /^\d{9}$/,
    validationMessage: 'Enter a valid Kenyan phone number without the +254 country code',
  },
  {
    code: 'ZA',
    label: 'South Africa',
    dialCode: '+27',
    placeholder: '821234567',
    minLength: 9,
    maxLength: 9,
    pattern: /^\d{9}$/,
    validationMessage: 'Enter a valid South African phone number without the +27 country code',
  },
] as const;

export type SupportedPhoneCountry = (typeof phoneCountryOptions)[number]['code'];

export const defaultPhoneCountry: SupportedPhoneCountry = 'NG';

const phoneCountryByCode = Object.fromEntries(
  phoneCountryOptions.map((option) => [option.code, option]),
) as Record<SupportedPhoneCountry, (typeof phoneCountryOptions)[number]>;
const phoneCountriesByDialCode = [...phoneCountryOptions].sort(
  (left, right) => right.dialCode.length - left.dialCode.length,
);

export function getPhoneCountryOption(countryCode: SupportedPhoneCountry) {
  return phoneCountryByCode[countryCode];
}

export function normalizeNationalPhoneNumber(value: string) {
  return value.replace(/\D/g, '');
}

function stripNationalTrunkPrefix(countryCode: SupportedPhoneCountry, value: string) {
  const country = getPhoneCountryOption(countryCode);
  if (country.pattern.test(value)) {
    return value;
  }

  if (value.startsWith('0') && country.pattern.test(value.slice(1))) {
    return value.slice(1);
  }

  return value;
}

export function normalizePhoneNumberForCountry(countryCode: SupportedPhoneCountry, value: string) {
  const digits = normalizeNationalPhoneNumber(value);
  const normalized = stripNationalTrunkPrefix(countryCode, digits);
  const country = getPhoneCountryOption(countryCode);

  return normalized.slice(0, country.maxLength);
}

export function validateNationalPhoneNumber(countryCode: SupportedPhoneCountry, value: string) {
  const digits = stripNationalTrunkPrefix(countryCode, normalizeNationalPhoneNumber(value));
  const country = getPhoneCountryOption(countryCode);

  if (!digits) {
    return 'Phone number is required';
  }

  if (!country.pattern.test(digits)) {
    return country.validationMessage;
  }

  return null;
}

export function formatPhoneNumberWithCountryCode(
  countryCode: SupportedPhoneCountry,
  value: string,
) {
  const digits = normalizePhoneNumberForCountry(countryCode, value);
  const country = getPhoneCountryOption(countryCode);

  return digits ? `${country.dialCode} ${digits}` : country.dialCode;
}

export function formatOptionalPhoneNumberWithCountryCode(
  countryCode: SupportedPhoneCountry,
  value: string,
) {
  const digits = normalizePhoneNumberForCountry(countryCode, value);
  return digits ? formatPhoneNumberWithCountryCode(countryCode, digits) : '';
}

export function parseStoredPhoneNumber(
  value: string | null | undefined,
  fallbackCountry: SupportedPhoneCountry = defaultPhoneCountry,
) {
  const digits = normalizeNationalPhoneNumber(value ?? '');

  if (!digits) {
    return {
      countryCode: fallbackCountry,
      nationalNumber: '',
    };
  }

  for (const option of phoneCountriesByDialCode) {
    const dialDigits = normalizeNationalPhoneNumber(option.dialCode);
    if (!digits.startsWith(dialDigits)) {
      continue;
    }

    const candidate = stripNationalTrunkPrefix(option.code, digits.slice(dialDigits.length));
    if (!candidate || option.pattern.test(candidate)) {
      return {
        countryCode: option.code,
        nationalNumber: candidate.slice(0, option.maxLength),
      };
    }
  }

  return {
    countryCode: fallbackCountry,
    nationalNumber: normalizePhoneNumberForCountry(fallbackCountry, digits),
  };
}
