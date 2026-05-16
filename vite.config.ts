import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'copy-spa-fallbacks',
      writeBundle() {
        const dist = resolve(__dirname, 'dist');
        copyFileSync(resolve(__dirname, 'public/.htaccess'), resolve(dist, '.htaccess'));
        copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
      },
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    copyPublicDir: true,
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'supabase': ['@supabase/supabase-js'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lucide': ['lucide-react'],
        },
      },
    },
  },
});
