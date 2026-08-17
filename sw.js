const CACHE_NAME = "webbuild-intake-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon.svg"
];


/* =========================
   INSTALL
========================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(APP_FILES);

        })
        .then(() => {

          return self.skipWaiting();

        })

    );

  }
);


/* =========================
   ACTIVATE
========================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(cacheNames => {

          return Promise.all(

            cacheNames
              .filter(
                cacheName =>
                  cacheName !== CACHE_NAME
              )
              .map(
                cacheName =>
                  caches.delete(cacheName)
              )

          );

        })
        .then(() => {

          return self.clients.claim();

        })

    );

  }
);


/* =========================
   FETCH
========================= */

self.addEventListener(
  "fetch",
  event => {

    /*
      Only handle GET requests.
      Form submissions are not cached.
    */

    if (
      event.request.method !== "GET"
    ) {

      return;

    }


    event.respondWith(

      caches
        .match(event.request)
        .then(cachedResponse => {

          /*
            Use the cached version first.
          */

          if (cachedResponse) {

            return cachedResponse;

          }


          /*
            Otherwise request it
            from the network.
          */

          return fetch(event.request)
            .then(networkResponse => {

              /*
                Cache successful basic
                responses for future use.
              */

              if (
                networkResponse &&
                networkResponse.status === 200 &&
                networkResponse.type === "basic"
              ) {

                const responseClone =
                  networkResponse.clone();


                caches
                  .open(CACHE_NAME)
                  .then(cache => {

                    cache.put(
                      event.request,
                      responseClone
                    );

                  });

              }


              return networkResponse;

            })
            .catch(() => {

              /*
                If the user is offline,
                return the main app page.
              */

              return caches.match(
                "./index.html"
              );

            });

        })

    );

  }
);
