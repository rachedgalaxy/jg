const CACHE_NAME = 'jaguar-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/index.css',
    '/index.tsx',
    '/index.tsx',
    'https://i.ibb.co/KphRqqMV/jgc.png',
    'https://cdn.tailwindcss.com',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
