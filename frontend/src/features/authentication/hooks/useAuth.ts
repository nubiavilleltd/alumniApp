// import { useIdentityStore } from '../stores/useIdentityStore';
// import { useTokenStore } from '../stores/useTokenStore';

// export const useAuth = () => {
//   const user = useIdentityStore((s) => s.user);
//   const accessToken = useTokenStore((s) => s.accessToken);
//   return {
//     user,
//     isAuthenticated: !!user && !!accessToken,
//     isAdmin: user?.role === 'admin',
//   };
// };

import { useIdentityStore } from '../stores/useIdentityStore';
import { useTokenStore } from '../stores/useTokenStore';

export const useAuth = () => {
  const user = useIdentityStore((s) => s.user);
  const accessToken = useTokenStore((s) => s.accessToken);
  const identityHydrated = useIdentityStore((s) => s._hydrated);
  const tokenHydrated = useTokenStore((s) => s._hydrated);

  return {
    user,
    isAuthenticated: !!user && !!accessToken,
    isAdmin: user?.role === 'super admin',
    isHydrated: identityHydrated && tokenHydrated,
  };
};
