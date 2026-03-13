// import { z } from 'zod';
// import { phoneCountryOptions, validateNationalPhoneNumber } from '../constants/phoneCountries';

// const currentYear = new Date().getFullYear();
// const supportedPhoneCountries = phoneCountryOptions.map((option) => option.code) as [
//   (typeof phoneCountryOptions)[number]['code'],
//   ...(typeof phoneCountryOptions)[number]['code'][],
// ];

// const passwordSchema = z
//   .string()
//   .min(8, 'Password must be at least 8 characters')
//   .regex(/[a-z]/, 'Password must include at least one lowercase letter')
//   .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
//   .regex(/\d/, 'Password must include at least one number')
//   .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');

// export const loginSchema = z.object({
//   email: z.string().trim().email('Please enter a valid email address'),
//   password: z.string().min(1, 'Password is required'),
//   rememberMe: z.boolean().default(false),
// });

// export const forgotPasswordSchema = z.object({
//   email: z.string().trim().email('Please enter a valid email address'),
// });

// export const registerDetailsSchema = z
//   .object({
//     fullName: z
//       .string()
//       .trim()
//       .min(3, 'Name must be at least 3 characters')
//       .max(80, 'Name must be 80 characters or less')
//       .regex(/^[A-Za-z][A-Za-z\s'.-]*$/, 'Please enter a valid full name'),
//     email: z.string().trim().email('Please enter a valid email address'),
//     phoneCountry: z.enum(supportedPhoneCountries),
//     phoneNumber: z.string().trim().min(1, 'Phone number is required'),
//     graduationYear: z.coerce
//       .number()
//       .int('Graduation year must be a whole number')
//       .min(1950, 'Graduation year must be 1950 or later')
//       .max(currentYear, `Graduation year cannot be later than ${currentYear}`),
//     password: passwordSchema,
//     confirmPassword: z.string().min(1, 'Please confirm your password'),
//   })
//   .superRefine((data, ctx) => {
//     const phoneNumberError = validateNationalPhoneNumber(data.phoneCountry, data.phoneNumber);

//     if (phoneNumberError) {
//       ctx.addIssue({
//         code: 'custom',
//         path: ['phoneNumber'],
//         message: phoneNumberError,
//       });
//     }
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ['confirmPassword'],
//     message: 'Passwords do not match',
//   });

// export const emailVerificationSchema = z.object({
//   code: z
//     .string()
//     .trim()
//     .regex(/^\d{6}$/, 'Enter the 6-digit verification code'),
// });

// export const resetPasswordSchema = z
//   .object({
//     password: passwordSchema,
//     confirmPassword: z.string().min(1, 'Please confirm your password'),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     path: ['confirmPassword'],
//     message: 'Passwords do not match',
//   });





import { z } from 'zod';
import { phoneCountryOptions, validateNationalPhoneNumber } from '../constants/phoneCountries';

const currentYear = new Date().getFullYear();
const supportedPhoneCountries = phoneCountryOptions.map((option) => option.code) as [
  (typeof phoneCountryOptions)[number]['code'],
  ...(typeof phoneCountryOptions)[number]['code'][],
];

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/\d/, 'Password must include at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character');

export const loginSchema = z.object({
  email:      z.string().trim().email('Please enter a valid email address'),
  password:   z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export const registerDetailsSchema = z
  .object({
    surname: z
      .string()
      .trim()
      .min(2, 'Surname must be at least 2 characters')
      .max(50, 'Surname must be 50 characters or less')
      .regex(/^[A-Za-z][A-Za-z\s'.-]*$/, 'Please enter a valid surname'),

    otherNames: z
      .string()
      .trim()
      .min(2, 'Other names must be at least 2 characters')
      .max(80, 'Other names must be 80 characters or less')
      .regex(/^[A-Za-z][A-Za-z\s'.-]*$/, 'Please enter valid other names'),

    nameInSchool: z
      .string()
      .trim()
      .min(3, 'Name in school must be at least 3 characters')
      .max(80, 'Name in school must be 80 characters or less')
      .regex(/^[A-Za-z][A-Za-z\s'.-]*$/, 'Please enter a valid name'),

    email: z.string().trim().email('Please enter a valid email address'),

    phoneCountry: z.enum(supportedPhoneCountries),

    whatsappPhone: z.string().trim().min(1, 'WhatsApp phone number is required'),

    graduationYear: z.coerce
      .number()
      .int('Graduation year must be a whole number')
      .min(1966, 'FGGC Owerri was established in 1966')
      .max(currentYear, `Graduation year cannot be later than ${currentYear}`),

    password:        passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .superRefine((data, ctx) => {
    const phoneError = validateNationalPhoneNumber(data.phoneCountry, data.whatsappPhone);
    if (phoneError) {
      ctx.addIssue({ code: 'custom', path: ['whatsappPhone'], message: phoneError });
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const emailVerificationSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit verification code'),
});

export const resetPasswordSchema = z
  .object({
    password:        passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
