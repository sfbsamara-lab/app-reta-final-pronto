/* Service Worker for Reta Final
   - Caches important assets
   - Deletes old caches on activation
   - Listens for SKIP_WAITING message to immediately activate
   - Forces clients to reload when a new SW takes control
*/

const CACHE_NAME = 'reta-final-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/installed-icon-v2-192.png',
  '/icons/installed-icon-v2-512.png',
  '/icons/foguinho.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE).catch((e) => {
      console.warn('[SW] cache.addAll failed:', e);
    }))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
        return Promise.resolve();
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Try network first, fallback to cache — this helps getting newest icons/manifest
  event.respondWith(
    fetch(event.request).then((response) => {
      // Store a clone in cache for future
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, responseClone).catch(() => {});
      });
      return response;
    }).catch(() => caches.match(event.request))
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});