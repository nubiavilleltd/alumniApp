/**
 * ============================================================================
 * API ERROR HANDLER
 * ============================================================================
 *
 * Standardized error handling for all API calls
 * Use this in all services/adapters for consistent error messages
 *
 * ============================================================================
 */

import { getUserFriendlyError, logError } from './errorUtils';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

/**
 * Handle API errors consistently across all services
 *
 * Usage in services:
 * ```typescript
 * try {
 *   const { data } = await apiClient.post(...);
 *   return data;
 * } catch (error) {
 *   throw handleApiError(error, 'Failed to fetch alumni');
 * }
 * ```
 */
// export function handleApiError(
//   error: any,
//   fallbackMessage: string = 'An error occurred',
//   context?: string,
// ): Error {
//   // Log error for debugging
//   logError(error, context);

//   // Get user-friendly error
//   const friendlyError = getUserFriendlyError(error);

//   // Try to extract backend message first
//   const backendMessage =
//     error.response?.data?.message ||
//     error.response?.data?.error ||
//     error.response?.data?.detail ||
//     error.response?.data?.msg;

//   // Priority: Backend message > Friendly message > Fallback
//   const finalMessage = backendMessage || friendlyError.message || fallbackMessage;

//   // Create standardized error
//   const apiError = new Error(finalMessage) as Error & ApiError;
//   apiError.status = error.response?.status;
//   apiError.code = error.code;

//   // Attach original error in development
//   if (import.meta.env.DEV) {
//     apiError.details = {
//       original: error,
//       response: error.response?.data,
//     };
//   }

//   return apiError;
// }

export function handleApiError(
  error: any,
  fallbackMessage: string = 'An error occurred',
  context?: string,
): Error {
  // Log error for debugging
  logError(error, context);

  // Try to extract backend message from MULTIPLE possible locations
  const backendMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.response?.data?.detail ||
    error.response?.data?.msg ||
    error.message || // ← ADD THIS: fall back to error.message
    (typeof error === 'string' ? error : null);

  // Get user-friendly error (this might also be causing issues)
  const friendlyError = getUserFriendlyError(error);

  // Priority: Backend message > Error message > Friendly message > Fallback
  const finalMessage = backendMessage || friendlyError.message || fallbackMessage;

  // Create standardized error
  const apiError = new Error(finalMessage) as Error & ApiError;

  // Preserve as much original error info as possible
  apiError.status = error.response?.status || error.status;
  apiError.code = error.code || error.response?.data?.code;

  // ALWAYS preserve the original response if available
  if (error.response) {
    apiError.details = {
      original: error,
      response: error.response?.data,
      status: error.response?.status,
    };
  } else if (import.meta.env.DEV) {
    apiError.details = {
      original: error,
      message: error.message,
    };
  }

  return apiError;
}

/**
 * Wrapper for API calls with automatic error handling
 *
 * Usage:
 * ```typescript
 * export const alumniService = {
 *   getAll: () => withApiErrorHandling(
 *     () => apiClient.get('/alumni'),
 *     'Failed to load alumni directory',
 *     'AlumniService.getAll'
 *   ),
 * };
 * ```
 */
export async function withApiErrorHandling<T>(
  apiCall: () => Promise<T>,
  fallbackMessage: string,
  context?: string,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    throw handleApiError(error, fallbackMessage, context);
  }
}

/**
 * Extract validation errors from backend response
 *
 * Returns object like: { email: 'Invalid email format', password: 'Too short' }
 */
export function extractValidationErrors(error: any): Record<string, string> | null {
  const data = error.response?.data;

  if (!data || !data.errors) return null;

  const errors: Record<string, string> = {};

  // Handle different validation error formats
  if (typeof data.errors === 'object') {
    Object.entries(data.errors).forEach(([field, message]) => {
      if (Array.isArray(message)) {
        errors[field] = message[0];
      } else if (typeof message === 'string') {
        errors[field] = message;
      }
    });
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
