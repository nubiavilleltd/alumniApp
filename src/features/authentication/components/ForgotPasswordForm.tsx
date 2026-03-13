// import { zodResolver } from '@hookform/resolvers/zod';
// import { Icon } from '@iconify/react';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { authApi } from '../api/authApi';
// import { forgotPasswordSchema } from '../schemas/authSchema';
// import type { ForgotPasswordFormValues, ForgotPasswordResponse } from '../types/auth.types';

// export function ForgotPasswordForm() {
//   const [result, setResult] = useState<ForgotPasswordResponse | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<ForgotPasswordFormValues>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: {
//       email: '',
//     },
//   });

//   const onSubmit = handleSubmit(async (values) => {
//     const response = await authApi.requestPasswordReset(values);
//     setResult(response);
//   });

//   return (
//     <div>
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-accent-900">Forgot password</h2>
//         <p className="mt-2 text-sm leading-6 text-accent-500">
//           Enter the email address on the account. In frontend-only mode, the reset email is
//           simulated and the reset link is surfaced directly below.
//         </p>
//       </div>

//       {result && (
//         <div className="mb-6 space-y-4 rounded-[1.5rem] border border-primary-200 bg-primary-50 p-5">
//           <div className="flex items-start gap-3 text-sm text-primary-900">
//             <Icon icon="mdi:email-check-outline" className="mt-0.5 h-5 w-5 flex-shrink-0" />
//             <div>
//               <p className="font-semibold">Reset email prepared</p>
//               <p className="mt-1 leading-6">{result.message}</p>
//               <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-primary-700">
//                 Link lifetime: {result.expiresInMinutes} minutes
//               </p>
//             </div>
//           </div>

//           {result.resetLink ? (
//             <div className="rounded-2xl border border-primary-200/80 bg-white/80 p-4">
//               <p className="text-sm font-semibold text-accent-900">Frontend-only reset link</p>
//               <p className="mt-1 text-sm leading-6 text-accent-600">
//                 In production, the user would receive this by email. For now, open the link below to
//                 continue the reset flow.
//               </p>
//               <AppLink href={result.resetLink} className="btn btn-primary mt-4 w-full">
//                 Open password reset link
//               </AppLink>
//             </div>
//           ) : (
//             <div className="rounded-2xl border border-accent-200 bg-white/80 p-4 text-sm leading-6 text-accent-600">
//               No matching dummy account was found for that email, so no demo reset link was created.
//             </div>
//           )}
//         </div>
//       )}

//       <form className="space-y-5" onSubmit={onSubmit}>
//         <div>
//           <label
//             className="mb-2 block text-sm font-semibold text-accent-800"
//             htmlFor="forgot-password-email"
//           >
//             Email address
//           </label>
//           <input
//             id="forgot-password-email"
//             type="email"
//             autoComplete="email"
//             className={`input ${errors.email ? 'border-secondary-400 focus:ring-secondary-400 focus:border-secondary-400' : ''}`}
//             placeholder="you@example.com"
//             {...register('email')}
//           />
//           {errors.email && (
//             <p className="mt-2 text-sm text-secondary-700">{errors.email.message}</p>
//           )}
//         </div>

//         <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Sending reset email...' : 'Send reset email'}
//         </button>

//         <div className="flex items-center justify-between gap-3 text-sm">
//           <AppLink
//             href="/auth/login"
//             className="font-medium text-primary-600 hover:text-primary-700"
//           >
//             Back to login
//           </AppLink>
//           <AppLink
//             href="/auth/register"
//             className="font-medium text-primary-600 hover:text-primary-700"
//           >
//             Create account
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
import { useNavigate } from 'react-router-dom';
import { AppLink } from '@/shared/components/ui/AppLink';
import { FormInput } from '@/shared/components/ui/input/FormInput';
import { authApi } from '../api/authApi';
import { forgotPasswordSchema } from '../schemas/authSchema';
import type { ForgotPasswordFormValues, ForgotPasswordResponse } from '../types/auth.types';
import { AuthCard } from './AuthCard';

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ForgotPasswordResponse | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ForgotPasswordFormValues>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: '' },
    });

  const onSubmit = handleSubmit(async (values) => {
    const response = await authApi.requestPasswordReset(values);
    setResult(response);
  });

  if (result) {
    return (
      <AuthCard title="Email" titleAccent="Sent">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="mdi:email-check-outline" className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            We have sent an email to the address associated with your account. Please check
            your inbox for further instructions on how to reset your password.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-500">
            Please check your spam/junk folder if the email is not in your inbox
          </div>
          {result.resetLink && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-left">
              <p className="text-xs font-semibold text-primary-700 mb-2">Frontend-only — simulated reset link:</p>
              <AppLink href={result.resetLink} className="text-xs text-primary-600 underline break-all">
                {result.resetLink}
              </AppLink>
            </div>
          )}
          <button type="button" onClick={() => navigate('/')} className="btn btn-primary w-full">
            Return Home
          </button>
          <AppLink href="/auth/login" className="block text-sm text-center text-gray-500 hover:text-primary-500">
            Back to login
          </AppLink>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgotten"
      titleAccent="Password"
      subtitle="Enter the email address associated with your account. We'll send you instructions on how to reset your password."
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
        <button type="submit" disabled={isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2">
          {isSubmitting ? (
            <><Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />Sending...</>
          ) : 'Reset Password'}
        </button>
        <AppLink href="/auth/login"
          className="block text-sm text-center text-gray-500 hover:text-primary-500">
          Back to login
        </AppLink>
      </form>
    </AuthCard>
  );
}
