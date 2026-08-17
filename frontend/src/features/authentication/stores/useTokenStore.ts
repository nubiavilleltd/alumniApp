
// // // ═══════════════════════════════════════════════════════════════════════════
// // // USAGE EXAMPLES
// // // ═══════════════════════════════════════════════════════════════════════════

// // /**
// //  * LOGIN (Remember Me = FALSE)
// //  *
// //  * const { data } = await api.login(credentials);
// //  * useTokenStore.getState().setTokens(data.accessToken, false);
// //  *
// //  * Result:
// //  * - Token saved in sessionStorage
// //  * - Token ONLY exists in current tab
// //  * - Opening new tab → token is null (expected!)
// //  * - Closing tab → token deleted
// //  * - Refreshing page → token persists ✅
// //  */

// // /**
// //  * LOGIN (Remember Me = TRUE)
// //  *
// //  * const { data } = await api.login(credentials);
// //  * useTokenStore.getState().setTokens(data.accessToken, true);
// //  *
// //  * Result:
// //  * - Token saved in localStorage
// //  * - Token shared across all tabs ✅
// //  * - Opening new tab → token exists ✅
// //  * - Closing browser → token persists ✅
// //  * - Refreshing page → token persists ✅
// //  */

// // /**
// //  * LOGOUT
// //  *
// //  * useTokenStore.getState().clearTokens();
// //  *
// //  * Result:
// //  * - Token cleared from both storages
// //  * - All tabs lose access
// //  */

// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';



// interface TokenState {
//   accessToken: string | null;
//   refreshToken: string | null;
//   rememberMe: boolean;
//   _hydrated: boolean;
//   _isLoggingOut: boolean;

//   setTokens: (accessToken: string, refreshToken: string) => void;
//   setRememberMe: (value: boolean) => void;
//   clearTokens: () => void;
//   setLoggingOut: (value: boolean) => void;
// }

// export const useTokenStore = create<TokenState>()(
//   persist(
//     (set) => ({
//       accessToken: null,
//       refreshToken: null,
//       rememberMe: false,
//       _hydrated: false,
//       _isLoggingOut: false,

//       setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
//       setRememberMe: (value) => set({ rememberMe: value }),
//       setLoggingOut: (value) => set({ _isLoggingOut: value }),
//       clearTokens: () =>
//         set({
//           accessToken: null,
//           refreshToken: null,
//           rememberMe: false,
//         }),
//     }),
//     {
//       name: 'alumniapp.auth.tokens',
//       onRehydrateStorage: () => (state) => {
//         if (state) state._hydrated = true;
//       },
//       partialize: (state) => ({
//         accessToken: state.accessToken,
//         refreshToken: state.refreshToken,
//         rememberMe: state.rememberMe,
//         // Don't persist _isLoggingOut
//       }),
//       storage: createJSONStorage(() => ({
//         getItem: (name) => {
//           try {
//             const fromSession = sessionStorage.getItem(name);
//             if (fromSession) return fromSession;
//             const fromLocal = localStorage.getItem(name);
//             if (fromLocal) return fromLocal;
//             return null;
//           } catch (error) {
//             console.error('Failed to read tokens from storage:', error);
//             return null;
//           }
//         },
//         setItem: (name, value) => {
//           try {
//             const parsed = JSON.parse(value);
//             const rememberMe = parsed?.state?.rememberMe ?? false;
//             const targetStorage = rememberMe ? localStorage : sessionStorage;
//             const oppositeStorage = rememberMe ? sessionStorage : localStorage;
//             targetStorage.setItem(name, value);
//             oppositeStorage.removeItem(name);
//           } catch (error) {
//             console.error('Failed to write tokens to storage:', error);
//           }
//         },
//         removeItem: (name) => {
//           try {
//             localStorage.removeItem(name);
//             sessionStorage.removeItem(name);
//           } catch (error) {
//             console.error('Failed to remove tokens from storage:', error);
//           }
//         },
//       })),
//     },
//   ),
// );










// ═══════════════════════════════════════════════════════════════════════════
// USAGE
// ═══════════════════════════════════════════════════════════════════════════
//
// LOGIN
//
//   const { data } = await api.login({ ...credentials, remember_me: rememberMe });
//   useTokenStore.getState().setTokens(data.accessToken, data.refreshToken);
//
//   "Remember me" is sent to the backend and controls how long the refresh
//   token stays valid there (e.g. 1 day vs 30 days). The frontend does not
//   decide this — it just stores whatever token it's given.
//
// LOGOUT
//
//   useTokenStore.getState().clearTokens();
//
// Result, always, regardless of how the user logged in:
//   - Token lives in localStorage
//   - Shared across all tabs, including duplicated tabs and links opened
//     in a new tab
//   - Persists across refresh and browser restarts
//   - Session ends when the backend expires/revokes the refresh token,
//     not when a tab closes
//
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  _hydrated: boolean;
  _isLoggingOut: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  setLoggingOut: (value: boolean) => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      _hydrated: false,
      _isLoggingOut: false,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setLoggingOut: (value) => set({ _isLoggingOut: value }),
      clearTokens: () =>
        set({
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: 'alumniapp.auth.tokens',
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        // _isLoggingOut and _hydrated are runtime-only, never persisted
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
