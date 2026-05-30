const CACHE_NAME = "dhoon-v3";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add("/");
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((networkResponse) => {
          const responseClone =
            networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(
              event.request,
              responseClone
            );
          });

          return networkResponse;
        })
      );
    })
  );
});