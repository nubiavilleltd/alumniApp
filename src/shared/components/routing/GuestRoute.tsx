import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { USER_ROUTES } from '@/features/user/routes';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface GuestRouteProps {
  children: ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  if (user) {
    const from = (location.state as any)?.from ?? USER_ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }
  return <>{children}</>;
}
