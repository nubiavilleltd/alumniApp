// features/authentication/api/adapters/resetpassword.adapter.ts

import type { ResetPasswordFormValues } from '../../types/auth.types';

export function mapResetPasswordPayload(values: ResetPasswordFormValues & { code: string }) {
  return {
    code: values.code,
    new_password: values.password,
    new_password_confirm: values.confirmPassword,
  };
}

export function mapResetPasswordResponse(res: any) {
  return {
    message: res.message || 'Password successfully reset',
  };
}

export function mapResetPasswordError(error: any): string {
  const status = error.response?.status;
  const msg =
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;

  switch (status) {
    case 400:
      return 'Invalid or expired reset link. Please request a new one.';
    case 404:
      return 'No account found with this reset link.';
    case 422:
      return 'Invalid reset code.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return msg || 'Failed to reset password. Please try again.';
  }
}
