// // shared/components/routing/ProtectedRoute.tsx
// //
// // CHANGE: Reads the session from the Zustand store (localStorage) synchronously.
// // No useCurrentUser() call needed here — if the user has a session in localStorage
// // they're allowed in. The profile freshness is handled by individual pages.
// // This prevents the spurious redirect to /login on page reload.

// import type { ReactNode } from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { AUTH_ROUTES } from '@/features/authentication/routes';
// import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
// import { useAuth } from '@/features/authentication/hooks/useAuth';

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   // Reads from localStorage synchronously — available on the very first render
//   // const user = useIdentityStore((state) => state.user);
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (!isAuthenticated) {
//     console.log("redirecting to login in Protected Route ... not authenticated")
//     // Pass the current path as `from` so LoginForm can redirect back after login
//     return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
//   }

//   return <>{children}</>;
// }

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

// export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { isAuthenticated, isHydrated } = useAuth();
//   const location = useLocation();

//   // Wait for Zustand to rehydrate from storage before making any auth decision
//   if (!isHydrated) return null;

//   if (!isAuthenticated) {
//     console.log('redirecting to login in Protected Route ... not authenticated');
//     return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
//   }

//   return <>{children}</>;
// }

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const isLoggingOut = useTokenStore((state) => state._isLoggingOut);
  const location = useLocation();

  // Wait for Zustand to rehydrate from storage
  if (!isHydrated) return null;

  // ✅ NEW: Don't redirect if logout is in progress
  // if (isLoggingOut) return null;

  if (!isAuthenticated) {
    console.log('redirecting to login in Protected Route ... not authenticated');
    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
