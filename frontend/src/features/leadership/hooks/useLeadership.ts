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
    mutationFn: (payload: LeadershipFormPayload) => {
  if (payload.photoFile) {
    const formData = new FormData();
    formData.append('user_id', payload.memberId);
    formData.append('position_title', payload.role);
    formData.append('sort_order', '0');
    formData.append('is_featured', '0');
    formData.append('leadership_photo', payload.photoFile);
    return leadershipService.create(formData);
  }

  return leadershipService.create({
    user_id: payload.memberId,
    position_title: payload.role,
    sort_order: '0',
    is_featured: '0',
  });
},
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
    mutationFn: ({
  id,
  payload,
  photoRemoved,
}: {
  id: number;
  payload: LeadershipFormPayload;
  photoRemoved?: boolean;
}) => {
  if (payload.photoFile) {
    const formData = new FormData();
    formData.append('position_title', payload.role);
    formData.append('leadership_photo', payload.photoFile);
    return leadershipService.update(id, formData);
  }

  return leadershipService.update(id, {
    position_title: payload.role,
    ...(photoRemoved ? { remove_photo: '1' } : {}),
  });
},
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
