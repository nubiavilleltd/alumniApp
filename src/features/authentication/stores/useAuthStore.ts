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

// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';
// import type { AuthSessionUser } from '../types/auth.types';
// import { defaultPrivacySettings } from '../types/auth.types';

// interface AuthState {
//   user: AuthSessionUser | null;
//   accessToken: string | null;
//   refreshToken: string | null;

//   setSession: (user: AuthSessionUser, accessToken: string, refreshToken: string) => void;
//   updateUser: (updates: Partial<AuthSessionUser>) => void;
//   clearSession: () => void;
// }

// /**
//  * Strip undefined values from an object so they don't overwrite
//  * existing store values during a partial update.
//  *
//  * Problem this solves: the backend response only returns fields it knows about.
//  * Fields like `photo` come back as `undefined` when the backend returns
//  * "default.png" or no avatar. Without this, spreading `updates` onto the
//  * existing user would wipe out the photo the user already had.
//  */
// function stripUndefined<T extends object>(obj: T): Partial<T> {
//   return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       accessToken: null,
//       refreshToken: null,

//       setSession: (user, accessToken, refreshToken) => {
//         // Always guarantee privacy settings exist — merge defaults under
//         // whatever the backend/session returns so badges always render.
//         const userWithPrivacy: AuthSessionUser = {
//           ...user,
//           privacy: { ...defaultPrivacySettings, ...user.privacy },
//         };
//         set({ user: userWithPrivacy, accessToken, refreshToken });
//       },

//       /**
//        * Merge a partial update into the current user.
//        *
//        * Rules:
//        * 1. Only defined values are applied — undefined fields in `updates`
//        *    do not overwrite existing store values.
//        * 2. Privacy is always merged with defaults so badges are never missing.
//        * 3. The user must already exist; this is not a login action.
//        */
//       updateUser: (updates) =>
//         set((state) => {
//           if (!state.user) return {};

//           const safeUpdates = stripUndefined(updates);

//           // Merge privacy carefully: existing > incoming > defaults
//           const mergedPrivacy = {
//             ...defaultPrivacySettings,
//             ...state.user.privacy,
//             ...(safeUpdates.privacy ?? {}),
//           };

//           return {
//             user: {
//               ...state.user,
//               ...safeUpdates,
//               privacy: mergedPrivacy,
//             },
//           };
//         }),

//       clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
//     }),
//     {
//       name: 'openalumns.auth.session',
//       storage: createJSONStorage(() => window.sessionStorage),
//     },
//   ),
// );

// features/authentication/stores/useAuthStore.ts

// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';

// interface AuthState {
//   // ✅ Keep only session tokens
//   user: { id: string; memberId: string; role: string } | null;
//   accessToken: string | null;
//   refreshToken: string | null;

//   setSession: (
//     user: { id: string; memberId: string; role: string },
//     accessToken: string,
//     refreshToken: string,
//   ) => void;
//   clearSession: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       accessToken: null,
//       refreshToken: null,

//       setSession: (user, accessToken, refreshToken) => {
//         set({ user, accessToken, refreshToken });
//       },

//       clearSession: () =>
//         set({
//           user: null,
//           accessToken: null,
//           refreshToken: null,
//         }),
//     }),
//     {
//       name: 'openalumns.auth.session',
//       storage: createJSONStorage(() => window.sessionStorage),
//     },
//   ),
// );

// features/authentication/stores/useAuthStore.ts
//
// CHANGES FROM PREVIOUS VERSION:
//
//  1. Uses localStorage instead of sessionStorage.
//     sessionStorage clears when:
//       - The browser tab is closed and re-opened
//       - Some mobile browsers clear it when the page loses focus
//       - The user refreshes in certain browser configurations
//     localStorage persists across all of these. We clear it ourselves on logout.
//
//  2. Stores the full AuthSessionUser instead of just { id, memberId, role }.
//     Previously, the store only held a minimal token payload and Navigation had
//     to wait for useCurrentUser() to finish a network request before it could
//     render the user dropdown. This caused a visible Login button flicker after
//     every page load / reload. Now the full profile is available synchronously
//     from localStorage on mount — no network request needed just to render the nav.
//
//  3. Adds updateUser() back — needed by EditProfileModal after profile updates.

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
