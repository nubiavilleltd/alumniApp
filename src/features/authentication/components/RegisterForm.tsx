// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { Icon } from '@iconify/react';
// // import { useState } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { getSiteConfig } from '@/data/content';
// // import { AppLink } from '@/shared/components/ui/AppLink';
// // import { authApi } from '../api/authApi';
// // import {
// //   defaultPhoneCountry,
// //   formatPhoneNumberWithCountryCode,
// //   getPhoneCountryOption,
// //   normalizeNationalPhoneNumber,
// //   type SupportedPhoneCountry,
// //   phoneCountryOptions,
// // } from '../constants/phoneCountries';
// // import { emailVerificationSchema, registerDetailsSchema } from '../schemas/authSchema';
// // import type {
// //   CompleteRegistrationResponse,
// //   EmailVerificationFormValues,
// //   RegisterDetailsFormValues,
// //   StartRegistrationResponse,
// // } from '../types/auth.types';
// // import { PasswordStrengthMeter } from './PasswordStrengthMeter';

// // type RegistrationStep = 'details' | 'verification' | 'success';

// // const stepOrder: Array<{ id: RegistrationStep; label: string }> = [
// //   { id: 'details', label: 'Account details' },
// //   { id: 'verification', label: 'Verify email' },
// //   { id: 'success', label: 'Approval pending' },
// // ];

// // function currentStepIndex(step: RegistrationStep) {
// //   return stepOrder.findIndex((item) => item.id === step);
// // }

// // export function RegisterForm() {
// //   const config = getSiteConfig();
// //   const currentYear = new Date().getFullYear();
// //   const firstYear = Math.min(config.years.start, currentYear - 70);
// //   const lastYear = Math.max(config.years.end, currentYear);
// //   const graduationYears = Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
// //     return lastYear - index;
// //   });

// //   const [step, setStep] = useState<RegistrationStep>('details');
// //   const [draft, setDraft] = useState<RegisterDetailsFormValues | null>(null);
// //   const [verificationState, setVerificationState] = useState<StartRegistrationResponse | null>(
// //     null,
// //   );
// //   const [completionState, setCompletionState] = useState<CompleteRegistrationResponse | null>(null);
// //   const [resendMessage, setResendMessage] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// //   const detailForm = useForm<RegisterDetailsFormValues>({
// //     resolver: zodResolver(registerDetailsSchema),
// //     defaultValues: {
// //       fullName: '',
// //       email: '',
// //       phoneCountry: defaultPhoneCountry,
// //       phoneNumber: '',
// //       graduationYear: currentYear,
// //       password: '',
// //       confirmPassword: '',
// //     },
// //   });

// //   const verificationForm = useForm<EmailVerificationFormValues>({
// //     resolver: zodResolver(emailVerificationSchema),
// //     defaultValues: {
// //       code: '',
// //     },
// //   });

// //   const passwordValue = detailForm.watch('password') ?? '';
// //   const phoneCountry = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
// //   const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
// //   const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
// //   const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);
// //   const phoneCountryRegistration = detailForm.register('phoneCountry', {
// //     onChange: (event) => {
// //       const nextCountryCode = event.target.value as SupportedPhoneCountry;
// //       const nextCountry = getPhoneCountryOption(nextCountryCode);
// //       const currentPhoneNumber = normalizeNationalPhoneNumber(detailForm.getValues('phoneNumber'));
// //       const nextPhoneNumber = currentPhoneNumber.slice(0, nextCountry.maxLength);

// //       if (nextPhoneNumber !== detailForm.getValues('phoneNumber')) {
// //         detailForm.setValue('phoneNumber', nextPhoneNumber, {
// //           shouldDirty: true,
// //           shouldValidate: true,
// //         });
// //         return;
// //       }

// //       if (currentPhoneNumber) {
// //         void detailForm.trigger('phoneNumber');
// //       }
// //     },
// //   });
// //   const phoneNumberRegistration = detailForm.register('phoneNumber', {
// //     onChange: (event) => {
// //       event.target.value = normalizeNationalPhoneNumber(event.target.value).slice(
// //         0,
// //         selectedPhoneCountry.maxLength,
// //       );
// //     },
// //   });

// //   const submitDetails = detailForm.handleSubmit(async (values) => {
// //     const response = await authApi.startRegistration(values);
// //     setDraft(values);
// //     setVerificationState(response);
// //     setCompletionState(null);
// //     setResendMessage('');
// //     verificationForm.reset({ code: '' });
// //     setStep('verification');
// //   });

// //   const submitVerification = verificationForm.handleSubmit(async (values) => {
// //     if (!draft) {
// //       return;
// //     }

// //     const response = await authApi.verifyRegistrationEmail({
// //       draft,
// //       code: values.code,
// //     });

// //     setCompletionState(response);
// //     setStep('success');
// //   });

// //   const resendVerificationCode = async () => {
// //     if (!draft) {
// //       return;
// //     }

// //     const response = await authApi.startRegistration(draft);
// //     setVerificationState(response);
// //     setResendMessage(`A fresh verification step has been simulated for ${draft.email}.`);
// //   };

// //   const activeStepIndex = currentStepIndex(step);

// //   const resetFlow = () => {
// //     detailForm.reset({
// //       fullName: '',
// //       email: '',
// //       phoneCountry: defaultPhoneCountry,
// //       phoneNumber: '',
// //       graduationYear: currentYear,
// //       password: '',
// //       confirmPassword: '',
// //     });
// //     verificationForm.reset({ code: '' });
// //     setDraft(null);
// //     setVerificationState(null);
// //     setCompletionState(null);
// //     setResendMessage('');
// //     setStep('details');
// //   };

// //   return (
// //     <div>
// //       <div className="mb-6">
// //         <h2 className="text-2xl font-bold text-accent-900">Register</h2>
// //         <p className="mt-2 text-sm leading-6 text-accent-500">
// //           Enter your alumni details, verify your email, and then wait for admin approval before the
// //           account can be used.
// //         </p>
// //       </div>

// //       <div className="mb-8 grid gap-3 sm:grid-cols-3">
// //         {stepOrder.map((item, index) => {
// //           const isComplete = index < activeStepIndex;
// //           const isActive = index === activeStepIndex;

// //           return (
// //             <div
// //               className={`rounded-2xl border px-4 py-3 transition-colors duration-200 ${
// //                 isActive
// //                   ? 'border-primary-300 bg-primary-50'
// //                   : isComplete
// //                     ? 'border-primary-200 bg-white'
// //                     : 'border-accent-200 bg-accent-50'
// //               }`}
// //               key={item.id}
// //             >
// //               <div className="flex items-center gap-3">
// //                 <div
// //                   className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
// //                     isActive || isComplete
// //                       ? 'bg-primary-600 text-white'
// //                       : 'bg-white text-accent-500'
// //                   }`}
// //                 >
// //                   {isComplete ? <Icon icon="mdi:check" className="h-4 w-4" /> : index + 1}
// //                 </div>
// //                 <span className="text-sm font-semibold text-accent-800">{item.label}</span>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {step === 'details' && (
// //         <form className="space-y-5" onSubmit={submitDetails}>
// //           <div>
// //             <label
// //               className="mb-2 block text-sm font-semibold text-accent-800"
// //               htmlFor="register-name"
// //             >
// //               Full name
// //             </label>
// //             <input
// //               id="register-name"
// //               type="text"
// //               autoComplete="name"
// //               placeholder="Jane Doe"
// //               className={`input ${detailForm.formState.errors.fullName ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //               {...detailForm.register('fullName')}
// //             />
// //             {detailForm.formState.errors.fullName && (
// //               <p className="mt-2 text-sm text-secondary-700">
// //                 {detailForm.formState.errors.fullName.message}
// //               </p>
// //             )}
// //           </div>

