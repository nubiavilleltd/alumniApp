// features/authentication/api/adapters/changepassword.adapter.ts

import type { ChangePasswordFormValues } from '../../../authentication/types/auth.types';

export function mapChangePasswordPayload(values: ChangePasswordFormValues) {
  return {
    old_password: values.currentPassword,
    new_password: values.newPassword,
    confirm_password: values.confirmPassword,
  };
}

export function mapChangePasswordResponse(res: any) {
  return {
    message: res.message || 'Password successfully updated',
  };
}

// export function mapChangePasswordError(error: any): string {
//     const status = error.response?.status;
//     const msg =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.response?.data?.detail;

//     switch (status) {
//         case 400: return 'Invalid or expired reset link. Please request a new one.';
//         case 404: return 'No account found with this reset link.';
//         case 422: return 'Invalid reset code.';
//         case 500: return 'Server error. Please try again later.';
//         default: return msg || 'Failed to reset password. Please try again.';
//     }
// }

export function mapChangePasswordError(error: any): string {
  const status = error.response?.status;

  const data = error.response?.data;

  const msg = data?.message || data?.error || data?.detail;

  switch (status) {
    case 400:
      return msg || 'Invalid request. Please check your input and try again.';

    case 401:
      return 'Your session has expired. Please log in again.';

    case 403:
      return 'You are not authorized to perform this action.';

    case 404:
      return 'User account not found.';

    case 422:
      // validation errors (very common here)
      return msg || 'Please ensure your passwords match and meet the required criteria.';

    case 500:
      return 'Server error. Please try again later.';

    default:
      return msg || 'Failed to update password. Please try again.';
  }
}
