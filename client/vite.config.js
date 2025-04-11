import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Add server proxy configuration to fix CORS issues
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  base: '/',
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: ['react-router-dom'],
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.gif'],
  publicDir: 'public',
})
