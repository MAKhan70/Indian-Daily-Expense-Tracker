const CACHE_NAME = "pocket-ledger-shell-v5";
const scopedPath = (path = "") => new URL(path, self.registration.scope).pathname;
const APP_SHELL = [
  scopedPath(),
  scopedPath("index.html"),
  scopedPath("manifest.webmanifest"),
  scopedPath("icons/icon-192.png"),
  scopedPath("icons/icon-512.png"),
  scopedPath("icons/maskable-512.png"),
  scopedPath("icons/apple-touch-icon.png")
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith(scopedPath("api/"))) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(scopedPath("index.html"), copy));
          return response;
        })
        .catch(() => caches.match(scopedPath("index.html"))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    })),
  );
});
