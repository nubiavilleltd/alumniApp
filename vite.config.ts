import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const apiTarget = env.VITE_API_BASE_URL?.trim();

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: apiTarget
      ? {
          proxy: {
            '/api': {
              target: apiTarget,
              changeOrigin: true,
              secure: true,
            },
            '/auth': {
              target: apiTarget,
              changeOrigin: true,
              secure: true,
            },
            '/chat_api': {
              target: apiTarget,
              changeOrigin: true,
              secure: true,
            },
          },
        }
      : undefined,
  };
});