// //           <div className="grid gap-5 md:grid-cols-2">
// //             <div>
// //               <label
// //                 className="mb-2 block text-sm font-semibold text-accent-800"
// //                 htmlFor="register-email"
// //               >
// //                 Email address
// //               </label>
// //               <input
// //                 id="register-email"
// //                 type="email"
// //                 autoComplete="email"
// //                 placeholder="you@example.com"
// //                 className={`input ${detailForm.formState.errors.email ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //                 {...detailForm.register('email')}
// //               />
// //               {detailForm.formState.errors.email && (
// //                 <p className="mt-2 text-sm text-secondary-700">
// //                   {detailForm.formState.errors.email.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div>
// //               <label
// //                 className="mb-2 block text-sm font-semibold text-accent-800"
// //                 htmlFor="register-phone"
// //               >
// //                 Phone number
// //               </label>
// //               <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
// //                 <select
// //                   id="register-phone-country"
// //                   className={`select select-compact ${detailForm.formState.errors.phoneNumber ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //                   aria-label="Phone country code"
// //                   title={selectedPhoneCountry.label}
// //                   {...phoneCountryRegistration}
// //                 >
// //                   {phoneCountryOptions.map((option) => (
// //                     <option value={option.code} key={option.code}>
// //                       {option.dialCode}
// //                     </option>
// //                   ))}
// //                 </select>

// //                 <input
// //                   id="register-phone"
// //                   type="tel"
// //                   inputMode="numeric"
// //                   autoComplete="tel-national"
// //                   placeholder={selectedPhoneCountry.placeholder}
// //                   maxLength={selectedPhoneCountry.maxLength}
// //                   className={`input ${detailForm.formState.errors.phoneNumber ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //                   {...phoneNumberRegistration}
// //                 />
// //               </div>
// //               <p className="mt-2 text-sm text-accent-500">
// //                 Enter the number without the country code. Example:{' '}
// //                 {selectedPhoneCountry.placeholder}
// //               </p>
// //               {detailForm.formState.errors.phoneNumber && (
// //                 <p className="mt-2 text-sm text-secondary-700">
// //                   {detailForm.formState.errors.phoneNumber.message}
// //                 </p>
// //               )}
// //             </div>
// //           </div>

// //           <div>
// //             <label
// //               className="mb-2 block text-sm font-semibold text-accent-800"
// //               htmlFor="register-year"
// //             >
// //               Graduation year
// //             </label>
// //             <select
// //               id="register-year"
// //               className={`select ${detailForm.formState.errors.graduationYear ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //               {...detailForm.register('graduationYear', { valueAsNumber: true })}
// //             >
// //               {graduationYears.map((year) => (
// //                 <option value={year} key={year}>
// //                   {year}
// //                 </option>
// //               ))}
// //             </select>
// //             {detailForm.formState.errors.graduationYear && (
// //               <p className="mt-2 text-sm text-secondary-700">
// //                 {detailForm.formState.errors.graduationYear.message}
// //               </p>
// //             )}
// //           </div>

// //           <div className="grid gap-5 md:grid-cols-2">
// //             <div>
// //               <label
// //                 className="mb-2 block text-sm font-semibold text-accent-800"
// //                 htmlFor="register-password"
// //               >
// //                 Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   id="register-password"
// //                   type={showPassword ? 'text' : 'password'}
// //                   autoComplete="new-password"
// //                   placeholder="Create a secure password"
// //                   className={`input pr-12 ${detailForm.formState.errors.password ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //                   {...detailForm.register('password')}
// //                 />
// //                 <button
// //                   type="button"
// //                   className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-primary-600"
// //                   aria-label={showPassword ? 'Hide password' : 'Show password'}
// //                   onClick={() => setShowPassword((value) => !value)}
// //                 >
// //                   <Icon
// //                     icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
// //                     className="h-5 w-5"
// //                   />
// //                 </button>
// //               </div>
// //               {detailForm.formState.errors.password && (
// //                 <p className="mt-2 text-sm text-secondary-700">
// //                   {detailForm.formState.errors.password.message}
// //                 </p>
// //               )}
// //             </div>

// //             <div>
// //               <label
// //                 className="mb-2 block text-sm font-semibold text-accent-800"
// //                 htmlFor="register-confirm-password"
// //               >
// //                 Confirm password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   id="register-confirm-password"
// //                   type={showConfirmPassword ? 'text' : 'password'}
// //                   autoComplete="new-password"
// //                   placeholder="Re-enter your password"
// //                   className={`input pr-12 ${detailForm.formState.errors.confirmPassword ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //                   {...detailForm.register('confirmPassword')}
// //                 />
// //                 <button
// //                   type="button"
// //                   className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-primary-600"
// //                   aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
// //                   onClick={() => setShowConfirmPassword((value) => !value)}
// //                 >
// //                   <Icon
// //                     icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
// //                     className="h-5 w-5"
// //                   />
// //                 </button>
// //               </div>
// //               {detailForm.formState.errors.confirmPassword ? (
// //                 <p className="mt-2 text-sm text-secondary-700">
// //                   {detailForm.formState.errors.confirmPassword.message}
// //                 </p>
// //               ) : confirmPasswordValue ? (
// //                 <p
// //                   className={`mt-2 text-sm ${passwordsMatch ? 'text-primary-700' : 'text-accent-500'}`}
// //                 >
// //                   {passwordsMatch ? 'Passwords match.' : 'Passwords must match exactly.'}
// //                 </p>
// //               ) : null}
// //             </div>
// //           </div>

// //           {passwordValue ? <PasswordStrengthMeter password={passwordValue} /> : null}

// //           <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-600">
// //             After this step, the UI will move to email verification. Until the backend is connected,
// //             the verification experience is simulated on the frontend.
// //           </div>

// //           <button
// //             className="btn btn-primary w-full"
// //             type="submit"
// //             disabled={detailForm.formState.isSubmitting}
// //           >
// //             {detailForm.formState.isSubmitting
// //               ? 'Checking details...'
// //               : 'Continue to email verification'}
// //           </button>
// //         </form>
// //       )}

// //       {step === 'verification' && draft && verificationState && (
// //         <div className="space-y-6">
// //           <div className="rounded-[1.5rem] border border-primary-200 bg-primary-50 p-5">
// //             <div className="flex items-start gap-3">
// //               <Icon
// //                 icon="mdi:email-fast"
// //                 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-700"
// //               />
// //               <div>
// //                 <p className="font-semibold text-primary-900">Verify your email address</p>
// //                 <p className="mt-1 text-sm leading-6 text-primary-900/80">
// //                   {verificationState.message}
// //                 </p>
// //                 <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-700">
// //                   Verification window: {verificationState.expiresInMinutes} minutes
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="rounded-[1.5rem] border border-accent-200 bg-white p-5">
// //             <div className="flex items-center justify-between gap-3">
// //               <h3 className="text-lg font-semibold text-accent-900">Submitted details</h3>
// //               <button
// //                 className="text-sm font-semibold text-primary-600 hover:text-primary-700"
// //                 type="button"
// //                 onClick={() => setStep('details')}
// //               >
// //                 Edit details
// //               </button>
// //             </div>

// //             <dl className="mt-4 grid gap-4 text-sm text-accent-600 sm:grid-cols-2">
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Name</dt>
// //                 <dd className="mt-1">{draft.fullName}</dd>
// //               </div>
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Email</dt>
// //                 <dd className="mt-1">{draft.email}</dd>
// //               </div>
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Phone</dt>
// //                 <dd className="mt-1">
// //                   {formatPhoneNumberWithCountryCode(draft.phoneCountry, draft.phoneNumber)}
// //                 </dd>
// //               </div>
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Graduation year</dt>
// //                 <dd className="mt-1">{draft.graduationYear}</dd>
// //               </div>
// //             </dl>
// //           </div>

