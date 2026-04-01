// shared/components/routing/AdminRoute.tsx
//
// Wraps any route that requires an admin user.
// - Not logged in      → /auth/login  (with `from` state)
// - Logged in, member  → /dashboard   (silent redirect, no error page)
// - Logged in, admin   → renders children

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { USER_ROUTES } from '@/features/user/routes';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to={USER_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
