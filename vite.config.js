import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: VitePWA plugin REMOVED intentionally.
// The Service Worker was caching stale HTML/JS and causing infinite loading
// on F5 after every deploy. This app requires API calls to function, so
// offline caching provides no real value but causes critical UX bugs.
// The manifest.json in /public still enables PWA install-to-homescreen.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
