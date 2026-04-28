// shared/components/routing/ProtectedRoute.tsx
//
// CHANGE: Reads the session from the Zustand store (localStorage) synchronously.
// No useCurrentUser() call needed here — if the user has a session in localStorage
// they're allowed in. The profile freshness is handled by individual pages.
// This prevents the spurious redirect to /login on page reload.

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { useAuth } from '@/features/authentication/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Reads from localStorage synchronously — available on the very first render
  // const user = useIdentityStore((state) => state.user);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Pass the current path as `from` so LoginForm can redirect back after login
    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
