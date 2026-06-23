/**
 * ============================================================================
 * API CLIENT - WITH ENHANCED ERROR HANDLING
 * ============================================================================
 *
 * Axios instance with:
 * - Automatic auth header injection
 * - FormData handling
 * - Enhanced error responses
 * ============================================================================
 */

import axios from 'axios';
import { logError } from '@/lib/errors/errorUtils';

import { handleTokenRefresh } from '@/features/authentication/services/refreshToken.service';
import { didLastTokenRefreshFailDueToAuth } from '@/features/authentication/services/refreshToken.service';
import { AUTH_ROUTES } from '@/features/authentication/routes';
import { useTokenStore } from '@/features/authentication/stores/useTokenStore';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';
import { API_ENDPOINTS } from './endpoints';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
// const shouldUseViteDevProxy = import.meta.env.DEV && /^https?:\/\//i.test(configuredApiBaseUrl);
// const resolvedApiBaseUrl = shouldUseViteDevProxy ? '' : configuredApiBaseUrl;

const BEARER_EXCLUDED_ENDPOINTS = new Set<string>([
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REGISTER,
  API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
  API_ENDPOINTS.AUTH.RESET_PASSWORD,
  API_ENDPOINTS.AUTH.VERIFY_EMAIL,
  API_ENDPOINTS.AUTH.RESEND_VERIFY_EMAIL,
  API_ENDPOINTS.AUTH.REFRESH_TOKEN,
  API_ENDPOINTS.AUTH.SOCIAL_LOGIN,
  API_ENDPOINTS.AUTH.SOCIAL_SIGNUP,
  API_ENDPOINTS.CONTACT.CREATE,
]);

function getPathname(url?: string) {
  if (!url) return '';

  try {
    return new URL(url, configuredApiBaseUrl || window.location.origin).pathname;
  } catch {
    return url;
  }
}

export const apiClient = axios.create({
  baseURL: configuredApiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_TOKEN;
    const accessToken = useTokenStore.getState().accessToken;
    const pathname = getPathname(config.url);
    const shouldSendBearer = accessToken && !BEARER_EXCLUDED_ENDPOINTS.has(pathname);
    const isFormData = config.data instanceof FormData;

    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }

    if (shouldSendBearer) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (BEARER_EXCLUDED_ENDPOINTS.has(pathname)) {
      delete config.headers.Authorization;
    }

    if (isFormData) {
      // Let browser set Content-Type with boundary.
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    logError(error, 'Request Interceptor');
    return Promise.reject(error);
  },
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const { status } = error.response;

      const pathname = getPathname(error.config?.url);
      const isRefreshRequest = pathname === API_ENDPOINTS.AUTH.REFRESH_TOKEN;
      const isBearerExcludedRequest = BEARER_EXCLUDED_ENDPOINTS.has(pathname);
      const shouldSkipAuthRedirect = Boolean(error.config?._skipAuthRedirect);

      // ✅ NEW: Check if logout is in progress
      const isLoggingOut = useTokenStore.getState()._isLoggingOut;

      if (
        status === 401 &&
        !error.config._retry &&
        !isRefreshRequest &&
        !isBearerExcludedRequest &&
        !isLoggingOut &&
        !shouldSkipAuthRedirect
      ) {
        error.config._retry = true;

        const newToken = await handleTokenRefresh();

        if (newToken) {
          error.config.headers.Authorization = `Bearer ${newToken}`;

          return apiClient(error.config);
        }

        if (didLastTokenRefreshFailDueToAuth()) {
          const clearTokens = useTokenStore.getState().clearTokens;
          const clearIdentity = useIdentityStore.getState().clearIdentity;
          clearTokens();
          clearIdentity();

          if (!isLoggingOut && !window.location.pathname.startsWith(AUTH_ROUTES.LOGIN)) {
            window.location.href = `${AUTH_ROUTES.LOGIN}?session_expired=true`;
          }
        }
      }

      if (status === 403) {
        // Forbidden - user doesn't have permission
        error.message = 'You do not have permission to perform this action';
      }

      if (status === 404) {
        // Not found
        error.message = 'The requested resource was not found';
      }

      if (status >= 500) {
        // Server error
        error.message = 'Server error. Please try again later';
      }
    } else if (error.request) {
      // Request made but no response received - network error
      error.message = 'Network error. Please check your connection';
    }

    // Log all errors
    logError(error, 'API Response');

    return Promise.reject(error);
    // return new Promise(() => {});
  },
);
