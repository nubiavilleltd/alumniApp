import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { authApi } from '../api/authApi';
import { defaultMockAccounts } from '../constants/mockAccounts';
import { loginSchema } from '../schemas/authSchema';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginFormValues } from '../types/auth.types';

export function LoginForm() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await authApi.login(values);
      setSession(response.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError('password', {
        type: 'manual',
        message:
          error instanceof Error ? error.message : 'We could not sign you in with those details',
      });
    }
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-accent-900">Sign in</h2>
        <p className="mt-2 text-sm leading-6 text-accent-500">
          Use one of the stored demo accounts below. Session state is kept in the browser session so
          the signed-in navbar and dashboard flow behave like a lightweight session-based auth
          setup.
        </p>
      </div>

      <div className="mb-6 rounded-[1.5rem] border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-2 text-primary-700 shadow-sm">
            <span className="block text-xs font-bold uppercase tracking-[0.18em]">Demo</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-primary-900">Dummy accounts</p>
            <p className="mt-1 text-sm leading-6 text-primary-900/80">
              Default password for these accounts is{' '}
              <span className="font-semibold">Alumni123!</span>. If you reset one account later,
              that account will start using the new password you set.
            </p>
            <div className="mt-4 grid gap-3">
              {defaultMockAccounts.map((account) => (
                <div
                  className="rounded-2xl border border-primary-200/70 bg-white/80 px-4 py-3 text-sm text-accent-700"
                  key={account.id}
                >
                  <p className="font-semibold text-accent-900">{account.fullName}</p>
                  <p className="mt-1">{account.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm font-semibold text-accent-800" htmlFor="login-email">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
            placeholder="you@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-secondary-700">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-sm font-semibold text-accent-800" htmlFor="login-password">
              Password
            </label>
            <div className="flex items-center gap-3">
              <AppLink
                href="/auth/forgot-password"
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </AppLink>
              <AppLink
                href="/auth/register"
                className="text-xs font-medium text-primary-600 hover:text-primary-700"
              >
                Need an account?
              </AppLink>
            </div>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`input pr-12 ${errors.password ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
              placeholder="Enter your password"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-primary-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((value) => !value)}
            >
              <Icon
                icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                className="h-5 w-5"
              />
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-secondary-700">{errors.password.message}</p>
          )}
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3 text-sm text-accent-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-accent-300 text-primary-600 focus:ring-primary-500"
            {...register('rememberMe')}
          />
          Keep me signed in on this device
        </label>

        <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