// //           <form className="space-y-5" onSubmit={submitVerification}>
// //             <div>
// //               <label
// //                 className="mb-2 block text-sm font-semibold text-accent-800"
// //                 htmlFor="verification-code"
// //               >
// //                 Verification code
// //               </label>
// //               <input
// //                 id="verification-code"
// //                 type="text"
// //                 inputMode="numeric"
// //                 autoComplete="one-time-code"
// //                 maxLength={6}
// //                 placeholder="Enter 6 digits"
// //                 className={`input text-center text-lg tracking-[0.45em] ${verificationForm.formState.errors.code ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
// //                 {...verificationForm.register('code')}
// //               />
// //               {verificationForm.formState.errors.code ? (
// //                 <p className="mt-2 text-sm text-secondary-700">
// //                   {verificationForm.formState.errors.code.message}
// //                 </p>
// //               ) : (
// //                 <p className="mt-2 text-sm text-accent-500">
// //                   Frontend-only mode: any 6-digit code will pass until the real email verification
// //                   API is ready.
// //                 </p>
// //               )}
// //             </div>

// //             {resendMessage && (
// //               <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-700">
// //                 {resendMessage}
// //               </div>
// //             )}

// //             <div className="flex flex-col gap-3 sm:flex-row">
// //               <button
// //                 className="btn btn-primary flex-1"
// //                 type="submit"
// //                 disabled={verificationForm.formState.isSubmitting}
// //               >
// //                 {verificationForm.formState.isSubmitting ? 'Verifying email...' : 'Verify email'}
// //               </button>
// //               <button
// //                 className="btn btn-outline flex-1"
// //                 type="button"
// //                 onClick={resendVerificationCode}
// //                 disabled={verificationForm.formState.isSubmitting}
// //               >
// //                 Resend code
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       )}

// //       {step === 'success' && completionState && (
// //         <div className="space-y-6">
// //           <div className="rounded-[1.75rem] border border-primary-200 bg-primary-50 p-6">
// //             <div className="flex items-start gap-3">
// //               <Icon
// //                 icon="mdi:shield-check"
// //                 className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-700"
// //               />
// //               <div>
// //                 <p className="text-lg font-semibold text-primary-900">Registration completed</p>
// //                 <p className="mt-2 text-sm leading-6 text-primary-900/80">
// //                   {completionState.message}
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="rounded-[1.5rem] border border-accent-200 bg-white p-5">
// //             <h3 className="text-lg font-semibold text-accent-900">What happens next</h3>
// //             <ul className="mt-4 space-y-3 text-sm leading-6 text-accent-600">
// //               <li className="flex gap-3">
// //                 <Icon
// //                   icon="mdi:check-circle-outline"
// //                   className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600"
// //                 />
// //                 <span>Your email has been verified successfully.</span>
// //               </li>
// //               <li className="flex gap-3">
// //                 <Icon
// //                   icon="mdi:clock-outline"
// //                   className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600"
// //                 />
// //                 <span>Your account is now waiting for admin approval.</span>
// //               </li>
// //               <li className="flex gap-3">
// //                 <Icon
// //                   icon="mdi:email-outline"
// //                   className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600"
// //                 />
// //                 <span>
// //                   You should notify the user here once approval APIs or notifications are available.
// //                 </span>
// //               </li>
// //             </ul>
// //           </div>

// //           <div className="flex flex-col gap-3 sm:flex-row">
// //             <button className="btn btn-outline flex-1" type="button" onClick={resetFlow}>
// //               Create another account
// //             </button>
// //             <AppLink href="/auth/login" className="btn btn-primary flex-1">
// //               Go to login
// //             </AppLink>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // import { zodResolver } from '@hookform/resolvers/zod';
// // import { Icon } from '@iconify/react';
// // import { useState } from 'react';
// // import { useForm } from 'react-hook-form';
// // import { getSiteConfig } from '@/data/content';
// // import { AppLink } from '@/shared/components/ui/AppLink';
// // import { authApi } from '../api/authApi';
// // import {
// //   defaultPhoneCountry,
// //   formatPhoneNumberWithCountryCode,
// //   getPhoneCountryOption,
// //   normalizeNationalPhoneNumber,
// //   type SupportedPhoneCountry,
// //   phoneCountryOptions,
// // } from '../constants/phoneCountries';
// // import { registerDetailsSchema } from '../schemas/authSchema';
// // import type {
// //   CompleteRegistrationResponse,
// //   EmailVerificationFormValues,
// //   RegisterDetailsFormValues,
// //   StartRegistrationResponse,
// // } from '../types/auth.types';
// // import { PasswordStrengthMeter } from './PasswordStrengthMeter';
// // import { emailVerificationSchema } from '../schemas/authSchema';
// // import { useForm as useVerifyForm } from 'react-hook-form';

// // type RegistrationStep = 'details' | 'verification' | 'success';

// // const stepOrder: Array<{ id: RegistrationStep; label: string }> = [
// //   { id: 'details',      label: 'Account details' },
// //   { id: 'verification', label: 'Verify email' },
// //   { id: 'success',      label: 'Approval pending' },
// // ];

// // function currentStepIndex(step: RegistrationStep) {
// //   return stepOrder.findIndex((item) => item.id === step);
// // }

// // export function RegisterForm() {
// //   const config = getSiteConfig();
// //   const currentYear = new Date().getFullYear();
// //   const firstYear   = Math.min(1966, currentYear - 70);
// //   const graduationYears = Array.from(
// //     { length: currentYear - firstYear + 1 },
// //     (_, i) => currentYear - i,
// //   );

// //   const [step, setStep]                       = useState<RegistrationStep>('details');
// //   const [draft, setDraft]                     = useState<RegisterDetailsFormValues | null>(null);
// //   const [verificationState, setVerificationState] = useState<StartRegistrationResponse | null>(null);
// //   const [completionState, setCompletionState] = useState<CompleteRegistrationResponse | null>(null);
// //   const [resendMessage, setResendMessage]     = useState('');
// //   const [showPassword, setShowPassword]       = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// //   const detailForm = useForm<RegisterDetailsFormValues>({
// //     resolver: zodResolver(registerDetailsSchema),
// //     defaultValues: {
// //       surname:         '',
// //       otherNames:      '',
// //       nameInSchool:    '',
// //       email:           '',
// //       phoneCountry:    defaultPhoneCountry,
// //       whatsappPhone:   '',
// //       graduationYear:  currentYear,
// //       password:        '',
// //       confirmPassword: '',
// //     },
// //   });

// //   const verificationForm = useVerifyForm<EmailVerificationFormValues>({
// //     resolver: zodResolver(emailVerificationSchema),
// //     defaultValues: { code: '' },
// //   });

// //   const passwordValue        = detailForm.watch('password') ?? '';
// //   const phoneCountry         = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
// //   const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
// //   const passwordsMatch       = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
// //   const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);

// //   const phoneCountryRegistration = detailForm.register('phoneCountry', {
// //     onChange: (event) => {
// //       const nextCode    = event.target.value as SupportedPhoneCountry;
// //       const nextCountry = getPhoneCountryOption(nextCode);
// //       const current     = normalizeNationalPhoneNumber(detailForm.getValues('whatsappPhone'));
// //       const next        = current.slice(0, nextCountry.maxLength);
// //       if (next !== detailForm.getValues('whatsappPhone')) {
// //         detailForm.setValue('whatsappPhone', next, { shouldDirty: true, shouldValidate: true });
// //       } else if (current) {
// //         void detailForm.trigger('whatsappPhone');
// //       }
// //     },
// //   });

// //   const whatsappPhoneRegistration = detailForm.register('whatsappPhone', {
// //     onChange: (event) => {
// //       event.target.value = normalizeNationalPhoneNumber(event.target.value).slice(
// //         0,
// //         selectedPhoneCountry.maxLength,
// //       );
// //     },
// //   });

// //   const submitDetails = detailForm.handleSubmit(async (values) => {
// //     const response = await authApi.startRegistration(values);
// //     setDraft(values);
// //     setVerificationState(response);
// //     setCompletionState(null);
// //     setResendMessage('');
// //     verificationForm.reset({ code: '' });
// //     setStep('verification');
// //   });

// //   const submitVerification = verificationForm.handleSubmit(async (values) => {
// //     if (!draft) return;
// //     const response = await authApi.verifyRegistrationEmail({ draft, code: values.code });
// //     setCompletionState(response);
// //     setStep('success');
// //   });

