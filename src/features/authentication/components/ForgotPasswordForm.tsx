// import { zodResolver } from '@hookform/resolvers/zod';
// import { Icon } from '@iconify/react';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import { AppLink } from '@/shared/components/ui/AppLink';
// import { FormInput } from '@/shared/components/ui/input/FormInput';
// import { authApi } from '../api/authApi';
// import { forgotPasswordSchema } from '../schemas/authSchema';
// import type { ForgotPasswordFormValues, ForgotPasswordResponse } from '../types/auth.types';
// import { AuthCard } from './AuthCard';

// export function ForgotPasswordForm() {
//   const navigate = useNavigate();
//   const [result, setResult] = useState<ForgotPasswordResponse | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<ForgotPasswordFormValues>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: { email: '' },
//   });

//   const onSubmit = handleSubmit(async (values) => {
//     const response = await authApi.requestPasswordReset(values);
//     setResult(response);
//   });

//   if (result) {
//     return (
//       <AuthCard title="Email" titleAccent="Sent">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
//             <Icon icon="mdi:email-check-outline" className="w-8 h-8 text-primary-500" />
//           </div>
//           <p className="text-sm text-gray-600 leading-relaxed">
//             We have sent an email to the address associated with your account. Please check your
//             inbox for further instructions on how to reset your password.
//           </p>
//           <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-500">
//             Please check your spam/junk folder if the email is not in your inbox
//           </div>
//           {result.resetLink && (
//             <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-left">
//               <p className="text-xs font-semibold text-primary-700 mb-2">
//                 Frontend-only — simulated reset link:
//               </p>
//               <AppLink
//                 href={result.resetLink}
//                 className="text-xs text-primary-600 underline break-all"
//               >
//                 {result.resetLink}
//               </AppLink>
//             </div>
//           )}
//           <button type="button" onClick={() => navigate('/')} className="btn btn-primary w-full">
//             Return Home
//           </button>
//           <AppLink
//             href="/auth/login"
//             className="block text-sm text-center text-gray-500 hover:text-primary-500"
//           >
//             Back to login
//           </AppLink>
//         </div>
//       </AuthCard>
//     );
//   }

//   return (
//     <AuthCard
//       title="Forgot"
//       titleAccent="Password"
//       subtitle="Enter the email address associated with your account. We'll send you instructions on how to reset your password."
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
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="btn btn-primary w-full flex items-center justify-center gap-2"
//         >
//           {isSubmitting ? (
//             <>
//               <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
//               Sending...
//             </>
//           ) : (
//             'Reset Password'
//           )}
//         </button>
//         <AppLink
//           href="/auth/login"
//           className="block text-sm text-center text-gray-500 hover:text-primary-500"
//         >
//           Back to login
//         </AppLink>
//       </form>
//     </AuthCard>
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
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto">
            <Icon icon="mdi:email-check-outline" className="w-8 h-8 text-primary-500" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            We have sent an email to the address associated with your account. Please check your
            inbox for further instructions on how to reset your password.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-500">
            Please check your spam/junk folder if the email is not in your inbox
          </div>
          <button type="button" onClick={() => navigate('/')} className="btn btn-primary w-full">
            Return Home
          </button>
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

  return (
    <AuthCard
      title="Forgot"
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
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
