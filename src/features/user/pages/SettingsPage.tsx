// features/user/pages/SettingsPage.tsx
// Route: /user/settings  (ProtectedRoute)

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '../routes';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { userService } from '../services/user.service';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { toast } from '@/shared/components/ui/Toast';
import { useDeactivateOwnAccount } from '@/features/admin/hooks/useUserManagement';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';

const breadcrumbItems = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Dashboard', href: USER_ROUTES.DASHBOARD },
  { label: 'Settings' },
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/\d/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    path: ['newPassword'],
    message: 'New password must be different from your current password',
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// ─── Password field ───────────────────────────────────────────────────────────

function PasswordField({
  label,
  placeholder,
  error,
  show,
  onToggle,
  registration,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
  registration: object;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete ?? 'new-password'}
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

// ─── Change Password section ──────────────────────────────────────────────────

function ChangePasswordSection() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // const [success, setSuccess] = useState(false);
  const clearTokens = useTokenStore.getState().clearTokens;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await userService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      reset();
      // setSuccess(true);
      // setTimeout(() => setSuccess(false), 5000);

      toast.success('Password successfully updated', 'Successful');

      setTimeout(() => {
        clearTokens();
        navigate(AUTH_ROUTES.LOGIN, { replace: true });
      }, 1500);
    } catch (error: any) {
      // If the backend says current password is wrong, show it on that field
      if (
        error.message?.toLowerCase().includes('incorrect') ||
        error.message?.toLowerCase().includes('current') ||
        error.response?.status === 400
      ) {
        setError('currentPassword', { type: 'manual', message: error.message });
      } else {
        setError('newPassword', {
          type: 'manual',
          message: error.message ?? 'Failed to update password. Please try again.',
        });
      }
    }
  });

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
          <Icon icon="mdi:lock-outline" className="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">Change Password</h2>
          <p className="text-xs text-gray-400">Update your account password</p>
        </div>
      </div>

      {/* {success && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-primary-50 border border-primary-100 px-4 py-3 text-sm text-primary-700">
          <Icon icon="mdi:check-circle-outline" className="w-4 h-4 flex-shrink-0" />
          Password updated successfully.
        </div>
      )} */}

      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        <PasswordField
          label="Current Password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
          autoComplete="current-password"
          registration={register('currentPassword')}
        />

        <PasswordField
          label="New Password"
          placeholder="Create a new password"
          error={errors.newPassword?.message}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
          registration={register('newPassword')}
        />

        <PasswordField
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          error={errors.confirmPassword?.message}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
          registration={register('confirmPassword')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </section>
  );
}

// ─── Danger Zone section ──────────────────────────────────────────────────────

// function DangerZoneSection() {
//   const currentUser = useAuthStore((state) => state.user);
//   const clearSession = useAuthStore((state) => state.clearSession);
//   const navigate = useNavigate();

//   const [showConfirm, setShowConfirm] = useState(false);
//   const [isDeactivating, setIsDeactivating] = useState(false);
//   const [deactivateError, setDeactivateError] = useState('');

//   const handleDeactivate = async () => {
//     setIsDeactivating(true);
//     setDeactivateError('');

//     try {
//       // TODO: Replace with real endpoint when backend provides POST /api/deactivate_account
//       // await apiClient.post(API_ENDPOINTS.USER.DEACTIVATE_ACCOUNT, { user_id: currentUser?.id });
//       throw new Error('Deactivate endpoint not yet available. Please contact an administrator.');
//     } catch (error: any) {
//       setDeactivateError(error.message ?? 'Failed to deactivate account. Please try again.');
//       setIsDeactivating(false);
//       return;
//     }

//     clearSession();
//     navigate(ROUTES.HOME, { replace: true });
//   };

//   return (
//     <section className="bg-white rounded-2xl border border-red-100 p-6">
//       <div className="flex items-center gap-3 mb-4">
//         <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
//           <Icon icon="mdi:alert-outline" className="w-5 h-5 text-red-500" />
//         </div>
//         <div>
//           <h2 className="text-base font-bold text-red-700">Danger Zone</h2>
//           <p className="text-xs text-gray-400">Irreversible account actions</p>
//         </div>
//       </div>

//       <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <p className="text-sm font-semibold text-gray-800">Deactivate Account</p>
//             <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
//               Your profile will be hidden and you will be logged out immediately. Your data is
//               preserved — an admin can reactivate your account.
//             </p>
//           </div>

//           {!showConfirm ? (
//             <button
//               type="button"
//               onClick={() => {
//                 setShowConfirm(true);
//                 setDeactivateError('');
//               }}
//               className="flex-shrink-0 flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
//             >
//               <Icon icon="mdi:account-off-outline" className="w-4 h-4" />
//               Deactivate
//             </button>
//           ) : (
//             <div className="flex-shrink-0 flex flex-col gap-2">
//               <p className="text-xs text-red-600 font-medium text-center">
//                 Are you sure? This will log you out.
//               </p>
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   disabled={isDeactivating}
//                   onClick={handleDeactivate}
//                   className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
//                 >
//                   {isDeactivating ? (
//                     <Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />
//                   ) : (
//                     <>
//                       <Icon icon="mdi:check" className="w-3.5 h-3.5" />
//                       Yes, deactivate
//                     </>
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowConfirm(false);
//                     setDeactivateError('');
//                   }}
//                   className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {deactivateError && (
//           <p className="mt-3 text-xs text-red-600 bg-red-100 rounded-lg px-3 py-2">
//             {deactivateError}
//           </p>
//         )}
//       </div>
//     </section>
//   );
// }

function DangerZoneSection() {
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Use the mutation hook
  const deactivate = useDeactivateOwnAccount();

  const handleDeactivate = async () => {
    try {
      await deactivate.mutateAsync();
      // Mutation handles logout and redirect
    } catch (error) {
      // Error toast shown by mutation
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-red-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
          <Icon icon="mdi:alert-outline" className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-bold text-red-700">Danger Zone</h2>
          <p className="text-xs text-gray-400">Irreversible account actions</p>
        </div>
      </div>

      <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">Deactivate Account</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Your profile will be hidden and you will be logged out immediately. Your data is
              preserved — an admin can reactivate your account.
            </p>
          </div>

          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={deactivate.isPending}
              className="flex-shrink-0 flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              <Icon icon="mdi:account-off-outline" className="w-4 h-4" />
              Deactivate
            </button>
          ) : (
            <div className="flex-shrink-0 flex flex-col gap-2">
              <p className="text-xs text-red-600 font-medium text-center">
                Are you sure? This will log you out.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={deactivate.isPending}
                  onClick={handleDeactivate}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {deactivate.isPending ? (
                    <>
                      <Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />
                      Deactivating...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:check" className="w-3.5 h-3.5" />
                      Yes, deactivate
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={deactivate.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  // const currentUser = useAuthStore((state) => state.user);
  const { data: currentUser, isLoading, error } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <SEO title="Settings" description="Manage your account settings." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-12">
        <div className="container-custom max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage security and account preferences for{' '}
              <span className="font-medium text-gray-700">{currentUser?.email}</span>
            </p>
          </div>

          <div className="space-y-6">
            <ChangePasswordSection />
            <DangerZoneSection />
          </div>
        </div>
      </section>
    </>
  );
}
