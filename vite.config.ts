import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/aotr/', // ✅ This is CRITICAL for GitHub Pages to load assets correctly
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