// //   const resendVerificationCode = async () => {
// //     if (!draft) return;
// //     const response = await authApi.startRegistration(draft);
// //     setVerificationState(response);
// //     setResendMessage(`A fresh verification step has been simulated for ${draft.email}.`);
// //   };

// //   const resetFlow = () => {
// //     detailForm.reset({
// //       surname: '', otherNames: '', nameInSchool: '',
// //       email: '', phoneCountry: defaultPhoneCountry, whatsappPhone: '',
// //       graduationYear: currentYear, password: '', confirmPassword: '',
// //     });
// //     verificationForm.reset({ code: '' });
// //     setDraft(null);
// //     setVerificationState(null);
// //     setCompletionState(null);
// //     setResendMessage('');
// //     setStep('details');
// //   };

// //   const activeStepIndex = currentStepIndex(step);

// //   return (
// //     <div>
// //       <div className="mb-6">
// //         <h2 className="text-2xl font-bold text-accent-900">Register</h2>
// //         <p className="mt-2 text-sm leading-6 text-accent-500">
// //           Enter your alumni details, verify your email, and wait for admin approval before
// //           the account can be used.
// //         </p>
// //       </div>

// //       {/* Step indicators */}
// //       <div className="mb-8 grid gap-3 sm:grid-cols-3">
// //         {stepOrder.map((item, index) => {
// //           const isComplete = index < activeStepIndex;
// //           const isActive   = index === activeStepIndex;
// //           return (
// //             <div
// //               key={item.id}
// //               className={`rounded-2xl border px-4 py-3 transition-colors duration-200 ${
// //                 isActive
// //                   ? 'border-primary-300 bg-primary-50'
// //                   : isComplete
// //                     ? 'border-primary-200 bg-white'
// //                     : 'border-accent-200 bg-accent-50'
// //               }`}
// //             >
// //               <div className="flex items-center gap-3">
// //                 <div
// //                   className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
// //                     isActive || isComplete ? 'bg-primary-600 text-white' : 'bg-white text-accent-500'
// //                   }`}
// //                 >
// //                   {isComplete ? <Icon icon="mdi:check" className="h-4 w-4" /> : index + 1}
// //                 </div>
// //                 <span className="text-sm font-semibold text-accent-800">{item.label}</span>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* ── Step 1: Details ────────────────────────────────────────────────── */}
// //       {step === 'details' && (
// //         <form className="space-y-5" onSubmit={submitDetails}>

// //           {/* Surname + Other Names */}
// //           <div className="grid gap-5 md:grid-cols-2">
// //             <div>
// //               <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-surname">
// //                 Surname
// //               </label>
// //               <input
// //                 id="reg-surname"
// //                 type="text"
// //                 autoComplete="family-name"
// //                 placeholder="e.g. Okonkwo"
// //                 className={`input ${detailForm.formState.errors.surname ? 'border-secondary-400' : ''}`}
// //                 {...detailForm.register('surname')}
// //               />
// //               {detailForm.formState.errors.surname && (
// //                 <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.surname.message}</p>
// //               )}
// //             </div>
// //             <div>
// //               <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-other-names">
// //                 Other Names
// //               </label>
// //               <input
// //                 id="reg-other-names"
// //                 type="text"
// //                 autoComplete="given-name"
// //                 placeholder="e.g. Adaeze Chioma"
// //                 className={`input ${detailForm.formState.errors.otherNames ? 'border-secondary-400' : ''}`}
// //                 {...detailForm.register('otherNames')}
// //               />
// //               {detailForm.formState.errors.otherNames && (
// //                 <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.otherNames.message}</p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Name in School */}
// //           <div>
// //             <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-name-in-school">
// //               Name in School
// //             </label>
// //             <input
// //               id="reg-name-in-school"
// //               type="text"
// //               placeholder="First name + Surname as used in FGGC Owerri"
// //               className={`input ${detailForm.formState.errors.nameInSchool ? 'border-secondary-400' : ''}`}
// //               {...detailForm.register('nameInSchool')}
// //             />
// //             <p className="mt-2 text-xs text-accent-500">
// //               This is the name you used while in school — important for alumni identification.
// //             </p>
// //             {detailForm.formState.errors.nameInSchool && (
// //               <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.nameInSchool.message}</p>
// //             )}
// //           </div>

// //           {/* Email */}
// //           <div>
// //             <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-email">
// //               Email Address
// //             </label>
// //             <input
// //               id="reg-email"
// //               type="email"
// //               autoComplete="email"
// //               placeholder="you@example.com"
// //               className={`input ${detailForm.formState.errors.email ? 'border-secondary-400' : ''}`}
// //               {...detailForm.register('email')}
// //             />
// //             {detailForm.formState.errors.email && (
// //               <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.email.message}</p>
// //             )}
// //           </div>

// //           {/* WhatsApp Phone */}
// //           <div>
// //             <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-phone">
// //               WhatsApp Phone Number
// //             </label>
// //             <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2">
// //               <select
// //                 className={`select select-compact ${detailForm.formState.errors.whatsappPhone ? 'border-secondary-400' : ''}`}
// //                 aria-label="Phone country code"
// //                 title={selectedPhoneCountry.label}
// //                 {...phoneCountryRegistration}
// //               >
// //                 {phoneCountryOptions.map((option) => (
// //                   <option value={option.code} key={option.code}>{option.dialCode}</option>
// //                 ))}
// //               </select>
// //               <input
// //                 id="reg-phone"
// //                 type="tel"
// //                 inputMode="numeric"
// //                 autoComplete="tel-national"
// //                 placeholder={selectedPhoneCountry.placeholder}
// //                 maxLength={selectedPhoneCountry.maxLength}
// //                 className={`input ${detailForm.formState.errors.whatsappPhone ? 'border-secondary-400' : ''}`}
// //                 {...whatsappPhoneRegistration}
// //               />
// //             </div>
// //             <p className="mt-2 text-sm text-accent-500">
// //               Enter the number without the country code. Example: {selectedPhoneCountry.placeholder}
// //             </p>
// //             {detailForm.formState.errors.whatsappPhone && (
// //               <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.whatsappPhone.message}</p>
// //             )}
// //           </div>

// //           {/* Graduation Year */}
// //           <div>
// //             <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-year">
// //               Year of Graduation from FGGC Owerri
// //             </label>
// //             <select
// //               id="reg-year"
// //               className={`select ${detailForm.formState.errors.graduationYear ? 'border-secondary-400' : ''}`}
// //               {...detailForm.register('graduationYear', { valueAsNumber: true })}
// //             >
// //               {graduationYears.map((year) => (
// //                 <option value={year} key={year}>{year}</option>
// //               ))}
// //             </select>
// //             {detailForm.formState.errors.graduationYear && (
// //               <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.graduationYear.message}</p>
// //             )}
// //           </div>

// //           {/* Password */}
// //           <div className="grid gap-5 md:grid-cols-2">
// //             <div>
// //               <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-password">
// //                 Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   id="reg-password"
// //                   type={showPassword ? 'text' : 'password'}
// //                   autoComplete="new-password"
// //                   placeholder="Create a secure password"
// //                   className={`input pr-12 ${detailForm.formState.errors.password ? 'border-secondary-400' : ''}`}
// //                   {...detailForm.register('password')}
// //                 />
// //                 <button
// //                   type="button"
// //                   className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 hover:text-primary-600"
// //                   onClick={() => setShowPassword((v) => !v)}
// //                 >
// //                   <Icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="h-5 w-5" />
// //                 </button>
// //               </div>
// //               {detailForm.formState.errors.password && (
// //                 <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.password.message}</p>
// //               )}
// //             </div>
// //             <div>
// //               <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="reg-confirm-password">
// //                 Confirm Password
// //               </label>
// //               <div className="relative">
// //                 <input
// //                   id="reg-confirm-password"
// //                   type={showConfirmPassword ? 'text' : 'password'}
// //                   autoComplete="new-password"
// //                   placeholder="Re-enter your password"
// //                   className={`input pr-12 ${detailForm.formState.errors.confirmPassword ? 'border-secondary-400' : ''}`}
// //                   {...detailForm.register('confirmPassword')}
// //                 />
// //                 <button
// //                   type="button"
// //                   className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 hover:text-primary-600"
// //                   onClick={() => setShowConfirmPassword((v) => !v)}
// //                 >
// //                   <Icon icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="h-5 w-5" />
// //                 </button>
// //               </div>
// //               {detailForm.formState.errors.confirmPassword ? (
// //                 <p className="mt-2 text-sm text-secondary-700">{detailForm.formState.errors.confirmPassword.message}</p>
// //               ) : confirmPasswordValue ? (
// //                 <p className={`mt-2 text-sm ${passwordsMatch ? 'text-primary-700' : 'text-accent-500'}`}>
// //                   {passwordsMatch ? 'Passwords match.' : 'Passwords must match exactly.'}
// //                 </p>
// //               ) : null}
// //             </div>
// //           </div>

