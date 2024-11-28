const CACHE_NAME = 'news-web-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/index3.html',
    '/Designer.png',
    '/manifest.json',
    '/main.js',
    '/style.css',
    '/192x192.png',
    '/512x512.png',
    '/telecharger.png',
    '/favicon.ico',
    '/apple-touch-icon.png'
];

// Séparons l'URL de l'API pour un traitement spécifique
const API_URL = 'https://startechs-2024-default-rtdb.europe-west1.firebasedatabase.app/blog.json';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Gérer les requêtes réseau, fetch intercepte les requêtes réseau
self.addEventListener('fetch', event => {
    //si la requête cible l'api
    if (event.request.url === API_URL) {
        // Stratégie Réseau d'abord pour l'API
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone(); // Clone avant consommation
                        caches.open(CACHE_NAME)
                        //on met en cache la requête et sa réponde qu'on a cloné
                            .then(cache => cache.put(event.request, responseClone));
                    }
                    //on retourne la réponse
                    return response;
                })
                .catch(() => {
                    // Si le réseau échoue, renvoyer les données en cache
                    return caches.match(event.request);
                })
        );
    } else {
        // Stratégie Cache d'abord pour les autres ressources
        //on remplace la réponse à la requête interceptée par fetch.
        event.respondWith(
            //on cherche dans le cache une réponse correspondant à la requête
            caches.match(event.request)
            //si on a une réponse elle est retournée || on envoie la requête au réseau
                .then(response => response || fetch(event.request))
        );
    }
});
