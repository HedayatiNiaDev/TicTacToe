// Bump this version any time cached files change to force an update.
const CACHE_NAME = 'tic-tac-toe-v2';

// Local app-shell files (same-origin)
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './js/i18n.js',
    './js/script.js',
    './js/pwa.js',
    './favicon.webp',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png'
];

// Third-party stylesheets that pull in fonts/icons at runtime.
// We fetch each one, read the actual font files it points to, and
// cache those too - so nothing is missing once the user goes offline.
const EXTERNAL_STYLESHEETS = [
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap'
];

// Downloads a stylesheet, caches it, then finds and caches every
// font file (url(...)) it references - relative or absolute.
async function cacheStylesheetAndFonts(cache, cssUrl) {
    try {
        const cssResponse = await fetch(cssUrl, { mode: 'cors' });
        if (!cssResponse.ok) return;
        const cssText = await cssResponse.clone().text();
        await cache.put(cssUrl, cssResponse);

        const fontUrls = [...cssText.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)]
            .map((match) => match[1])
            .filter((url) => !url.startsWith('data:'))
            .map((url) => new URL(url, cssUrl).href);

        await Promise.all(fontUrls.map(async (fontUrl) => {
            try {
                const fontResponse = await fetch(fontUrl, { mode: 'cors' });
                if (fontResponse.ok) await cache.put(fontUrl, fontResponse);
            } catch (err) {
                // Ignore individual font failures so one bad request
                // doesn't block the whole install.
            }
        }));
    } catch (err) {
        // Ignore - offline caching of a third-party asset is best-effort.
    }
}

// Install: pre-cache the app shell plus fonts/icons for full offline play
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            await cache.addAll(ASSETS_TO_CACHE);
            await Promise.all(
                EXTERNAL_STYLESHEETS.map((url) => cacheStylesheetAndFonts(cache, url))
            );
            return self.skipWaiting();
        })
    );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: cache-first for everything already cached, falling back to network,
// caching new same-origin AND cross-origin (fonts/icons) responses as they arrive.
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const networkFetch = fetch(event.request)
                .then((networkResponse) => {
                    const isCacheable = networkResponse
                        && networkResponse.status === 200
                        && (networkResponse.type === 'basic' || networkResponse.type === 'cors');
                    if (isCacheable) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse);

            return cachedResponse || networkFetch;
        })
    );
});
