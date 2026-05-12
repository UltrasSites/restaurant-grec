// Service Worker minimal pour la page /caisse (PWA).
// But : permettre l'installation comme PWA + garder l'onglet "vivant" sur tablette.
// Pas de cache offline (la page a besoin du réseau pour poll les commandes).

self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});
// On laisse passer toutes les requêtes au réseau.
self.addEventListener('fetch', function(e) {
  // Pass-through
});
