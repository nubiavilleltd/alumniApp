import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '../stores/useAuthStore';

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

function subscribe(callback: (token: string) => void) {
  subscribers.push(callback);
}

function notify(newToken: string) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}

export async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, user, setSession, clearSession } = useAuthStore.getState();

  if (!refreshToken) {
    clearSession();
    return null;
  }

  try {
    const response = await apiClient.post('/refresh_token', {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data?.accessToken;

    if (!newAccessToken) {
      clearSession();
      return null;
    }

    if (!user) {
      clearSession();
      return null;
    }

    // ✅ Silent update (no UI noise)
    setSession(user, newAccessToken, refreshToken);

    return newAccessToken;
  } catch {
    clearSession();
    return null;
  }
}

// Queue logic for multiple 401s
export async function handleTokenRefresh(): Promise<string | null> {
  if (!isRefreshing) {
    isRefreshing = true;

    const newToken = await refreshAccessToken();

    isRefreshing = false;

    if (newToken) {
      notify(newToken);
    }

    return newToken;
  }

  return new Promise((resolve) => {
    subscribe((token) => resolve(token));
  });
}
