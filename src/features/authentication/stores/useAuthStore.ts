import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthSessionUser } from '../types/auth.types';

interface AuthState {
  user: AuthSessionUser | null;
  setSession: (user: AuthSessionUser) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setSession: (user) => set({ user }),
      clearSession: () => set({ user: null }),
    }),
    {
      name: 'openalumns.auth.session',
      storage: createJSONStorage(() => window.sessionStorage),
    },
  ),
);
