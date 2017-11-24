var version = 'v1::';
var CACHE_NAME = 'cricket-cache';
var urlsToCache = [
  '/',
  '/manifest.json',
  '/config.js',
  '/styles/style.css',
  '/models/model.js',
  '/controllers/controller.js',
  '/js/concat.js',
  '/views/home.jade',
  '/images/launcher-icon-1x.png',
  '/images/launcher-icon-2x.png',
  '/images/launcher-icon-4x.png',
  '/images/launcher-icon-8x.png'
];

self.addEventListener('install', function(event) {
  console.log("install event in progress.");
  event.waitUntil(precache());
});

self.addEventListener('activate', function(event) {
  console.log("activate event in progress.");
  event.waitUntil(
    caches.keys()
    .then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return !key.startsWith(version);
        })
        .map(function(key) {
          console.log("delete cache");
          return caches.delete(key);
        })
      );
    })
    .then(function() {
      console.log('activate event completed.');
    })
  ); 
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') {
    console.log('fetch event ignored.', event.request.method, event.request.url);
    return;
  } 
    
  event.respondWith(
    caches.match(event.request)
    .then(function(cached) {
      var networked = fetch(event.request)
      .then(fetchedFromNetwork, unableToResolve)
      .catch(unableToResolve);
      console.log('fetch event', cached ? '(cached)' : '(network)', event.request.url);
      return cached || networked;
      
      function fetchedFromNetwork(response) {
        var cacheCopy = response.clone();
        console.log('fetch response from network.', event.request.url);
        caches.open(version + CACHE_NAME)
        .then(function add(cache) {
          cache.put(event.request, cacheCopy);
        })
        .then(function() {
          console.log('fetch response stored in cache.', event.request.url);
        });
        return response;
      }
      
      function unableToResolve() {
        console.log('fetch request failed in both cache and network.');
        return new Response('<h1>Service Unavailable</h1>', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/html'
          })
        });
      }
    })
  );
});

function precache() {
  return caches.open(version + CACHE_NAME).then(function(cache) {
    console.log('All files are cached');
    return cache.addAll(urlsToCache);
  }).then(function () {
    console.log('Install completed');
  });
}