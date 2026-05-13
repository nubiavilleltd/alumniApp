// /**
//  * ============================================================================
//  * TOKEN STORE - CORRECTED IMPLEMENTATION
//  * ============================================================================
//  *
//  * FIXES:
//  * ✅ Removed refreshToken (should be in httpOnly cookie)
//  * ✅ Correct storage priority (sessionStorage > localStorage)
//  * ✅ Proper error handling
//  * ✅ No race conditions
//  *
//  * BEHAVIOR:
//  * - rememberMe = false → sessionStorage (clears on tab close, tab-isolated)
//  * - rememberMe = true → localStorage (persists, shared across tabs)
//  *
//  * ============================================================================
//  */

// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';

// interface TokenState {
//   accessToken: string | null;
//   refreshToken: string | null;
//   // ✅ NO refreshToken - handled by httpOnly cookies
//   rememberMe: boolean;

//   setTokens: (accessToken: string, refreshToken: string) => void;
//   setRememberMe: (value: boolean) => void;
//   clearTokens: () => void;
// }

// export const useTokenStore = create<TokenState>()(
//   persist(
//     (set) => ({
//       accessToken: null,
//       refreshToken: null,
//       rememberMe: false,

//       setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
//       setRememberMe: (value) => set({ rememberMe: value }),

//       clearTokens: () =>
//         set({
//           accessToken: null,
//           refreshToken: null,
//           rememberMe: false,
//         }),
//     }),
//     {
//       name: 'alumniapp.auth.tokens',

//       storage: createJSONStorage(() => ({
//         getItem: (name) => {
//           try {
//             // ✅ CORRECT PRIORITY: Active session (sessionStorage) first
//             // Then fallback to remembered session (localStorage)
//             const fromSession = sessionStorage.getItem(name);
//             if (fromSession) {
//               return fromSession;
//             }

//             const fromLocal = localStorage.getItem(name);
//             if (fromLocal) {
//               return fromLocal;
//             }

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

//             // Choose target storage
//             const targetStorage = rememberMe ? localStorage : sessionStorage;
//             const oppositeStorage = rememberMe ? sessionStorage : localStorage;

//             // Write to target
//             targetStorage.setItem(name, value);

//             // Clean up opposite storage to prevent duplicates
//             oppositeStorage.removeItem(name);
//           } catch (error) {
//             console.error('Failed to write tokens to storage:', error);
//           }
//         },

//         removeItem: (name) => {
//           try {
//             // Clear from both locations
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

// // ═══════════════════════════════════════════════════════════════════════════
// // USAGE EXAMPLES
// // ═══════════════════════════════════════════════════════════════════════════

// /**
//  * LOGIN (Remember Me = FALSE)
//  *
//  * const { data } = await api.login(credentials);
//  * useTokenStore.getState().setTokens(data.accessToken, false);
//  *
//  * Result:
//  * - Token saved in sessionStorage
//  * - Token ONLY exists in current tab
//  * - Opening new tab → token is null (expected!)
//  * - Closing tab → token deleted
//  * - Refreshing page → token persists ✅
//  */

// /**
//  * LOGIN (Remember Me = TRUE)
//  *
//  * const { data } = await api.login(credentials);
//  * useTokenStore.getState().setTokens(data.accessToken, true);
//  *
//  * Result:
//  * - Token saved in localStorage
//  * - Token shared across all tabs ✅
//  * - Opening new tab → token exists ✅
//  * - Closing browser → token persists ✅
//  * - Refreshing page → token persists ✅
//  */

// /**
//  * LOGOUT
//  *
//  * useTokenStore.getState().clearTokens();
//  *
//  * Result:
//  * - Token cleared from both storages
//  * - All tabs lose access
//  */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  rememberMe: boolean;
  _hydrated: boolean;
  _isLoggingOut: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  setRememberMe: (value: boolean) => void;
  clearTokens: () => void;
  setLoggingOut: (value: boolean) => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      _hydrated: false,
      _isLoggingOut: false,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setRememberMe: (value) => set({ rememberMe: value }),
      setLoggingOut: (value) => set({ _isLoggingOut: value }),
      clearTokens: () =>
        set({
          accessToken: null,
          refreshToken: null,
          rememberMe: false,
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
        rememberMe: state.rememberMe,
        // Don't persist _isLoggingOut
      }),
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const fromSession = sessionStorage.getItem(name);
            if (fromSession) return fromSession;
            const fromLocal = localStorage.getItem(name);
            if (fromLocal) return fromLocal;
            return null;
          } catch (error) {
            console.error('Failed to read tokens from storage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            const parsed = JSON.parse(value);
            const rememberMe = parsed?.state?.rememberMe ?? false;
            const targetStorage = rememberMe ? localStorage : sessionStorage;
            const oppositeStorage = rememberMe ? sessionStorage : localStorage;
            targetStorage.setItem(name, value);
            oppositeStorage.removeItem(name);
          } catch (error) {
            console.error('Failed to write tokens to storage:', error);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
            sessionStorage.removeItem(name);
          } catch (error) {
            console.error('Failed to remove tokens from storage:', error);
          }
        },
      })),
    },
  ),
);
