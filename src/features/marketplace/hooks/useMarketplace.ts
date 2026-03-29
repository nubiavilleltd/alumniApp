// // features/marketplace/hooks/useMarketplace.ts

// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { marketplaceService } from '../services/marketplace.service';
// import type { Business, GetMarketplaceParams } from '../types/marketplace.types';

// // ─── Query Keys ───────────────────────────────────────────────────────────────
// export const marketplaceKeys = {
//   all: ['marketplace'] as const,
//   list: (params?: object) => [...marketplaceKeys.all, 'list', params] as const,
//   detail: (id: string) => [...marketplaceKeys.all, 'detail', id] as const,
//   userListings: (userId: string) => [...marketplaceKeys.all, 'user', userId] as const,
//   categories: () => [...marketplaceKeys.all, 'categories'] as const,
// };

// // ─── Queries ──────────────────────────────────────────────────────────────────

// /** All businesses with optional filters */
// export function useMarketplace(params?: GetMarketplaceParams) {
//   return useQuery({
//     queryKey: marketplaceKeys.list(params),
//     queryFn: () => marketplaceService.getAll(params),
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Single business by ID */
// export function useMarketplaceListing(id: string) {
//   return useQuery({
//     queryKey: marketplaceKeys.detail(id),
//     queryFn: () => marketplaceService.getById(id),
//     enabled: !!id,
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Get current user's businesses */
// export function useMyBusinesses() {
//   const currentUser = useAuthStore((state) => state.user);

//   return useQuery({
//     queryKey: marketplaceKeys.userListings(currentUser?.memberId || ''),
//     queryFn: () => {
//       if (!currentUser?.memberId) return [];
//       return marketplaceService.getByOwner(currentUser.memberId);
//     },
//     enabled: !!currentUser?.memberId,
//     staleTime: 1000 * 60 * 5,
//   });
// }

// /** Categories for filtering */
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
//     queryKey: marketplaceKeys.list({ limit: count }),
//     queryFn: () => marketplaceService.getAll(),
//     staleTime: 1000 * 60 * 5,
//     select: (data) => data.slice(0, count),
//   });
// }

// // ─── Mutations ────────────────────────────────────────────────────────────────

// /** Post a new business */
// // features/marketplace/hooks/useMarketplace.ts

// /** Post a new business - accepts FormData or plain object */
// export function useCreateListing() {
//   const queryClient = useQueryClient();
//   const currentUser = useAuthStore((state) => state.user);

//   return useMutation({
//     mutationFn: (payload: FormData | Record<string, any>) => marketplaceService.create(payload),
//     onSuccess: () => {
//       // Invalidate all marketplace queries
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
//       // Also invalidate current user's listings if we have them
//       if (currentUser?.memberId) {
//         queryClient.invalidateQueries({
//           queryKey: marketplaceKeys.userListings(currentUser.memberId),
//         });
//       }
//     },
//   });
// }

// /** Update a business - accepts FormData or plain object */
// export function useUpdateListing() {
//   const queryClient = useQueryClient();
//   const currentUser = useAuthStore((state) => state.user);

//   return useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: FormData | Record<string, any> }) =>
//       marketplaceService.update(id, payload),
//     onSuccess: (_, { id }) => {
//       // Invalidate specific listing
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.detail(id) });
//       // Invalidate all listings
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
//       // Invalidate user's listings
//       if (currentUser?.memberId) {
//         queryClient.invalidateQueries({
//           queryKey: marketplaceKeys.userListings(currentUser.memberId),
//         });
//       }
//     },
//   });
// }

// /** Delete a business */
// export function useDeleteListing() {
//   const queryClient = useQueryClient();
//   const currentUser = useAuthStore((state) => state.user);

//   return useMutation({
//     mutationFn: (id: string) => marketplaceService.delete(id),
//     onSuccess: () => {
//       // Invalidate all marketplace queries
//       queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
//       // Invalidate user's listings
//       if (currentUser?.memberId) {
//         queryClient.invalidateQueries({
//           queryKey: marketplaceKeys.userListings(currentUser.memberId),
//         });
//       }
//     },
//   });
// }

// features/marketplace/hooks/useMarketplace.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { toast } from '@/shared/components/ui/Toast';
import { marketplaceService } from '../services/marketplace.service';
import type { GetMarketplaceParams } from '../types/marketplace.types';
import type { CreateListingFormData } from '../api/adapters/marketplace.adapter';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const marketplaceKeys = {
  all: ['marketplace'] as const,
  list: (params?: object) => [...marketplaceKeys.all, 'list', params] as const,
  detail: (id: string) => [...marketplaceKeys.all, 'detail', id] as const,
  userListings: (userId: string) => [...marketplaceKeys.all, 'user', userId] as const,
  categories: () => [...marketplaceKeys.all, 'categories'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** All active listings with optional search / category filter. */
export function useMarketplace(params?: GetMarketplaceParams) {
  return useQuery({
    queryKey: marketplaceKeys.list(params),
    queryFn: () => marketplaceService.getAll(params),
    staleTime: 1000 * 60 * 5,
  });
}

/** Single listing by backend ID. */
export function useMarketplaceListing(id: string) {
  return useQuery({
    queryKey: marketplaceKeys.detail(id),
    queryFn: () => marketplaceService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Current user's own listings.
 *
 * IMPORTANT: passes `currentUser.id` (the backend numeric ID), NOT `memberId`.
 * The backend filters by `user_id` which is a numeric string like "5",
 * not the frontend MBR-{year}-{hex} format.
 */
export function useMyBusinesses() {
  const currentUser = useAuthStore((state) => state.user);
  // user.id is the legacy numeric backend ID — this is what the backend's
  // user_id field contains. memberId is the frontend-format key and will
  // never match backend user_id values.
  const backendUserId = currentUser?.id ?? '';

  return useQuery({
    queryKey: marketplaceKeys.userListings(backendUserId),
    queryFn: () => marketplaceService.getByOwner(backendUserId),
    enabled: !!backendUserId,
    staleTime: 1000 * 60 * 5,
  });
}

/** Marketplace categories — fetched once, cached forever. */
export function useMarketplaceCategories() {
  return useQuery({
    queryKey: marketplaceKeys.categories(),
    queryFn: marketplaceService.getCategories,
    staleTime: Infinity,
  });
}

/** Latest N listings for the homepage. */
export function useLatestListings(count = 6) {
  return useQuery({
    queryKey: marketplaceKeys.list({ limit: count }),
    queryFn: () => marketplaceService.getAll(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.slice(0, count),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Create a new listing. Caller passes form data; hook reads userId from store. */
export function useCreateListing() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (formData: CreateListingFormData) => {
      // Use numeric backend ID as user_id in the payload
      const userId = currentUser?.id ?? '';
      const chapterId = currentUser?.chapterId;
      return marketplaceService.create(formData, userId, chapterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      toast.success('Your listing has been posted successfully.');
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}

/** Update an existing listing. */
export function useUpdateListing() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: CreateListingFormData }) =>
      marketplaceService.update(id, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: marketplaceKeys.userListings(currentUser.id) });
      }
      toast.success('Your listing has been updated.');
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}

/** Delete a listing. */
export function useDeleteListing() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: (id: string) => marketplaceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: marketplaceKeys.all });
      if (currentUser?.id) {
        queryClient.invalidateQueries({ queryKey: marketplaceKeys.userListings(currentUser.id) });
      }
      toast.success('Your listing has been deleted.');
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}
