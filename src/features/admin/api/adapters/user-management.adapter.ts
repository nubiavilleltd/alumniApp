/**
 * ============================================================================
 * USER MANAGEMENT ADAPTER
 * ============================================================================
 *
 * Handles user account management:
 * - Deactivate account (admin or self)
 * - Activate account (admin only)
 * - Role changes (future)
 *
 * ============================================================================
 */

export type AccountStatus = 'active' | 'inactive';

/**
 * User account info (for admin member list)
 */
export type UserAccount = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'member';
  accountStatus: AccountStatus;
  profileStatus: string;
};

// ═══════════════════════════════════════════════════════════════════════════
// INBOUND (Backend → Frontend)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map backend user account to frontend type
 */
export function mapBackendUserAccount(raw: any): UserAccount {
  return {
    id: String(raw.id ?? raw.user_id ?? ''),
    fullName: raw.fullname || raw.full_name || 'Unknown',
    email: raw.email || '',
    phone: raw.phone || '',
    role: raw.user_role === 'admin' ? 'admin' : 'member',
    accountStatus:
      raw.active === '1' || raw.active === 1 || raw.active === true ? 'active' : 'inactive',
    profileStatus: raw.profile_status || 'active',
  };
}

/**
 * Map backend user list
 */
export function mapBackendUserList(raw: any): UserAccount[] {
  // Handle different response structures
  const users = raw.users || raw.data || raw || [];

  if (!Array.isArray(users)) {
    return [];
  }

  return users
    .map((user: any) => {
      try {
        return mapBackendUserAccount(user);
      } catch {
        return null;
      }
    })
    .filter((user): user is UserAccount => user !== null);
}

// ═══════════════════════════════════════════════════════════════════════════
// OUTBOUND (Frontend → Backend)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Payload for admin deactivating a user
 *
 * POST /api/manage_user_account
 * { "user_id": 42, "action": "deactivate" }
 */
export function createAdminDeactivatePayload(userId: string): Record<string, any> {
  return {
    user_id: userId,
    action: 'deactivate',
  };
}

/**
 * Payload for admin activating a user
 *
 * POST /api/manage_user_account
 * { "user_id": 42, "action": "activate" }
 */
export function createAdminActivatePayload(userId: string): Record<string, any> {
  return {
    user_id: userId,
    action: 'activate',
  };
}

/**
 * Payload for user deactivating their own account
 *
 * POST /api/manage_user_account
 * { "action": "deactivate" }
 */
export function createSelfDeactivatePayload(): Record<string, any> {
  return {
    action: 'deactivate',
  };
}

/**
 * Payload for admin changing user role (future)
 *
 * POST /api/manage_user_account
 * { "user_id": 42, "user_role": "admin" }
 */
export function createChangeRolePayload(
  userId: string,
  role: 'admin' | 'alumni',
): Record<string, any> {
  return {
    user_id: userId,
    user_role: role === 'admin' ? 'admin' : 'alumni',
  };
}

/**
 * Payload for getting all users (admin)
 *
 * POST /api/get_users_by_action
 * { "action_type": "all_users" }
 */
export function createGetAllUsersPayload(): Record<string, any> {
  return {
    action_type: 'all_users',
  };
}
