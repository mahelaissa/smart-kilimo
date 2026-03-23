const cacheName = 'smart-kilimo-v1';
const cacheName = 'smart-kilimo-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js',
  'https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js'
];

// 1. Hatua ya Kuinidhinisha (Install)
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Inahifadhi kodi za mfumo kwa ajili ya Offline...');
      cache.addAll(assets);
    })
  );
});

// 2. Hatua ya Kuchukua Data (Fetch)
// Hapa ndipo App inapochagua kutumia kodi za kwenye simu badala ya internet
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
