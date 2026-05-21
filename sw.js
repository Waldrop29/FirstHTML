const CACHE_NAME = "pantry-cache-v2";

const ASSETS = [
  "/Pantry-Planner/index.html",
  "/Pantry-Planner/manifest.json",
  "/Pantry-Planner/groceries.js",
  "/Pantry-Planner/groceries.css",
  "/Pantry-Planner/icon-192.png",
  "/Pantry-Planner/icon-512.png"
];

// Install: cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: stale‑while‑revalidate strategy
self.addEventListener("fetch", (event) => {
  const request = event.request;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // Update cache with fresh version
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return cachedResponse || caches.match("/Pantry-Planner/index.html");
        });

      // Return cached version immediately if available
      return cachedResponse || fetchPromise;
    })
  );
});
