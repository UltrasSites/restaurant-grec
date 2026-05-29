// Service Worker Καλαμάκι Της Τρούμπας — PWA A2HS minimal
// Stratégie : network-first avec fallback cache (offline-resilient)
// IMPORTANT : NE PAS intercepter /cashd/* (caisse temps-réel)
// IMPORTANT : NE PAS intercepter /api/* /functions/* /pos/* (endpoints dynamiques)

const CACHE_VERSION = 'kalamaki-v1';
const CORE_ASSETS = [
  '/',
  '/el/',
  '/en/',
  '/menu/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-180.png',
];

// Install — cache des routes clés (best effort, ignore les 404)
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return Promise.all(
        CORE_ASSETS.map(function (url) {
          return cache.add(url).catch(function () { return null; });
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

// Activate — purge des anciens caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_VERSION; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

// Fetch — network-first sauf routes sensibles (network-only)
self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== self.location.origin) return;

  // Network-only sur les routes dynamiques (caisse, API, POS)
  if (
    url.pathname.indexOf('/cashd') === 0 ||
    url.pathname.indexOf('/api/') === 0 ||
    url.pathname.indexOf('/functions/') === 0 ||
    url.pathname.indexOf('/pos/') === 0 ||
    url.pathname.indexOf('/admin') === 0
  ) {
    return; // laisse passer au réseau natif
  }

  // Network-first avec fallback cache
  event.respondWith(
    fetch(req).then(function (resp) {
      if (resp && resp.status === 200 && resp.type === 'basic') {
        var clone = resp.clone();
        caches.open(CACHE_VERSION).then(function (cache) {
          cache.put(req, clone).catch(function () {});
        });
      }
      return resp;
    }).catch(function () {
      return caches.match(req).then(function (cached) {
        if (cached) return cached;
        // Fallback : retourner la home cachée si page HTML
        if (req.mode === 'navigation' || (req.headers.get('accept') || '').indexOf('text/html') !== -1) {
          return caches.match('/el/').then(function (home) {
            return home || new Response('Offline', { status: 503, statusText: 'Offline' });
          });
        }
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
