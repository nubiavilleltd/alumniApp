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

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthSessionUser } from '../types/auth.types';

interface AuthState {
  user: AuthSessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;

  setSession: (user: AuthSessionUser, accessToken: string, refreshToken: string) => void;
  updateUser: (updates: Partial<AuthSessionUser>) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setSession: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),

      // Update user profile/privacy without full re-authentication
      // TODO: When backend is ready, this should call PUT /profile endpoint
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'openalumns.auth.session',
      storage: createJSONStorage(() => window.sessionStorage),
    },
  ),
);
