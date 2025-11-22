import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // port: 5173,
    port: 3021,
    proxy: {
      '/api': {
        target: 'http://localhost:3022',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3022',
        changeOrigin: true,
      }
    }
  }
});