import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { authApi } from '../api/authApi';
import { resetPasswordSchema } from '../schemas/authSchema';
import type { ResetPasswordFormValues } from '../types/auth.types';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { AuthCard } from './AuthCard';

// ─── Reusable password field ──────────────────────────────────────────────────
function PasswordField({
  label,
  placeholder,
  error,
  show,
  onToggle,
  registration,
}: {
  label: string;
  placeholder: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  registration: object;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={placeholder}
          className={`input pr-10 ${error ? 'border-red-400' : ''}`}
          {...registration}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Icon icon={show ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token')?.trim() ?? '';
  const email = searchParams.get('email')?.trim() ?? '';
  const hasValidLink = token.length > 0;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = form.watch('password') ?? '';
  const confirmPasswordValue = form.watch('confirmPassword') ?? '';
  const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await authApi.resetPassword({ token, email: email || undefined, password: values.password });
      setSuccess(true);
    } catch (error) {
      form.setError('password', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Password reset could not be completed',
      });
    }
  });

  // ── Invalid link ───────────────────────────────────────────────────────────
  if (!hasValidLink) {
    return (
      <AuthCard title="Invalid" titleAccent="Link">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="mdi:link-off" className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            This reset link is missing or invalid. Please request a new password reset email.
          </p>
          <AppLink
            href="/auth/forgot-password"
            className="btn btn-primary w-full block text-center"
          >
            Request reset email
          </AppLink>
          <AppLink
            href="/auth/login"
            className="block text-sm text-center text-gray-500 hover:text-primary-500"
          >
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
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="mdi:check-circle-outline" className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your password has been updated successfully. You can now sign in with your new password.
          </p>
          <AppLink href="/auth/login" className="btn btn-primary w-full block text-center">
            Go to login
          </AppLink>
        </div>
      </AuthCard>
    );
  }

  // ── Reset form ─────────────────────────────────────────────────────────────
  return (
    <AuthCard
      title="Reset"
      titleAccent="Password"
      subtitle={
        email
          ? `Setting a new password for ${email}`
          : 'Create a new secure password for your account.'
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <PasswordField
          label="New Password"
          placeholder="Create a secure password"
          error={form.formState.errors.password?.message}
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          registration={form.register('password')}
        />

        <div>
          <PasswordField
            label="Confirm Password"
            placeholder="Re-enter your new password"
            error={form.formState.errors.confirmPassword?.message}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((v) => !v)}
            registration={form.register('confirmPassword')}
          />
          {!form.formState.errors.confirmPassword && confirmPasswordValue && (
            <p
              className={`mt-1.5 text-xs ${passwordsMatch ? 'text-primary-600' : 'text-gray-400'}`}
            >
              {passwordsMatch ? '✓ Passwords match' : 'Passwords must match exactly'}
            </p>
          )}
        </div>

        {passwordValue && <PasswordStrengthMeter password={passwordValue} />}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {form.formState.isSubmitting ? (
            <>
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </button>

        <AppLink
          href="/auth/login"
          className="block text-sm text-center text-gray-500 hover:text-primary-500"
        >
          Back to login
        </AppLink>
      </form>
    </AuthCard>
  );
}
