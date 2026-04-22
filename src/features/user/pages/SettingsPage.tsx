// features/user/pages/SettingsPage.tsx
// Route: /user/settings  (ProtectedRoute)
// NEW DESIGN: Two-column layout (Change Password | Privacy Settings).
// Privacy toggles now live here (moved from UserProfilePage).
// Privacy panel is scrollable.

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import { ROUTES } from '@/shared/constants/routes';
import { USER_ROUTES } from '../routes';
import { userService } from '../services/user.service';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { toast } from '@/shared/components/ui/Toast';
import { useDeactivateOwnAccount } from '@/features/admin/hooks/useUserManagement';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { usePrivacyToggle } from '../hooks/usePrivacySettings';
import type { PrivacySettings } from '@/features/authentication/types/auth.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { PasswordInput } from '@/shared/components/ui/input/PasswordInput';

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

// ─── Privacy toggle row ───────────────────────────────────────────────────────

function PrivacyRow({
  field,
  label,
  description,
}: {
  field: keyof PrivacySettings;
  label: string;
  description: string;
}) {
  const { value, toggle, isUpdating } = usePrivacyToggle(field);
  const isPublic = value === 'public';

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs hidden sm:inline text-gray-500">Private</span>

        {/* Toggle */}
        <button
          type="button"
          onClick={() => toggle(isPublic ? 'private' : 'public')}
          disabled={isUpdating}
          role="switch"
          aria-checked={isPublic}
          className={`relative inline-flex h-4 w-10 flex-shrink-0 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none ${
            isPublic ? 'bg-primary-500/60 shadow-[0_0_0_2px_rgba(0,119,204,0.15)]' : 'bg-gray-300'
          } ${isUpdating ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {/* Knob */}
          <span
            className={`inline-block h-7 w-7 transform rounded-full shadow-md transition-all duration-300 ease-in-out ${
              isPublic ? 'translate-x-4 bg-primary-500' : 'translate-x-0 bg-gray-500'
            }`}
          />

          {/* Loading spinner */}
          {isUpdating && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Icon icon="mdi:loading" className="w-3.5 h-3.5 text-white animate-spin" />
            </span>
          )}
        </button>
        <span className="hidden sm:inline text-xs text-gray-500">Public</span>
      </div>
    </div>
  );
}

// ─── Change Password section ──────────────────────────────────────────────────

function ChangePasswordSection() {
  const clearTokens = useTokenStore.getState().clearTokens;
  const clearIdentity = useIdentityStore.getState().clearIdentity;
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
      toast.success('Password updated. Please sign in again.');
      setTimeout(() => {
        clearTokens();
        clearIdentity();
        navigate(AUTH_ROUTES.LOGIN, { replace: true });
      }, 1500);
    } catch (error: any) {
      if (error.message?.toLowerCase().includes('incorrect') || error.response?.status === 400) {
        setError('currentPassword', { type: 'manual', message: error.message });
      } else {
        setError('newPassword', {
          type: 'manual',
          message: error.message ?? 'Failed to update password.',
        });
      }
    }
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Change Password</h2>
      <p className="text-sm text-gray-400 mb-6">Update your account password</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordInput
          label="Current Password"
          id="currentPassword"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          autoComplete="current-password"
          {...register('currentPassword')}
        />
        <PasswordInput
          label="New Password"
          id="newPassword"
          placeholder="Enter your new password"
          hint="Password must be at least 8 characters long with a mix of uppercase letters, lowercase letters, numbers, and symbols"
          error={errors.newPassword?.message}
          autoComplete="new-password"
          {...register('newPassword')}
        />
        <PasswordInput
          label="Confirm New Password"
          id="confirmPassword"
          placeholder="Confirm your new password"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-3xl transition-colors disabled:opacity-60"
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
    </div>
  );
}

// ─── Privacy Settings section ─────────────────────────────────────────────────

function PrivacySection() {
  const privacyItems: { field: keyof PrivacySettings; label: string; description: string }[] = [
    {
      field: 'photo',
      label: 'Profile Photo Visibility',
      description: 'Let others see your profile picture',
    },
    {
      field: 'whatsappPhone',
      label: 'WhatsApp Phone Visibility',
      description: 'Let others see your WhatsApp phone number',
    },
    {
      field: 'alternativePhone',
      label: 'Alternative Phone Visibility',
      description: 'Let others see your alternative phone number',
    },
    {
      field: 'birthDate',
      label: 'Date of Birth Visibility',
      description: 'Let others see your date of birth',
    },
    {
      field: 'residentialAddress',
      label: 'Address Visibility',
      description: 'Let others see your house address',
    },
    {
      field: 'employmentStatus',
      label: 'Employment Information Visibility',
      description: 'Let others see your employment information',
    },
    {
      field: 'occupations',
      label: 'Occupation Visibility',
      description: 'Let others see your occupation',
    },
    {
      field: 'industrySectors',
      label: 'Industry Sector Visibility',
      description: 'Let others see your industry sector',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Privacy Settings</h2>
      <p className="text-sm text-gray-400 mb-5">Manage your account preferences</p>

      {/* Scrollable container */}
      <div className="flex-1 overflow-y-auto max-h-[400px] sm:max-h-[500px] pr-1 -mr-1">
        {privacyItems.map(({ field, label, description }) => (
          <PrivacyRow key={field} field={field} label={label} description={description} />
        ))}
      </div>
    </div>
  );
}

// ─── Deactivate section ───────────────────────────────────────────────────────

function DeactivateSection() {
  const deactivate = useDeactivateOwnAccount();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeactivate = async () => {
    try {
      await deactivate.mutateAsync();
      toast.success('Account deactivated. You have been logged out.');
    } catch (err: any) {
      toast.error(err.message ?? 'Could not deactivate account. Please try again.');
    }
  };

  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-start gap-3 flex-1">
        <Icon icon="mdi:alert-outline" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-gray-900">Deactivate your Account</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Your account will be deactivated and you will be logged out immediately. Your account
            information and data will be preserved and an admin can reactivate your account if
            requested.
          </p>
        </div>
      </div>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="flex-shrink-0 self-start sm:self-center border border-red-400 text-red-600 hover:bg-red-100 text-sm font-semibold px-4 py-2 rounded-3xl transition-colors"
        >
          Deactivate
        </button>
      ) : (
        <div className="flex gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={deactivate.isPending}
            className="border border-red-400 bg-red-500 text-white hover:bg-red-600 text-xs font-semibold px-3 py-2 rounded-3xl flex items-center gap-1.5 disabled:opacity-60"
          >
            {deactivate.isPending && (
              <Icon icon="mdi:loading" className="w-3.5 h-3.5 animate-spin" />
            )}
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold px-3 py-2 rounded-3xl"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <>
      <SEO title="Settings" description="Manage your account settings." />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="section py-8">
        <div className="container-custom max-w-5xl">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage security and account preferences</p>
          </div>

          {/* Two-column layout: Change Password | Privacy Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChangePasswordSection />
            <PrivacySection />
          </div>

          {/* Deactivate — full width at bottom */}
          <DeactivateSection />
        </div>
      </section>
    </>
  );
}
