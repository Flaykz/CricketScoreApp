var version = 'v1:6:3';
var CACHE_NAME = 'cricket-cache';
var urlsToCache = [
  '/',
  '/sw.js',
  '/manifest.json',
  '/config.js',
  '/js/home.js',
  '/styles/style.css',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
  '/models/model.js',
  '/controllers/controller.js',
  'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
  '/views/home.jade',
  '/favicon.png',
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
      //return self.clients.claim();
    })
  ); 
});

self.addEventListener('fetch', function(event) {
  console.log('fetchevent: request url before : ', event.request.url);
  var urlStripped = event.request.url.split("?")[0];
  if (urlStripped == "https://dev.flaykz.ovh/") {
    var req = new Request(urlStripped);
  }
  else {
    var req = event.request;
  }
  
  if (req.method !== 'GET') {
    console.log('fetch event ignored.', req.method, req.url);
    return;
  } 
    
  event.respondWith(
    caches.match(req, { 'ignoreSearch': true })
    .then(function(cached) {
      var networked = fetch(req)
      .then(fetchedFromNetwork, unableToResolve)
      .catch(unableToResolve);
      console.log('fetch event', cached ? '(cached)' : '(network)', req.url);
      return cached || networked;
      
      function fetchedFromNetwork(response) {
        var cacheCopy = response.clone();
        console.log('fetch response from network.', req.url);
        caches.open(version + CACHE_NAME)
        .then(function add(cache) {
          cache.put(req, cacheCopy);
        })
        .then(function() {
          console.log('fetch response stored in cache.', req.url);
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
    return self.skipWaiting();
  });
}