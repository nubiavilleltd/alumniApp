import { ReactNode } from 'react';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';

interface LogoutGateProps {
  children: ReactNode;
}

/**
 * Prevents ANY component from rendering during logout.
 * This stops React Router from evaluating routes and causing flashes.
 */
export function LogoutGate({ children }: LogoutGateProps) {
  const isLoggingOut = useTokenStore((state) => state._isLoggingOut);

  // During logout, render absolutely nothing
  // This prevents React Router from re-evaluating any routes
  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Logging out...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
