import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useTokenStore } from '../stores/useTokenStore';
import { useIdentityStore } from '../stores/useIdentityStore';

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

function subscribe(callback: (token: string) => void) {
  subscribers.push(callback);
}

function notify(newToken: string) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
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
  const { refreshToken, clearTokens, setTokens } = useTokenStore.getState();
  const { clearIdentity } = useIdentityStore.getState();

  if (!refreshToken) {
    clearTokens();
    clearIdentity();
    return null;
  }

  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });

    const newAccessToken = response.data?.accessToken;

    if (!newAccessToken) {
      clearTokens();
      clearIdentity();
      return null;
    }

    // ✅ Silent update (no UI noise)
    setTokens(newAccessToken, refreshToken);

    return newAccessToken;
  } catch {
    clearTokens();
    clearIdentity();
    return null;
  }
}

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
