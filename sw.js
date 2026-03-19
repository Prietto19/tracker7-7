var CACHE = ‘7plus7-v10’;
var BASE = ‘/tracker7-7/’;

self.addEventListener(‘install’, function(e) {
e.waitUntil(
caches.open(CACHE).then(function(c) {
return c.addAll([
BASE,
BASE + ‘index.html’,
BASE + ‘manifest.json’,
BASE + ‘icon-192.png’,
BASE + ‘icon-512.png’,
‘https://unpkg.com/react@18.3.1/umd/react.production.min.js’,
‘https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js’,
‘https://unpkg.com/@babel/standalone@7.23.10/babel.min.js’,
]).catch(function(){});
})
);
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
})
);
self.clients.claim();
});

self.addEventListener(‘fetch’, function(e) {
e.respondWith(
caches.match(e.request).then(function(cached) {
return cached || fetch(e.request).then(function(resp) {
return resp;
});
})
);
});
