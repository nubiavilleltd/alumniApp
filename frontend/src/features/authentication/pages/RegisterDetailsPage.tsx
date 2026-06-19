// features/authentication/pages/RegisterDetailsPage.tsx
// MODIFIED: city field changed from free-text FormInput to a SelectInput
// backed by useCities(). The selected city's name is stored in the form
// (and ultimately sent to the backend) exactly as before — only the UI changes.

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Button } from '@/shared/components/ui/Button';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { DatePicker } from '@/shared/components/ui/input/DatePicker';
import { PhoneNumberInput } from '@/shared/components/ui/input/PhoneNumberInput';
import { PasswordInput } from '@/shared/components/ui/input/PasswordInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { authApi } from '../services/auth.service';
import { registerDetailsSchema } from '../schemas/authSchema';
import type { RegisterDetailsFormValues, Voucher } from '../types/auth.types';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { RegistrationShell } from '../components/RegistrationShell';
import { AUTH_ROUTES } from '../routes';
import {
  clearRegistrationFlow,
  loadRegistrationFlow,
  saveRegistrationFlow,
} from '../lib/registrationFlow';
import { markInitialVerificationSend } from '../lib/verificationResendThrottle';
import { NIGERIA_STATES } from '../constants/nigerianStates';
import { TextareaInput } from '@/shared/components/ui/TextAreaInput';
import { useCities } from '../hooks/useCities';
import { NIGERIAN_PHONE_PLACEHOLDER } from '@/shared/utils/nigerianPhoneNumber';
// import { useCities } from '@/features/alumni/hooks/useCities';

const stateOptions = NIGERIA_STATES.map((state) => ({
  label: state,
  value: state,
}));

type SocialSignupProvider = {
  id: 'google' | 'facebook' | 'linkedin';
  label: string;
  icon: ReactNode;
  mockProfile: {
    providerUserId: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatarUrl?: string;
  };
};

type NormalizedSocialAuthResponse = {
  provider: SocialSignupProvider['id'];
  providerUserId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  emailVerified: boolean;
  avatarUrl: string | null;
  source: 'mock';
};

