/**
 * ============================================================================
 * ROLE MANAGEMENT HOOK
 * ============================================================================
 *
 * React Query mutation for changing user roles.
 *
 * ============================================================================
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roleManagementApi } from '../services/role-management.service';
import { toast } from '@/shared/components/ui/Toast';
import type { UserRole } from '../api/adapters/role-management.adapter';

/**
 * Change user role
 *
 * Usage:
 * ```tsx
 * const changeRole = useChangeUserRole();
 *
 * await changeRole.mutateAsync({
 *   userId: '42',
 *   newRole: 'admin'
 * });
 * ```
 */
export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) =>
      roleManagementApi.changeUserRole(userId, newRole),

    onSuccess: (_data, variables) => {
      const roleLabel = variables.newRole === 'admin' ? 'Admin' : 'Member';

      // Show success message
      toast.success(`User role changed to ${roleLabel} successfully`);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      queryClient.invalidateQueries({ queryKey: ['userManagement'] });
    },

    onError: (error: any) => {
      // Error message already sanitized in service
      toast.error(error.message || 'Failed to change user role');
    },
  });
}
