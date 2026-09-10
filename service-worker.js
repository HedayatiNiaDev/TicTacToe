// Bump this version any time cached files change to force an update.
const CACHE_NAME = 'tic-tac-toe-v2.1.0';

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

// Third-party stylesheets
const EXTERNAL_STYLESHEETS = [
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap'
];

/**
 * Check whether a URL can safely be stored in the Cache API.
 * chrome-extension:// and other unsupported schemes are excluded.
 */
function isCacheableRequest(requestOrUrl) {
    try {
        const url = new URL(
            typeof requestOrUrl === 'string'
                ? requestOrUrl
                : requestOrUrl.url
        );

        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

/**
 * Safely cache a request/response pair.
 */
async function safeCachePut(cache, request, response) {
    if (!response || !isCacheableRequest(request)) {
        return;
    }

    try {
        await cache.put(request, response);
    } catch (error) {
        // Ignore unsupported or failed cache requests.
    }
}

/**
 * Downloads a stylesheet, caches it, then finds and caches
 * every font file referenced by the stylesheet.
 */
async function cacheStylesheetAndFonts(cache, cssUrl) {
    try {
        const cssResponse = await fetch(cssUrl, {
            mode: 'cors'
        });

        if (!cssResponse.ok) {
            return;
        }

        const cssText = await cssResponse.clone().text();

        await safeCachePut(
            cache,
            cssUrl,
            cssResponse
        );

        const fontUrls = [
            ...cssText.matchAll(
                /url\(\s*['"]?([^'")]+)['"]?\s*\)/g
            )
        ]
            .map((match) => match[1])
            .filter((url) => !url.startsWith('data:'))
            .map((url) => new URL(url, cssUrl).href)
            .filter((url) => isCacheableRequest(url));

        await Promise.all(
            fontUrls.map(async (fontUrl) => {
                try {
                    const fontResponse = await fetch(fontUrl, {
                        mode: 'cors'
                    });

                    if (fontResponse.ok) {
                        await safeCachePut(
                            cache,
                            fontUrl,
                            fontResponse
                        );
                    }
                } catch (error) {
                    // Ignore individual font failures.
                }
            })
        );
    } catch (error) {
        // Third-party caching is best-effort.
    }
}

/**
 * Install
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {

                // Cache local application files.
                await cache.addAll(ASSETS_TO_CACHE);

                // Cache external stylesheets and their fonts.
                await Promise.all(
                    EXTERNAL_STYLESHEETS.map((url) =>
                        cacheStylesheetAndFonts(cache, url)
                    )
                );
            })
            .catch(() => {
                // Prevent installation from crashing because
                // of a third-party resource.
            })
    );

    // Do NOT call self.skipWaiting() here. The new worker stays in the
    // "waiting" state until the page asks it to take over (see the
    // SKIP_WAITING message handler below), so the user gets a chance to
    // press the "Update" button instead of being force-updated silently.
});

/**
 * Message
 *
 * Lets the page tell a waiting service worker to activate immediately,
 * which is how the in-app "Update" button applies a new version.
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

/**
 * Activate
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

/**
 * Fetch
 *
 * Cache-first strategy:
 * 1. Return cached response if available.
 * 2. Otherwise request from network.
 * 3. Cache successful HTTP/HTTPS responses.
 */
self.addEventListener('fetch', (event) => {

    // Only handle GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    // IMPORTANT:
    // Do not process chrome-extension:// or other unsupported schemes.
    if (!isCacheableRequest(event.request)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(async (networkResponse) => {

                        const isCacheable =
                            networkResponse &&
                            networkResponse.status === 200 &&
                            (
                                networkResponse.type === 'basic' ||
                                networkResponse.type === 'cors'
                            );

                        if (isCacheable) {
                            const responseClone =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then((cache) =>
                                    safeCachePut(
                                        cache,
                                        event.request,
                                        responseClone
                                    )
                                )
                                .catch(() => {
                                    // Ignore cache errors.
                                });
                        }

                        return networkResponse;
                    })
                    .catch(() => {
                        // Network failed and nothing was cached.
                        return caches.match('./index.html');
                    });
            })
    );
});
