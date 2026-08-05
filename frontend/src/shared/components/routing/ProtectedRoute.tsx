// // shared/components/routing/ProtectedRoute.tsx

import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useAuth } from '@/features/authentication/hooks/useAuth';
// import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { toast } from '../ui/Toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      toast.info('Please sign in to continue.');
    }
  }, [isAuthenticated, isHydrated]);

  if (!isHydrated) return null;

  if (!isAuthenticated) {
    return <Navigate to={AUTH_ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