const socialSignupProviders: SocialSignupProvider[] = [
  {
    id: 'google',
    label: 'Sign up with Google',
    mockProfile: {
      providerUserId: 'google_112233445566',
      firstName: 'Adaeze',
      lastName: 'Okonkwo',
      email: 'adaeze.okonkwo@example.com',
      avatarUrl: 'https://example.com/mock/google-avatar.jpg',
    },
    icon: (
      <svg className="auth-social-icon auth-social-icon--google" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M23.5 12.27c0-.84-.08-1.64-.22-2.42H12v4.58h6.44a5.5 5.5 0 0 1-2.39 3.61v2.95h3.87c2.26-2.08 3.58-5.14 3.58-8.72Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-2.95c-1.08.72-2.45 1.14-4.08 1.14-3.13 0-5.77-2.1-6.72-4.93H1.29v3.05A12 12 0 0 0 12 24Z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.35A7.21 7.21 0 0 1 4.9 12c0-.82.13-1.61.38-2.35V6.6H1.29A12 12 0 0 0 0 12c0 1.94.47 3.77 1.29 5.4l3.99-3.05Z"
        />
        <path
          fill="#EA4335"
          d="M12 4.72c1.76 0 3.34.6 4.58 1.78l3.44-3.38C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.29 6.6l3.99 3.05C6.23 6.82 8.87 4.72 12 4.72Z"
        />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Sign up with Facebook',
    mockProfile: {
      providerUserId: 'facebook_998877665544',
      firstName: 'Chidinma',
      lastName: 'Nwosu',
    },
    icon: (
      <span className="auth-social-icon auth-social-icon--facebook" aria-hidden>
        f
      </span>
    ),
  },
  {
    id: 'linkedin',
    label: 'Sign up with LinkedIn',
    mockProfile: {
      providerUserId: 'linkedin_556677889900',
      firstName: 'Ifeoma',
      lastName: 'Eze',
      email: 'ifeoma.eze@example.com',
      avatarUrl: 'https://example.com/mock/linkedin-avatar.jpg',
    },
    icon: (
      <span className="auth-social-icon auth-social-icon--linkedin" aria-hidden>
        in
      </span>
    ),
  },
];

function buildRegisterDefaultValues(
  currentYear: number,
  savedValues?: RegisterDetailsFormValues | null,
): RegisterDetailsFormValues {
  return {
    surname: savedValues?.surname ?? '',
    otherNames: savedValues?.otherNames ?? '',
    nameInSchool: savedValues?.nameInSchool ?? '',
    nickName: savedValues?.nickName ?? '',
    email: savedValues?.email ?? '',
    whatsappPhone: savedValues?.whatsappPhone ?? '',
    graduationYear: savedValues?.graduationYear ?? currentYear,
    password: savedValues?.password ?? '',
    confirmPassword: savedValues?.confirmPassword ?? '',
    voucherId: savedValues?.voucherId ?? '',
    city: savedValues?.city ?? '',
    area: savedValues?.area ?? '',
    // state: 'Lagos',
    residentialAddress: savedValues?.residentialAddress ?? '',
  };
}

export function RegisterDetailsPage() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const savedFlow = useMemo(() => loadRegistrationFlow(), []);

  // ── Cities from API ──────────────────────────────────────────────────────────
  const { data: cities = [], isLoading: isLoadingCities } = useCities();

  // const cityOptions = cities.map((c) => ({
  //   label: c.city,
  //   value: c.city, // store city name string — same as old free-text value
  // }));

  const cityOptions = [...cities]
    .sort((a, b) => a.city.localeCompare(b.city))
    .map((c) => ({
      label: c.city,
      value: c.city,
    }));

  const citiesZoneMapping = cities.reduce(
    (acc, item) => {
      acc[item.city] = {
        zoneId: item.zoneId,
        zone: item.zone,
        chapterId: item.chapterId,
        cityId: item.cityId,
      };

      return acc;
    },
    {} as Record<
      string,
      {
        zoneId: number;
        zone: string;
        chapterId: number;
        cityId: number;
      }
    >,
  );

  useEffect(() => {
    if (savedFlow?.step === 'success') {
      clearRegistrationFlow();
    }
  }, [savedFlow]);

  const graduationYearOptions = Array.from({ length: currentYear - 1966 + 1 }, (_, index) => ({
    label: String(currentYear - index),
    value: String(currentYear - index),
  }));

  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [selectedSocialProvider, setSelectedSocialProvider] = useState<
    SocialSignupProvider['id'] | null
  >(null);
  const [socialAuthResponse, setSocialAuthResponse] = useState<NormalizedSocialAuthResponse | null>(
    null,
  );
  const [socialAuthStatus, setSocialAuthStatus] = useState<string | null>(null);
  const todayDate = new Date().toISOString().split('T')[0];

  const detailForm = useForm<RegisterDetailsFormValues>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: buildRegisterDefaultValues(
      currentYear,
      savedFlow?.step === 'verification' ? savedFlow.formValues : null,
    ),
    mode: 'onChange',
  });

  const passwordValue = detailForm.watch('password') ?? '';
  const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
  const graduationYear = detailForm.watch('graduationYear');
  const cityValue = detailForm.watch('city');
  const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;

  // useEffect(() => {
  //   if (detailForm.getValues('state') !== 'Lagos') {
  //     detailForm.setValue('state', 'Lagos', {
  //       shouldDirty: false,
  //       shouldValidate: true,
  //     });
  //   }
  // }, [detailForm]);

  useEffect(() => {
    const loadVouchers = async () => {
      setIsLoadingVouchers(true);
      const vouchers = await authApi.getVouchers();
      setAllVouchers(vouchers);
      setIsLoadingVouchers(false);
    };

    void loadVouchers();
  }, []);

  useEffect(() => {
    if (graduationYear) {
      const nextVouchers = allVouchers;
      setFilteredVouchers(nextVouchers);

      const currentVoucherId = detailForm.getValues('voucherId');
      if (currentVoucherId) {
        const isValidVoucher = nextVouchers.some(
          (voucher) => String(voucher.id) === currentVoucherId,
        );
        if (!isValidVoucher) {
          detailForm.setValue('voucherId', '');
          detailForm.setError('voucherId', {
            type: 'manual',
            message: 'Please select a voucher for the selected graduation year',
          });
        } else {
          detailForm.clearErrors('voucherId');
        }
      }
    } else {
      setFilteredVouchers([]);
    }
  }, [allVouchers, detailForm, graduationYear]);

  const voucherOptions = filteredVouchers.map((voucher) => ({
    label: `${voucher.fullName} (${voucher.email})`,
    value: String(voucher.id),
  }));

  const selectedSocialProfile = selectedSocialProvider
    ? socialSignupProviders.find((provider) => provider.id === selectedSocialProvider)
    : null;

  const applySocialProfile = (
    provider: SocialSignupProvider,
    profile: NormalizedSocialAuthResponse,
    statusMessage: string,
  ) => {
    detailForm.setValue('otherNames', profile.firstName ?? '', {
      shouldDirty: true,
      shouldValidate: true,
    });
    detailForm.setValue('surname', profile.lastName ?? '', {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (profile.email) {
      detailForm.setValue('email', profile.email, {
        shouldDirty: true,
        shouldValidate: true,
      });
      detailForm.clearErrors('email');
    } else {
      detailForm.setValue('email', '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    setSelectedSocialProvider(provider.id);
    setSocialAuthResponse(profile);
    setSocialAuthStatus(statusMessage);
  };

  const applyMockSocialSignup = (provider: SocialSignupProvider) => {
    applySocialProfile(
      provider,
      {
        provider: provider.id,
        providerUserId: provider.mockProfile.providerUserId,
        firstName: provider.mockProfile.firstName,
        lastName: provider.mockProfile.lastName,
        email: provider.mockProfile.email ?? null,
        emailVerified: Boolean(provider.mockProfile.email),
        avatarUrl: provider.mockProfile.avatarUrl ?? null,
        source: 'mock',
      },
      `${provider.label.replace('Sign up with ', '')} mock profile added${
        provider.mockProfile.email ? ' with verified email.' : '. Add your email below.'
      }`,
    );
  };

  const submitDetails = detailForm.handleSubmit(async (values) => {
    try {
      const response = await authApi.startRegistration(values);

      if (!response.userId) {
        console.error('Registration response did not include user ID:', response);
        detailForm.setError('root', {
          message: 'Server did not return a user ID. Please contact support if this persists.',
        });
        return;
      }

      markInitialVerificationSend(response.userId);

      saveRegistrationFlow({
        step: 'verification',
        formValues: values,
        verificationResponse: response,
        userId: response.userId,
        completionResponse: null,
      });

      navigate(AUTH_ROUTES.REGISTER_VERIFY);
    } catch (error: any) {
      detailForm.setError('root', {
        message: error.message || 'Registration failed. Please try again.',
      });
    }
  });

  return (
    <RegistrationShell step="details">
      <form
        className="auth-form auth-form--registration-details"
        onSubmit={submitDetails}
        noValidate
      >
        <div className="auth-social-signup" aria-label="Social sign up options">
          <div className="auth-social-signup__buttons">
            {socialSignupProviders.map((provider) => (
              <button
                key={provider.id}
                type="button"
                className={`auth-social-button ${
                  selectedSocialProvider === provider.id ? 'auth-social-button--selected' : ''
                }`}
                aria-label={provider.label}
                aria-pressed={selectedSocialProvider === provider.id}
                onClick={() => applyMockSocialSignup(provider)}
              >
                {provider.icon}
                <span className="auth-social-button__text">{provider.label}</span>
              </button>
            ))}
          </div>

          {socialAuthStatus ? (
            <div className="auth-social-status-panel" aria-live="polite">
              <p className="auth-social-status">{socialAuthStatus}</p>
              {socialAuthResponse ? (
                <pre className="auth-social-response-preview">
                  {JSON.stringify(socialAuthResponse, null, 2)}
                </pre>
              ) : null}
            </div>
          ) : null}

          <div className="auth-social-divider" aria-hidden="true">
            <span />
            <p>or</p>
            <span />
          </div>
        </div>

        <div className="auth-form-grid auth-form-grid--two">
          <FormInput
            label="First Name"
            required
            id="otherNames"
            placeholder="e.g. Adaeze"
            error={detailForm.formState.errors.otherNames?.message}
            {...detailForm.register('otherNames')}
          />
          <FormInput
            label="Last Name"
            id="surname"
            required
            placeholder="e.g. Okonkwo"
            error={detailForm.formState.errors.surname?.message}
            {...detailForm.register('surname')}
          />
        </div>

        <div className="auth-form-grid auth-form-grid--two">
          <FormInput
            label="Maiden Name"
            id="nameInSchool"
            required
            placeholder="Ezegburu"
            hint=""
            error={detailForm.formState.errors.nameInSchool?.message}
            {...detailForm.register('nameInSchool')}
          />
          <FormInput
            label="Nickname in School"
            id="nickName"
            placeholder="MJ"
            hint=""
            error={detailForm.formState.errors.nickName?.message}
            {...detailForm.register('nickName')}
          />
        </div>

        <div className="auth-form-grid auth-form-grid--two">
          <FormInput
            label="Email Address"
            id="email"
            required
            type="email"
            placeholder="you@example.com"
            readOnly={Boolean(socialAuthResponse?.emailVerified)}
            hint={
              socialAuthResponse?.emailVerified && selectedSocialProfile
                ? `${selectedSocialProfile.label.replace('Sign up with ', '')} email verified`
                : undefined
            }
            error={detailForm.formState.errors.email?.message}
            {...detailForm.register('email')}
          />

          <DatePicker
            label="Date of Birth"
            id="birthDate"
            value={birthDate}
            max={todayDate}
            placeholder="Select date of birth"
            onValueChange={setBirthDate}
          />
        </div>

        <PasswordInput
          label="Password"
          id="password"
          disableCopy
          required
          autoComplete="new-password"
          placeholder="Create a secure password"
          error={detailForm.formState.errors.password?.message}
          {...detailForm.register('password')}
        />

        <div>
          <PasswordInput
            label="Confirm Password"
            id="confirmPassword"
            disablePaste
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            error={detailForm.formState.errors.confirmPassword?.message}
            {...detailForm.register('confirmPassword')}
          />
          {!detailForm.formState.errors.confirmPassword && confirmPasswordValue ? (
            <p
              className={`auth-field-hint ${
                passwordsMatch ? 'auth-field-hint--success' : 'auth-field-hint--muted'
              }`}
            >
              {passwordsMatch ? 'Passwords match' : 'Passwords must match exactly'}
            </p>
          ) : null}
        </div>

        {passwordValue && <PasswordStrengthMeter password={passwordValue} />}

        <div className="auth-phone-field">
          <PhoneNumberInput
            label="WhatsApp Phone Number"
            id="whatsappPhone"
            required
            placeholder={NIGERIAN_PHONE_PLACEHOLDER}
            hint="Enter your 11-digit Nigerian phone number starting with 0"
            error={detailForm.formState.errors.whatsappPhone?.message}
            {...detailForm.register('whatsappPhone')}
          />
        </div>

        <div className="auth-form-grid auth-form-grid--two">
          {/* <TextareaInput
          label="Street Name and Address"
          id="residentialAddress"
          required
          rows={5}
          placeholder=""
          error={detailForm.formState.errors.residentialAddress?.message}
          {...detailForm.register('residentialAddress')}
        /> */}
          <FormInput
            label="Street Name and Address"
            id="residentialAddress"
            required
            placeholder=""
            error={detailForm.formState.errors.residentialAddress?.message}
            {...detailForm.register('residentialAddress')}
          />

          <FormInput
            label="Area"
            id="area"
            required
            type="text"
            placeholder=""
            error={detailForm.formState.errors.area?.message}
            {...detailForm.register('area')}
          />
        </div>

        <div className="auth-form-grid auth-form-grid--two">
          {/* <SelectInput
            label="State of Residence"
            id="state"
            required
            options={stateOptions}
            placeholder="Lagos"
            error={detailForm.formState.errors.state?.message}
            value={detailForm.watch('state') || 'Lagos'}
            disabled
            onChange={(e) => {
              detailForm.setValue('state', e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            onBlur={() => detailForm.trigger('state')}
          /> */}

          {/* ── CHANGED: city is now a dropdown backed by the API ── */}
          <SelectInput
            label="City"
            id="city"
            required
            options={cityOptions}
            placeholder={isLoadingCities ? 'Loading cities...' : 'Select your city'}
            disabled={isLoadingCities}
            error={detailForm.formState.errors.city?.message}
            value={cityValue || ''}
            onChange={(e) => {
              detailForm.setValue('city', e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            onBlur={() => detailForm.trigger('city')}
          />
          <FormInput
            label="Zone"
            id="zone"
            type="text"
            placeholder=""
            disabled
            value={citiesZoneMapping[cityValue]?.zone ?? ''}
          />
        </div>

        <SelectInput
          label="Year of Graduation from FGGC Owerri"
          id="graduationYear"
          required
          options={graduationYearOptions}
          placeholder="Select Graduation Year"
          error={detailForm.formState.errors.graduationYear?.message}
          value={detailForm.watch('graduationYear')?.toString() || ''}
          onChange={(event) => {
            detailForm.setValue('graduationYear', parseInt(event.target.value, 10), {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          onBlur={() => detailForm.trigger('graduationYear')}
        />

        <SelectInput
          label="Voucher (Someone to approve your registration)"
          id="voucherId"
          required
          options={voucherOptions}
          placeholder={
            isLoadingVouchers
              ? 'Loading vouchers...'
              : filteredVouchers.length === 0 && graduationYear
                ? 'No vouchers available for this graduation year'
                : 'Select a voucher'
          }
          error={detailForm.formState.errors.voucherId?.message}
          disabled={isLoadingVouchers || filteredVouchers.length === 0}
          hint="Select a member who will vouch for you"
          value={detailForm.watch('voucherId') || ''}
          onChange={(event) => {
            detailForm.setValue('voucherId', event.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          onBlur={() => detailForm.trigger('voucherId')}
        />

        {detailForm.formState.errors.root && (
          <div className="auth-alert auth-alert--error">
            <p>{detailForm.formState.errors.root.message}</p>
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          loading={detailForm.formState.isSubmitting}
          rightIcon={detailForm.formState.isSubmitting ? undefined : 'mdi:arrow-right'}
          className="auth-submit-button rounded-full"
        >
          {detailForm.formState.isSubmitting ? 'Checking...' : 'Continue'}
        </Button>

        <p className="auth-card__footer-text auth-card__footer-text--compact">
          Already have an account?{' '}
          <AppLink href={AUTH_ROUTES.LOGIN} className="auth-card__footer-link">
            Login
          </AppLink>
        </p>
      </form>
    </RegistrationShell>
  );
}
