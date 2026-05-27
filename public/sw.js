const CACHE = 'artro-v1';

const PRECACHE = [
  '/',
  '/index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Не кешируем внешние запросы к аналитике и CDN платформы
  if (url.hostname !== self.location.hostname) return;

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request).then(response => {
        if (response.ok) cache.put(e.request, response.clone());
        return response;
      }).catch(() => cached);
      // Stale-while-revalidate: сразу отдаём кеш, фоном обновляем
      return cached || fetchPromise;
    })
  );
});
