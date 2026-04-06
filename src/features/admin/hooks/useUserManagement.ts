/**
 * ============================================================================
 * USER MANAGEMENT HOOKS
 * ============================================================================
 *
 * React Query hooks for:
 * - Fetching all users (admin)
 * - Deactivating users (admin or self)
 * - Activating users (admin only)
 *
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userManagementApi } from '../services/user-management.service';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { toast } from '@/shared/components/ui/Toast';
import { ROUTES } from '@/shared/constants/routes';

// ═══════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════

export const userManagementKeys = {
  all: ['userManagement'] as const,
  lists: () => [...userManagementKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...userManagementKeys.lists(), filters] as const,
};

// ═══════════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all users (admin only)
 *
 * Usage:
 * ```tsx
 * const { data: users, isLoading } = useAllUsers();
 * ```
 */
export function useAllUsers() {
  return useQuery({
    queryKey: userManagementKeys.list(),
    queryFn: () => userManagementApi.getAllUsers(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Admin deactivates a user
 *
 * Usage:
 * ```tsx
 * const deactivate = useAdminDeactivateUser();
 * await deactivate.mutateAsync('42');
 * ```
 */
export function useAdminDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userManagementApi.adminDeactivateUser(userId),

    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: userManagementKeys.all });
      queryClient.invalidateQueries({ queryKey: ['alumni'] });

      toast.success('User account deactivated');
    },

    onError: (error: any) => {
      toast.error(error.message || 'Failed to deactivate user');
    },
  });
}

/**
 * Admin activates a user
 *
 * Usage:
 * ```tsx
 * const activate = useAdminActivateUser();
 * await activate.mutateAsync('42');
 * ```
 */
export function useAdminActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userManagementApi.adminActivateUser(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userManagementKeys.all });
      queryClient.invalidateQueries({ queryKey: ['alumni'] });

      toast.success('User account activated');
    },

    onError: (error: any) => {
      toast.error(error.message || 'Failed to activate user');
    },
  });
}

/**
 * User deactivates their own account
 *
 * Usage:
 * ```tsx
 * const deactivate = useDeactivateOwnAccount();
 * await deactivate.mutateAsync();
 * // User is automatically logged out
 * ```
 */
export function useDeactivateOwnAccount() {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: () => userManagementApi.deactivateOwnAccount(),

    onSuccess: () => {
      toast.success('Account deactivated. You have been logged out.');

      // Clear session and redirect
      setTimeout(() => {
        clearSession();
        navigate(ROUTES.HOME, { replace: true });
      }, 1000);
    },

    onError: (error: any) => {
      toast.error(error.message || 'Failed to deactivate account');
    },
  });
}
