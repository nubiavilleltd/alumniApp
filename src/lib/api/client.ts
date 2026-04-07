/**
 * ============================================================================
 * API CLIENT - WITH ENHANCED ERROR HANDLING
 * ============================================================================
 *
 * Axios instance with:
 * - Automatic token injection
 * - FormData handling
 * - Enhanced error responses
 * - Request/response logging in dev
 *
 * ============================================================================
 */

import axios from 'axios';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { logError } from '@/lib/errors/errorUtils';

import { handleTokenRefresh } from '@/features/authentication/services/refreshToken.service';
import { AUTH_ROUTES } from '@/features/authentication/routes';

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
// const shouldUseViteDevProxy = import.meta.env.DEV && /^https?:\/\//i.test(configuredApiBaseUrl);
// const resolvedApiBaseUrl = shouldUseViteDevProxy ? '' : configuredApiBaseUrl;

export const apiClient = axios.create({
  baseURL: configuredApiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_TOKEN;

    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;

      // Only modify POST requests
      if (config.method === 'post') {
        const isFormData = config.data instanceof FormData;

        if (isFormData) {
          // ═══════════════════════════════════════════════════════════════
          // FORMDATA REQUEST
          // ═══════════════════════════════════════════════════════════════
          if (import.meta.env.DEV) {
            console.log('📤 FormData Request:', config.url);
          }

          const token = apiKey;
          const accessToken = useAuthStore.getState().accessToken;

          config.data.append('token', token);
          if (accessToken) {
            config.data.append('jwt', accessToken);
          }

          // Let browser set Content-Type with boundary
          delete config.headers['Content-Type'];
        } else {
          // ═══════════════════════════════════════════════════════════════
          // JSON REQUEST
          // ═══════════════════════════════════════════════════════════════
          const existing = config.data
            ? typeof config.data === 'string'
              ? JSON.parse(config.data)
              : config.data
            : {};

          const payload: Record<string, unknown> = { ...existing, token: apiKey };

          const accessToken = useAuthStore.getState().accessToken;
          if (accessToken) {
            payload.jwt = accessToken;
          }

          if (import.meta.env.DEV) {
            console.log('📤 JSON Request:', config.url, payload);
          }

          config.data = payload;
        }
      }
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
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('📥 Response:', response.config.url, response.status);
    }
    return response;
  },
  async (error) => {
    // Enhanced error handling
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (import.meta.env.DEV) {
        console.error('❌ API Error:', {
          url: error.config?.url,
          status,
          data,
        });
      }

      if (status === 401 && !error.config._retry) {
        error.config._retry = true;

        const newToken = await handleTokenRefresh();

        if (newToken) {
          // 🔁 Retry original request with new token
          if (error.config.data instanceof FormData) {
            error.config.data.set('jwt', newToken);
          } else if (typeof error.config.data === 'object') {
            error.config.data.jwt = newToken;
          }

          return apiClient(error.config);
        }

        // ❌ Refresh failed → logout
        const clearSession = useAuthStore.getState().clearSession;
        clearSession();

        if (!window.location.pathname.startsWith(AUTH_ROUTES.LOGIN)) {
          window.location.href = `${AUTH_ROUTES.LOGIN}?session_expired=true`;
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
      if (import.meta.env.DEV) {
        console.error('❌ Network Error:', error.message);
      }
      error.message = 'Network error. Please check your connection';
    } else {
      // Something else happened
      if (import.meta.env.DEV) {
        console.error('❌ Unexpected Error:', error.message);
      }
    }

    // Log all errors
    logError(error, 'API Response');

    return Promise.reject(error);
    // return new Promise(() => {});
  },
);
