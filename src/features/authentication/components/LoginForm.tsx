// import { zodResolver } from '@hookform/resolvers/zod';
// import { Icon } from '@iconify/react';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { authApi } from '../services/auth.service';
// import { loginSchema } from '../schemas/authSchema';
// import { useAuthStore } from '../stores/useAuthStore';
// import type { LoginFormValues } from '../types/auth.types';
// import { AuthCard } from './AuthCard';
// import { toast } from '@/shared/components/ui/Toast';
// import { USER_ROUTES } from '@/features/user/routes';
// import { ADMIN_ROUTES } from '@/features/admin/routes';
// import { AUTH_ROUTES } from '../routes';

// export function LoginForm() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const setSession = useAuthStore((state) => state.setSession);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     if (params.get('session_expired')) {
//       toast.info('Your session expired. Please login again.');

//       // 🧼 Remove query param so it doesn't show again on refresh
//       params.delete('session_expired');
//       navigate({ search: params.toString() }, { replace: true });
//     }
//   }, [location.search, navigate]);

//   // Where to go after login — defaults to /dashboard
//   // ProtectedRoute / AdminRoute pass their path as location.state.from
//   const from = (location.state as { from?: string } | null)?.from ?? USER_ROUTES.DASHBOARD;

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: '', password: '', rememberMe: false },
//   });

//   const onSubmit = handleSubmit(async (values) => {
//     try {
//       const response = await authApi.login(values);
//       setSession(response.user, response.accessToken, response.refreshToken);
//       navigate(response?.user?.role == 'admin' ? ADMIN_ROUTES.DASHBOARD : from, { replace: true });
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Login failed. Please try again.';

//       // ── Sentinel errors — shown on the email field ────────────────────────
//       if (message === 'EMAIL_NOT_VERIFIED') {
//         setError('email', {
//           type: 'manual',
//           message: 'Your email is not verified. Please check your inbox.',
//         });
//         return;
//       }

//       if (message === 'AWAITING_APPROVAL') {
//         setError('email', {
//           type: 'manual',
//           message: 'Your account is awaiting admin approval.',
//         });
//         return;
//       }

//       if (message === 'ACCOUNT_DEACTIVATED') {
//         setError('email', {
//           type: 'manual',
//           message: 'Your account has been deactivated. Please contact support.',
//         });
//         return;
//       }

//       // ── Field-specific errors ─────────────────────────────────────────────
//       if (
//         message.toLowerCase().includes('email') ||
//         message.toLowerCase().includes('not found') ||
//         message.toLowerCase().includes('no account')
//       ) {
//         setError('email', { type: 'manual', message });
//         return;
//       }

//       // ── Default: show on password field ──────────────────────────────────
//       setError('password', { type: 'manual', message });
//     }
//   });

//   return (
//     <AuthCard
//       title="Welcome"
//       titleAccent="Back"
//       subtitle="Sign in to your alumni account to continue."
//     >
//       <form className="space-y-4" onSubmit={onSubmit}>
//         <FormInput
//           label="Email Address"
//           id="email"
//           type="email"
//           autoComplete="email"
//           placeholder="you@example.com"
//           error={errors.email?.message}
//           {...register('email')}
//         />

//         <div>
//           <div className="flex items-center justify-between mb-1.5">
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <AppLink
//               href={AUTH_ROUTES.FORGOT_PASSWORD}
//               className="text-xs font-medium text-primary-500 hover:text-primary-600"
//             >
//               Forgot password?
//             </AppLink>
//           </div>
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               autoComplete="current-password"
//               placeholder="Enter your password"
//               className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
//               {...register('password')}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((v) => !v)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <Icon
//                 icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
//                 className="w-4 h-4"
//               />
//             </button>
//           </div>
//           {errors.password && (
//             <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
//           )}
//         </div>

//         {/* Remember me */}
//         <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//           <input
//             type="checkbox"
//             className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
//             {...register('rememberMe')}
//           />
//           Remember me
//         </label>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="btn btn-primary w-full flex items-center justify-center gap-2"
//         >
//           {isSubmitting ? (
//             <>
//               <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//               Signing in...
//             </>
//           ) : (
//             <>
//               Login <Icon icon="mdi:arrow-right" className="w-4 h-4" />
//             </>
//           )}
//         </button>

//         <div className="relative my-1">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-100" />
//           </div>
//           <div className="relative flex justify-center">
//             <span className="bg-white px-3 text-xs text-gray-400">or</span>
//           </div>
//         </div>

//         <p className="text-center text-sm text-gray-500">
//           Don't have an account?{' '}
//           <AppLink
//             href={AUTH_ROUTES.REGISTER}
//             className="font-semibold text-primary-500 hover:text-primary-600"
//           >
//             Sign up
//           </AppLink>
//         </p>
//       </form>
//     </AuthCard>
//   );
// }

// features/authentication/components/LoginForm.tsx
//
// CHANGE: After a successful login, setSession is now called with the full
// AuthSessionUser (from mapCurrentUserResponse) rather than just the minimal
// { id, memberId, role } token payload.
//
// Previously:
//   setSession(response.user, ...)  // response.user = { id, memberId, role }
//
// Now:
//   const fullProfile = mapCurrentUserResponse(rawData)
//   setSession(fullProfile, ...)
//
// This means localStorage immediately has the full profile (name, photo, role,
// etc.) so Navigation can render the user dropdown synchronously on the very
// next render — no waiting for useCurrentUser() to complete a network request.

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { authApi } from '../services/auth.service';
import { loginSchema } from '../schemas/authSchema';
import { useAuthStore } from '../stores/useAuthStore';
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

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired')) {
      toast.info('Your session expired. Please login again.');
      params.delete('session_expired');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [location.search, navigate]);

  const from = (location.state as { from?: string } | null)?.from;

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
      setSession(fullProfile, loginResponse.accessToken, loginResponse.refreshToken);

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
