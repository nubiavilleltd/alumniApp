// features/user/pages/ChangePasswordPage.tsx
// Route: /user/settings  (ProtectedRoute)

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { authenticateMockAccount } from '@/features/authentication/lib/mockAuth';

const breadcrumbItems = [
  { label: 'Home',      href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings' },
];

// ─── Schemas ──────────────────────────────────────────────────────────────────
const changePasswordSchema = z
  .object({
    currentPassword:  z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/\d/,   'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path:    ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    path:    ['newPassword'],
    message: 'New password must be different from your current password',
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// ─── Change Password section ──────────────────────────────────────────────────
function ChangePasswordSection() {
  const currentUser = useAuthStore((state) => state.user);
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [success, setSuccess]           = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    // Verify current password against mock accounts
    const account = authenticateMockAccount(
      currentUser?.email ?? '',
      values.currentPassword,
    );

    if (!account) {
      setError('currentPassword', {
        type:    'manual',
        message: 'Current password is incorrect',
      });
      return;
    }

    // 🔴 TODO: call updatePassword API
    // await authApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
    await new Promise((r) => setTimeout(r, 800));

    reset();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
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

      {success && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-primary-50 border border-primary-100 px-4 py-3 text-sm text-primary-700">
          <Icon icon="mdi:check-circle-outline" className="w-4 h-4 flex-shrink-0" />
          Password updated successfully.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 max-w-md">

        {/* Current password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your current password"
              className={`input pr-10 ${errors.currentPassword ? 'border-red-400' : ''}`}
              {...register('currentPassword')}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon={showCurrent ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1.5 text-xs text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a new password"
              className={`input pr-10 ${errors.newPassword ? 'border-red-400' : ''}`}
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon={showNew ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1.5 text-xs text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter your new password"
              className={`input pr-10 ${errors.confirmPassword ? 'border-red-400' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon={showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'} className="w-4 h-4" />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary flex items-center gap-2"
        >
          {isSubmitting ? (
            <><Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />Updating...</>
          ) : 'Update Password'}
        </button>

      </form>
    </section>
  );
}

// ─── Danger Zone section ──────────────────────────────────────────────────────
function DangerZoneSection() {
  const currentUser  = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate     = useNavigate();
  const [showConfirm, setShowConfirm]   = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleDeactivate = async () => {
    setIsDeactivating(true);

    // 🔴 TODO: call deactivateAccount API
    // await authApi.deactivateAccount({ memberId: currentUser?.memberId });
    await new Promise((r) => setTimeout(r, 800));

    clearSession();
    navigate('/', { replace: true });
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
              Your profile will be hidden and you will be logged out immediately.
              Your data is preserved — an admin can reactivate your account.
            </p>
          </div>
          {!showConfirm ? (
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="flex-shrink-0 flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
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
                  disabled={isDeactivating}
                  onClick={handleDeactivate}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {isDeactivating ? (
                    <Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />
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
                  className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
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
export default function ChangePasswordPage() {
  const currentUser = useAuthStore((state) => state.user);

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