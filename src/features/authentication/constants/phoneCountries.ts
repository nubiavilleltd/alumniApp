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

export function getPhoneCountryOption(countryCode: SupportedPhoneCountry) {
  return phoneCountryByCode[countryCode];
}

export function normalizeNationalPhoneNumber(value: string) {
  return value.replace(/\D/g, '');
}

export function validateNationalPhoneNumber(countryCode: SupportedPhoneCountry, value: string) {
  const digits = normalizeNationalPhoneNumber(value);
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
  const digits = normalizeNationalPhoneNumber(value);
  const country = getPhoneCountryOption(countryCode);

  return digits ? `${country.dialCode} ${digits}` : country.dialCode;
}