// //           {passwordValue ? <PasswordStrengthMeter password={passwordValue} /> : null}

// //           <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-600">
// //             After this step, the UI will move to email verification. Your account will then
// //             await admin approval before you can sign in.
// //           </div>

// //           <button
// //             className="btn btn-primary w-full"
// //             type="submit"
// //             disabled={detailForm.formState.isSubmitting}
// //           >
// //             {detailForm.formState.isSubmitting ? 'Checking details...' : 'Continue to email verification'}
// //           </button>
// //         </form>
// //       )}

// //       {/* ── Step 2: Verification ───────────────────────────────────────────── */}
// //       {step === 'verification' && draft && verificationState && (
// //         <div className="space-y-6">
// //           <div className="rounded-[1.5rem] border border-primary-200 bg-primary-50 p-5">
// //             <div className="flex items-start gap-3">
// //               <Icon icon="mdi:email-fast" className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-700" />
// //               <div>
// //                 <p className="font-semibold text-primary-900">Verify your email address</p>
// //                 <p className="mt-1 text-sm leading-6 text-primary-900/80">{verificationState.message}</p>
// //                 <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-700">
// //                   Verification window: {verificationState.expiresInMinutes} minutes
// //                 </p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="rounded-[1.5rem] border border-accent-200 bg-white p-5">
// //             <div className="flex items-center justify-between gap-3">
// //               <h3 className="text-lg font-semibold text-accent-900">Submitted details</h3>
// //               <button
// //                 className="text-sm font-semibold text-primary-600 hover:text-primary-700"
// //                 type="button"
// //                 onClick={() => setStep('details')}
// //               >
// //                 Edit details
// //               </button>
// //             </div>
// //             <dl className="mt-4 grid gap-4 text-sm text-accent-600 sm:grid-cols-2">
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Full Name</dt>
// //                 <dd className="mt-1">{draft.otherNames} {draft.surname}</dd>
// //               </div>
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Name in School</dt>
// //                 <dd className="mt-1">{draft.nameInSchool}</dd>
// //               </div>
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Email</dt>
// //                 <dd className="mt-1">{draft.email}</dd>
// //               </div>
// //               <div>
// //                 <dt className="font-semibold text-accent-900">WhatsApp</dt>
// //                 <dd className="mt-1">{formatPhoneNumberWithCountryCode(draft.phoneCountry, draft.whatsappPhone)}</dd>
// //               </div>
// //               <div>
// //                 <dt className="font-semibold text-accent-900">Graduation Year</dt>
// //                 <dd className="mt-1">{draft.graduationYear}</dd>
// //               </div>
// //             </dl>
// //           </div>

// //           <form className="space-y-5" onSubmit={submitVerification}>
// //             <div>
// //               <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="verification-code">
// //                 Verification Code
// //               </label>
// //               <input
// //                 id="verification-code"
// //                 type="text"
// //                 inputMode="numeric"
// //                 autoComplete="one-time-code"
// //                 maxLength={6}
// //                 placeholder="Enter 6 digits"
// //                 className={`input text-center text-lg tracking-[0.45em] ${verificationForm.formState.errors.code ? 'border-secondary-400' : ''}`}
// //                 {...verificationForm.register('code')}
// //               />
// //               {verificationForm.formState.errors.code ? (
// //                 <p className="mt-2 text-sm text-secondary-700">{verificationForm.formState.errors.code.message}</p>
// //               ) : (
// //                 <p className="mt-2 text-sm text-accent-500">
// //                   Frontend-only mode: any 6-digit code will pass until the real API is ready.
// //                 </p>
// //               )}
// //             </div>

// //             {resendMessage && (
// //               <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-700">
// //                 {resendMessage}
// //               </div>
// //             )}

// //             <div className="flex flex-col gap-3 sm:flex-row">
// //               <button className="btn btn-primary flex-1" type="submit" disabled={verificationForm.formState.isSubmitting}>
// //                 {verificationForm.formState.isSubmitting ? 'Verifying...' : 'Verify email'}
// //               </button>
// //               <button className="btn btn-outline flex-1" type="button" onClick={resendVerificationCode} disabled={verificationForm.formState.isSubmitting}>
// //                 Resend code
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       )}

// //       {/* ── Step 3: Success ────────────────────────────────────────────────── */}
// //       {step === 'success' && completionState && (
// //         <div className="space-y-6">
// //           <div className="rounded-[1.75rem] border border-primary-200 bg-primary-50 p-6">
// //             <div className="flex items-start gap-3">
// //               <Icon icon="mdi:shield-check" className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-700" />
// //               <div>
// //                 <p className="text-lg font-semibold text-primary-900">Registration completed</p>
// //                 <p className="mt-2 text-sm leading-6 text-primary-900/80">{completionState.message}</p>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="rounded-[1.5rem] border border-accent-200 bg-white p-5">
// //             <h3 className="text-lg font-semibold text-accent-900">What happens next</h3>
// //             <ul className="mt-4 space-y-3 text-sm leading-6 text-accent-600">
// //               <li className="flex gap-3">
// //                 <Icon icon="mdi:check-circle-outline" className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600" />
// //                 Your email has been verified successfully.
// //               </li>
// //               <li className="flex gap-3">
// //                 <Icon icon="mdi:clock-outline" className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600" />
// //                 Your account is now waiting for admin approval.
// //               </li>
// //               <li className="flex gap-3">
// //                 <Icon icon="mdi:email-outline" className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600" />
// //                 You will be notified once your account is approved.
// //               </li>
// //             </ul>
// //           </div>

// //           <div className="flex flex-col gap-3 sm:flex-row">
// //             <button className="btn btn-outline flex-1" type="button" onClick={resetFlow}>
// //               Create another account
// //             </button>
// //             <AppLink href="/auth/login" className="btn btn-primary flex-1">
// //               Go to login
// //             </AppLink>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import { zodResolver } from '@hookform/resolvers/zod';
// import { Icon } from '@iconify/react';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { authApi } from '../api/authApi';
// import {
//   defaultPhoneCountry,
//   formatPhoneNumberWithCountryCode,
//   getPhoneCountryOption,
//   normalizeNationalPhoneNumber,
//   type SupportedPhoneCountry,
//   phoneCountryOptions,
// } from '../constants/phoneCountries';
// import { emailVerificationSchema, registerDetailsSchema } from '../schemas/authSchema';
// import type {
//   CompleteRegistrationResponse,
//   EmailVerificationFormValues,
//   RegisterDetailsFormValues,
//   StartRegistrationResponse,
// } from '../types/auth.types';
// import { PasswordStrengthMeter } from './PasswordStrengthMeter';
// import { AuthCard } from './AuthCard';

// type RegistrationStep = 'details' | 'verification' | 'success';

// export function RegisterForm() {
//   const currentYear = new Date().getFullYear();
//   const graduationYears = Array.from(
//     { length: currentYear - 1966 + 1 },
//     (_, i) => currentYear - i,
//   );

