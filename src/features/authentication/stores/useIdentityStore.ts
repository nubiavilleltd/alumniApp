import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthSessionUser } from '../types/auth.types';
import { defaultPrivacySettings } from '../types/auth.types';

interface IdentityState {
  user: AuthSessionUser | null;

  setIdentity: (user: AuthSessionUser) => void;
  updateUser: (updates: Partial<AuthSessionUser>) => void;
  clearIdentity: () => void;
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      user: null,

      setIdentity: (user) => {
        const userWithPrivacy: AuthSessionUser = {
          ...user,
          privacy: { ...defaultPrivacySettings, ...user.privacy },
        };

        set({ user: userWithPrivacy });
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
            user: {
              ...state.user,
              ...safeUpdates,
              privacy: mergedPrivacy,
            },
          };
        }),

      clearIdentity: () => set({ user: null }),
    }),
    {
      name: 'alumniapp.auth.identity',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
