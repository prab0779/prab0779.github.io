export default defineConfig({
  base: '/aotr',  // 👈 Replace with your GitHub repo name
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
