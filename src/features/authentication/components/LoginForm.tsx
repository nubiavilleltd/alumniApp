import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { authApi } from '../api/authApi';
import { loginSchema } from '../schemas/authSchema';
import { useAuthStore } from '../stores/useAuthStore';
import type { LoginFormValues } from '../types/auth.types';
import { AuthCard } from './AuthCard';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  // Where to go after login — defaults to /dashboard
  // ProtectedRoute / AdminRoute pass their path as location.state.from
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await authApi.login(values);
      console.log("user", response.user)
      setSession(response.user);
      navigate(from, { replace: true });
    } catch (error) {
      setError('password', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Invalid email or password',
      });
    }
  });

  return (
    <AuthCard
      title="Welcome"
      titleAccent="Back"
      subtitle="Sign in to your alumni account to continue."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <AppLink
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary-500 hover:text-primary-600"
            >
              Forgot password?
            </AppLink>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon
                icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
                className="w-4 h-4"
              />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
            {...register('rememberMe')}
          />
          Remember me
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Login <Icon icon="mdi:arrow-right" className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-gray-400">or</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <AppLink
            href="/auth/register"
            className="font-semibold text-primary-500 hover:text-primary-600"
          >
            Sign up
          </AppLink>
        </p>
      </form>
    </AuthCard>
  );
}
