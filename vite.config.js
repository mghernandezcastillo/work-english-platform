import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // prompt strategy — shows an update toast instead of silently caching
      registerType: 'prompt',
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
        // Only precache the HTML shell and large static assets
        // JS/CSS get content-hashed filenames from Vite, so they naturally
        // bust the cache. We just need the SW to let them through.
        globPatterns: ['**/*.{html,ico,png,svg,woff2}'],
        // Don't precache JS/CSS chunks — serve them network-first
        // so new deploys are picked up immediately
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\//],
        // Clean up old caches from previous SW versions automatically
        cleanupOutdatedCaches: true,
        // Skip waiting + claim immediately when the user accepts the update
        skipWaiting: false,
        clientsClaim: false,
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
