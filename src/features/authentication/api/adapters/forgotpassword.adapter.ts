// import type { ForgotPasswordFormValues } from '../../types/auth.types';

// /**
//  * Forgot Password Payload & Response Adapter
//  *
//  * Maps frontend form data to backend API payload format,
//  * and backend response to frontend ForgotPasswordResponse format.
//  *
//  * UPDATE THIS FILE when backend changes - rest of code stays the same!
//  *
//  * Last Updated: 2026-03-24
//  * Backend Status: Unstable (in development)
//  *
//  * ============================================================================
//  * BACKEND CONTRACT (Current - Subject to Change)
//  * ============================================================================
//  *
//  * Endpoint: POST /auth/forgot-password
//  *
//  * Request:
//  * - email: string
//  *
//  * Response: Not yet documented — mapping defensively with fallbacks.
//  *
//  * Error Status Codes: Not yet documented — handling common cases.
//  * - 400 → Bad request / malformed payload
//  * - 404 → Email not registered
//  * - 422 → Invalid email format
//  * - 500 → Server error
//  *
//  * ============================================================================
//  * TODO / CLARIFICATIONS NEEDED FROM BACKEND TEAM:
//  * ============================================================================
//  *
//  * 1. What does the success response body look like?
//  *    - Currently mapping message + expiresInMinutes defensively
//  *
//  * 2. Does the backend return expiry time?
//  *    - Defaulting to 30 minutes if not provided
//  *
//  * 3. Confirm all error status codes when available
//  *
//  * ============================================================================
//  */

// /**
//  * Maps frontend forgot password form data to backend API payload
//  */
// export function mapForgotPasswordPayload(values: ForgotPasswordFormValues) {
//   return {
//     identity: values.email, // No transformation needed — field names match
//   };
// }

// /**
//  * Maps backend forgot password response to frontend format
//  */
// export function mapForgotPasswordResponse(backendResponse: any) {
//   return {
//     status: 'email_sent' as const,
//     message:
//       backendResponse.message ||
//       backendResponse.msg ||
//       'Password reset instructions sent to your email.',
//     email: backendResponse.email || '',
//     expiresInMinutes: backendResponse.expires_in_minutes || backendResponse.expiresInMinutes || 30, // Default to 30 mins if backend doesn't return this
//   };
// }

// /**
//  * Maps backend forgot password error to a user-friendly message
//  *
//  * Called in authApi.requestPasswordReset catch block.
//  */
// export function mapForgotPasswordError(error: any): string {
//   const status = error.response?.status;
//   const serverMessage =
//     error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;

//   switch (status) {
//     case 400:
//       return 'Invalid request. Please check your email and try again.';
//     case 404:
//       return 'No account found with this email address.';
//     case 422:
//       return 'Please enter a valid email address.';
//     case 500:
//       return 'Something went wrong on our end. Please try again later.';
//     default:
//       return serverMessage || 'Failed to send reset email. Please try again.';
//   }
// }

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
