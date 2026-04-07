// // shared/components/routing/ProtectedRoute.tsx
// //
// // Wraps any route that requires a logged-in user.
// // Redirects to /auth/login if no session exists.
// // Preserves the intended destination so the user lands
// // back there after a successful login.

// import type { ReactNode } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
// import { AUTH_ROUTES } from '@/features/authentication/routes';
// import { useCurrentUser } from '@/features/authentication/hooks/useCurrentUser';
// import { mapCurrentUserResponse } from '@/features/authentication/api/adapters/login.adapter';

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const user = useAuthStore((state) => state.user);

//   //  const { data, isLoading } = useCurrentUser();
//   //    const currentUserProfile = data ? mapCurrentUserResponse(data) : null

//   const location = useLocation();

//   if (!user) {
//     // Pass the current path as `from` so LoginForm can redirect back after login
//     return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
//   }

//   return <>{children}</>;
// }

// shared/components/routing/ProtectedRoute.tsx
//
// CHANGE: Reads the session from the Zustand store (localStorage) synchronously.
// No useCurrentUser() call needed here — if the user has a session in localStorage
// they're allowed in. The profile freshness is handled by individual pages.
// This prevents the spurious redirect to /login on page reload.

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { AUTH_ROUTES } from '@/features/authentication/routes';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Reads from localStorage synchronously — available on the very first render
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    // Pass the current path as `from` so LoginForm can redirect back after login
    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
