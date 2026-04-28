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

export const userManagementApi = {
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
