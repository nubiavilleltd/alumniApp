import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadershipService } from '@/features/leadership/services/leadership.service';
import { LeadershipFormPayload } from '../types/leadership.types';
import { handleApiError } from '@/lib/errors/apiErrorHandler';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const leadershipKeys = {
  all: ['leadership'] as const,
  list: () => [...leadershipKeys.all, 'list'] as const,
  detail: (id: number) => [...leadershipKeys.all, 'detail', id] as const,
  positionOptions: () => [...leadershipKeys.all, 'position-options'] as const,
};
// ─── Queries ──────────────────────────────────────────────────────────────────

/** All leadership members */
export function useLeadership() {
  return useQuery({
    queryKey: leadershipKeys.list(),
    queryFn: leadershipService.getAll,
    staleTime: 1000 * 60 * 30, // leadership rarely changes — 30 min
  });
}

/** Single member by id */
export function useLeader(id: number) {
  return useQuery({
    queryKey: leadershipKeys.detail(id),
    queryFn: () => leadershipService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 30,
  });
}


// ─── Mutations ────────────────────────────────────────────────────────────────

/** Add a new Exco (leadership) member */
export function useCreateLeadershipMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LeadershipFormPayload) => leadershipService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadershipKeys.list() });
    },
    onError: (error) => {
      handleApiError(error, 'Failed to add Exco');
    },
  });
}

/** Update an existing Exco's position and/or photo */
export function useUpdateLeadershipMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: LeadershipFormPayload }) =>
      leadershipService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: leadershipKeys.list() });
      queryClient.invalidateQueries({ queryKey: leadershipKeys.detail(id) });
    },
    onError: (error) => {
      handleApiError(error, 'Failed to update Exco');
    },
  });
}

/** Remove a member as Exco */
export function useRemoveLeadershipMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => leadershipService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadershipKeys.list() });
    },
    onError: (error) => {
      handleApiError(error, 'Failed to remove Exco');
    },
  });
}


/** Available position options for the Add/Edit Exco form */
export function useExcoPositionOptions() {
  return useQuery({
    queryKey: leadershipKeys.positionOptions(),
    queryFn: leadershipService.getPositionOptions,
    staleTime: 1000 * 60 * 60, // options change rarely
  });
}
