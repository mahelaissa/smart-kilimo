const cacheName = 'smart-kilimo-v2'; // Tumia jina moja tu la cache

// Orodha ya mafaili yote yanayotakiwa kufanya kazi Offline
const assets = [
  './',
  './index.html',
  './manifest.json',
  './style.css',              // Hakikisha jina linafanana na faili lako
  './tf.min.js',              // Faili ulilopakua
  './teachablemachine-image.min.js', // Faili ulilopakua
  './html2pdf.bundle.min.js', // Faili ulilopakua la PDF
  
  // MUHIMU: Ongeza faili za Model yako hapa (badili jina la folder kama ni tofauti)
  './model/model.json',
  './model/metadata.json',
  './model/weights.bin'
];

// 1. Hatua ya Kuinidhinisha (Install)
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Inahifadhi kodi za mfumo kwa ajili ya Offline...');
      // Tunatumia addAll kuhifadhi kila kitu kwenye list ya assets
      return cache.addAll(assets);
    })
  );
});

// 2. Hatua ya Kuamsha (Activate) - Inafuta cache za zamani
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

// 3. Hatua ya Kuchukua Data (Fetch) - Hii ndio inayofanya kazi Offline
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // Kama faili lipo kwenye cache, litoe hapo. Kama halipo, nenda mtandaoni (kama kuna internet)
      return cacheRes || fetch(evt.request);
    })
  );
});
