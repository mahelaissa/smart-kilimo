const cacheName = 'smart-kilimo-v9';
const assets = [
  '/',
  'index.html',
  'tf.min.js',
  'teachablemachine-image.min.js',
  'html2pdf.bundle.min.js',
  'manifest.json',
  'model/model.json',
  'model/metadata.json',
  'model/weights.bin',
  // Unaweza kuongeza picha ya icon hapa pia
];

// Install Service Worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching shell assets...');
      // Kutumia addAll ni rahisi zaidi, lakini mbinu yako ya .map ni nzuri kwa debugging
      return cache.addAll(assets);
    })
  );
  self.skipWaiting();
});

// Activate Event
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

// Fetch Event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // Kama kipo kwenye cache, kirudishe. Kama hakipo, nenda mtandaoni.
      return cacheRes || fetch(evt.request).catch(() => {
        // Hapa unaweza kurudisha ukurasa wa "Opps! Hauna Mtandao" kwa HTML requests
        if (evt.request.url.indexOf('.html') > -1) {
          return caches.match('index.html'); 
        }
      });
    })
  );
});
