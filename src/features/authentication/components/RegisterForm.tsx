import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getSiteConfig } from '@/data/content';
import { AppLink } from '@/shared/components/ui/AppLink';
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

type RegistrationStep = 'details' | 'verification' | 'success';

const stepOrder: Array<{ id: RegistrationStep; label: string }> = [
  { id: 'details', label: 'Account details' },
  { id: 'verification', label: 'Verify email' },
  { id: 'success', label: 'Approval pending' },
];

function currentStepIndex(step: RegistrationStep) {
  return stepOrder.findIndex((item) => item.id === step);
}

export function RegisterForm() {
  const config = getSiteConfig();
  const currentYear = new Date().getFullYear();
  const firstYear = Math.min(config.years.start, currentYear - 70);
  const lastYear = Math.max(config.years.end, currentYear);
  const graduationYears = Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
    return lastYear - index;
  });

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
      fullName: '',
      email: '',
      phoneCountry: defaultPhoneCountry,
      phoneNumber: '',
      graduationYear: currentYear,
      password: '',
      confirmPassword: '',
    },
  });

  const verificationForm = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      code: '',
    },
  });

  const passwordValue = detailForm.watch('password') ?? '';
  const phoneCountry = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
  const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
  const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
  const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);
  const phoneCountryRegistration = detailForm.register('phoneCountry', {
    onChange: (event) => {
      const nextCountryCode = event.target.value as SupportedPhoneCountry;
      const nextCountry = getPhoneCountryOption(nextCountryCode);
      const currentPhoneNumber = normalizeNationalPhoneNumber(detailForm.getValues('phoneNumber'));
      const nextPhoneNumber = currentPhoneNumber.slice(0, nextCountry.maxLength);

      if (nextPhoneNumber !== detailForm.getValues('phoneNumber')) {
        detailForm.setValue('phoneNumber', nextPhoneNumber, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return;
      }

      if (currentPhoneNumber) {
        void detailForm.trigger('phoneNumber');
      }
    },
  });
  const phoneNumberRegistration = detailForm.register('phoneNumber', {
    onChange: (event) => {
      event.target.value = normalizeNationalPhoneNumber(event.target.value).slice(
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
    if (!draft) {
      return;
    }

    const response = await authApi.verifyRegistrationEmail({
      draft,
      code: values.code,
    });

    setCompletionState(response);
    setStep('success');
  });

  const resendVerificationCode = async () => {
    if (!draft) {
      return;
    }

    const response = await authApi.startRegistration(draft);
    setVerificationState(response);
    setResendMessage(`A fresh verification step has been simulated for ${draft.email}.`);
  };

  const activeStepIndex = currentStepIndex(step);

  const resetFlow = () => {
    detailForm.reset({
      fullName: '',
      email: '',
      phoneCountry: defaultPhoneCountry,
      phoneNumber: '',
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-accent-900">Register</h2>
        <p className="mt-2 text-sm leading-6 text-accent-500">
          Enter your alumni details, verify your email, and then wait for admin approval before the
          account can be used.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {stepOrder.map((item, index) => {
          const isComplete = index < activeStepIndex;
          const isActive = index === activeStepIndex;

          return (
            <div
              className={`rounded-2xl border px-4 py-3 transition-colors duration-200 ${
                isActive
                  ? 'border-primary-300 bg-primary-50'
                  : isComplete
                    ? 'border-primary-200 bg-white'
                    : 'border-accent-200 bg-accent-50'
              }`}
              key={item.id}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    isActive || isComplete
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-accent-500'
                  }`}
                >
                  {isComplete ? <Icon icon="mdi:check" className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-sm font-semibold text-accent-800">{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {step === 'details' && (
        <form className="space-y-5" onSubmit={submitDetails}>
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-accent-800"
              htmlFor="register-name"
            >
              Full name
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              className={`input ${detailForm.formState.errors.fullName ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
              {...detailForm.register('fullName')}
            />
            {detailForm.formState.errors.fullName && (
              <p className="mt-2 text-sm text-secondary-700">
                {detailForm.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-accent-800"
                htmlFor="register-email"
              >
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`input ${detailForm.formState.errors.email ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
                {...detailForm.register('email')}
              />
              {detailForm.formState.errors.email && (
                <p className="mt-2 text-sm text-secondary-700">
                  {detailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-accent-800"
                htmlFor="register-phone"
              >
                Phone number
              </label>
              <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
                <select
                  id="register-phone-country"
                  className={`select select-compact ${detailForm.formState.errors.phoneNumber ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
                  aria-label="Phone country code"
                  title={selectedPhoneCountry.label}
                  {...phoneCountryRegistration}
                >
                  {phoneCountryOptions.map((option) => (
                    <option value={option.code} key={option.code}>
                      {option.dialCode}
                    </option>
                  ))}
                </select>

                <input
                  id="register-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder={selectedPhoneCountry.placeholder}
                  maxLength={selectedPhoneCountry.maxLength}
                  className={`input ${detailForm.formState.errors.phoneNumber ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
                  {...phoneNumberRegistration}
                />
              </div>
              <p className="mt-2 text-sm text-accent-500">
                Enter the number without the country code. Example: {selectedPhoneCountry.placeholder}
              </p>
              {detailForm.formState.errors.phoneNumber && (
                <p className="mt-2 text-sm text-secondary-700">
                  {detailForm.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-accent-800"
              htmlFor="register-year"
            >
              Graduation year
            </label>
            <select
              id="register-year"
              className={`select ${detailForm.formState.errors.graduationYear ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
              {...detailForm.register('graduationYear', { valueAsNumber: true })}
            >
              {graduationYears.map((year) => (
                <option value={year} key={year}>
                  {year}
                </option>
              ))}
            </select>
            {detailForm.formState.errors.graduationYear && (
              <p className="mt-2 text-sm text-secondary-700">
                {detailForm.formState.errors.graduationYear.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-accent-800"
                htmlFor="register-password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  className={`input pr-12 ${detailForm.formState.errors.password ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
                  {...detailForm.register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-primary-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <Icon
                    icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                    className="h-5 w-5"
                  />
                </button>
              </div>
              {detailForm.formState.errors.password && (
                <p className="mt-2 text-sm text-secondary-700">
                  {detailForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-accent-800"
                htmlFor="register-confirm-password"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  className={`input pr-12 ${detailForm.formState.errors.confirmPassword ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
                  {...detailForm.register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-primary-600"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirmPassword((value) => !value)}
                >
                  <Icon
                    icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                    className="h-5 w-5"
                  />
                </button>
              </div>
              {detailForm.formState.errors.confirmPassword ? (
                <p className="mt-2 text-sm text-secondary-700">
                  {detailForm.formState.errors.confirmPassword.message}
                </p>
              ) : confirmPasswordValue ? (
                <p
                  className={`mt-2 text-sm ${passwordsMatch ? 'text-primary-700' : 'text-accent-500'}`}
                >
                  {passwordsMatch ? 'Passwords match.' : 'Passwords must match exactly.'}
                </p>
              ) : null}
            </div>
          </div>

          {passwordValue ? <PasswordStrengthMeter password={passwordValue} /> : null}

          <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-600">
            After this step, the UI will move to email verification. Until the backend is connected,
            the verification experience is simulated on the frontend.
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={detailForm.formState.isSubmitting}
          >
            {detailForm.formState.isSubmitting
              ? 'Checking details...'
              : 'Continue to email verification'}
          </button>
        </form>
      )}

      {step === 'verification' && draft && verificationState && (
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-primary-200 bg-primary-50 p-5">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:email-fast"
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-700"
              />
              <div>
                <p className="font-semibold text-primary-900">Verify your email address</p>
                <p className="mt-1 text-sm leading-6 text-primary-900/80">
                  {verificationState.message}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-700">
                  Verification window: {verificationState.expiresInMinutes} minutes
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-accent-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-accent-900">Submitted details</h3>
              <button
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                type="button"
                onClick={() => setStep('details')}
              >
                Edit details
              </button>
            </div>

            <dl className="mt-4 grid gap-4 text-sm text-accent-600 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-accent-900">Name</dt>
                <dd className="mt-1">{draft.fullName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-accent-900">Email</dt>
                <dd className="mt-1">{draft.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-accent-900">Phone</dt>
                <dd className="mt-1">
                  {formatPhoneNumberWithCountryCode(draft.phoneCountry, draft.phoneNumber)}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-accent-900">Graduation year</dt>
                <dd className="mt-1">{draft.graduationYear}</dd>
              </div>
            </dl>
          </div>

          <form className="space-y-5" onSubmit={submitVerification}>
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-accent-800"
                htmlFor="verification-code"
              >
                Verification code
              </label>
              <input
                id="verification-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Enter 6 digits"
                className={`input text-center text-lg tracking-[0.45em] ${verificationForm.formState.errors.code ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
                {...verificationForm.register('code')}
              />
              {verificationForm.formState.errors.code ? (
                <p className="mt-2 text-sm text-secondary-700">
                  {verificationForm.formState.errors.code.message}
                </p>
              ) : (
                <p className="mt-2 text-sm text-accent-500">
                  Frontend-only mode: any 6-digit code will pass until the real email verification
                  API is ready.
                </p>
              )}
            </div>

            {resendMessage && (
              <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-700">
                {resendMessage}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                className="btn btn-primary flex-1"
                type="submit"
                disabled={verificationForm.formState.isSubmitting}
              >
                {verificationForm.formState.isSubmitting ? 'Verifying email...' : 'Verify email'}
              </button>
              <button
                className="btn btn-outline flex-1"
                type="button"
                onClick={resendVerificationCode}
                disabled={verificationForm.formState.isSubmitting}
              >
                Resend code
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'success' && completionState && (
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-primary-200 bg-primary-50 p-6">
            <div className="flex items-start gap-3">
              <Icon
                icon="mdi:shield-check"
                className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-700"
              />
              <div>
                <p className="text-lg font-semibold text-primary-900">Registration completed</p>
                <p className="mt-2 text-sm leading-6 text-primary-900/80">
                  {completionState.message}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-accent-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-accent-900">What happens next</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-accent-600">
              <li className="flex gap-3">
                <Icon
                  icon="mdi:check-circle-outline"
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600"
                />
                <span>Your email has been verified successfully.</span>
              </li>
              <li className="flex gap-3">
                <Icon
                  icon="mdi:clock-outline"
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600"
                />
                <span>Your account is now waiting for admin approval.</span>
              </li>
              <li className="flex gap-3">
                <Icon
                  icon="mdi:email-outline"
                  className="mt-1 h-4 w-4 flex-shrink-0 text-primary-600"
                />
                <span>
                  You should notify the user here once approval APIs or notifications are available.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-outline flex-1" type="button" onClick={resetFlow}>
              Create another account
            </button>
            <AppLink href="/auth/login" className="btn btn-primary flex-1">
              Go to login
            </AppLink>
          </div>
        </div>
      )}
    </div>
  );
}
