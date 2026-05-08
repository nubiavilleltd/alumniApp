import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useTokenStore } from '../stores/useTokenStore';
import { useIdentityStore } from '../stores/useIdentityStore';

let isRefreshing = false;
let subscribers: ((token: string | null) => void)[] = [];
let lastRefreshFailedDueToAuth = false;

function subscribe(callback: (token: string | null) => void) {
  subscribers.push(callback);
}

function notify(newToken: string | null) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}

function clearAuthSession() {
  const { clearTokens } = useTokenStore.getState();
  const { clearIdentity } = useIdentityStore.getState();
  clearTokens();
  clearIdentity();
}

export function didLastTokenRefreshFailDueToAuth() {
  return lastRefreshFailedDueToAuth;
}

// export async function refreshAccessToken(): Promise<string | null> {
// //   const { refreshToken, user, setSession, clearSession } = useAuthStore.getState();
// const { refreshToken, clearTokens, setTokens } = useTokenStore.getState();

// const {user, setIdentity} = useIdentityStore()

//   if (!refreshToken) {
//     clearTokens();
//     return null;
//   }

//   try {
//     const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
//       refresh_token: refreshToken,
//     });

//     const newAccessToken = response.data?.accessToken;

//     if (!newAccessToken) {
//       clearTokens();
//       return null;
//     }

//     // ✅ Silent update (no UI noise)
//     setTokens(newAccessToken, refreshToken);

//     return newAccessToken;
//   } catch {
//     clearTokens();
//     return null;
//   }
// }

// Queue logic for multiple 401s

export async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, setTokens } = useTokenStore.getState();

  try {
    lastRefreshFailedDueToAuth = false;

    const payload = refreshToken ? { refresh_token: refreshToken } : {};
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, payload);

    const newAccessToken = response.data?.access_token ?? response.data?.accessToken;

    if (!newAccessToken) {
      lastRefreshFailedDueToAuth = true;
      clearAuthSession();
      return null;
    }

    // ✅ Silent update (no UI noise)
    setTokens(newAccessToken, refreshToken ?? '');

    return newAccessToken;
  } catch (error: any) {
    const status = error?.response?.status;
    const isAuthFailure = status === 400 || status === 401 || status === 403;

    lastRefreshFailedDueToAuth = isAuthFailure;

    if (isAuthFailure) {
      clearAuthSession();
    }

    return null;
  }
}

export async function handleTokenRefresh(): Promise<string | null> {
  if (!isRefreshing) {
    isRefreshing = true;

    const newToken = await refreshAccessToken();

    isRefreshing = false;
    notify(newToken);

    return newToken;
  }

  return new Promise((resolve) => {
    subscribe((token) => resolve(token));
  });
}
