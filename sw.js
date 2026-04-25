const cacheName = 'smart-kilimo-v14'; 
const assets = [
  './',
  './index.html',
  './tf.min.js',
  './teachablemachine-image.min.js',
  './model/model.json',
  './model/metadata.json',
  './model/weights.bin'
];

// 1. INSTALL: Inahifadhi files zote muhimu (Pre-caching)
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Inahifadhi faili za Kilimo (Caching assets)...');
      return Promise.all(
        assets.map(asset => {
          // fetch() inahakikisha tunapata file kabla ya ku-add ili kuzuia error
          return fetch(asset).then(response => {
            if (!response.ok) throw new Error(`File halipo: ${asset}`);
            return cache.put(asset, response);
          }).catch(err => console.error("Imeshindwa kuhifadhi file hili:", asset, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// 2. ACTIVATE: Inafuta version za zamani ili kupata kodi mpya
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // Inachukua control ya page haraka
});

// 3. FETCH: Siri ya kufanya kazi Offline
self.addEventListener('fetch', evt => {
  // Hatupendi ku-cache maombi ya nje (kama analytics) au POST requests
  if (evt.request.method !== 'GET') return;

  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // Kama lipo kwenye cache, tumia hicho. Kama hakuna, nenda Internet.
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(cacheName).then(cache => {
          // Hiari: Unaweza ku-cache files mpya zinazopatikana njiani
          // cache.put(evt.request.url, fetchRes.clone()); 
          return fetchRes;
        });
      }).catch(() => {
        // Ikiwa mtandao umekatika na file halipo cache
        if (evt.request.url.indexOf('.html') > -1) {
          return caches.match('./index.html'); 
        }
      });
    })
  );
});
