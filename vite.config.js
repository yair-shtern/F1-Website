import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Ensure it listens on all network interfaces
    port: process.env.PORT || 3000,  // Use the Render environment variable or fallback to 3000
    open: true,
    proxy: {
      // Proxy for Wikipedia API requests
      '/wikipedia': {
        target: 'https://en.wikipedia.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wikipedia/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js'
  }
})
