import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppLink } from '@/shared/components/ui/AppLink';
import { authApi } from '../api/authApi';
import { forgotPasswordSchema } from '../schemas/authSchema';
import type { ForgotPasswordFormValues, ForgotPasswordResponse } from '../types/auth.types';

export function ForgotPasswordForm() {
  const [result, setResult] = useState<ForgotPasswordResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const response = await authApi.requestPasswordReset(values);
    setResult(response);
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-accent-900">Forgot password</h2>
        <p className="mt-2 text-sm leading-6 text-accent-500">
          Enter the email address on the account. In frontend-only mode, the reset email is
          simulated and the reset link is surfaced directly below.
        </p>
      </div>

      {result && (
        <div className="mb-6 space-y-4 rounded-[1.5rem] border border-primary-200 bg-primary-50 p-5">
          <div className="flex items-start gap-3 text-sm text-primary-900">
            <Icon icon="mdi:email-check-outline" className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Reset email prepared</p>
              <p className="mt-1 leading-6">{result.message}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-700">
                Link lifetime: {result.expiresInMinutes} minutes
              </p>
            </div>
          </div>

          {result.resetLink ? (
            <div className="rounded-2xl border border-primary-200/80 bg-white/80 p-4">
              <p className="text-sm font-semibold text-accent-900">Frontend-only reset link</p>
              <p className="mt-1 text-sm leading-6 text-accent-600">
                In production, the user would receive this by email. For now, open the link below
                to continue the reset flow.
              </p>
              <AppLink href={result.resetLink} className="btn btn-primary mt-4 w-full">
                Open password reset link
              </AppLink>
            </div>
          ) : (
            <div className="rounded-2xl border border-accent-200 bg-white/80 p-4 text-sm leading-6 text-accent-600">
              No matching dummy account was found for that email, so no demo reset link was created.
            </div>
          )}
        </div>
      )}

      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-accent-800"
            htmlFor="forgot-password-email"
          >
            Email address
          </label>
          <input
            id="forgot-password-email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
            placeholder="you@example.com"
            {...register('email')}
          />
          {errors.email && <p className="mt-2 text-sm text-secondary-700">{errors.email.message}</p>}
        </div>

        <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending reset email...' : 'Send reset email'}
        </button>

        <div className="flex items-center justify-between gap-3 text-sm">
          <AppLink href="/auth/login" className="font-medium text-primary-600 hover:text-primary-700">
            Back to login
          </AppLink>
          <AppLink
            href="/auth/register"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Create account
          </AppLink>
        </div>
      </form>
    </div>
  );
}
