self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pantry-cache-v1').then((cache) => {
      return  cache.addAll ([
      "/Pantry-Planner/",
      "/Pantry-Planner/index.html",
      "/Pantry-Planner/manifest.json",
      "/Pantry-Planner/groceries.js",
      "/Pantry-Planner/groceries.css",
      "/Pantry-Planner/icon-192.png",
      "/Pantry-Planner/icon-512.png"
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
