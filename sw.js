const cacheName = 'smart-kilimo-v9'; // Badili kila unapo-update
const assets = [
  './',
  'index.html',
  'tf.min.js',
  'teachablemachine-image.min.js',
  'html2pdf.bundle.min.js',
  'manifest.json',
 
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      return Promise.all(
        assets.map(asset => {
          return cache.add(asset).catch(err => console.log("Faili halipo: " + asset));
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)));
    })
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
