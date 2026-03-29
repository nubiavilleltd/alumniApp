// // import axios from 'axios';

// // export const apiClient = axios.create({
// //   baseURL: import.meta.env.VITE_API_BASE_URL,
// //   headers: { 'Content-Type': 'application/json' },
// //   timeout: 15000,
// // });

// // // ─── Attach auth token to every request ───────────────────────────────────────
// // apiClient.interceptors.request.use((config) => {
// //   //   const token = localStorage.getItem('auth_token');
// //   const token = import.meta.env.VITE_API_TOKEN;

// //   if (token) {
// //     config.headers.Authorization = `Bearer ${token}`;

// //     if (config.method === 'post') {
// //       const existing = config.data
// //         ? typeof config.data === 'string'
// //           ? JSON.parse(config.data)
// //           : config.data
// //         : {};
// //       config.data = { ...existing, token };
// //     }
// //   }

// //   return config;
// // });

// // // ─── Global error handling ────────────────────────────────────────────────────
// // apiClient.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401) {
// //       //   localStorage.removeItem('auth_token');
// //       window.location.href = '/auth/login';
// //     }
// //     return Promise.reject(error);
// //   },
// // );

// // api/client.ts

// import axios from 'axios';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';

// export const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// });

// // ─── Attach tokens to every request ──────────────────────────────────────────
// // Two tokens are in play:
// //   `token` — API key from env, required on every single request.
// //   `jwt`   — user session token, required only on authenticated endpoints.
// //             Injected into POST body when the user is logged in.
// apiClient.interceptors.request.use((config) => {
//   const apiKey = import.meta.env.VITE_API_TOKEN;

//   if (apiKey) {
//     config.headers.Authorization = `Bearer ${apiKey}`;

//     if (config.method === 'post') {
//       const existing = config.data
//         ? typeof config.data === 'string'
//           ? JSON.parse(config.data)
//           : config.data
//         : {};

//       // Always inject the API key as `token`
//       const payload: Record<string, unknown> = { ...existing, token: apiKey };

//       // Also inject the session JWT when the user is logged in
//       const accessToken = useAuthStore.getState().accessToken;
//       if (accessToken) {
//         payload.jwt = accessToken;
//       }

//       console.log('payload   --', { payload });

//       config.data = payload;
//     }
//   }

//   return config;
// });

// // ─── Global error handling ────────────────────────────────────────────────────
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   },
// );

// lib/api/client.ts

// import axios from 'axios';
// import { useAuthStore } from '@/features/authentication/stores/useAuthStore';

// export const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15000,
// });

// // ─── Attach tokens to every request ──────────────────────────────────────────
// apiClient.interceptors.request.use((config) => {
//   const apiKey = import.meta.env.VITE_API_TOKEN;

//   if (apiKey) {
//     config.headers.Authorization = `Bearer ${apiKey}`;

//     // Only modify POST requests that are NOT FormData
//     if (config.method === 'post') {
//       // Check if we're dealing with FormData
//       const isFormData = config.data instanceof FormData;

//       if (isFormData) {
//         // For FormData, we need to add token and jwt as fields
//         console.log('🔄 API Client - Processing FormData request');

//         const token = apiKey;
//         const accessToken = useAuthStore.getState().accessToken;

//         // Append token and jwt to FormData
//         config.data.append('token', token);
//         if (accessToken) {
//           config.data.append('jwt', accessToken);
//         }

//         // IMPORTANT: Don't set Content-Type header for FormData
//         // Let the browser set it with the correct boundary
//         delete config.headers['Content-Type'];

//         console.log('🔄 API Client - Added token and jwt to FormData');
//       } else {
//         // For JSON requests, merge token and jwt into the object
//         const existing = config.data
//           ? typeof config.data === 'string'
//             ? JSON.parse(config.data)
//             : config.data
//           : {};

//         const payload: Record<string, unknown> = { ...existing, token: apiKey };

//         const accessToken = useAuthStore.getState().accessToken;
//         if (accessToken) {
//           payload.jwt = accessToken;
//         }

//         console.log('🔄 API Client - Modified JSON payload:', payload);
//         config.data = payload;
//       }
//     }
//   }

//   return config;
// });

// // ─── Global error handling ────────────────────────────────────────────────────
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   },
// );

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

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
  (error) => {
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

      // Handle specific status codes
      if (status === 401) {
        // Unauthorized - clear session and redirect to login
        const clearSession = useAuthStore.getState().clearSession;
        clearSession();

        // Only redirect if not already on login page
        if (!window.location.pathname.startsWith('/auth/login')) {
          window.location.href = '/auth/login?session_expired=true';
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
  },
);
