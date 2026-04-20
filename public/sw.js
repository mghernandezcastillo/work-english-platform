/**
 * English for Work — Service Worker (Selective Offline Cache)
 *
 * Strategy: SAFE & CONSERVATIVE
 * - Cache static assets (JS, CSS, fonts, icons) with stale-while-revalidate
 * - NEVER cache Supabase API calls (app requires live data)
 * - NEVER cache /login, /dashboard or any app route (prevents stale HTML)
 * - The app shell (index.html) is always fetched fresh from the network
 *
 * This ensures:
 * ✓ Faster subsequent loads (cached JS/CSS served instantly)
 * ✓ No stale content bugs on deploy
 * ✓ No broken auth from cached API responses
 */

const CACHE_NAME = 'efw-static-v2'

// Asset origins we will cache
const CACHEABLE_ORIGINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
]

// Patterns we will NEVER cache (data, auth, API)
const NEVER_CACHE = [
  'supabase.co',
  '/rest/v1/',
  '/auth/v1/',
  '/storage/v1/',
  '/realtime/v1/',
]

function shouldCache(url) {
  const u = new URL(url)
  // Never cache anything from these origins/paths
  if (NEVER_CACHE.some(pattern => url.includes(pattern))) return false
  // Cache Google Fonts
  if (CACHEABLE_ORIGINS.some(o => u.hostname.includes(o))) return true
  // Cache our own static assets (JS/CSS/images/woff2) but NOT HTML
  if (u.origin === self.location.origin) {
    const path = u.pathname
    if (path.endsWith('.js') || path.endsWith('.css') ||
        path.endsWith('.woff2') || path.endsWith('.woff') ||
        path.endsWith('.png') || path.endsWith('.svg') ||
        path.endsWith('.webp') || path.endsWith('.jpg')) {
      return true
    }
  }
  return false
}

// Install — open cache but don't precache anything
self.addEventListener('install', event => {
  self.skipWaiting()
})

// Activate — clean up old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

// Fetch — stale-while-revalidate for allowed assets
self.addEventListener('fetch', event => {
  const { request } = event
  const url = request.url

  // Only handle GET requests
  if (request.method !== 'GET') return

  // Skip chrome-extension and non-http
  if (!url.startsWith('http')) return

  // Never intercept data/API requests
  if (NEVER_CACHE.some(pattern => url.includes(pattern))) return

  if (shouldCache(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const networkFetch = fetch(request)
            .then(response => {
              if (response.ok) {
                cache.put(request, response.clone())
              }
              return response
            })
            .catch(() => cached) // offline fallback: serve cached
          // Return cached immediately, update in background
          return cached || networkFetch
        })
      )
    )
  }
  // All other requests (HTML, API) — pass through to network
})
