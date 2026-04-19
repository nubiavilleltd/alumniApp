import { useIdentityStore } from '../stores/useIdentityStore';
import { useTokenStore } from '../stores/useTokenStore';

export const useAuth = () => {
  const user = useIdentityStore((s) => s.user);
  const accessToken = useTokenStore((s) => s.accessToken);

  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    isAdmin: user?.role === 'admin',
  };
};
