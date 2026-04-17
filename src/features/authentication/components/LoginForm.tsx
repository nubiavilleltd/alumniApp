import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { authApi } from '../services/auth.service';
import { loginSchema } from '../schemas/authSchema';
import { useIdentityStore } from '../stores/useIdentityStore';
import { useTokenStore } from '../stores/useTokenStore';
import type { LoginFormValues } from '../types/auth.types';
import { AuthCard } from './AuthCard';
import { toast } from '@/shared/components/ui/Toast';
import { USER_ROUTES } from '@/features/user/routes';
import { ADMIN_ROUTES } from '@/features/admin/routes';
import { AUTH_ROUTES } from '../routes';
import { mapCurrentUserResponse } from '../api/adapters/login.adapter';
import {
  formatVerificationResendDuration,
  getVerificationResendStatus,
  recordVerificationResendAttempt,
} from '../lib/verificationResendThrottle';
import { boolean } from 'zod';

interface LoginLocationState {
  from?: string;
  loginNotice?: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LoginLocationState | null) ?? null;
  const setIdentity = useIdentityStore((state) => state.setIdentity);
  const setTokens = useTokenStore((state) => state.setTokens);
  const setRememberMe = useTokenStore((state) => state.setRememberMe);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired')) {
      toast.info('Your session expired. Please login again.');
      params.delete('session_expired');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    if (!locationState?.loginNotice) {
      return;
    }

    toast.info(locationState.loginNotice);

    navigate(
      {
        pathname: location.pathname,
        search: location.search,
      },
      {
        replace: true,
        state: locationState.from ? { from: locationState.from } : null,
      },
    );
  }, [location.pathname, location.search, locationState, navigate]);

  const from = locationState?.from;

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
      // Step 1: Authenticate — get tokens + minimal user
      const loginResponse = await authApi.login(values);

      // Step 2: Fetch the full profile using the returned user ID
      // This gives us fullName, photo, role, etc. for the nav to render immediately.
      let fullProfile;
      try {
        const rawProfile = await authApi.getCurrentUserRaw(loginResponse.user.id);
        fullProfile = mapCurrentUserResponse(rawProfile);
      } catch {
        // If the profile fetch fails, fall back to constructing a minimal user
        // so login still succeeds — the profile will load later via useCurrentUser.
        fullProfile = {
          ...loginResponse.user,
          fullName: '',
          avatarInitials: '',
          email: values.email,
          graduationYear: 0,
          createdAt: new Date().toISOString(),
        } as any;
      }

      // Step 3: Persist full profile to localStorage — nav renders synchronously
      // setSession(fullProfile, loginResponse.accessToken, loginResponse.refreshToken, values.rememberMe);

      setIdentity(fullProfile);

      setTokens(loginResponse.accessToken, loginResponse.refreshToken);

      setRememberMe(values.rememberMe as boolean);

      const fallbackDestination =
        fullProfile.role === 'admin' ? ADMIN_ROUTES.DASHBOARD : USER_ROUTES.DASHBOARD;

      // Step 4: Navigate
      navigate(from ?? fallbackDestination, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed. Please try again.';
      const verificationUserId =
        error instanceof Error
          ? ((error as Error & { details?: { response?: { user_id?: string } } }).details?.response
              ?.user_id ?? '')
          : '';

      if (message.includes('not verified')) {
        if (verificationUserId) {
          const resendStatus = getVerificationResendStatus(String(verificationUserId));

          if (resendStatus.isBlocked) {
            toast.info(
              `You have used all ${resendStatus.attempts} resend attempts. Try again in ${formatVerificationResendDuration(resendStatus.blockRemainingMs)}.`,
            );
          } else if (resendStatus.isCoolingDown) {
            toast.info(
              `You can request another verification code in ${formatVerificationResendDuration(resendStatus.cooldownRemainingMs)}.`,
            );
          } else {
            try {
              recordVerificationResendAttempt(String(verificationUserId));
              const resendMessage = await authApi.resendVerificationEmail({
                email: values.email,
                userId: String(verificationUserId),
              });
              toast.info(resendMessage);
            } catch (resendError) {
              const resendErrorMessage =
                resendError instanceof Error
                  ? resendError.message
                  : 'Could not resend the verification code right now.';
              toast.error(resendErrorMessage);
            }
          }

          const search = new URLSearchParams({
            email: values.email,
            userId: String(verificationUserId),
            source: 'login',
          });

          navigate(`${AUTH_ROUTES.REGISTER_VERIFY}?${search.toString()}`, { replace: true });
          return;
        }

        setError('email', {
          type: 'manual',
          message: 'Your email is not verified. Please check your inbox.',
        });
        return;
      }
      if (message === 'AWAITING_APPROVAL') {
        setError('email', { type: 'manual', message: 'Your account is awaiting admin approval.' });
        return;
      }
      if (message === 'ACCOUNT_DEACTIVATED') {
        setError('email', {
          type: 'manual',
          message: 'Your account has been deactivated. Please contact support.',
        });
        return;
      }

      toast.error(message);
    }
  });

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your alumni account">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <FormInput
          label="Email address"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <AppLink
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-primary-500 hover:text-primary-600"
            >
              Forgot password?
            </AppLink>
          </div>
          <div className="relative">
            <input
              id="password"
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
            href={AUTH_ROUTES.REGISTER}
            className="font-semibold text-primary-500 hover:text-primary-600"
          >
            Sign up
          </AppLink>
        </p>
      </form>
    </AuthCard>
  );
}
