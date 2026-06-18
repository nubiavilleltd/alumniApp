import type { ForgotPasswordFormValues } from '../../types/auth.types';

export function mapForgotPasswordPayload(values: ForgotPasswordFormValues) {
  return {
    identity: values.email,
  };
}

export function mapForgotPasswordResponse(res: any) {
  return {
    status: 'email_sent' as const,
    message: res.message || res.msg || 'Password reset instructions sent.',
    email: res.email || '',
    expiresInMinutes: res.expires_in_minutes || res.expiresInMinutes || 30,
  };
}

export function mapForgotPasswordError(error: any): string {
  const status = error.response?.status;
  const msg =
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;

  switch (status) {
    case 400:
      return 'Invalid request. Please check your email and try again.';
    case 404:
      return 'No account found with this email.';
    case 422:
      return 'Invalid email address.';
    case 500:
      return 'Server error. Try again later.';
    default:
      return msg || 'Failed to send reset email.';
  }
}
