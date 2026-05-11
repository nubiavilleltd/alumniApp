// features/authentication/pages/RegisterDetailsPage.tsx
// MODIFIED: city field changed from free-text FormInput to a SelectInput
// backed by useCities(). The selected city's name is stored in the form
// (and ultimately sent to the backend) exactly as before — only the UI changes.

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Button } from '@/shared/components/ui/Button';
import { FormInput } from '@/shared/components/ui/input/FormInput';
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
