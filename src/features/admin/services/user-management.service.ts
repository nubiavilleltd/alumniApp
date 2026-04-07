/**
 * ============================================================================
 * USER MANAGEMENT SERVICE
 * ============================================================================
 *
 * API methods for managing user accounts
 *
 * ============================================================================
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import {
  createAdminActivatePayload,
  createAdminDeactivatePayload,
  createGetAllUsersPayload,
  createSelfDeactivatePayload,
  mapBackendUserList,
  UserAccount,
} from '../api/adapters/user-management.adapter';
// import {
//   mapBackendUserList,
//   createAdminDeactivatePayload,
//   createAdminActivatePayload,
//   createSelfDeactivatePayload,
//   createGetAllUsersPayload,
//   type UserAccount,
// } from '../api/adapters/user-management.adapter';

export const userManagementApi = {
  /**
   * Get all users (admin only)
   *
   * POST /api/get_users_by_action
   * { "action_type": "all_users" }
   */
  // async getAllUsers(): Promise<UserAccount[]> {
  //   const payload = createGetAllUsersPayload();
  //   const { data } = await apiClient.post(API_ENDPOINTS.ADMIN.MEMBER_LIST, payload);
  //   return mapBackendUserList(data);
  // },

  /**
   * Admin deactivates a user account
   *
   * POST /api/manage_user_account
   * { "user_id": "42", "action": "deactivate" }
   */
  async adminDeactivateUser(userId: string): Promise<void> {
    const payload = createAdminDeactivatePayload(userId);
    await apiClient.post(API_ENDPOINTS.USER.MANAGE_ACCOUNT, payload);
  },

  /**
   * Admin activates a user account
   *
   * POST /api/manage_user_account
   * { "user_id": "42", "action": "activate" }
   */
  async adminActivateUser(userId: string): Promise<void> {
    const payload = createAdminActivatePayload(userId);
    await apiClient.post(API_ENDPOINTS.USER.MANAGE_ACCOUNT, payload);
  },

  /**
   * User deactivates their own account
   *
   * POST /api/manage_user_account
   * { "action": "deactivate" }
   */
  async deactivateOwnAccount(): Promise<void> {
    const payload = createSelfDeactivatePayload();
    await apiClient.post(API_ENDPOINTS.USER.MANAGE_ACCOUNT, payload);
  },
};
