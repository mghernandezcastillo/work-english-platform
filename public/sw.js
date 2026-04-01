// Self-destroying service worker.
// This replaces the old caching SW. When the browser detects this new
// sw.js is different from the old one, it installs this version.
// On activation, this SW unregisters itself and clears all caches,
// effectively removing the SW layer entirely.

self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.registration.unregister();
    }).then(function() {
      return self.clients.matchAll();
    }).then(function(clients) {
      clients.forEach(function(client) {
        client.navigate(client.url);
      });
    })
  );
});
