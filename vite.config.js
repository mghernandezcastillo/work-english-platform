import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Auto-update: new SW activates immediately on page load
      // This prevents stale cache issues after deploys
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'images/*.png', 'images/*.svg'],
      manifest: {
        name: 'English for Work',
        short_name: 'EnglishWork',
        description: 'Aprende el inglés que sí te sirve para trabajar',
        theme_color: '#2563EB',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Only precache static assets — NOT HTML (served network-first)
        globPatterns: ['**/*.{ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\//],
        cleanupOutdatedCaches: true,
        // Activate new SW immediately — no stale versions
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Supabase API calls — always network first
            urlPattern: /^https:\/\/mtobgwfknefjlpoxznqx\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // JS and CSS chunks — network first with fallback to cache
            urlPattern: /\.(?:js|css)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-assets',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Audio files — cache first (they don't change)
            urlPattern: /\.(?:mp3|wav|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
})
