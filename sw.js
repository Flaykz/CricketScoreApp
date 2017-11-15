var CACHE_NAME = 'cricket-cache';
var urlsToCache = [
  '/',
  '/manifest.json',
  '/config.js',
  '/styles/style.css',
  '/styles/toastr.min.css',
  '/models/model.js',
  '/controllers/controller.js',
  '/js/concat.js',
  '/views/home.jade',
  '/images/0.svg',
  '/images/1.svg',
  '/images/2.svg',
  '/images/3.svg',
  '/images/launcher-icon-1x.png',
  '/images/launcher-icon-2x.png',
  '/images/launcher-icon-4x.png',
  '/images/launcher-icon-8x.png'
];

self.addEventListener('install', function(event) {
    console.log("The service worker is being installed.");
    event.waitUntil(precache());
});

self.addEventListener('activate', function (event) {
    console.log("The service worker is activate.");
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    //return true if you want to remove this cache
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    ); 
});

self.addEventListener('fetch', function(event) {
    console.log("The service worker is fetching something.");
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                // return response || fetch(event.request).then(function(response) {
                //     cache.put(event.request, response.clone());
                //     return response;
                // });
                var fetchPromise = fetch(event.request).then(function(networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                return response || fetchPromise;
            }).catch(function() {
                console.log("fail to cache and fail to network.");
                return cache.match('/offline.html');
            });
        })
    );
//   event.respondWith(fromNetwork(event.request, 400).catch(function () {
//     return fromCache(event.request);
//   })
//   );
});

function precache() {
  return caches.open(CACHE_NAME).then(function(cache) {
    console.log('Opened cache');
    return cache.addAll(urlsToCache);
  });
}

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);
    fetch(request).then(function(response) {
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache (request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return caches.match(request).then(function (matching) {
      return matching || Promise.reject("no-match");
    });
  });
}