export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/javascript; charset=utf-8')
  return `const CACHE_NAME = 'kenya-duty-calc-v3';
const urlsToCache = [
  '/import-duty-calculator.html',
  '/images/calculator-hero.jpg',
  '/images/kenya-tradex-logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => cacheName !== CACHE_NAME ? caches.delete(cacheName) : undefined))));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
`
})
