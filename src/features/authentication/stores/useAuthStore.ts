// features/authentication/stores/useAuthStore.ts

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthSessionUser } from '../types/auth.types';
import { defaultPrivacySettings } from '../types/auth.types';

interface AuthState {
  user: AuthSessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  setSession: (user: AuthSessionUser, accessToken: string, refreshToken: string) => void;
  updateUser: (updates: Partial<AuthSessionUser>) => void;
  clearSession: () => void;
}

/** Remove undefined values so they don't accidentally overwrite existing store fields. */
function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setSession: (user, accessToken, refreshToken) => {
        // Always guarantee privacy settings exist
        const userWithPrivacy: AuthSessionUser = {
          ...user,
          privacy: { ...defaultPrivacySettings, ...user.privacy },
        };
        set({ user: userWithPrivacy, accessToken, refreshToken });
      },

      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return {};
          const safeUpdates = stripUndefined(updates);
          const mergedPrivacy = {
            ...defaultPrivacySettings,
            ...state.user.privacy,
            ...(safeUpdates.privacy ?? {}),
          };
          return {
            user: { ...state.user, ...safeUpdates, privacy: mergedPrivacy },
          };
        }),

      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'openalumns.auth.session',
      // localStorage persists across reloads, tab switches, and window blur
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
