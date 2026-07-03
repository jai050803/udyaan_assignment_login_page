import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Note: The prompt requested 4000, but our backend runs on 7002.
      // Proxying to 7002 to match the implemented backend.
      '/api': {
        target: 'http://localhost:7002',
        changeOrigin: true,
      },
    },
  },
});
