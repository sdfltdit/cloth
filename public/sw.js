const CACHE_NAME = 'sdf-clothing-v3';
const urlsToCache = [
  '/',
  '/about/',
  '/contact/',
  '/products/',
  '/clothing-manufacturers/',
  '/price-calculator/',
  '/lead-time-calculator/',
  '/eu-readiness-checker/',
  '/logo.webp',
  '/manifest.json',
  '/robots.txt',
  '/styles/global.css',
  '/scripts/app.js',
  '/scripts/contact-form.js',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  // Don't cache form submissions or API calls
  if (event.request.url.includes('web3forms') || event.request.url.includes('formcarry') || event.request.url.includes('ipapi')) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(fetchResponse => {
        // Cache static assets only
        if (event.request.url.match(/\.(css|js|webp|woff2|ico)$/)) {
          const clone = fetchResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return fetchResponse;
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});