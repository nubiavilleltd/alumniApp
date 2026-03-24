// import { zodResolver } from '@hookform/resolvers/zod';
// import { Icon } from '@iconify/react';
// import { useEffect, useState } from 'react';
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
// import { SelectInput } from '@/shared/components/ui/SelectInput';

// type RegistrationStep = 'details' | 'verification' | 'success';

// const STEPS: RegistrationStep[] = ['details', 'verification', 'success'];

// const stepMeta: Record<RegistrationStep, { step: string; label: string }> = {
//   details: { step: 'Step 1 of 3', label: 'Account Details' },
//   verification: { step: 'Step 2 of 3', label: 'Verify Email' },
//   success: { step: 'Step 3 of 3', label: 'Approval Pending' },
// };

// export function RegisterForm() {
//   const currentYear = new Date().getFullYear();

//   const graduationYearOptions = Array.from({ length: currentYear - 1966 + 1 }, (_, i) => ({
//     label: String(currentYear - i),
//     value: String(currentYear - i),
//   }));

//   const phoneCountrySelectOptions = phoneCountryOptions.map((o) => ({
//     label: `${o.dialCode} (${o.label})`,
//     value: o.code,
//   }));

//   const [step, setStep] = useState<RegistrationStep>('details');
//   const [draft, setDraft] = useState<(RegisterDetailsFormValues & { userId?: string }) | null>(
//     null,
//   );
//   const [verificationState, setVerificationState] = useState<StartRegistrationResponse | null>(
//     null,
//   );
//   const [completionState, setCompletionState] = useState<CompleteRegistrationResponse | null>(null);
//   const [resendMessage, setResendMessage] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const detailForm = useForm<RegisterDetailsFormValues>({
//     resolver: zodResolver(registerDetailsSchema),
//     defaultValues: {
//       surname: '',
//       otherNames: '',
//       nameInSchool: '',
//       email: '',
//       phoneCountry: defaultPhoneCountry,
//       whatsappPhone: '',
//       graduationYear: currentYear,
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const verificationForm = useForm<EmailVerificationFormValues>({
//     resolver: zodResolver(emailVerificationSchema),
//     defaultValues: { code: '', userId: '' },
//   });

//   const passwordValue = detailForm.watch('password') ?? '';
//   const phoneCountry = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
//   const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
//   const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
//   const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);

//   const phoneCountryRegistration = detailForm.register('phoneCountry', {
//     onChange: (e) => {
//       const nextCode = e.target.value as SupportedPhoneCountry;
//       const nextCountry = getPhoneCountryOption(nextCode);
//       const current = normalizeNationalPhoneNumber(detailForm.getValues('whatsappPhone'));
//       const next = current.slice(0, nextCountry.maxLength);
//       if (next !== detailForm.getValues('whatsappPhone')) {
//         detailForm.setValue('whatsappPhone', next, { shouldDirty: true, shouldValidate: true });
//       } else if (current) {
//         void detailForm.trigger('whatsappPhone');
//       }
//     },
//   });

//   const whatsappRegistration = detailForm.register('whatsappPhone', {
//     onChange: (e) => {
//       e.target.value = normalizeNationalPhoneNumber(e.target.value).slice(
//         0,
//         selectedPhoneCountry.maxLength,
//       );
//     },
//   });

//   useEffect(() => {
//     const savedDraft = sessionStorage.getItem('registration_draft');
//     if (savedDraft) {
//       const parsed = JSON.parse(savedDraft);
//       console.log("parsed ====>", {parsed})
//       setDraft(parsed.values);
//       setVerificationState(parsed.response);
//       verificationForm.reset({
//   code: '',
//   userId: parsed.response?.userId || ''
// });
//       setStep('verification'); // Resume at verification step
//     }
//   }, []);

//   const submitDetails = detailForm.handleSubmit(async (values) => {
//     const response = await authApi.startRegistration(values);
//     console.log("response here", {response})
//     setDraft(values);
//     sessionStorage.setItem('registration_draft', JSON.stringify({values, response}));
//     setVerificationState(response);
//     setCompletionState(null);
//     setResendMessage('');
//     // verificationForm.reset({ code: '', userId: '' });
//     console.log("setting user id => ", {response})
//     verificationForm.reset({
//     code: '',
//     userId: response.userId || '' // ← Use userId from backend
//   });
//     setStep('verification');
//   });

//   const submitVerification = verificationForm.handleSubmit(async (values) => {
//     console.log("this is draft", {draft})
//     if (!draft) return;

//     console.log('values', { values });
//     const response = await authApi.verifyRegistrationEmail({
//       draft,
//       code: values.code,
//       userId: values.userId,
//     });
//     // const response = await authApi.verifyRegistrationEmail({ draft, code: values.code, userId:'30' });
//     setCompletionState(response);
//     sessionStorage.removeItem('registration_draft');
//     setStep('success');
//   });

//   const resendCode = async () => {
//     if (!draft) return;
//     const response = await authApi.startRegistration(draft);
//     setVerificationState(response);

//     verificationForm.setValue('userId', response.userId || '');
//     setResendMessage(`A fresh code has been simulated for ${draft.email}.`);
//   };

//   const resetFlow = () => {
//     detailForm.reset({
//       surname: '',
//       otherNames: '',
//       nameInSchool: '',
//       email: '',
//       phoneCountry: defaultPhoneCountry,
//       whatsappPhone: '',
//       graduationYear: currentYear,
//       password: '',
//       confirmPassword: '',
//     });
//     verificationForm.reset({ code: '' });
//     setDraft(null);
//     setVerificationState(null);
//     setCompletionState(null);
//     setResendMessage('');
//     setStep('details');
//   };

//   const { step: stepNumber, label: stepLabel } = stepMeta[step];
//   const activeIndex = STEPS.indexOf(step);

//   return (
//     <AuthCard title="Sign" titleAccent="Up" subtitle="Join your Sisters">
//       {/* ── Step indicator ────────────────────────────────────────────────── */}
//       <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-100">
//         <div>
//           <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">
//             {stepNumber}
//           </p>
//           <p className="text-sm font-bold text-gray-800 mt-0.5">{stepLabel}</p>
//         </div>
//         <div className="flex items-center gap-1.5">
//           {STEPS.map((s, i) => (
//             <div
//               key={s}
//               className={`rounded-full transition-all duration-300 ${
//                 s === step
//                   ? 'w-5 h-2 bg-primary-500'
//                   : i < activeIndex
//                     ? 'w-2 h-2 bg-primary-300'
//                     : 'w-2 h-2 bg-gray-200'
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ── Step 1: Details ──────────────────────────────────────────────── */}
//       {step === 'details' && (
//         <form className="space-y-4" onSubmit={submitDetails}>
//           <div className="grid grid-cols-2 gap-3">
//             <FormInput
//               label="Surname"
//               id="surname"
//               placeholder="e.g. Okonkwo"
//               error={detailForm.formState.errors.surname?.message}
//               {...detailForm.register('surname')}
//             />
//             <FormInput
//               label="Other Names"
//               id="otherNames"
//               placeholder="e.g. Adaeze"
//               error={detailForm.formState.errors.otherNames?.message}
//               {...detailForm.register('otherNames')}
//             />
//           </div>

//           <FormInput
//             label="Name in School"
//             id="nameInSchool"
//             placeholder="First name + Surname as used in FGGC Owerri"
//             hint="The name you used while in school — important for alumni identification."
//             error={detailForm.formState.errors.nameInSchool?.message}
//             {...detailForm.register('nameInSchool')}
//           />

//           <FormInput
//             label="Email Address"
//             id="email"
//             type="email"
//             placeholder="you@example.com"
//             error={detailForm.formState.errors.email?.message}
//             {...detailForm.register('email')}
//           />

//           {/* WhatsApp — country code select + number input side by side */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               WhatsApp Phone Number
//             </label>
//             <div className="grid grid-cols-[10rem_1fr] gap-2">
//               <SelectInput
//                 id="phoneCountry"
//                 options={phoneCountrySelectOptions}
//                 placeholder="Country"
//                 error={undefined}
//                 {...phoneCountryRegistration}
//               />
//               <FormInput
//                 id="whatsappPhone"
//                 type="tel"
//                 inputMode="numeric"
//                 placeholder={selectedPhoneCountry.placeholder}
//                 error={detailForm.formState.errors.whatsappPhone?.message}
//                 {...whatsappRegistration}
//               />
//             </div>
//             <p className="mt-1 text-xs text-gray-400">Enter number without country code</p>
//           </div>

//           <SelectInput
//             label="Year of Graduation from FGGC Owerri"
//             id="graduationYear"
//             options={graduationYearOptions}
//             placeholder="Select Graduation Year"
//             error={detailForm.formState.errors.graduationYear?.message}
//             {...detailForm.register('graduationYear')}
//           />

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
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((v) => !v)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <Icon
//                   icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
//                   className="w-4 h-4"
//                 />
//               </button>
//             </div>
//             {detailForm.formState.errors.password && (
//               <p className="mt-1 text-xs text-red-500">
//                 {detailForm.formState.errors.password.message}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 placeholder="Re-enter your password"
//                 className={`input pr-10 ${detailForm.formState.errors.confirmPassword ? 'border-red-400' : ''}`}
//                 {...detailForm.register('confirmPassword')}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword((v) => !v)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <Icon
//                   icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
//                   className="w-4 h-4"
//                 />
//               </button>
//             </div>
//             {detailForm.formState.errors.confirmPassword ? (
//               <p className="mt-1 text-xs text-red-500">
//                 {detailForm.formState.errors.confirmPassword.message}
//               </p>
//             ) : confirmPasswordValue ? (
//               <p
//                 className={`mt-1 text-xs ${passwordsMatch ? 'text-primary-600' : 'text-gray-400'}`}
//               >
//                 {passwordsMatch ? '✓ Passwords match' : 'Passwords must match exactly'}
//               </p>
//             ) : null}
//           </div>

//           {passwordValue && <PasswordStrengthMeter password={passwordValue} />}

//           <button
//             type="submit"
//             disabled={detailForm.formState.isSubmitting}
//             className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2"
//           >
//             {detailForm.formState.isSubmitting ? (
//               <>
//                 <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//                 Checking...
//               </>
//             ) : (
//               <>
//                 Sign up <Icon icon="mdi:arrow-right" className="w-4 h-4" />
//               </>
//             )}
//           </button>

//           <p className="text-center text-sm text-gray-500">
//             Already have an account?{' '}
//             <AppLink
//               href="/auth/login"
//               className="font-semibold text-primary-500 hover:text-primary-600"
//             >
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

//           {/* Summary */}
//           <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm">
//             {[
//               { label: 'Full name', value: `${draft.otherNames} ${draft.surname}` },
//               { label: 'Name in school', value: draft.nameInSchool },
//               { label: 'Email', value: draft.email },
//               {
//                 label: 'WhatsApp',
//                 value: formatPhoneNumberWithCountryCode(draft.phoneCountry, draft.whatsappPhone),
//               },
//               { label: 'Graduation year', value: String(draft.graduationYear) },
//             ].map(({ label, value }) => (
//               <div key={label} className="flex justify-between items-center">
//                 <span className="text-gray-500">{label}</span>
//                 <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
//                   {value}
//                 </span>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={() => setStep('details')}
//               className="text-xs text-primary-500 hover:text-primary-600 font-medium pt-1"
//             >
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
//               // hint="Any 6-digit code works in frontend-only mode"
//               hint=""
//               error={verificationForm.formState.errors.code?.message}
//               className="text-center text-lg tracking-[0.4em]"
//               {...verificationForm.register('code')}
//             />

//             {resendMessage && (
//               <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
//                 {resendMessage}
//               </p>
//             )}

//             <div className="flex gap-3">
//               <button
//                 type="submit"
//                 disabled={verificationForm.formState.isSubmitting}
//                 className="btn btn-primary flex-1 flex items-center justify-center gap-2"
//               >
//                 {verificationForm.formState.isSubmitting ? (
//                   <>
//                     <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//                     Verifying...
//                   </>
//                 ) : (
//                   'Verify email'
//                 )}
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
//               { icon: 'mdi:clock-outline', text: 'Your account is awaiting admin approval.' },
//               {
//                 icon: 'mdi:email-outline',
//                 text: 'You will be notified once your account is approved.',
//               },
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

// features/authentication/components/RegisterForm.tsx
//
// Registration flow: details → email verification → success
//
// State architecture:
//   - `flowState` is the single source of truth for everything between steps.
//   - It is persisted to sessionStorage so page refreshes don't lose progress.
//   - `userId` (and any other server-issued tokens) live in flowState, NOT in
//     form state. Forms only hold user-entered values.
//   - Both forms are fully controlled by their own useForm instances.
//   - Errors from the API are surfaced as form-level setError calls so the user
//     always sees feedback — no silent failures.

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
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

// ─── Types ────────────────────────────────────────────────────────────────────

type RegistrationStep = 'details' | 'verification' | 'success';

const STEPS: RegistrationStep[] = ['details', 'verification', 'success'];

const stepMeta: Record<RegistrationStep, { step: string; label: string }> = {
  details: { step: 'Step 1 of 3', label: 'Account Details' },
  verification: { step: 'Step 2 of 3', label: 'Verify Email' },
  success: { step: 'Step 3 of 3', label: 'Approval Pending' },
};

// ─── Flow state ───────────────────────────────────────────────────────────────
// Everything the flow needs between steps. Persisted to sessionStorage.
// userId is server-issued — it lives here, not in any form.

interface RegistrationFlowState {
  step: RegistrationStep;
  // Captured after step 1 completes
  formValues: RegisterDetailsFormValues | null;
  // Returned by the backend after step 1
  verificationResponse: StartRegistrationResponse | null;
  // userId as issued by backend — critical for step 2
  userId: string | null;
  // Returned by the backend after step 2
  completionResponse: CompleteRegistrationResponse | null;
}

const INITIAL_FLOW_STATE: RegistrationFlowState = {
  step: 'details',
  formValues: null,
  verificationResponse: null,
  userId: null,
  completionResponse: null,
};

const STORAGE_KEY = 'registration_flow';

function saveFlow(state: RegistrationFlowState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable (private browsing quota, etc.) — degrade gracefully
  }
}

