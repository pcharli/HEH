const CACHE_NAME = 'news-web-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/images/Designer.png',
    '/manifest.json',
    '/main.js',
    '/style.css',
    'https://startechs-2024-default-rtdb.europe-west1.firebasedatabase.app/blog.json',
    '/icons/192x192.png',
    '/icons/512x512.png',
    '/images/telecharger.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon.ico',
    '/images/telecharger2.png'
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

//add push notifications

self.addEventListener('push', e => {
    if( !(self.Notification && self.Notification.permission === 'granted') ) {
        return;
    }
    console.log('test notification')
    const data = e.data.json() ?? {}
    console.log(data)

    const myNotification = registration.showNotification(data.title, {
        body: data.message,
        tag: "simple-demo-notification-push",
        icon: "icons/192x192.png"
    })

    self.addEventListener('notificationclick', e => {
        e.notification.close()
        e.waitUntil(
            clients.openWindow(data.url)
        )
    })
})
