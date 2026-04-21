import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { authApi } from '../services/auth.service';
import { forgotPasswordSchema } from '../schemas/authSchema';
import type { ForgotPasswordFormValues, ForgotPasswordResponse } from '../types/auth.types';
import { AuthCard } from './AuthCard';
import { AUTH_ROUTES } from '../routes';
import { ROUTES } from '@/shared/constants/routes';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ForgotPasswordResponse | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await authApi.requestPasswordReset(values);
      setResult(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send reset email. Please try again.';
      setError('email', { type: 'manual', message });
    }
  });

  if (result) {
    return (
      <AuthCard title="Email" titleAccent="Sent">
        <div className="auth-message-panel">
          <div className="auth-message-panel__icon">
            <Icon icon="mdi:email-check-outline" />
          </div>
          <p className="auth-message-panel__copy">
            We have sent an email to the address associated with your account. Please check your
            inbox for further instructions on how to reset your password.
          </p>
          <div className="auth-message-panel__note">
            Please check your spam/junk folder if the email is not in your inbox
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.HOME)}
            className="btn btn-primary w-full auth-submit-button"
          >
            Return Home
          </button>
          <AppLink href={AUTH_ROUTES.LOGIN} className="auth-form-link auth-form-link--center">
            Back to login
          </AppLink>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot Password"
      subtitle="Enter the email address associated with your account. We'll send you instructions on how to reset your password."
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          error={errors.email?.message}
          {...register('email')}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2 auth-submit-button"
        >
          {isSubmitting ? (
            <>
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
        <AppLink href={AUTH_ROUTES.LOGIN} className="auth-form-link auth-form-link--center">
          Back to login
        </AppLink>
      </form>
    </AuthCard>
  );
}