//   const [step, setStep]                               = useState<RegistrationStep>('details');
//   const [draft, setDraft]                             = useState<RegisterDetailsFormValues | null>(null);
//   const [verificationState, setVerificationState]     = useState<StartRegistrationResponse | null>(null);
//   const [completionState, setCompletionState]         = useState<CompleteRegistrationResponse | null>(null);
//   const [resendMessage, setResendMessage]             = useState('');
//   const [showPassword, setShowPassword]               = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const detailForm = useForm<RegisterDetailsFormValues>({
//     resolver: zodResolver(registerDetailsSchema),
//     defaultValues: {
//       surname: '', otherNames: '', nameInSchool: '',
//       email: '', phoneCountry: defaultPhoneCountry, whatsappPhone: '',
//       graduationYear: currentYear, password: '', confirmPassword: '',
//     },
//   });

//   const verificationForm = useForm<EmailVerificationFormValues>({
//     resolver: zodResolver(emailVerificationSchema),
//     defaultValues: { code: '' },
//   });

//   const passwordValue        = detailForm.watch('password') ?? '';
//   const phoneCountry         = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
//   const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
//   const passwordsMatch       = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
//   const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);

//   const phoneCountryRegistration = detailForm.register('phoneCountry', {
//     onChange: (e) => {
//       const nextCode    = e.target.value as SupportedPhoneCountry;
//       const nextCountry = getPhoneCountryOption(nextCode);
//       const current     = normalizeNationalPhoneNumber(detailForm.getValues('whatsappPhone'));
//       const next        = current.slice(0, nextCountry.maxLength);
//       if (next !== detailForm.getValues('whatsappPhone')) {
//         detailForm.setValue('whatsappPhone', next, { shouldDirty: true, shouldValidate: true });
//       } else if (current) {
//         void detailForm.trigger('whatsappPhone');
//       }
//     },
//   });

//   const whatsappRegistration = detailForm.register('whatsappPhone', {
//     onChange: (e) => {
//       e.target.value = normalizeNationalPhoneNumber(e.target.value).slice(0, selectedPhoneCountry.maxLength);
//     },
//   });

//   const submitDetails = detailForm.handleSubmit(async (values) => {
//     const response = await authApi.startRegistration(values);
//     setDraft(values);
//     setVerificationState(response);
//     setCompletionState(null);
//     setResendMessage('');
//     verificationForm.reset({ code: '' });
//     setStep('verification');
//   });

//   const submitVerification = verificationForm.handleSubmit(async (values) => {
//     if (!draft) return;
//     const response = await authApi.verifyRegistrationEmail({ draft, code: values.code });
//     setCompletionState(response);
//     setStep('success');
//   });

//   const resendCode = async () => {
//     if (!draft) return;
//     const response = await authApi.startRegistration(draft);
//     setVerificationState(response);
//     setResendMessage(`A fresh code has been simulated for ${draft.email}.`);
//   };

//   const resetFlow = () => {
//     detailForm.reset({
//       surname: '', otherNames: '', nameInSchool: '',
//       email: '', phoneCountry: defaultPhoneCountry, whatsappPhone: '',
//       graduationYear: currentYear, password: '', confirmPassword: '',
//     });
//     verificationForm.reset({ code: '' });
//     setDraft(null); setVerificationState(null);
//     setCompletionState(null); setResendMessage('');
//     setStep('details');
//   };

//   // ── Step labels ────────────────────────────────────────────────────────────
//   const stepMeta: Record<RegistrationStep, { label: string; step: string }> = {
//     details:      { step: 'Step 1 of 3', label: 'Account Details' },
//     verification: { step: 'Step 2 of 3', label: 'Verify Email' },
//     success:      { step: 'Step 3 of 3', label: 'Approval Pending' },
//   };
//   const { step: stepNumber, label: stepLabel } = stepMeta[step];

//   return (
//     <AuthCard title="Sign" titleAccent="Up" subtitle="Join your Sisters">

//       {/* Simple step indicator */}
//       <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
//         <div>
//           <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">{stepNumber}</p>
//           <p className="text-sm font-bold text-gray-800 mt-0.5">{stepLabel}</p>
//         </div>
//         {/* Dot progress */}
//         <div className="flex items-center gap-1.5">
//           {(['details', 'verification', 'success'] as RegistrationStep[]).map((s, i) => (
//             <div
//               key={s}
//               className={`rounded-full transition-all duration-300 ${
//                 s === step
//                   ? 'w-5 h-2 bg-primary-500'
//                   : i < (['details', 'verification', 'success'] as RegistrationStep[]).indexOf(step)
//                     ? 'w-2 h-2 bg-primary-300'
//                     : 'w-2 h-2 bg-gray-200'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ── Step 1: Details ─────────────────────────────────────────────────── */}
//       {step === 'details' && (
//         <form className="space-y-4" onSubmit={submitDetails}>

//           {/* Surname + Other Names */}
//           <div className="grid grid-cols-2 gap-3">
//             <FormInput
//               label="Surname"
//               name="surname"
//               placeholder="e.g. Okonkwo"
//               error={detailForm.formState.errors.surname?.message}
//               {...detailForm.register('surname')}
//             />
//             <FormInput
//               label="Other Names"
//               name="otherNames"
//               placeholder="e.g. Adaeze"
//               error={detailForm.formState.errors.otherNames?.message}
//               {...detailForm.register('otherNames')}
//             />
//           </div>

//           {/* Name in School */}
//           <div>
//             <FormInput
//               label="Name in School"
//               name="nameInSchool"
//               placeholder="First name + Surname as used in FGGC Owerri"
//               hint="This is the name you used while in school — important for alumni identification."
//               error={detailForm.formState.errors.nameInSchool?.message}
//               {...detailForm.register('nameInSchool')}
//             />
//           </div>

//           {/* Email */}
//           <FormInput
//             label="Email Address"
//             name="email"
//             type="email"
//             placeholder="you@example.com"
//             error={detailForm.formState.errors.email?.message}
//             {...detailForm.register('email')}
//           />

//           {/* WhatsApp phone */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               WhatsApp Phone Number
//             </label>
//             <div className="grid grid-cols-[4.5rem_1fr] gap-2">
//               <select
//                 className="select select-compact"
//                 title={selectedPhoneCountry.label}
//                 {...phoneCountryRegistration}
//               >
//                 {phoneCountryOptions.map((o) => (
//                   <option value={o.code} key={o.code}>{o.dialCode}</option>
//                 ))}
//               </select>
//               <input
//                 type="tel"
//                 inputMode="numeric"
//                 placeholder={selectedPhoneCountry.placeholder}
//                 className={`input ${detailForm.formState.errors.whatsappPhone ? 'border-red-400' : ''}`}
//                 {...whatsappRegistration}
//               />
//             </div>
//             <p className="mt-1 text-xs text-gray-400">Enter number without country code</p>
//             {detailForm.formState.errors.whatsappPhone && (
//               <p className="mt-1 text-xs text-red-500">{detailForm.formState.errors.whatsappPhone.message}</p>
//             )}
//           </div>

//           {/* Graduation Year */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Year of Graduation from FGGC Owerri
//             </label>
//             <select
//               className={`select ${detailForm.formState.errors.graduationYear ? 'border-red-400' : ''}`}
//               {...detailForm.register('graduationYear', { valueAsNumber: true })}
//             >
//               <option value="">Select Graduation Year</option>
//               {graduationYears.map((y) => (
//                 <option value={y} key={y}>{y}</option>
//               ))}
//             </select>
//             {detailForm.formState.errors.graduationYear && (
//               <p className="mt-1 text-xs text-red-500">{detailForm.formState.errors.graduationYear.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Create a secure password"
//                 className={`input pr-10 ${detailForm.formState.errors.password ? 'border-red-400' : ''}`}
//                 {...detailForm.register('password')}
//               />
//               <button type="button" onClick={() => setShowPassword((v) => !v)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <Icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
//               </button>
//             </div>
//             {detailForm.formState.errors.password && (
//               <p className="mt-1 text-xs text-red-500">{detailForm.formState.errors.password.message}</p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 placeholder="Re-enter your password"
//                 className={`input pr-10 ${detailForm.formState.errors.confirmPassword ? 'border-red-400' : ''}`}
//                 {...detailForm.register('confirmPassword')}
//               />
//               <button type="button" onClick={() => setShowConfirmPassword((v) => !v)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//                 <Icon icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
//               </button>
//             </div>
//             {detailForm.formState.errors.confirmPassword ? (
//               <p className="mt-1 text-xs text-red-500">{detailForm.formState.errors.confirmPassword.message}</p>
//             ) : confirmPasswordValue ? (
//               <p className={`mt-1 text-xs ${passwordsMatch ? 'text-primary-600' : 'text-gray-400'}`}>
//                 {passwordsMatch ? '✓ Passwords match' : 'Passwords must match exactly'}
//               </p>
//             ) : null}
//           </div>

