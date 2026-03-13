// import { zodResolver } from '@hookform/resolvers/zod';
// import { Icon } from '@iconify/react';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useSearchParams } from 'react-router-dom';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { authApi } from '../api/authApi';
// import { resetPasswordSchema } from '../schemas/authSchema';
// import type { ResetPasswordFormValues, ResetPasswordResponse } from '../types/auth.types';
// import { PasswordStrengthMeter } from './PasswordStrengthMeter';

// export function ResetPasswordForm() {
//   const [searchParams] = useSearchParams();
//   const [result, setResult] = useState<ResetPasswordResponse | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const token = searchParams.get('token')?.trim() ?? '';
//   const email = searchParams.get('email')?.trim() ?? '';
//   const hasValidResetLink = token.length > 0;

//   const form = useForm<ResetPasswordFormValues>({
//     resolver: zodResolver(resetPasswordSchema),
//     defaultValues: {
//       password: '',
//       confirmPassword: '',
//     },
//   });

//   const passwordValue = form.watch('password') ?? '';
//   const confirmPasswordValue = form.watch('confirmPassword') ?? '';
//   const passwordsMatch = passwordValue.length > 0 && confirmPasswordValue === passwordValue;

//   const onSubmit = form.handleSubmit(async (values) => {
//     if (!hasValidResetLink) {
//       return;
//     }

//     try {
//       const response = await authApi.resetPassword({
//         token,
//         email: email || undefined,
//         password: values.password,
//       });

//       setResult(response);
//       form.reset({
//         password: '',
//         confirmPassword: '',
//       });
//     } catch (error) {
//       form.setError('password', {
//         type: 'manual',
//         message: error instanceof Error ? error.message : 'Password reset could not be completed',
//       });
//     }
//   });

//   if (!hasValidResetLink) {
//     return (
//       <div className="space-y-6">
//         <div className="rounded-[1.5rem] border border-secondary-200 bg-secondary-50 p-5">
//           <div className="flex items-start gap-3">
//             <Icon
//               icon="mdi:alert-circle-outline"
//               className="mt-0.5 h-5 w-5 flex-shrink-0 text-secondary-700"
//             />
//             <div>
//               <p className="font-semibold text-secondary-900">Reset link is missing or invalid</p>
//               <p className="mt-1 text-sm leading-6 text-secondary-900/80">
//                 Open this page from the email link, or request a fresh password reset email.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col gap-3 sm:flex-row">
//           <AppLink href="/auth/forgot-password" className="btn btn-primary flex-1">
//             Request reset email
//           </AppLink>
//           <AppLink href="/auth/login" className="btn btn-outline flex-1">
//             Back to login
//           </AppLink>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-accent-900">Set a new password</h2>
//         <p className="mt-2 text-sm leading-6 text-accent-500">
//           Create a new password for {email || 'your account'}. This reset link is simulated on the
//           frontend and mirrors the route a real email would open.
//         </p>
//       </div>

//       {result && (
//         <div className="mb-6 rounded-[1.5rem] border border-primary-200 bg-primary-50 p-5 text-sm text-primary-900">
//           <div className="flex items-start gap-3">
//             <Icon icon="mdi:check-circle" className="mt-0.5 h-5 w-5 flex-shrink-0" />
//             <div>
//               <p className="font-semibold">Password updated</p>
//               <p className="mt-1 leading-6">{result.message}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <form className="space-y-5" onSubmit={onSubmit}>
//         <div>
//           <label
//             className="mb-2 block text-sm font-semibold text-accent-800"
//             htmlFor="reset-password"
//           >
//             New password
//           </label>
//           <div className="relative">
//             <input
//               id="reset-password"
//               type={showPassword ? 'text' : 'password'}
//               autoComplete="new-password"
//               placeholder="Create a secure password"
//               className={`input pr-12 ${form.formState.errors.password ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
//               {...form.register('password')}
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-primary-600"
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//               onClick={() => setShowPassword((value) => !value)}
//             >
//               <Icon
//                 icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
//                 className="h-5 w-5"
//               />
//             </button>
//           </div>
//           {form.formState.errors.password && (
//             <p className="mt-2 text-sm text-secondary-700">
//               {form.formState.errors.password.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <label
//             className="mb-2 block text-sm font-semibold text-accent-800"
//             htmlFor="reset-confirm-password"
//           >
//             Confirm new password
//           </label>
//           <div className="relative">
//             <input
//               id="reset-confirm-password"
//               type={showConfirmPassword ? 'text' : 'password'}
//               autoComplete="new-password"
//               placeholder="Re-enter your new password"
//               className={`input pr-12 ${form.formState.errors.confirmPassword ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
//               {...form.register('confirmPassword')}
//             />
//             <button
//               type="button"
//               className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-accent-500 transition-colors duration-200 hover:text-primary-600"
//               aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
//               onClick={() => setShowConfirmPassword((value) => !value)}
//             >
//               <Icon
//                 icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'}
//                 className="h-5 w-5"
//               />
//             </button>
//           </div>
//           {form.formState.errors.confirmPassword ? (
//             <p className="mt-2 text-sm text-secondary-700">
//               {form.formState.errors.confirmPassword.message}
//             </p>
//           ) : confirmPasswordValue ? (
//             <p
//               className={`mt-2 text-sm ${passwordsMatch ? 'text-primary-700' : 'text-accent-500'}`}
//             >
//               {passwordsMatch ? 'Passwords match.' : 'Passwords must match exactly.'}
//             </p>
//           ) : null}
//         </div>

