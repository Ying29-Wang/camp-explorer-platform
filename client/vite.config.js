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
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            // Ensure DELETE requests are properly handled
            if (req.method === 'DELETE') {
              proxyReq.setHeader('Content-Length', '0');
            }
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Received Response from the Target:', proxyRes.statusCode);
          });
        }
      },
    },
  },
  plugins: [react()],
  base: '/',
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
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
