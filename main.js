let deferredPrompt;
const installButton = document.getElementById('installButton');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block';
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the installation');
            installButton.style.display = 'none';
        }
        deferredPrompt = null;
    }
});

window.addEventListener('appinstalled', () => {
    installButton.style.display = 'none';
    console.log('PWA was installed');
});

function createArticleElement(article) {
            return `
                <article class="article">
                    <img src="${article.image}" alt="${article.title1}">
                    <h2 class="article-title">${article.title1}</h2>
                    <h3 class="article-subtitle">${article.title2}</h3>
                    <div class="article-content">${article.content}</div>
                    <div class="article-meta">
                        <span class="article-date">${new Date(article.date).toLocaleDateString()}</span>
                        <span class="article-author">${article.author}</span>
                    </div>
                </article>
            `;
        }

        async function loadArticles() {
            const articlesContainer = document.getElementById('articles');

            try {
                const response = await fetch('https://startechs-2024-default-rtdb.europe-west1.firebasedatabase.app/blog.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const articles = await response.json();
                
                const sortedArticles = articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                articlesContainer.innerHTML = sortedArticles.map(createArticleElement).join('');

            } catch (error) {
                console.error('Error fetching articles:', error);
                articlesContainer.innerHTML = '<p>Une erreur est survenue lors du chargement des articles.</p>';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(loadArticles, 200);
        });

        // Register Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker2.js')
                    .then(registration => {
                        console.log('ServiceWorker registration successful');
                    })
                    .catch(err => {
                        console.log('ServiceWorker registration failed: ', err);
                    });
            });
        }


        //NOTIFICATION
const notifyMe = () => {
    //alert('notify')
    let myNotification = null
    const options = {
        body: "Envoyé par Pierre",
        icon: "icons/favicon-32x32.png",
        vibrate: [200,100,200,100,200,100,200],
        url: "https://www.lesoir.be"
    }
    if( !("Notification" in window) ) {
        alert('Pas de notification dans ce navigateur')
    } else if (Notification.permission === "granted") {
        console.log("Notification possible")
        myNotification = new Notification('Hi me !', options)
    } else { //demande de permission
        Notification.requestPermission().then( permission => {
            if (permission === "granted") {
                console.log("Notification possible")
                myNotification = new Notification('Oh, Thank You !', options)
            }
        })
    }
}

if(Notification.permission !== 'granted') {
    if(confirm('Recevoir notifications ?')) {
        notifyMe()
    }
}

notifyMe()