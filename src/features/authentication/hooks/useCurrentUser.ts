// features/authentication/hooks/useCurrentUser.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { authApi } from '../services/auth.service';
import type { AuthSessionUser } from '../types/auth.types';

/**
 * Query keys for current user
 */
export const currentUserKeys = {
  all: ['currentUser'] as const,
  detail: (userId: string) => [...currentUserKeys.all, userId] as const,
};

/**
 * Hook to get current user's profile from backend
 *
 * This replaces reading user from Zustand store.
 * Always fetches fresh data from backend.
 *
 * Usage:
 * ```tsx
 * const { data: user, isLoading } = useCurrentUser();
 *
 * if (isLoading) return <Spinner />;
 * if (!user) return <LoginPrompt />;
 *
 * return <div>Welcome, {user.fullName}!</div>
 * ```
 */
export function useCurrentUser() {
  const currentUser = useAuthStore((state) => state.user);

  console.log('okay okay', { currentUser });

  return useQuery({
    queryKey: currentUserKeys.detail(currentUser?.id || ''),
    queryFn: () => authApi.getCurrentUser(currentUser?.id!),
    enabled: !!currentUser, // Only fetch if logged in
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook to invalidate current user cache
 *
 * Call this after profile updates to force re-fetch
 *
 * Usage:
 * ```tsx
 * const invalidateUser = useInvalidateCurrentUser();
 *
 * // After updating profile
 * await updateProfile(data);
 * invalidateUser(); // ← Forces re-fetch
 * ```
 */
export function useInvalidateCurrentUser() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: currentUserKeys.all,
    });
  };
}
