var CACHE=‘7plus7-v11’;
var ASSETS=[
‘/tracker7-7/’,
‘/tracker7-7/index.html’,
‘/tracker7-7/manifest.json’,
‘/tracker7-7/icon-192.png’,
‘/tracker7-7/icon-512.png’,
‘https://unpkg.com/react@18.3.1/umd/react.production.min.js’,
‘https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js’
];
self.addEventListener(‘install’,function(e){
e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS).catch(function(){});}).then(function(){return self.skipWaiting();}));
});
self.addEventListener(‘activate’,function(e){
e.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener(‘fetch’,function(e){
e.respondWith(caches.match(e.request).then(function(c){return c||fetch(e.request);}));
});
