// Service Worker minimal pour la page /cashd (PWA caisse).
// But : permettre l'installation comme PWA + purger les anciens caches qui
// causaient la redemande de mot de passe lors du passage Messages ↔ Caisse.
// Fix 19/05/2026 — Tiago.
// Pas de cache offline (la page a besoin du réseau pour poll les commandes).

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys()
      .then(function(keys) { return Promise.all(keys.map(function(k) { return caches.delete(k); })); })
      .then(function() { return self.clients.claim(); })
  );
});

// Pass-through : aucune requête interceptée/cachée.
self.addEventListener('fetch', function(e) {
  // No respondWith → comportement réseau natif (cookies caisse_auth toujours transmis).
});