function loadFlow(): RegistrationFlowState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RegistrationFlowState;
    // Only restore if there's an actionable in-progress state
    if (parsed.step === 'details' || parsed.step === 'success') return null;
    if (!parsed.formValues || !parsed.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearFlow() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ── Single source of truth for inter-step state ───────────────────────────
  const [flow, setFlow] = useState<RegistrationFlowState>(INITIAL_FLOW_STATE);
  const [resendMessage, setResendMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Forms — only hold user-typed values ──────────────────────────────────
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

  // emailVerificationSchema only has `code` — userId is NOT a form field
  const verificationForm = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { code: '' },
  });

  const passwordValue = detailForm.watch('password') ?? '';
  const phoneCountry = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
  const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
  const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
  const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);

  // ── Phone field — normalise as the user types ────────────────────────────
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

  // ── Restore in-progress flow from sessionStorage on mount ────────────────
  // This handles the page-refresh case. We restore flow state only — we do NOT
  // touch the verification form here because the code field should always start
  // empty (the user needs to re-enter the code, which is correct UX).
  useEffect(() => {
    const saved = loadFlow();
    if (saved) {
      setFlow(saved);
    }
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function updateFlow(updates: Partial<RegistrationFlowState>) {
    setFlow((prev) => {
      const next = { ...prev, ...updates };
      saveFlow(next);
      return next;
    });
  }

  // ── Step 1: Submit registration details ──────────────────────────────────
  const submitDetails = detailForm.handleSubmit(async (values) => {
    try {
      const response = await authApi.startRegistration(values);

      if (!response.userId) {
        // Backend returned a response without a userId — surface this clearly
        // rather than letting it fail silently two steps later
        detailForm.setError('root', {
          message: 'Server did not return a user ID. Please contact support if this persists.',
        });
        return;
      }

      updateFlow({
        step: 'verification',
        formValues: values,
        verificationResponse: response,
        userId: response.userId,
        completionResponse: null,
      });
      setResendMessage('');
      verificationForm.reset({ code: '' });
    } catch (error: any) {
      detailForm.setError('root', {
        message: error.message || 'Registration failed. Please try again.',
      });
    }
  });

  // ── Step 2: Verify email ──────────────────────────────────────────────────
  const submitVerification = verificationForm.handleSubmit(async ({ code }) => {
    // userId comes from flow state — never from the form
    if (!flow.formValues || !flow.userId) {
      // This should never happen in normal operation, but if it does (e.g.
      // corrupted sessionStorage), send the user back to step 1 cleanly.
      verificationForm.setError('root', {
        message: 'Session data missing. Please go back and fill in your details again.',
      });
      return;
    }

    try {
      const response = await authApi.verifyRegistrationEmail({
        draft: flow.formValues,
        code,
        userId: flow.userId,
      });

      clearFlow();
      updateFlow({
        step: 'success',
        completionResponse: response,
      });
    } catch (error: any) {
      verificationForm.setError('root', {
        message: error.message || 'Verification failed. Please check the code and try again.',
      });
    }
  });

  // ── Resend code ───────────────────────────────────────────────────────────
  const resendCode = async () => {
    if (!flow.formValues) return;

    try {
      const response = await authApi.startRegistration(flow.formValues);

      if (!response.userId) {
        setResendMessage('Failed to resend — server did not return a user ID.');
        return;
      }

      // Update flow with new userId and response — old userId is now invalid
      updateFlow({
        verificationResponse: response,
        userId: response.userId,
      });
      verificationForm.reset({ code: '' });
      setResendMessage(`A new code has been sent to ${flow.formValues.email}.`);
    } catch (error: any) {
      setResendMessage(error.message || 'Failed to resend. Please try again.');
    }
  };

  // ── Reset entire flow ─────────────────────────────────────────────────────
  const resetFlow = () => {
    clearFlow();
    setFlow(INITIAL_FLOW_STATE);
    setResendMessage('');
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
  };

  // ── Derived display values ────────────────────────────────────────────────
  const { step: stepNumber, label: stepLabel } = stepMeta[flow.step];
  const activeIndex = STEPS.indexOf(flow.step);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AuthCard title="Sign" titleAccent="Up" subtitle="Join your Sisters">
      {/* ── Step indicator ──────────────────────────────────────────────── */}
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
                s === flow.step
                  ? 'w-5 h-2 bg-primary-500'
                  : i < activeIndex
                    ? 'w-2 h-2 bg-primary-300'
                    : 'w-2 h-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Step 1: Details ─────────────────────────────────────────────── */}
      {flow.step === 'details' && (
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

          {/* WhatsApp — country code + number */}
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

          {/* Root-level API error */}
          {detailForm.formState.errors.root && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm text-red-600">{detailForm.formState.errors.root.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={detailForm.formState.isSubmitting}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            {detailForm.formState.isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" /> Checking...
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

      {/* ── Step 2: Verification ────────────────────────────────────────── */}
      {flow.step === 'verification' && flow.formValues && flow.verificationResponse && (
        <div className="space-y-5">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
            <p className="text-sm font-semibold text-primary-800 mb-1">Check your inbox</p>
            <p className="text-xs text-primary-700 leading-relaxed">
              {flow.verificationResponse.message}
            </p>
          </div>

          {/* Registration summary */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm">
            {[
              {
                label: 'Full name',
                value: `${flow.formValues.otherNames} ${flow.formValues.surname}`,
              },
              { label: 'Name in school', value: flow.formValues.nameInSchool },
              { label: 'Email', value: flow.formValues.email },
              {
                label: 'WhatsApp',
                value: formatPhoneNumberWithCountryCode(
                  flow.formValues.phoneCountry,
                  flow.formValues.whatsappPhone,
                ),
              },
              { label: 'Graduation year', value: String(flow.formValues.graduationYear) },
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
              onClick={() => updateFlow({ step: 'details' })}
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
              hint=""
              error={verificationForm.formState.errors.code?.message}
              className="text-center text-lg tracking-[0.4em]"
              {...verificationForm.register('code')}
            />

            {/* API / session error */}
            {verificationForm.formState.errors.root && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-sm text-red-600">
                  {verificationForm.formState.errors.root.message}
                </p>
                {/* Show back button if session data is missing */}
                {verificationForm.formState.errors.root.message?.includes('Session data') && (
                  <button
                    type="button"
                    onClick={() => updateFlow({ step: 'details' })}
                    className="mt-2 text-xs text-primary-600 font-medium hover:underline"
                  >
                    ← Go back to details
                  </button>
                )}
              </div>
            )}

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
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  'Verify email'
                )}
              </button>
              <button
                type="button"
                onClick={resendCode}
                disabled={verificationForm.formState.isSubmitting}
                className="btn btn-outline flex-1"
              >
                Resend code
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Step 3: Success ─────────────────────────────────────────────── */}
      {flow.step === 'success' && flow.completionResponse && (
        <div className="space-y-5 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="mdi:shield-check-outline" className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-2">Registration completed!</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              {flow.completionResponse.message}
            </p>
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
