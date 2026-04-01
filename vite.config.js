import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
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
        // ═══════════════════════════════════════════════════════════
        // CRITICAL: Do NOT precache JS/CSS/HTML.
        // Only precache icons and fonts that are truly immutable.
        // This prevents the #1 cause of "stuck loading": the SW
        // serving stale HTML that references dead JS chunk hashes.
        // ═══════════════════════════════════════════════════════════
        globPatterns: ['**/*.{ico,png,svg,woff2}'],

        // NO navigateFallback — let ALL navigation requests hit the
        // network. Vercel serves index.html via its own rewrite rule.
        // This is the ONLY reliable way to guarantee F5 always works.
        // navigateFallback: '/index.html',  ← REMOVED

        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        runtimeCaching: [
          {
            // Supabase API — always network first
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            // Audio files — cache first (immutable content)
            urlPattern: /\.(?:mp3|wav|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            // Simulation audio from Supabase storage — cache first
            urlPattern: /supabase.*storage.*sim-audios/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'sim-audio-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // NOTE: JS/CSS are NOT cached by the SW at all.
          // Vite hashes them (app-abc123.js), so the browser cache
          // naturally busts on each deploy. The Vercel header gives
          // /assets/* immutable caching. No SW intervention needed.
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
})
