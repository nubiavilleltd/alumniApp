// features/admin/hooks/useAdminDashboard.ts
//
// React Query hooks for the admin dashboard.
// Follows the same pattern as useAlumni.ts.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminDashboardApi } from '../api/adminDashboardApi';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  pending: () => [...adminKeys.all, 'pending'] as const,
  approved: () => [...adminKeys.all, 'approved'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Full dashboard data — stats + both member lists in one call.
 * Used by AdminDashboardPage on initial load.
 */
export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminDashboardApi.getDashboard(),
    staleTime: 1000 * 60 * 2, // 2 min — dashboard data should be reasonably fresh
    retry: 1,
  });
}

/**
 * Pending approvals only — used when you want to refetch just this slice
 * without reloading the whole dashboard.
 */
export function usePendingMembers() {
  return useQuery({
    queryKey: adminKeys.pending(),
    queryFn: () => adminDashboardApi.getPendingMembers(),
    staleTime: 1000 * 60 * 1, // 1 min — pending list changes more often
    retry: 1,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Approve a pending member.
 *
 * On success:
 *   - Invalidates pending list so count badge updates everywhere
 *   - Invalidates approved list so recent members panel refreshes
 *   - Invalidates full dashboard so stats re-derive
 */
export function useApproveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminDashboardApi.approveMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adminKeys.approved() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}

/**
 * Reject a pending member (with optional reason).
 *
 * On success: same cache invalidation as approve.
 */
export function useRejectMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) =>
      adminDashboardApi.rejectMember(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pending() });
      queryClient.invalidateQueries({ queryKey: adminKeys.approved() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboard() });
    },
  });
}
