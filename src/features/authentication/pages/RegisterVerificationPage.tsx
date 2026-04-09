import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { authApi } from '../services/auth.service';
import { formatPhoneNumberWithCountryCode } from '../constants/phoneCountries';
import { emailVerificationSchema } from '../schemas/authSchema';
import type { EmailVerificationFormValues } from '../types/auth.types';
import { RegistrationShell } from '../components/RegistrationShell';
import { AUTH_ROUTES } from '../routes';
import { loadRegistrationFlow, saveRegistrationFlow } from '../lib/registrationFlow';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  formatVerificationResendDuration,
  getVerificationResendStatus,
  recordVerificationResendAttempt,
} from '../lib/verificationResendThrottle';

export function RegisterVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flow = loadRegistrationFlow();
  const [resendMessage, setResendMessage] = useState('');
  const verificationEmail = flow?.formValues?.email ?? searchParams.get('email') ?? '';
  const verificationUserId = flow?.userId ?? searchParams.get('userId') ?? '';
  const cameFromLogin = searchParams.get('source') === 'login';
  const hasRegistrationDetails = !!flow?.formValues;
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const resendStatus = useMemo(
    () => getVerificationResendStatus(verificationUserId, timerNow),
    [timerNow, verificationUserId],
  );

  const verificationForm = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    setTimerNow(Date.now());
  }, [verificationUserId]);

  useEffect(() => {
    if (!resendStatus.isCoolingDown && !resendStatus.isBlocked) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimerNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendStatus.isBlocked, resendStatus.isCoolingDown]);

  if (!verificationEmail || !verificationUserId) {
    return <Navigate to={AUTH_ROUTES.REGISTER} replace />;
  }

  if (flow?.step === 'success' && flow.completionResponse) {
    return <Navigate to={AUTH_ROUTES.REGISTER_SUCCESS} replace />;
  }

  const submitVerification = verificationForm.handleSubmit(async ({ code }) => {
    try {
      const response = await authApi.verifyRegistrationEmail({
        email: verificationEmail,
        code,
        userId: verificationUserId,
      });

      saveRegistrationFlow({
        ...(flow ?? {
          step: 'verification' as const,
          formValues: null,
          verificationResponse: null,
          userId: verificationUserId,
          completionResponse: null,
        }),
        step: 'success',
        userId: verificationUserId,
        completionResponse: response,
      });

      navigate(AUTH_ROUTES.REGISTER_SUCCESS, { replace: true });
    } catch (error: any) {
      verificationForm.setValue('code', '');
      verificationForm.setError('code', {
        type: 'manual',
        message: error.message || 'Invalid verification code. Please try again.',
      });
    }
  });

  const resendCode = async () => {
    const status = getVerificationResendStatus(verificationUserId);

    if (status.isBlocked) {
      setResendMessage(
        `You have used all ${status.attempts} resend attempts. Try again in ${formatVerificationResendDuration(status.blockRemainingMs)}.`,
      );
      setTimerNow(Date.now());
      return;
    }

    if (status.isCoolingDown) {
      setResendMessage(
        `You can resend another code in ${formatVerificationResendDuration(status.cooldownRemainingMs)}.`,
      );
      setTimerNow(Date.now());
      return;
    }

    if (!status.canCallApi) {
      setResendMessage('You cannot request another code right now. Please try again later.');
      return;
    }

    try {
      recordVerificationResendAttempt(verificationUserId);
      setTimerNow(Date.now());
      const responseMessage = await authApi.resendVerificationEmail({
        email: verificationEmail,
        userId: verificationUserId,
      });
      verificationForm.reset({ code: '' });
      setResendMessage(responseMessage);
    } catch (error: any) {
      setResendMessage(error.message || 'Failed to resend. Please try again.');
    }
  };

  const resendButtonLabel = resendStatus.isBlocked
    ? `Try again in ${formatVerificationResendDuration(resendStatus.blockRemainingMs)}`
    : resendStatus.isCoolingDown
      ? `Resend in ${formatVerificationResendDuration(resendStatus.cooldownRemainingMs)}`
      : 'Resend code';

  const resendStatusMessage = resendStatus.isBlocked
    ? `You have used all ${resendStatus.attempts} resend attempts. You can request another code in ${formatVerificationResendDuration(resendStatus.blockRemainingMs)}.`
    : resendStatus.isCoolingDown
      ? `You can request another code in ${formatVerificationResendDuration(resendStatus.cooldownRemainingMs)}.`
      : `You have ${resendStatus.attemptsRemaining} resend ${resendStatus.attemptsRemaining === 1 ? 'try' : 'tries'} left.`;

  return (
    <RegistrationShell step="verification">
      <div className="space-y-5">
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-primary-800 mb-1">Check your inbox</p>
          <p className="text-xs text-primary-700 leading-relaxed">
            {flow?.verificationResponse?.message ??
              (cameFromLogin
                ? 'Your email is not verified yet. Enter the verification code we sent to your inbox.'
                : 'We sent a verification code to your email.')}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5 text-sm">
          {(hasRegistrationDetails
            ? [
                {
                  label: 'Full name',
                  value: `${flow.formValues!.otherNames} ${flow.formValues!.surname}`,
                },
                { label: 'Nickname', value: flow.formValues!.nameInSchool },
                { label: 'Email', value: flow.formValues!.email },
                {
                  label: 'WhatsApp',
                  value: formatPhoneNumberWithCountryCode(
                    flow.formValues!.phoneCountry,
                    flow.formValues!.whatsappPhone,
                  ),
                },
                { label: 'Graduation year', value: String(flow.formValues!.graduationYear) },
              ]
            : [{ label: 'Email', value: verificationEmail }]
          ).map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">
                {value}
              </span>
            </div>
          ))}
          {hasRegistrationDetails ? (
            <button
              type="button"
              onClick={() => navigate(AUTH_ROUTES.REGISTER)}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium pt-1"
            >
              ← Edit details
            </button>
          ) : null}
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
            className="text-center text-lg"
            {...verificationForm.register('code')}
          />

          {verificationForm.formState.errors.root && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm text-red-600">
                {verificationForm.formState.errors.root.message}
              </p>
            </div>
          )}

          {resendMessage && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{resendMessage}</p>
          )}

          <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
            {resendStatusMessage}
          </p>

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
              disabled={
                verificationForm.formState.isSubmitting ||
                resendStatus.isCoolingDown ||
                resendStatus.isBlocked
              }
              className="btn btn-outline flex-1"
            >
              {resendButtonLabel}
            </button>
          </div>
        </form>
      </div>
    </RegistrationShell>
  );
}
