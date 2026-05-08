import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { authApi } from '../services/auth.service';
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

const VERIFICATION_CODE_LENGTH = 6;

export function RegisterVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flow = loadRegistrationFlow();
  const [resendMessage, setResendMessage] = useState('');
  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const verificationEmail = flow?.formValues?.email ?? searchParams.get('email') ?? '';
  const verificationUserId = flow?.userId ?? searchParams.get('userId') ?? '';
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const resendStatus = useMemo(
    () => getVerificationResendStatus(verificationUserId, timerNow),
    [timerNow, verificationUserId],
  );

  const verificationForm = useForm<EmailVerificationFormValues>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { code: '' },
  });

  const verificationCode = verificationForm.watch('code') ?? '';
  const codeDigits = Array.from(
    { length: VERIFICATION_CODE_LENGTH },
    (_, index) => verificationCode[index] ?? '',
  );
  const codeErrorMessage = verificationForm.formState.errors.code?.message;

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

  const resendCountdown = resendStatus.isBlocked
    ? formatVerificationResendDuration(resendStatus.blockRemainingMs)
    : resendStatus.isCoolingDown
      ? formatVerificationResendDuration(resendStatus.cooldownRemainingMs)
      : '';

  const resendStatusMessage = resendMessage
    ? resendMessage
    : resendStatus.isBlocked
      ? `You have used all ${resendStatus.attempts} resend attempts. You can request another code in ${formatVerificationResendDuration(resendStatus.blockRemainingMs)}.`
      : '';

  const focusCodeInput = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(VERIFICATION_CODE_LENGTH - 1, index));
    const input = codeInputRefs.current[boundedIndex];

    if (!input) return;

    input.focus();
    input.select();
  };

  const getCurrentDigits = () =>
    Array.from(
      { length: VERIFICATION_CODE_LENGTH },
      (_, index) => verificationForm.getValues('code')?.[index] ?? '',
    );

  const updateVerificationCode = (digits: string[]) => {
    const nextCode = digits.join('').replace(/\D/g, '').slice(0, VERIFICATION_CODE_LENGTH);

    verificationForm.setValue('code', nextCode, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: nextCode.length === VERIFICATION_CODE_LENGTH,
    });

    if (nextCode.length > 0) {
      verificationForm.clearErrors('code');
    }

    return nextCode;
  };

  const handleCodeInput = (index: number, rawValue: string) => {
    const inputDigits = rawValue.replace(/\D/g, '');
    const nextDigits = getCurrentDigits();

    if (!inputDigits) {
      nextDigits[index] = '';
      updateVerificationCode(nextDigits);
      return;
    }

    inputDigits
      .slice(0, VERIFICATION_CODE_LENGTH - index)
      .split('')
      .forEach((digit, offset) => {
        nextDigits[index + offset] = digit;
      });

    const nextCode = updateVerificationCode(nextDigits);

    if (nextCode.length >= VERIFICATION_CODE_LENGTH) {
      codeInputRefs.current[VERIFICATION_CODE_LENGTH - 1]?.blur();
      return;
    }

    window.requestAnimationFrame(() =>
      focusCodeInput(Math.min(index + inputDigits.length, VERIFICATION_CODE_LENGTH - 1)),
    );
  };

  const handleCodeKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusCodeInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < VERIFICATION_CODE_LENGTH - 1) {
      event.preventDefault();
      focusCodeInput(index + 1);
      return;
    }

    if (event.key !== 'Backspace' && event.key !== 'Delete') {
      return;
    }

    event.preventDefault();

    const nextDigits = getCurrentDigits();
    const deleteIndex = nextDigits[index] || event.key === 'Delete' ? index : index - 1;

    if (deleteIndex < 0) return;

    nextDigits.splice(deleteIndex, 1);
    nextDigits.push('');
    updateVerificationCode(nextDigits);
    window.requestAnimationFrame(() => focusCodeInput(deleteIndex));
  };

  const handleCodePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    handleCodeInput(index, event.clipboardData.getData('text'));
  };

  return (
    <RegistrationShell
      step="verification"
      cardClassName="!w-full !max-w-[36rem] !rounded-[1.5rem] !px-5 !py-5 sm:!px-7 sm:!py-7 md:!px-8 md:!py-8"
      headerClassName="!mb-4 sm:!mb-5"
      stepperClassName="!mb-5 !gap-3 sm:!mb-6"
      stepCountClassName="!text-base sm:!text-[1.05rem]"
      stepLabelClassName="!text-[1.55rem] sm:!text-[1.7rem]"
      stepDotsClassName="!gap-1.5"
    >
      <div className="mx-auto flex w-full max-w-[26rem] flex-col gap-5 sm:gap-6">
        <p className="m-0 text-sm leading-6 text-gray-500 sm:text-[0.98rem]">
          Please enter the code we sent to your email.
        </p>

        <form className="flex flex-col gap-5 sm:gap-6" onSubmit={submitVerification}>
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="sr-only">Verification code</legend>
            <div
              className="grid grid-cols-6 gap-2 sm:gap-2.5"
              aria-describedby={codeErrorMessage ? 'verification-code-error' : undefined}
            >
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    codeInputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  value={digit}
                  placeholder="-"
                  aria-label={`Verification code digit ${index + 1} of ${VERIFICATION_CODE_LENGTH}`}
                  aria-invalid={codeErrorMessage ? 'true' : 'false'}
                  className="h-12 w-full rounded-full border border-transparent bg-[#f8f8f7] text-center text-[1.2rem] font-medium text-[#071116] outline-none caret-primary-500 transition focus:border-primary-200 focus:ring-4 focus:ring-primary-100 sm:h-14 sm:text-[1.45rem]"
                  onChange={(event) => handleCodeInput(index, event.target.value)}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                  onPaste={(event) => handleCodePaste(index, event)}
                  onFocus={(event) => event.currentTarget.select()}
                />
              ))}
            </div>
            {codeErrorMessage && (
              <p
                id="verification-code-error"
                className="mt-2.5 text-center text-sm font-medium text-red-500"
              >
                {codeErrorMessage}
              </p>
            )}
          </fieldset>

          {verificationForm.formState.errors.root && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              <p>{verificationForm.formState.errors.root.message}</p>
            </div>
          )}

          <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-1 text-center text-sm font-semibold text-gray-500">
            <span>Didn't receive a code?</span>
            <button
              type="button"
              onClick={resendCode}
              disabled={
                verificationForm.formState.isSubmitting ||
                resendStatus.isCoolingDown ||
                resendStatus.isBlocked
              }
              className="bg-transparent p-0 font-bold text-primary-500 transition-colors hover:text-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resendStatus.isBlocked ? 'Try again' : 'Resend Code'}
            </button>
            {resendCountdown && <span className="text-gray-500">({resendCountdown})</span>}
          </div>

          {resendStatusMessage && (
            <p className="rounded-2xl bg-[#f8f8f7] px-4 py-3 text-sm font-medium leading-6 text-gray-500">
              {resendStatusMessage}
            </p>
          )}

          <Button
            type="submit"
            loading={verificationForm.formState.isSubmitting}
            fullWidth
            className="!min-h-0 !rounded-full !px-6 !py-3 !text-sm sm:!py-3.5"
          >
            {verificationForm.formState.isSubmitting ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>
      </div>
    </RegistrationShell>
  );
}
