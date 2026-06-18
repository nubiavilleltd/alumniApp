// features/authentication/hooks/useCurrentUser.ts
//
// CHANGE: The hook now reads from the auth store (localStorage) synchronously
// as its initial data, so components get something to render immediately.
// The network request still happens in the background to refresh stale data,
// but it no longer gates the initial render.

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi } from '../services/auth.service';
import type { AuthSessionUser } from '../types/auth.types';
import { useIdentityStore } from '../stores/useIdentityStore';

export const currentUserKeys = {
  all: ['currentUser'] as const,
  detail: (userId: string) => [...currentUserKeys.all, userId] as const,
};

/**
 * Returns the current user's full profile.
 *
 * Reads from localStorage (via Zustand) synchronously — so `data` is
 * available on the very first render without a network request.
 * The background query keeps it fresh from the backend.
 *
 * Usage:
 *   const { data: user, isLoading } = useCurrentUser();
 *   // data is available immediately if the user was previously logged in
 */
export function useCurrentUser() {
  const storeUser = useIdentityStore((state) => state.user);

  return useQuery<AuthSessionUser | null>({
    queryKey: currentUserKeys.detail(storeUser?.id || ''),
    queryFn: () => (storeUser?.id ? authApi.getCurrentUser(storeUser.id) : null),
    enabled: !!storeUser?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    // Seed the cache with the store value so components render immediately.
    // React Query will still run the queryFn in the background when stale.
    initialData: storeUser ?? undefined,
    initialDataUpdatedAt: 0, // treat as stale so background fetch still runs
  });
}

/**
 * Invalidate the current user cache — call after profile updates.
 */
export function useInvalidateCurrentUser() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: currentUserKeys.all });
}
