```javascript
const CACHE_NAME = "ocb-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

/*
 * Installation du service worker
 */
self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())

  );

});


/*
 * Activation
 */
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys => {

        return Promise.all(

          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))

        );

      })
      .then(() => self.clients.claim())

  );

});


/*
 * Requêtes
 *
 * On laisse le réseau fonctionner normalement.
 * Le cache sert uniquement de secours.
 */
self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)
      .catch(() => caches.match(event.request))

  );

});
```
