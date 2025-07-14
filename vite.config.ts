import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/aotr/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
