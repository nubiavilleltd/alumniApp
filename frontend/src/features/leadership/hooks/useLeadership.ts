import { useQuery } from '@tanstack/react-query';
import { leadershipService } from '@/features/leadership/services/leadership.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const leadershipKeys = {
  all: ['leadership'] as const,
  list: () => [...leadershipKeys.all, 'list'] as const,
  detail: (id: number) => [...leadershipKeys.all, 'detail', id] as const,
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
