// shared/components/routing/ProtectedRoute.tsx
//
// Wraps any route that requires a logged-in user.
// Redirects to /auth/login if no session exists.
// Preserves the intended destination so the user lands
// back there after a successful login.

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    // Preserve path and search so guarded deep links can resume after login.
    return (
      <Navigate
        to="/auth/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return <>{children}</>;
}
