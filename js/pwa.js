// ---------- PWA: install prompt + update handling ----------

let deferredInstallPrompt = null;
let waitingServiceWorker = null;

function isRunningStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true; // iOS Safari
}

function buildPwaButtons() {
    if (document.getElementById('pwaActions')) return;

    const wrap = document.createElement('div');
    wrap.id = 'pwaActions';
    wrap.className = 'pwa-actions';
    wrap.innerHTML = `
        <button id="updateBtn" class="pwa-btn pwa-update-btn" type="button" hidden>
            <i class="bi bi-arrow-up-circle-fill"></i><span data-i18n="updateApp">Update</span>
        </button>
        <button id="installBtn" class="pwa-btn" type="button" hidden>
            <i class="bi bi-download"></i><span data-i18n="installApp">Install</span>
        </button>
    `;

    const topbar = document.querySelector('.topbar');
    const langSwitcher = document.querySelector('.lang-switcher');
    const githubLink = document.querySelector('.github-link');
    topbar.insertBefore(wrap, langSwitcher || githubLink);

    document.getElementById('installBtn').addEventListener('click', onInstallClick);
    document.getElementById('updateBtn').addEventListener('click', onUpdateClick);

    // Translate the freshly-inserted buttons right away.
    if (typeof applyStaticTranslations === 'function') applyStaticTranslations();
}

async function onInstallClick() {
    if (!deferredInstallPrompt) return;
    const installBtn = document.getElementById('installBtn');
    installBtn.disabled = true;
    deferredInstallPrompt.prompt();
    try {
        await deferredInstallPrompt.userChoice;
    } finally {
        deferredInstallPrompt = null;
        installBtn.hidden = true;
        installBtn.disabled = false;
    }
}

function onUpdateClick() {
    if (!waitingServiceWorker) return;
    const updateBtn = document.getElementById('updateBtn');
    updateBtn.disabled = true;
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
}

// Chrome/Edge/Android fire this when the app is installable.
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    if (isRunningStandalone()) return;
    deferredInstallPrompt = event;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) installBtn.hidden = false;
});

// Hide the install button once the app has actually been installed.
window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) installBtn.hidden = true;
});

// Registers the service worker so the game can be installed and played offline,
// and wires up update detection so a new version can be applied on demand.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then((registration) => {

            function trackInstallingWorker(worker) {
                if (!worker) return;
                worker.addEventListener('statechange', () => {
                    // "installed" + an existing controller means this is an
                    // update to an already-running app, not the first install.
                    if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                        waitingServiceWorker = worker;
                        const updateBtn = document.getElementById('updateBtn');
                        if (updateBtn) updateBtn.hidden = false;
                    }
                });
            }

            // A new version may already be waiting from a previous visit.
            if (registration.waiting && navigator.serviceWorker.controller) {
                waitingServiceWorker = registration.waiting;
                const updateBtn = document.getElementById('updateBtn');
                if (updateBtn) updateBtn.hidden = false;
            }

            registration.addEventListener('updatefound', () => {
                trackInstallingWorker(registration.installing);
            });

            // Periodically check for a newer service-worker.js in the background.
            setInterval(() => registration.update(), 60 * 60 * 1000);

        }).catch((err) => {
            console.warn('Service worker registration failed:', err);
        });

        // Once the new worker takes control, reload once to load the new assets.
        let hasReloaded = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (hasReloaded) return;
            hasReloaded = true;
            window.location.reload();
        });
    });
}

document.addEventListener('DOMContentLoaded', buildPwaButtons);
