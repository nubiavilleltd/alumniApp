/**
 * ============================================================================
 * ROLE MANAGEMENT ADAPTER
 * ============================================================================
 *
 * Handles user role changes (admin <-> alumni).
 * Admin-only operation.
 *
 * ============================================================================
 */

export type UserRole = 'admin' | 'alumni';

export interface RoleChangePayload {
  user_id: string;
  user_role: UserRole;
}

/**
 * Create payload for changing user role
 *
 * POST /api/manage_user_account
 * { "user_id": "42", "user_role": "admin" }
 */
export function createChangeRolePayload(userId: string, newRole: UserRole): RoleChangePayload {
  return {
    user_id: userId,
    user_role: newRole,
  };
}

/**
 * Get user-friendly role label
 */
export function getRoleLabel(role: UserRole): string {
  return role === 'admin' ? 'Admin' : 'Member';
}

/**
 * Get role options for dropdown
 */
export function getRoleOptions(): Array<{ value: UserRole; label: string }> {
  return [
    { value: 'admin', label: 'Admin' },
    { value: 'alumni', label: 'Member' },
  ];
}
