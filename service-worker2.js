const CACHE_NAME = 'news-web-v1';
const urlsToCache = [
    '/',
    '/index3.html',
    '/Designer.png',
    '/manifest.json',
    '/main.js',
    '/style.css',
    'https://startechs-2024-default-rtdb.europe-west1.firebasedatabase.app/blog.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});