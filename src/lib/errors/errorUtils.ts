/**
 * ============================================================================
 * ERROR UTILITIES
 * ============================================================================
 *
 * Categorizes errors and provides user-friendly messages
 * Hides technical details from users
 *
 * ============================================================================
 */

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface UserFriendlyError {
  type: ErrorType;
  title: string;
  message: string;
  action?: string;
  canRetry: boolean;
}

/**
 * Categorize error based on various signals
 */
export function categorizeError(error: any): ErrorType {
  // Network errors
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return ErrorType.NETWORK;
  }

  if (!error.response) {
    return ErrorType.NETWORK;
  }

  // HTTP status codes
  const status = error.response?.status;

  if (status === 401 || status === 403) {
    return ErrorType.AUTH;
  }

  if (status === 404) {
    return ErrorType.NOT_FOUND;
  }

  if (status >= 400 && status < 500) {
    return ErrorType.VALIDATION;
  }

  if (status >= 500) {
    return ErrorType.SERVER;
  }

  return ErrorType.UNKNOWN;
}

/**
 * Convert any error to user-friendly format
 */
export function getUserFriendlyError(error: any): UserFriendlyError {
  const type = categorizeError(error);

  switch (type) {
    case ErrorType.NETWORK:
      return {
        type,
        title: 'Connection Problem',
        message:
          "We couldn't connect to the server. Please check your internet connection and try again.",
        action: 'Check your connection',
        canRetry: true,
      };

    case ErrorType.AUTH:
      return {
        type,
        title: 'Authentication Required',
        message: 'Your session has expired or you need to log in again to continue.',
        action: 'Log in again',
        canRetry: false,
      };

    case ErrorType.NOT_FOUND:
      return {
        type,
        title: 'Not Found',
        message: "We couldn't find what you're looking for. It may have been moved or removed.",
        action: 'Go back',
        canRetry: false,
      };

    case ErrorType.VALIDATION:
      // Try to extract backend validation message
      const backendMessage = extractBackendMessage(error);
      return {
        type,
        title: 'Invalid Input',
        message: backendMessage || 'Please check your information and try again.',
        action: 'Review your input',
        canRetry: true,
      };

    case ErrorType.SERVER:
      return {
        type,
        title: 'Server Error',
        message:
          "Something went wrong on our end. We're working to fix it. Please try again in a few moments.",
        action: 'Try again later',
        canRetry: true,
      };

    case ErrorType.UNKNOWN:
    default:
      // Check for common JavaScript errors
      if (error instanceof TypeError) {
        return {
          type: ErrorType.UNKNOWN,
          title: 'Something Went Wrong',
          message: 'An unexpected error occurred. Please refresh the page and try again.',
          action: 'Refresh page',
          canRetry: true,
        };
      }

      return {
        type,
        title: 'Unexpected Error',
        message:
          'Something unexpected happened. Please try again or contact support if this persists.',
        action: 'Try again',
        canRetry: true,
      };
  }
}

/**
 * Extract user-friendly message from backend error response
 */
function extractBackendMessage(error: any): string | null {
  const data = error.response?.data;

  if (!data) return null;

  // Try different common backend error message fields
  if (typeof data.message === 'string') return data.message;
  if (typeof data.error === 'string') return data.error;
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.msg === 'string') return data.msg;

  // If validation errors object
  if (data.errors && typeof data.errors === 'object') {
    const firstError = Object.values(data.errors)[0];
    if (typeof firstError === 'string') return firstError;
    if (Array.isArray(firstError) && firstError[0]) return String(firstError[0]);
  }

  return null;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const type = categorizeError(error);
  return type === ErrorType.NETWORK || type === ErrorType.SERVER || type === ErrorType.UNKNOWN;
}

/**
 * Log error to console in development, send to service in production
 */
export function logError(error: any, context?: string) {
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  } else {
    // TODO: Send to error reporting service (Sentry, etc.)
    // Example: Sentry.captureException(error, { tags: { context } });
  }
}

/**
 * Format error for display in toast notifications
 */
export function getToastErrorMessage(error: any): string {
  const friendlyError = getUserFriendlyError(error);
  return friendlyError.message;
}
