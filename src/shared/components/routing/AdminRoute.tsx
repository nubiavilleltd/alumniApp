// shared/components/routing/AdminRoute.tsx
//
// CHANGES:
// 1. Checks the store synchronously first (fast path — no redirect while loading).
// 2. When the role IS in the store (role='admin'), renders children immediately.
// 3. Only falls back to useCurrentUser() when the role needs to be verified
//    from a fresh backend response (e.g. role may have changed server-side).
// 4. Shows a skeleton while the profile check is in-flight instead of
//    immediately navigating to /login — which was the cause of the "kicked to
//    login while logged in" bug on page reload.

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { USER_ROUTES } from '@/features/user/routes';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();

  // Synchronous store read — immediately available from localStorage
  const storeUser = useAuthStore((state) => state.user);

  // Background profile fetch — enriches data but never blocks the initial check
  const { data: freshUser, isLoading } = useCurrentUser();

  // ① Not logged in at all — redirect to login immediately
  if (!storeUser) {
    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // ② Store says admin — allow in immediately (no waiting for network)
  // The background fetch will still run and update the cache for freshness.
  if (storeUser.role === 'admin') {
    return <>{children}</>;
  }

  // ③ Store role is not admin, but we're still loading the fresh profile.
  // Hold rendering rather than redirecting — avoids false kick-to-login.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ④ Fresh profile loaded — use it for the definitive role check
  const effectiveUser = freshUser ?? storeUser;

  if (!effectiveUser || effectiveUser.role !== 'admin') {
    // Logged in but not admin — go to user dashboard, not login
    return <Navigate to={USER_ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
