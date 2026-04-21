import { Icon } from '@iconify/react';
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
    <RegistrationShell step="verification">
      <div className="auth-verification">
        <p className="auth-verification__copy">Please enter the code we sent to your email.</p>

        <form className="auth-form" onSubmit={submitVerification}>
          <fieldset className="auth-code-fieldset">
            <legend className="auth-visually-hidden">Verification code</legend>
            <div
              className="auth-code-inputs"
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
                  className="auth-code-input"
                  onChange={(event) => handleCodeInput(index, event.target.value)}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                  onPaste={(event) => handleCodePaste(index, event)}
                  onFocus={(event) => event.currentTarget.select()}
                />
              ))}
            </div>
            {codeErrorMessage && (
              <p id="verification-code-error" className="auth-field-error auth-code-error">
                {codeErrorMessage}
              </p>
            )}
          </fieldset>

          {verificationForm.formState.errors.root && (
            <div className="auth-alert auth-alert--error">
              <p>{verificationForm.formState.errors.root.message}</p>
            </div>
          )}

          <div className="auth-verification__resend-row">
            <span>Didn't receive a code?</span>
            <button
              type="button"
              onClick={resendCode}
              disabled={
                verificationForm.formState.isSubmitting ||
                resendStatus.isCoolingDown ||
                resendStatus.isBlocked
              }
              className="auth-verification__resend-button"
            >
              {resendStatus.isBlocked ? 'Try again' : 'Resend Code'}
            </button>
            {resendCountdown && (
              <span className="auth-verification__resend-time">({resendCountdown})</span>
            )}
          </div>

          {resendStatusMessage && <p className="auth-status-note">{resendStatusMessage}</p>}

          <button
            type="submit"
            disabled={verificationForm.formState.isSubmitting}
            className="btn btn-primary flex items-center justify-center gap-2 auth-submit-button auth-verification__submit"
          >
            {verificationForm.formState.isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" /> Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
        </form>
      </div>
    </RegistrationShell>
  );
}
