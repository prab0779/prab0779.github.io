import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

function publicImagesPlugin() {
  const virtualId = 'virtual:public-images';
  const resolvedId = '\0' + virtualId;

  return {
    name: 'public-images',
    resolveId(id: string) {
      if (id === virtualId) return resolvedId;
    },
    load(id: string) {
      if (id !== resolvedId) return;
      const publicDir = resolve(__dirname, 'public');
      const files = readdirSync(publicDir).filter((f) =>
        /\.(png|webp|jpg|jpeg|gif|svg)$/i.test(f)
      );
      return `export default ${JSON.stringify(files)};`;
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    publicImagesPlugin(),
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
