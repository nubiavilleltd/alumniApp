import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Attach auth token to every request ───────────────────────────────────────
apiClient.interceptors.request.use((config) => {

//   const token = localStorage.getItem('auth_token');
  const token = import.meta.env.VITE_API_TOKEN;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

    if (config.method === 'post') {
      const existing = config.data
        ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data)
        : {};
      config.data = { ...existing, token };
    }
  }

  return config;
});

// ─── Global error handling ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    //   localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);