const CACHE_NAME = "pantry-cache-v8";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./groceries.js",
  "./groceries.css",
  "./icon-192.png",
  "./icon-512.png"
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

// Fetch: stale‑while‑revalidate with safe caching
self.addEventListener("fetch", (event) => {
  const request = event.request;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // Only cache valid, cloneable responses
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return (
            cachedResponse ||
            caches.match("./index.html")
          );
        });

      // Return cached version immediately if available
      return cachedResponse || fetchPromise;
    })
  );
});
