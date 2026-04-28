/**
 * ============================================================================
 * ROLE MANAGEMENT SERVICE
 * ============================================================================
 *
 * API method for changing user roles.
 * Admin-only operation.
 *
 * ============================================================================
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { UserRole } from '../api/adapters/role-management.adapter';
import { createChangeRolePayload } from '../api/adapters/user-management.adapter';

export const roleManagementApi = {
  /**
   * Change user role
   *
   * POST /api/manage_user_account
   * { "user_id": "42", "user_role": "admin" }
   *
   * Response:
   * {
   *   "status": 200,
   *   "message": "User role updated successfully",
   *   "user": {
   *     "id": "42",
   *     "fullname": "Jane Doe",
   *     "user_role": "admin",
   *     ...
   *   }
   * }
   */
  async changeUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      const payload = createChangeRolePayload(userId, newRole);
      await apiClient.post(API_ENDPOINTS.USER.MANAGE_ACCOUNT, payload);
    } catch (error: any) {
      // Sanitize error message - don't expose technical details
      const userMessage = getUserFriendlyErrorMessage(error);
      throw new Error(userMessage);
    }
  },
};

/**
 * Convert technical errors to user-friendly messages
 */
function getUserFriendlyErrorMessage(error: any): string {
  const status = error.response?.status;

  // Check for specific error messages from backend
  const backendMessage =
    error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail;

  // Map status codes to user-friendly messages
  if (status === 401 || status === 403) {
    return 'You do not have permission to change user roles.';
  }

  if (status === 404) {
    return 'User not found. They may have been removed.';
  }

  if (status === 400) {
    // If backend provided a message, use it (sanitized)
    if (backendMessage && !isTechnicalError(backendMessage)) {
      return backendMessage;
    }
    return 'Invalid role selected. Please try again.';
  }

  if (status === 409) {
    return 'This user already has the selected role.';
  }

  if (status >= 500) {
    return 'Server error. Please try again later.';
  }

  // Network errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.';
  }

  if (error.message?.includes('Network Error')) {
    return 'Network error. Please check your connection.';
  }

  // Default fallback
  return 'Failed to change user role. Please try again.';
}

/**
 * Check if error message contains technical details
 */
function isTechnicalError(message: string): boolean {
  const technicalKeywords = [
    'sql',
    'database',
    'exception',
    'stack trace',
    'undefined',
    'null',
    'syntax error',
    'internal server',
  ];

  const lowerMessage = message.toLowerCase();
  return technicalKeywords.some((keyword) => lowerMessage.includes(keyword));
}
