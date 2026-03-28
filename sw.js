const cacheName = 'smart-kilimo-v5'; // Badili iwe v5
const assets = [
  './',
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
      console.log('Inajaribu kuhifadhi mafaili...');
      return cache.addAll(assets).catch(err => {
        // Hii itatuambia kwenye Console faili gani lina shida
        console.error("Kuna faili limekosekana kwenye GitHub:", err);
      });
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
