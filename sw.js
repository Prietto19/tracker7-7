var CACHE=‘7plus7-v12’;
var ASSETS=[’/tracker7-7/’,’/tracker7-7/index.html’,’/tracker7-7/manifest.json’,
‘https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js’,
‘https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js’];
self.addEventListener(‘install’,function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS).catch(function(){});}).then(function(){return self.skipWaiting();}));});
self.addEventListener(‘activate’,function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE;}).map(function(n){return caches.delete(n);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener(‘fetch’,function(e){e.respondWith(caches.match(e.request).then(function(c){return c||fetch(e.request);}));});
