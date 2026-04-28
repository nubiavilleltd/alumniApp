import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { Button, ButtonLink } from '@/shared/components/ui/Button';
import { PasswordInput } from '@/shared/components/ui/input/PasswordInput';
import { resetPasswordSchema } from '../schemas/authSchema';
import type { ResetPasswordFormValues } from '../types/auth.types';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { AuthCard } from './AuthCard';
import { AUTH_ROUTES } from '../routes';
import { authApi } from '../services/auth.service';

// ─── Main component ───────────────────────────────────────────────────────────

export function ResetPasswordForm() {
  // Code comes from the URL path: /auth/reset-password/:code
  const { code = '' } = useParams<{ code: string }>();
  const hasValidLink = code.trim().length > 0;

  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = form.watch('password') ?? '';
  const confirmPasswordValue = form.watch('confirmPassword') ?? '';
  const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await authApi.resetPassword({
        token: code, // the URL path code
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setSuccess(true);
    } catch (error) {
      form.setError('password', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Password reset could not be completed.',
      });
    }
  });

  // ── Invalid / missing link ─────────────────────────────────────────────────

  if (!hasValidLink) {
    return (
      <AuthCard title="Invalid" titleAccent="Link">
        <div className="auth-message-panel">
          <div className="auth-message-panel__icon auth-message-panel__icon--danger">
            <Icon icon="mdi:link-off" />
          </div>
          <p className="auth-message-panel__copy">
            This reset link is missing or invalid. Please request a new password reset email.
          </p>
          <ButtonLink
            href={AUTH_ROUTES.FORGOT_PASSWORD}
            fullWidth
            className="auth-submit-button rounded-full"
          >
            Request reset email
          </ButtonLink>
          <AppLink href={AUTH_ROUTES.LOGIN} className="auth-form-link auth-form-link--center">
            Back to login
          </AppLink>
        </div>
      </AuthCard>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────

  if (success) {
    return (
      <AuthCard title="Password" titleAccent="Updated">
        <div className="auth-message-panel">
          <div className="auth-message-panel__icon">
            <Icon icon="mdi:check-circle-outline" />
          </div>
          <p className="auth-message-panel__copy">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <ButtonLink
            href={AUTH_ROUTES.LOGIN}
            fullWidth
            className="auth-submit-button rounded-full"
          >
            Go to login
          </ButtonLink>
        </div>
      </AuthCard>
    );
  }

  // ── Reset form ─────────────────────────────────────────────────────────────

  return (
    <AuthCard
      title="Reset"
      titleAccent="Password"
      subtitle="Create a new secure password for your account."
    >
      <form className="auth-form" onSubmit={onSubmit}>
        <PasswordInput
          label="New Password"
          id="password"
          autoComplete="new-password"
          placeholder="Create a secure password"
          error={form.formState.errors.password?.message}
          {...form.register('password')}
        />

        <div>
          <PasswordInput
            label="Confirm Password"
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register('confirmPassword')}
          />
          {!form.formState.errors.confirmPassword && confirmPasswordValue && (
            <p
              className={`auth-field-hint ${
                passwordsMatch ? 'auth-field-hint--success' : 'auth-field-hint--muted'
              }`}
            >
              {passwordsMatch ? 'Passwords match' : 'Passwords must match exactly'}
            </p>
          )}
        </div>

        {passwordValue && <PasswordStrengthMeter password={passwordValue} />}

        <Button
          type="submit"
          fullWidth
          loading={form.formState.isSubmitting}
          className="auth-submit-button rounded-full"
        >
          {form.formState.isSubmitting ? 'Updating...' : 'Update Password'}
        </Button>

        <AppLink href={AUTH_ROUTES.LOGIN} className="auth-form-link auth-form-link--center">
          Back to login
        </AppLink>
      </form>
    </AuthCard>
  );
}