//         {passwordValue ? <PasswordStrengthMeter password={passwordValue} /> : null}

//         <button
//           className="btn btn-primary w-full"
//           type="submit"
//           disabled={form.formState.isSubmitting}
//         >
//           {form.formState.isSubmitting ? 'Updating password...' : 'Save new password'}
//         </button>

//         <div className="flex items-center justify-between gap-3 text-sm">
//           <AppLink
//             href="/auth/forgot-password"
//             className="font-medium text-primary-600 hover:text-primary-700"
//           >
//             Request another link
//           </AppLink>
//           <AppLink
//             href="/auth/login"
//             className="font-medium text-primary-600 hover:text-primary-700"
//           >
//             Back to login
//           </AppLink>
//         </div>
//       </form>
//     </div>
//   );
// }





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

export function ResetPasswordForm() {
  const [searchParams]    = useSearchParams();
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword]             = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token')?.trim() ?? '';
  const email = searchParams.get('email')?.trim() ?? '';
  const hasValidLink = token.length > 0;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue        = form.watch('password') ?? '';
  const confirmPasswordValue = form.watch('confirmPassword') ?? '';
  const passwordsMatch       = passwordValue.length > 0 && confirmPasswordValue === passwordValue;

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
          <AppLink href="/auth/forgot-password" className="btn btn-primary w-full block text-center">
            Request reset email
          </AppLink>
          <AppLink href="/auth/login" className="block text-sm text-center text-gray-500 hover:text-primary-500">
            Back to login
          </AppLink>
        </div>
      </AuthCard>
    );
  }

  // ── Success state ──────────────────────────────────────────────────────────
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
      title="Change"
      titleAccent="Password"
      subtitle={email ? `Setting a new password for ${email}` : 'Create a new secure password for your account.'}
    >
      <form className="space-y-4" onSubmit={onSubmit}>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <Icon icon="mdi:lock-outline" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a secure password"
              className={`input pl-10 pr-10 ${form.formState.errors.password ? 'border-red-400' : ''}`}
              {...form.register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon={showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-1.5 text-xs text-red-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Icon icon="mdi:lock-check-outline" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className={`input pl-10 pr-10 ${form.formState.errors.confirmPassword ? 'border-red-400' : ''}`}
              {...form.register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon={showConfirmPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
            </button>
          </div>
          {form.formState.errors.confirmPassword ? (
            <p className="mt-1.5 text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
          ) : confirmPasswordValue ? (
            <p className={`mt-1.5 text-xs ${passwordsMatch ? 'text-primary-600' : 'text-gray-400'}`}>
              {passwordsMatch ? '✓ Passwords match' : 'Passwords must match exactly'}
            </p>
          ) : null}
        </div>

        {passwordValue && <PasswordStrengthMeter password={passwordValue} />}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          {form.formState.isSubmitting ? (
            <><Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />Updating...</>
          ) : (
            'Update Password'
          )}
        </button>

      </form>
    </AuthCard>
  );
}
