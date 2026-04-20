/**
 * English for Work — Service Worker (Selective Offline Cache)
 *
 * Strategy: SAFE & CONSERVATIVE
 * - Cache ONLY fonts and images (NOT JS/CSS — Vite content-hashes those,
 *   the browser HTTP cache handles them perfectly without SW interference)
 * - NEVER cache Supabase API calls (app requires live data)
 * - NEVER cache HTML routes (prevents stale app shell)
 *
 * Why JS/CSS are excluded:
 * Vite produces hashed filenames (e.g. AdCenter-a1b2c3.js). Caching them
 * in the SW causes stale-chunk bugs when a new deploy introduces new chunk
 * names — the SW serves the old bundle from cache. The HTTP cache + CDN
 * handles JS/CSS immutable caching correctly without these bugs.
 */

const CACHE_NAME = 'efw-static-v3'

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
  if (NEVER_CACHE.some(pattern => url.includes(pattern))) return false

  // Cache Google Fonts
  if (u.hostname.includes('fonts.googleapis.com') ||
      u.hostname.includes('fonts.gstatic.com')) return true

  // Cache ONLY static media from our own origin — NOT JS or CSS
  if (u.origin === self.location.origin) {
    const path = u.pathname
    if (path.endsWith('.woff2') || path.endsWith('.woff') ||
        path.endsWith('.png') || path.endsWith('.svg') ||
        path.endsWith('.webp') || path.endsWith('.jpg') ||
        path.endsWith('.ico')) {
      return true
    }
  }
  return false
}

// Install — activate immediately
self.addEventListener('install', event => {
  self.skipWaiting()
})

// Activate — delete ALL old caches, claim clients immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

// Fetch — cache-first for fonts/images, network-first for everything else
self.addEventListener('fetch', event => {
  const { request } = event
  const url = request.url

  if (request.method !== 'GET') return
  if (!url.startsWith('http')) return
  if (NEVER_CACHE.some(pattern => url.includes(pattern))) return

  if (shouldCache(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const networkFetch = fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone())
            return response
          }).catch(() => cached)
          return cached || networkFetch
        })
      )
    )
  }
})

