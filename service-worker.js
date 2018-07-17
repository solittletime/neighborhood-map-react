var staticCacheName = 'rleaf-static-v1';
var contentImgsCache = 'rleaf-content-imgs';
var allCaches = [
  staticCacheName,
  contentImgsCache
];
/*
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        'css/styles_small.css',
        'img/1-270x248.jpg'
      ]);
    }).catch(function(error) {
      console.log(error); // "oh, no!"
    })
  );
});
*/

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('rleaf-') &&
                 !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(serveStatic(event.request));
  return;
});

function serveStatic(request) {
  var storageUrl = request.url;
  storageUrl = storageUrl.replace(/\?.*$/, '');
  return caches.open(staticCacheName).then(function (cache) {
    return cache.match(storageUrl).then(function (response) {
      if (response) return response;
      return fetch(request, {cache: "no-store"}).then(function (networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      }).catch(function () {
        console.log(request.url);
        console.log("error");
      });
    });
  });
}