//           {passwordValue && <PasswordStrengthMeter password={passwordValue} />}

//           <button type="submit" disabled={detailForm.formState.isSubmitting}
//             className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2">
//             {detailForm.formState.isSubmitting ? (
//               <><Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />Checking...</>
//             ) : (
//               <>Sign up <Icon icon="mdi:arrow-right" className="w-4 h-4" /></>
//             )}
//           </button>

//           <p className="text-center text-sm text-gray-500">
//             Already have an account?{' '}
//             <AppLink href="/auth/login" className="font-semibold text-primary-500 hover:text-primary-600">
//               Login
//             </AppLink>
//           </p>
//         </form>
//       )}

//       {/* ── Step 2: Verification ──────────────────────────────────────────── */}
//       {step === 'verification' && draft && verificationState && (
//         <div className="space-y-5">
//           <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
//             <p className="text-sm font-semibold text-primary-800 mb-1">Check your inbox</p>
//             <p className="text-xs text-primary-700 leading-relaxed">{verificationState.message}</p>
//           </div>

//           {/* Submitted details summary */}
//           <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm">
//             {[
//               { label: 'Full name',        value: `${draft.otherNames} ${draft.surname}` },
//               { label: 'Name in school',   value: draft.nameInSchool },
//               { label: 'Email',            value: draft.email },
//               { label: 'WhatsApp',         value: formatPhoneNumberWithCountryCode(draft.phoneCountry, draft.whatsappPhone) },
//               { label: 'Graduation year',  value: String(draft.graduationYear) },
//             ].map(({ label, value }) => (
//               <div key={label} className="flex justify-between items-center">
//                 <span className="text-gray-500">{label}</span>
//                 <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">{value}</span>
//               </div>
//             ))}
//             <button type="button" onClick={() => setStep('details')}
//               className="text-xs text-primary-500 hover:text-primary-600 font-medium pt-1">
//               ← Edit details
//             </button>
//           </div>

//           <form className="space-y-4" onSubmit={submitVerification}>
//             <FormInput
//               label="Verification Code"
//               id="code"
//               type="text"
//               inputMode="numeric"
//               maxLength={6}
//               placeholder="Enter 6-digit code"
//               hint="Any 6-digit code works in frontend-only mode"
//               error={verificationForm.formState.errors.code?.message}
//               className="text-center text-lg tracking-[0.4em]"
//               {...verificationForm.register('code')}
//             />

//             {resendMessage && (
//               <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{resendMessage}</p>
//             )}

//             <div className="flex gap-3">
//               <button type="submit" disabled={verificationForm.formState.isSubmitting}
//                 className="btn btn-primary flex-1 flex items-center justify-center gap-2">
//                 {verificationForm.formState.isSubmitting ? (
//                   <><Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />Verifying...</>
//                 ) : 'Verify email'}
//               </button>
//               <button type="button" onClick={resendCode} className="btn btn-outline flex-1">
//                 Resend code
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* ── Step 3: Success ───────────────────────────────────────────────── */}
//       {step === 'success' && completionState && (
//         <div className="space-y-5 text-center">
//           <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
//             <Icon icon="mdi:shield-check-outline" className="w-8 h-8 text-primary-500" />
//           </div>
//           <div>
//             <p className="font-semibold text-gray-800 mb-2">Registration completed!</p>
//             <p className="text-sm text-gray-500 leading-relaxed">{completionState.message}</p>
//           </div>
//           <ul className="text-left space-y-2.5 text-sm text-gray-500">
//             {[
//               { icon: 'mdi:check-circle-outline', text: 'Your email has been verified.' },
//               { icon: 'mdi:clock-outline',        text: 'Your account is awaiting admin approval.' },
//               { icon: 'mdi:email-outline',        text: 'You will be notified once your account is approved.' },
//             ].map(({ icon, text }) => (
//               <li key={text} className="flex items-start gap-2">
//                 <Icon icon={icon} className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
//                 {text}
//               </li>
//             ))}
//           </ul>
//           <div className="flex gap-3 pt-2">
//             <button type="button" onClick={resetFlow} className="btn btn-outline flex-1 text-sm">
//               Register another
//             </button>
//             <AppLink href="/auth/login" className="btn btn-primary flex-1 text-sm text-center">
//               Go to login
//             </AppLink>
//           </div>
//         </div>
//       )}

//     </AuthCard>
//   );
// }

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLink } from '@/shared/components/ui/AppLink';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { authApi } from '../api/authApi';
import {
  defaultPhoneCountry,
  formatPhoneNumberWithCountryCode,
  getPhoneCountryOption,
  normalizeNationalPhoneNumber,
  type SupportedPhoneCountry,
  phoneCountryOptions,
} from '../constants/phoneCountries';
import { emailVerificationSchema, registerDetailsSchema } from '../schemas/authSchema';
import type {
  CompleteRegistrationResponse,
  EmailVerificationFormValues,
  RegisterDetailsFormValues,
  StartRegistrationResponse,
} from '../types/auth.types';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { AuthCard } from './AuthCard';
import { SelectInput } from '@/shared/components/ui/SelectInput';

type RegistrationStep = 'details' | 'verification' | 'success';

const STEPS: RegistrationStep[] = ['details', 'verification', 'success'];

const stepMeta: Record<RegistrationStep, { step: string; label: string }> = {
  details: { step: 'Step 1 of 3', label: 'Account Details' },
  verification: { step: 'Step 2 of 3', label: 'Verify Email' },
  success: { step: 'Step 3 of 3', label: 'Approval Pending' },
};

