import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  marketplaceService,
  type GetMarketplaceParams,
} from '@/features/marketplace/services/marketplace.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const marketplaceKeys = {
  all: ['marketplace'] as const,
  list: (params?: object) => [...marketplaceKeys.all, 'list', params] as const,
  detail: (id: string) => [...marketplaceKeys.all, 'detail', id] as const,
  categories: () => [...marketplaceKeys.all, 'categories'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All businesses — raw, unfiltered */
export function useMarketplace(params?: GetMarketplaceParams) {
  return useQuery({
    queryKey: marketplaceKeys.list(params),
    queryFn: () => marketplaceService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
}

/** Single business by id/slug */
export function useMarketplaceListing(id: string) {
  return useQuery({
    queryKey: marketplaceKeys.detail(id),
    queryFn: () => marketplaceService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/** Categories — rarely change so staleTime is Infinity */
export function useMarketplaceCategories() {
  return useQuery({
    queryKey: marketplaceKeys.categories(),
    queryFn: marketplaceService.getCategories,
    staleTime: Infinity,
  });
}

/** Latest N businesses for homepage */
export function useLatestListings(count = 6) {
  return useQuery({
    queryKey: marketplaceKeys.list(),
    queryFn: () => marketplaceService.getAll(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.slice(0, count),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Post a new business */
export function useCreateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => marketplaceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
    },
  });
}

/** Update a business */
export function useUpdateListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      marketplaceService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
    },
  });
}

/** Delete a business */
export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marketplaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
    },
  });
}
