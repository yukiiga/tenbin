import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: `/tenbin/`,  // ← GitHub Pages用に追加
  server: {
    port: 3000,
    open: true,
  },
});
