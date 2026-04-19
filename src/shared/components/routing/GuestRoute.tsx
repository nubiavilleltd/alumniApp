import { useAuth } from '@/features/authentication/hooks/useAuth';
import { USER_ROUTES } from '@/features/user/routes';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  //   const user = useIdentityStore((state) => state.user);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated) {
    const from = (location.state as any)?.from ?? USER_ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }
  return <>{children}</>;
}
