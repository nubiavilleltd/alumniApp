// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { GetMarketplaceParams } from '../types/marketplace.types';
// import { marketplaceService } from '../services/marketplace.service';
// // import {
// //   marketplaceService,
// //   type GetMarketplaceParams,
// // } from '@/features/marketplace/services/marketplace.type';

// // ─── Query Keys ───────────────────────────────────────────────────────────────
// export const marketplaceKeys = {
//   all: ['marketplace'] as const,
//   list: (params?: object) => [...marketplaceKeys.all, 'list', params] as const,
//   detail: (id: string) => [...marketplaceKeys.all, 'detail', id] as const,
//   categories: () => [...marketplaceKeys.all, 'categories'] as const,
// };

// // ─── Queries ──────────────────────────────────────────────────────────────────

// /** All businesses — raw, unfiltered */
// export function useMarketplace(params?: GetMarketplaceParams) {
//   return useQuery({
//     queryKey: marketplaceKeys.list(params),
//     queryFn: () => marketplaceService.getAll(params),
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Single business by id/slug */
// export function useMarketplaceListing(id: string) {
//   return useQuery({
//     queryKey: marketplaceKeys.detail(id),
//     queryFn: () => marketplaceService.getByOwner(id),
//     enabled: !!id,
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Categories — rarely change so staleTime is Infinity */
// export function useMarketplaceCategories() {
//   return useQuery({
//     queryKey: marketplaceKeys.categories(),
//     queryFn: marketplaceService.getCategories,
//     staleTime: Infinity,
//   });
// }

// /** Latest N businesses for homepage */
// export function useLatestListings(count = 6) {
//   return useQuery({
//     queryKey: marketplaceKeys.list(),
//     queryFn: () => marketplaceService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) => data.slice(0, count),
//   });
// }

// // ─── Mutations ────────────────────────────────────────────────────────────────

// /** Post a new business */
// export function useCreateListing() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: FormData) => marketplaceService.create(payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
//     },
//   });
// }

// /** Update a business */
// export function useUpdateListing() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
//       marketplaceService.update(id, payload),
//     onSuccess: (_, { id }) => {
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.detail(id) });
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
//     },
//   });
// }

// /** Delete a business */
// export function useDeleteListing() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => marketplaceService.delete(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
//     },
//   });
// }

// features/marketplace/hooks/useMarketplace.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { marketplaceService } from '../services/marketplace.service';
import type { Business, GetMarketplaceParams } from '../types/marketplace.types';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const marketplaceKeys = {
  all: ['marketplace'] as const,
  list: (params?: object) => [...marketplaceKeys.all, 'list', params] as const,
  detail: (id: string) => [...marketplaceKeys.all, 'detail', id] as const,
  userListings: (userId: string) => [...marketplaceKeys.all, 'user', userId] as const,
  categories: () => [...marketplaceKeys.all, 'categories'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All businesses with optional filters */
export function useMarketplace(params?: GetMarketplaceParams) {
  return useQuery({
    queryKey: marketplaceKeys.list(params),
    queryFn: () => marketplaceService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
}

/** Single business by ID */
export function useMarketplaceListing(id: string) {
  return useQuery({
    queryKey: marketplaceKeys.detail(id),
    queryFn: () => marketplaceService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/** Get current user's businesses */
export function useMyBusinesses() {
  const currentUser = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: marketplaceKeys.userListings(currentUser?.memberId || ''),
    queryFn: () => {
      if (!currentUser?.memberId) return [];
      return marketplaceService.getByOwner(currentUser.memberId);
    },
    enabled: !!currentUser?.memberId,
    staleTime: 1000 * 60 * 5,
  });
}

/** Categories for filtering */
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
    queryKey: marketplaceKeys.list({ limit: count }),
    queryFn: () => marketplaceService.getAll(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.slice(0, count),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Post a new business */
// features/marketplace/hooks/useMarketplace.ts

/** Post a new business - accepts FormData or plain object */
export function useCreateListing() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (payload: FormData | Record<string, any>) => marketplaceService.create(payload),
    onSuccess: () => {
      // Invalidate all marketplace queries
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      // Also invalidate current user's listings if we have them
      if (currentUser?.memberId) {
        queryClient.invalidateQueries({
          queryKey: marketplaceKeys.userListings(currentUser.memberId),
        });
      }
    },
  });
}

/** Update a business - accepts FormData or plain object */
export function useUpdateListing() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData | Record<string, any> }) =>
      marketplaceService.update(id, payload),
    onSuccess: (_, { id }) => {
      // Invalidate specific listing
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.detail(id) });
      // Invalidate all listings
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      // Invalidate user's listings
      if (currentUser?.memberId) {
        queryClient.invalidateQueries({
          queryKey: marketplaceKeys.userListings(currentUser.memberId),
        });
      }
    },
  });
}

/** Delete a business */
export function useDeleteListing() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (id: string) => marketplaceService.delete(id),
    onSuccess: () => {
      // Invalidate all marketplace queries
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      // Invalidate user's listings
      if (currentUser?.memberId) {
        queryClient.invalidateQueries({
          queryKey: marketplaceKeys.userListings(currentUser.memberId),
        });
      }
    },
  });
}
