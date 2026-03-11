import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '@/features/projects/services/projects.service';
import { DonatePayload } from '../types/project.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All projects */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: projectsService.getAll,
    staleTime: 1000 * 60 * 10,
  });
}

/** Single project by id */
export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Donate to a project */
export function useDonateToProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DonatePayload }) =>
      projectsService.donate(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
    },
  });
}
