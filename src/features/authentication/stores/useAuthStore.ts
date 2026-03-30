// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';
// import type { AuthSessionUser } from '../types/auth.types';

// interface AuthState {
//   user: AuthSessionUser | null;
//   setSession: (user: AuthSessionUser) => void;
//   clearSession: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       setSession: (user) => set({ user }),
//       clearSession: () => set({ user: null }),
//     }),
//     {
//       name: 'openalumns.auth.session',
//       storage: createJSONStorage(() => window.sessionStorage),
//     },
//   ),
// );

// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';
// import type { AuthSessionUser } from '../types/auth.types';

// interface AuthState {
//   user: AuthSessionUser | null;
//   setSession: (user: AuthSessionUser) => void;
//   updateUser: (updates: Partial<AuthSessionUser>) => void;
//   clearSession: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       setSession: (user) => set({ user }),

//       // Update user profile/privacy without full re-authentication
//       // TODO: When backend is ready, this should call PUT /profile endpoint
//       updateUser: (updates) =>
//         set((state) => ({
//           user: state.user ? { ...state.user, ...updates } : null,
//         })),

//       clearSession: () => set({ user: null }),
//     }),
//     {
//       name: 'openalumns.auth.session',
//       storage: createJSONStorage(() => window.sessionStorage),
//     },
//   ),
// );

// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';
// import type { AuthSessionUser } from '../types/auth.types';

// interface AuthState {
//   user: AuthSessionUser | null;
//   accessToken: string | null;
//   refreshToken: string | null;

//   setSession: (user: AuthSessionUser, accessToken: string, refreshToken: string) => void;
//   updateUser: (updates: Partial<AuthSessionUser>) => void;
//   clearSession: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       accessToken: null,
//       refreshToken: null,

//       setSession: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),

//       // Update user profile/privacy without full re-authentication
//       // TODO: When backend is ready, this should call PUT /profile endpoint
//       updateUser: (updates) =>
//         set((state) => ({
//           user: state.user ? { ...state.user, ...updates } : null,
//         })),

//       clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
//     }),
//     {
//       name: 'openalumns.auth.session',
//       storage: createJSONStorage(() => window.sessionStorage),
//     },
//   ),
// );

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

/**
 * Strip undefined values from an object so they don't overwrite
 * existing store values during a partial update.
 *
 * Problem this solves: the backend response only returns fields it knows about.
 * Fields like `photo` come back as `undefined` when the backend returns
 * "default.png" or no avatar. Without this, spreading `updates` onto the
 * existing user would wipe out the photo the user already had.
 */
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
        // Always guarantee privacy settings exist — merge defaults under
        // whatever the backend/session returns so badges always render.
        const userWithPrivacy: AuthSessionUser = {
          ...user,
          privacy: { ...defaultPrivacySettings, ...user.privacy },
        };
        set({ user: userWithPrivacy, accessToken, refreshToken });
      },

      /**
       * Merge a partial update into the current user.
       *
       * Rules:
       * 1. Only defined values are applied — undefined fields in `updates`
       *    do not overwrite existing store values.
       * 2. Privacy is always merged with defaults so badges are never missing.
       * 3. The user must already exist; this is not a login action.
       */
      updateUser: (updates) =>
        set((state) => {
          if (!state.user) return {};

          const safeUpdates = stripUndefined(updates);

          // Merge privacy carefully: existing > incoming > defaults
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

      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'openalumns.auth.session',
      storage: createJSONStorage(() => window.sessionStorage),
    },
  ),
);