export function RegisterForm() {
  const currentYear = new Date().getFullYear();

  const graduationYearOptions = Array.from({ length: currentYear - 1966 + 1 }, (_, i) => ({
    label: String(currentYear - i),
    value: String(currentYear - i),
  }));

  const phoneCountrySelectOptions = phoneCountryOptions.map((o) => ({
    label: `${o.dialCode} (${o.label})`,
    value: o.code,
  }));

  const [step, setStep] = useState<RegistrationStep>('details');
  const [draft, setDraft] = useState<RegisterDetailsFormValues | null>(null);
  const [verificationState, setVerificationState] = useState<StartRegistrationResponse | null>(
    null,
  );
  const [completionState, setCompletionState] = useState<CompleteRegistrationResponse | null>(null);
  const [resendMessage, setResendMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const detailForm = useForm<RegisterDetailsFormValues>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: {
      surname: '',
      otherNames: '',
      nameInSchool: '',
      email: '',
      phoneCountry: defaultPhoneCountry,
      whatsappPhone: '',
      graduationYear: currentYear,
      password: '',
      confirmPassword: '',
    },
  });

  const verificationForm = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { code: '' },
  });

  const passwordValue = detailForm.watch('password') ?? '';
  const phoneCountry = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
  const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
  const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
  const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);

  const phoneCountryRegistration = detailForm.register('phoneCountry', {
    onChange: (e) => {
      const nextCode = e.target.value as SupportedPhoneCountry;
      const nextCountry = getPhoneCountryOption(nextCode);
      const current = normalizeNationalPhoneNumber(detailForm.getValues('whatsappPhone'));
      const next = current.slice(0, nextCountry.maxLength);
      if (next !== detailForm.getValues('whatsappPhone')) {
        detailForm.setValue('whatsappPhone', next, { shouldDirty: true, shouldValidate: true });
      } else if (current) {
        void detailForm.trigger('whatsappPhone');
      }
    },
  });

  const whatsappRegistration = detailForm.register('whatsappPhone', {
    onChange: (e) => {
      e.target.value = normalizeNationalPhoneNumber(e.target.value).slice(
        0,
        selectedPhoneCountry.maxLength,
      );
    },
  });

  const submitDetails = detailForm.handleSubmit(async (values) => {
    const response = await authApi.startRegistration(values);
    setDraft(values);
    setVerificationState(response);
    setCompletionState(null);
    setResendMessage('');
    verificationForm.reset({ code: '' });
    setStep('verification');
  });

  const submitVerification = verificationForm.handleSubmit(async (values) => {
    if (!draft) return;
    const response = await authApi.verifyRegistrationEmail({ draft, code: values.code });
    setCompletionState(response);
    setStep('success');
  });

  const resendCode = async () => {
    if (!draft) return;
    const response = await authApi.startRegistration(draft);
    setVerificationState(response);
    setResendMessage(`A fresh code has been simulated for ${draft.email}.`);
  };

  const resetFlow = () => {
    detailForm.reset({
      surname: '',
      otherNames: '',
      nameInSchool: '',
      email: '',
      phoneCountry: defaultPhoneCountry,
      whatsappPhone: '',
      graduationYear: currentYear,
      password: '',
      confirmPassword: '',
    });
    verificationForm.reset({ code: '' });
    setDraft(null);
    setVerificationState(null);
    setCompletionState(null);
    setResendMessage('');
    setStep('details');
  };

  const { step: stepNumber, label: stepLabel } = stepMeta[step];
  const activeIndex = STEPS.indexOf(step);

  return (
    <AuthCard title="Sign" titleAccent="Up" subtitle="Join your Sisters">
      {/* ── Step indicator ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
        <div>
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
            {stepNumber}
          </p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">{stepLabel}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-5 h-2 bg-primary-500'
                  : i < activeIndex
                    ? 'w-2 h-2 bg-primary-300'
                    : 'w-2 h-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Step 1: Details ──────────────────────────────────────────────── */}
      {step === 'details' && (
        <form className="space-y-4" onSubmit={submitDetails}>
          <div className="grid grid-cols-2 gap-3">
            <FormInput
              label="Surname"
              id="surname"
              placeholder="e.g. Okonkwo"
              error={detailForm.formState.errors.surname?.message}
              {...detailForm.register('surname')}
            />
            <FormInput
              label="Other Names"
              id="otherNames"
              placeholder="e.g. Adaeze"
              error={detailForm.formState.errors.otherNames?.message}
              {...detailForm.register('otherNames')}
            />
          </div>

          <FormInput
            label="Name in School"
            id="nameInSchool"
            placeholder="First name + Surname as used in FGGC Owerri"
            hint="The name you used while in school — important for alumni identification."
            error={detailForm.formState.errors.nameInSchool?.message}
            {...detailForm.register('nameInSchool')}
          />

          <FormInput
            label="Email Address"
            id="email"
            type="email"
            placeholder="you@example.com"
            error={detailForm.formState.errors.email?.message}
            {...detailForm.register('email')}
          />

          {/* WhatsApp — country code select + number input side by side */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              WhatsApp Phone Number
            </label>
            <div className="grid grid-cols-[10rem_1fr] gap-2">
              <SelectInput
                id="phoneCountry"
                options={phoneCountrySelectOptions}
                placeholder="Country"
                error={undefined}
                {...phoneCountryRegistration}
              />
              <FormInput
                id="whatsappPhone"
                type="tel"
                inputMode="numeric"
                placeholder={selectedPhoneCountry.placeholder}
                error={detailForm.formState.errors.whatsappPhone?.message}
                {...whatsappRegistration}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Enter number without country code</p>
          </div>

          <SelectInput
            label="Year of Graduation from FGGC Owerri"
            id="graduationYear"
            options={graduationYearOptions}
            placeholder="Select Graduation Year"
            error={detailForm.formState.errors.graduationYear?.message}
            {...detailForm.register('graduationYear')}
          />

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a secure password"
                className={`input pr-10 ${detailForm.formState.errors.password ? 'border-red-400' : ''}`}
                {...detailForm.register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon
                  icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                  className="w-4 h-4"
                />
              </button>
            </div>
            {detailForm.formState.errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {detailForm.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                className={`input pr-10 ${detailForm.formState.errors.confirmPassword ? 'border-red-400' : ''}`}
                {...detailForm.register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icon
                  icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                  className="w-4 h-4"
                />
              </button>
            </div>
            {detailForm.formState.errors.confirmPassword ? (
              <p className="mt-1 text-xs text-red-500">
                {detailForm.formState.errors.confirmPassword.message}
              </p>
            ) : confirmPasswordValue ? (
              <p
                className={`mt-1 text-xs ${passwordsMatch ? 'text-primary-600' : 'text-gray-400'}`}
              >
                {passwordsMatch ? '✓ Passwords match' : 'Passwords must match exactly'}
              </p>
            ) : null}
          </div>

          {passwordValue && <PasswordStrengthMeter password={passwordValue} />}

          <button
            type="submit"
            disabled={detailForm.formState.isSubmitting}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {detailForm.formState.isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                Sign up <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <AppLink
              href="/auth/login"
              className="font-semibold text-primary-500 hover:text-primary-600"
            >
              Login
            </AppLink>
          </p>
        </form>
      )}

      {/* ── Step 2: Verification ──────────────────────────────────────────── */}
      {step === 'verification' && draft && verificationState && (
        <div className="space-y-5">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
            <p className="text-sm font-semibold text-primary-800 mb-1">Check your inbox</p>
            <p className="text-xs text-primary-700 leading-relaxed">{verificationState.message}</p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm">
            {[
              { label: 'Full name', value: `${draft.otherNames} ${draft.surname}` },
              { label: 'Name in school', value: draft.nameInSchool },
              { label: 'Email', value: draft.email },
              {
                label: 'WhatsApp',
                value: formatPhoneNumberWithCountryCode(draft.phoneCountry, draft.whatsappPhone),
              },
              { label: 'Graduation year', value: String(draft.graduationYear) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
                  {value}
                </span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setStep('details')}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium pt-1"
            >
              ← Edit details
            </button>
          </div>

          <form className="space-y-4" onSubmit={submitVerification}>
            <FormInput
              label="Verification Code"
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              hint="Any 6-digit code works in frontend-only mode"
              error={verificationForm.formState.errors.code?.message}
              className="text-center text-lg tracking-[0.4em]"
              {...verificationForm.register('code')}
            />

            {resendMessage && (
              <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                {resendMessage}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={verificationForm.formState.isSubmitting}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {verificationForm.formState.isSubmitting ? (
                  <>
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify email'
                )}
              </button>
              <button type="button" onClick={resendCode} className="btn btn-outline flex-1">
                Resend code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Step 3: Success ───────────────────────────────────────────────── */}
      {step === 'success' && completionState && (
        <div className="space-y-5 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="mdi:shield-check-outline" className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-2">Registration completed!</p>
            <p className="text-sm text-gray-500 leading-relaxed">{completionState.message}</p>
          </div>
          <ul className="text-left space-y-2.5 text-sm text-gray-500">
            {[
              { icon: 'mdi:check-circle-outline', text: 'Your email has been verified.' },
              { icon: 'mdi:clock-outline', text: 'Your account is awaiting admin approval.' },
              {
                icon: 'mdi:email-outline',
                text: 'You will be notified once your account is approved.',
              },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-2">
                <Icon icon={icon} className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                {text}
              </li>
            ))}
          </ul>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={resetFlow} className="btn btn-outline flex-1 text-sm">
              Register another
            </button>
            <AppLink href="/auth/login" className="btn btn-primary flex-1 text-sm text-center">
              Go to login
            </AppLink>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
