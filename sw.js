const cacheName = 'smart-kilimo-v11'; // Nimeongeza version ili browser isome upya
const assets = [
  './',
  './index.html',
  './tf.min.js',
  './teachablemachine-image.min.js',
  './html2pdf.bundle.min.js',
  './manifest.json',
  './model/model.json',
  './model/metadata.json',
  './model/weights.bin'
];

// Install Service Worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Inahifadhi faili (Caching assets)...');
      // Kutumia Promise.all na map hapa inasaidia kama faili moja ikikosekana nyingine ziendelee
      return Promise.all(
        assets.map(asset => {
          return cache.add(asset).catch(err => console.error("Imeshindwa kuhifadhi:", asset, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate Event - Futa cache za zamani
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName)
            .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Event - Inasoma kutoka kwenye Cache hata kama hakuna Internet
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // Kama faili lipo kwenye cache, rudi nalo. Kama halipo, nenda mtandaoni (fetch)
      return cacheRes || fetch(evt.request).catch(() => {
        // Kama mtandao umekatika na anatafuta ukurasa wa HTML, mrudishe index.html
        if (evt.request.url.indexOf('.html') > -1) {
          return caches.match('./index.html'); 
        }
      });
    })
  );
});
