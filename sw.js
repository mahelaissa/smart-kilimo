const cacheName = 'smart-kilimo-v7'; // Badili namba kila unapoweka mpya
const assets = [
  'index.html',
  'tf.min.js',
  'teachablemachine-image.min.js',
  'html2pdf.bundle.min.js',
  'manifest.json',
  'model/model.json',
  'model/metadata.json',
  'model/weights.bin'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Inaanza kupakia mafaili...');
      // Badala ya addAll, tunatumia ramani (map) ili kujua kila faili limefika au la
      return Promise.all(
        assets.map(asset => {
          return cache.add(asset).catch(err => {
            console.error("Faili hili halijapatikana GitHub: " + asset);
          });
        })
      );
    })
  );
  self.skipWaiting(); // Inalazimisha toleo jipya kuanza mara moja
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
