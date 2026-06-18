import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/shared/components/ui/Toast';
import { AUTH_ROUTES } from '../routes';

interface RequireSignInOptions {
  message: string;
  from?: string;
  replace?: boolean;
}

function buildCurrentLocation(pathname: string, search: string, hash: string) {
  return `${pathname}${search}${hash}`;
}

export function useRequireSignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    ({ message, from, replace = false }: RequireSignInOptions) => {
      toast.info(message);
      navigate(AUTH_ROUTES.LOGIN, {
        replace,
        state: {
          from: from ?? buildCurrentLocation(location.pathname, location.search, location.hash),
        },
      });
    },
    [location.hash, location.pathname, location.search, navigate],
  );
}
