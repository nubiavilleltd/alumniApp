import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { PasswordInput } from '@/shared/components/ui/input/PasswordInput';
import { SelectInput } from '@/shared/components/ui/SelectInput';
import { authApi } from '../services/auth.service';
import {
  defaultPhoneCountry,
  getPhoneCountryOption,
  normalizeNationalPhoneNumber,
  phoneCountryOptions,
  type SupportedPhoneCountry,
} from '../constants/phoneCountries';
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

const stateOptions = NIGERIA_STATES.map((state) => ({
  label: state,
  value: state,
}));

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
    phoneCountry: savedValues?.phoneCountry ?? defaultPhoneCountry,
    whatsappPhone: savedValues?.whatsappPhone ?? '',
    graduationYear: savedValues?.graduationYear ?? currentYear,
    password: savedValues?.password ?? '',
    confirmPassword: savedValues?.confirmPassword ?? '',
    voucherId: savedValues?.voucherId ?? '',
    city: savedValues?.city ?? '',
    state: savedValues?.state ?? 'Lagos',
    residentialAddress: savedValues?.residentialAddress ?? '',
  };
}

export function RegisterDetailsPage() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const savedFlow = useMemo(() => loadRegistrationFlow(), []);

  useEffect(() => {
    if (savedFlow?.step === 'success') {
      clearRegistrationFlow();
    }
  }, [savedFlow]);

  const graduationYearOptions = Array.from({ length: currentYear - 1966 + 1 }, (_, index) => ({
    label: String(currentYear - index),
    value: String(currentYear - index),
  }));

  const phoneCountrySelectOptions = phoneCountryOptions.map((option) => ({
    label: `${option.dialCode} (${option.label})`,
    value: option.code,
  }));

  const [allVouchers, setAllVouchers] = useState<Voucher[]>([]);
  const [filteredVouchers, setFilteredVouchers] = useState<Voucher[]>([]);
  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  const detailForm = useForm<RegisterDetailsFormValues>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: buildRegisterDefaultValues(
      currentYear,
      savedFlow?.step === 'verification' ? savedFlow.formValues : null,
    ),
    mode: 'onChange',
  });

  const passwordValue = detailForm.watch('password') ?? '';
  const phoneCountry = detailForm.watch('phoneCountry') ?? defaultPhoneCountry;
  const confirmPasswordValue = detailForm.watch('confirmPassword') ?? '';
  const graduationYear = detailForm.watch('graduationYear');
  const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;
  const selectedPhoneCountry = getPhoneCountryOption(phoneCountry);

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
      //We would set up voucher filtering based on graduation year. However, due to the current lack of vouchers in the system, we will not implement this filtering for now. Once there are vouchers available, we can easily enable this filtering by uncommenting the relevant code below and removing the line that sets all vouchers as filtered.

      // const nextVouchers = allVouchers.filter(
      //   (voucher) => Number(voucher.graduationYeßar) === graduationYear,
      // );
      // setFilteredVouchers(nextVouchers);

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

  const phoneCountryRegistration = detailForm.register('phoneCountry', {
    onChange: (event) => {
      const nextCode = event.target.value as SupportedPhoneCountry;
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
    onChange: (event) => {
      event.target.value = normalizeNationalPhoneNumber(event.target.value).slice(
        0,
        selectedPhoneCountry.maxLength,
      );
    },
  });

  const voucherOptions = filteredVouchers.map((voucher) => ({
    label: `${voucher.fullName} (${voucher.email})`,
    value: String(voucher.id),
  }));

  const submitDetails = detailForm.handleSubmit(async (values) => {
    try {
      console.log('ready');
      console.log('set');
      const response = await authApi.startRegistration(values);
      console.log('go');
      console.log('responding');
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
        <div className="auth-form-grid auth-form-grid--two">
          <FormInput
            label="Surname"
            id="surname"
            required
            placeholder="e.g. Okonkwo"
            error={detailForm.formState.errors.surname?.message}
            {...detailForm.register('surname')}
          />
          <FormInput
            label="Other Names"
            required
            id="otherNames"
            placeholder="e.g. Adaeze"
            error={detailForm.formState.errors.otherNames?.message}
            {...detailForm.register('otherNames')}
          />
        </div>

        <div className="auth-form-grid auth-form-grid--two">
          <FormInput
            label="Maiden Name"
            id="nameInSchool"
            required
            placeholder=""
            hint=""
            error={detailForm.formState.errors.nameInSchool?.message}
            {...detailForm.register('nameInSchool')}
          />
          <FormInput
            label="Nickname"
            id="nickName"
            required
            placeholder=""
            hint=""
            error={detailForm.formState.errors.nickName?.message}
            {...detailForm.register('nickName')}
          />
        </div>

        <FormInput
          label="Email Address"
          id="email"
          required
          type="email"
          placeholder="you@example.com"
          error={detailForm.formState.errors.email?.message}
          {...detailForm.register('email')}
        />

        <PasswordInput
          label="Password"
          id="password"
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
          <label className="auth-field-label">
            WhatsApp Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="auth-phone-grid">
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
          <p className="auth-field-hint auth-field-hint--muted">
            Enter number without country code
          </p>
        </div>

        <TextareaInput
          label="Residential Address"
          id="residentialAddress"
          rows={5}
          placeholder=""
          error={detailForm.formState.errors.residentialAddress?.message}
          {...detailForm.register('residentialAddress')}
        />

        <div className="auth-form-grid auth-form-grid--two">
          <SelectInput
            label="State of Residence"
            id="state"
            required
            options={stateOptions}
            placeholder="Select your state"
            error={detailForm.formState.errors.state?.message}
            value={detailForm.watch('state') || 'Lagos'}
            onChange={(e) => {
              detailForm.setValue('state', e.target.value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
            onBlur={() => detailForm.trigger('state')}
          />

          <FormInput
            label="City"
            id="city"
            placeholder="e.g. Ikeja"
            error={detailForm.formState.errors.city?.message}
            {...detailForm.register('city')}
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

        <button
          type="submit"
          disabled={detailForm.formState.isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2 auth-submit-button"
        >
          {detailForm.formState.isSubmitting ? (
            <>
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" /> Checking...
            </>
          ) : (
            <>
              Continue <Icon icon="mdi:arrow-right" className="w-4 h-4" />
            </>
          )}
        </button>

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
