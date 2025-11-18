import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/summarization": {
        target: "https://summarizer-backend-delta.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
