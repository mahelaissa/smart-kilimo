const cacheName = 'smart-kilimo-v4'; // Badili namba hapa iwe v4 ili simu ijue kuna mabadiliko
const assets = [
  '',
  'index.html',
  'manifest.json',
  'tf.min.js',
  'teachablemachine-image.min.js',
  'html2pdf.bundle.min.js',
  'model/model.json',
  'model/metadata.json',
  'model/weights.bin'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Inapakia mafaili...');
      // addAll itafeli kama faili moja halipo. Hakikisha majina yapo sawa!
      return cache.addAll(assets).catch(err => console.log("Faili limekosekana:", err));
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
