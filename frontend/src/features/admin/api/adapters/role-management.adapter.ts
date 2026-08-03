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

// export type UserRole = 'admin' | 'alumni';



// Specific admin categories (e.g. 'Content Admin') are now sent directly as
// user_role, so this is widened from the old strict admin/alumni union.
export type UserRole = string;

export interface AdminCategoryOption {
  value: UserRole;
  label: string;
}




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


