const CACHE_NAME = 'news-web-v1';
const urlsToCache = [
    '/',
    '/index3.html',
    '/Designer.png',
    '/manifest.json',
    '/main.js',
    '/style.css',
    '192x192.png',
    '512x512.png'
];

// Séparons l'URL de l'API pour un traitement spécifique
const API_URL = 'https://startechs-2024-default-rtdb.europe-west1.firebasedatabase.app/blog.json';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    // Si la requête correspond à l'URL de l'API, on privilégie le réseau
    if (event.request.url === API_URL) {
        return fetch(event.request)
            .then(response => {
                // Mettre à jour le cache avec la nouvelle réponse
                if (response.ok) {
                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, response.clone()));
                }
                return response;
            })
            .catch(error => {
                // Si l'erreur provient du réseau, on retourne la réponse en cache
                return caches.match(event.request).then(response => response);
            });
    } else {
        // Pour les autres requêtes, on utilise la stratégie de cache en premier
        return caches.match(event.request)
            .then(response => response || fetch(event.request));
    }
});
