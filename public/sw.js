const CACHE_NAME = 'sk-store-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/products',
        '/manifest.json',
        // Add other core static assets if needed
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Simple offline fallback: Network first, then Cache
  if (event.request.method === 'GET' && !event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((response) => {
          return response || caches.match('/');
        });
      })
    );
  }
});
