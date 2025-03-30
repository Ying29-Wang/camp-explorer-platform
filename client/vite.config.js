import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
