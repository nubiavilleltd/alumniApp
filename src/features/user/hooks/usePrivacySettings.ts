/**
 * ============================================================================
 * USE PRIVACY SETTINGS HOOK
 * ============================================================================
 *
 * React Query hooks for privacy settings with:
 * - Fetching privacy from backend
 * - Optimistic updates (UI updates before backend confirms)
 * - Automatic cache invalidation
 * - Error handling with rollback
 *
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PrivacySettings, FieldVisibility } from '@/features/authentication/types/auth.types';
import { defaultPrivacySettings } from '@/features/authentication/types/auth.types';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { privacyService } from '../services/privacy.service';
import { toast } from '@/shared/components/ui/Toast';

/**
 * Query keys for privacy settings
 */
export const privacyKeys = {
  all: ['privacy'] as const,
  user: (userId: string) => [...privacyKeys.all, userId] as const,
};

/**
 * Get privacy settings for current user
 *
 * Fetches from backend and caches result
 */
export function usePrivacySettings() {
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.id;

  return useQuery({
    queryKey: privacyKeys.user(userId || ''),
    queryFn: () => privacyService.getPrivacySettings(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    placeholderData: defaultPrivacySettings, // Show defaults while loading
  });
}

/**
 * Update privacy for a single field with optimistic update
 *
 * OPTIMISTIC FLOW:
 * 1. User clicks toggle
 * 2. UI updates immediately (optimistic)
 * 3. Request sent to backend
 * 4. If success: keep optimistic update
 * 5. If error: revert to previous value
 */
export function useUpdateFieldPrivacy() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const userId = currentUser?.id;

  return useMutation({
    mutationFn: async ({
      field,
      visibility,
    }: {
      field: keyof PrivacySettings;
      visibility: FieldVisibility;
    }) => {
      if (!userId) throw new Error('No user ID');
      return privacyService.updateFieldPrivacy(userId, field, visibility);
    },

    // ═══════════════════════════════════════════════════════════════════
    // OPTIMISTIC UPDATE
    // ═══════════════════════════════════════════════════════════════════
    onMutate: async ({ field, visibility }) => {
      if (!userId) return;

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: privacyKeys.user(userId) });

      // Snapshot the previous value
      const previousPrivacy = queryClient.getQueryData<PrivacySettings>(privacyKeys.user(userId));

      // Optimistically update cache
      queryClient.setQueryData<PrivacySettings>(privacyKeys.user(userId), (old) => ({
        ...defaultPrivacySettings,
        ...old,
        [field]: visibility,
      }));

      // Optimistically update auth store
      if (currentUser?.privacy) {
        updateUser({
          privacy: {
            ...currentUser.privacy,
            [field]: visibility,
          },
        });
      }

      console.log(`🔄 Optimistic update: ${field} → ${visibility}`);

      // Return context for rollback
      return { previousPrivacy };
    },

    // ═══════════════════════════════════════════════════════════════════
    // SUCCESS
    // ═══════════════════════════════════════════════════════════════════
    onSuccess: (updatedPrivacy, { field, visibility }) => {
      if (!userId) return;

      console.log('✅ Privacy update confirmed by backend');

      // Update cache with backend response
      queryClient.setQueryData<PrivacySettings>(privacyKeys.user(userId), updatedPrivacy);

      // Update auth store with backend response
      updateUser({ privacy: updatedPrivacy });

      // Invalidate related caches for app-wide sync
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // Show success feedback (optional - can be removed for silent updates)
      // toast.success(`Privacy updated: ${field} is now ${visibility}`);
    },

    // ═══════════════════════════════════════════════════════════════════
    // ERROR - ROLLBACK
    // ═══════════════════════════════════════════════════════════════════
    onError: (error, { field, visibility }, context) => {
      if (!userId) return;

      console.error('❌ Privacy update failed, rolling back:', error);

      // Rollback to previous value
      if (context?.previousPrivacy) {
        queryClient.setQueryData<PrivacySettings>(
          privacyKeys.user(userId),
          context.previousPrivacy,
        );

        updateUser({ privacy: context.previousPrivacy });
      }

      toast.error('Failed to update privacy setting. Please try again.');
    },
  });
}

/**
 * Helper hook for privacy toggle component
 *
 * Usage:
 * ```tsx
 * const { value, toggle, isUpdating } = usePrivacyToggle('photo');
 *
 * <PrivacyToggle
 *   value={value}
 *   onChange={toggle}
 *   disabled={isUpdating}
 * />
 * ```
 */
export function usePrivacyToggle(field: keyof PrivacySettings) {
  const { data: privacy, isLoading } = usePrivacySettings();
  const updatePrivacy = useUpdateFieldPrivacy();

  const value = privacy?.[field] || 'private';

  const toggle = (newValue: FieldVisibility) => {
    updatePrivacy.mutate({ field, visibility: newValue });
  };

  return {
    value,
    toggle,
    isLoading,
    isUpdating: updatePrivacy.isPending,
  };
}
