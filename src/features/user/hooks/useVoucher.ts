/**
 * ============================================================================
 * VOUCHER HOOKS
 * ============================================================================
 *
 * React Query hooks for voucher-based approvals.
 *
 * Usage:
 *   const { data: vouches } = usePendingVouches();
 *   const approve = useApproveVouch();
 *   const reject = useRejectVouch();
 *
 * ============================================================================
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { voucherApi } from '../api/voucherApi';
import { toast } from '@/shared/components/ui/Toast';

// ═══════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════

export const voucherKeys = {
  all: ['voucher'] as const,
  pending: () => [...voucherKeys.all, 'pending'] as const,
};

// ═══════════════════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fetch pending vouches for the current user.
 *
 * Usage:
 * ```tsx
 * const { data: vouches = [], isLoading } = usePendingVouches();
 * ```
 */
export function usePendingVouches() {
  return useQuery({
    queryKey: voucherKeys.pending(),
    queryFn: () => voucherApi.getPendingVouches(),
    staleTime: 1000 * 60 * 1, // 1 min — pending list changes frequently
    retry: 1,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Approve a pending vouch.
 *
 * On success:
 *   - Shows success toast
 *   - Invalidates pending list to refresh
 *
 * Usage:
 * ```tsx
 * const approve = useApproveVouch();
 *
 * await approve.mutateAsync(vouchId);
 * ```
 */
export function useApproveVouch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vouchId: string) => voucherApi.approveVouch(vouchId),

    onSuccess: (result) => {
      // Invalidate to refresh the list
      queryClient.invalidateQueries({ queryKey: voucherKeys.pending() });

      // Show success message
      toast.success(result.message || 'Account approved successfully');
    },

    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve vouch');
    },
  });
}

/**
 * Reject a pending vouch with a reason.
 *
 * On success:
 *   - Shows success toast
 *   - Invalidates pending list to refresh
 *
 * Usage:
 * ```tsx
 * const reject = useRejectVouch();
 *
 * await reject.mutateAsync({
 *   vouchId: '1',
 *   reason: 'I do not recognise this person'
 * });
 * ```
 */
export function useRejectVouch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vouchId, reason }: { vouchId: string; reason?: string }) =>
      voucherApi.rejectVouch(vouchId, reason),

    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: voucherKeys.pending() });
      toast.success(result.message || 'Vouch rejected. Admin can still approve.');
    },

    onError: (error: any) => {
      toast.error(error.message || 'Failed to reject vouch');
    },
  });
}
