// Admin Service Worker for Push Notifications
const CACHE_NAME = 'leo-admin-v2';

// Push event — received push notification from server
self.addEventListener('push', function (event) {
    console.log('[SW] Push received');

    // STEP 1: Show notification IMMEDIATELY (don't wait for fetch)
    // This ensures notification appears even if the device is battery-restricted
    const immediateNotify = self.registration.showNotification('🍣 Neue Bestellung!', {
        body: 'LEO SUSHI: Druck hier um die Bestellung zu öffnen.',
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
        tag: 'new-order-' + Date.now(), // unique tag so multiple orders show
        renotify: true,
        requireInteraction: true, // keeps notification visible until dismissed
        vibrate: [200, 100, 200, 100, 200], // strong vibration pattern
        data: { url: '/admin.html' },
        actions: [
            { action: 'open', title: '✅ Öffnen' },
            { action: 'dismiss', title: 'Später' }
        ]
    });

    // STEP 2: Also try to fetch the actual order count (best-effort, non-blocking)
    const enrichNotification = fetch(getApiUrl('/api/push.php?action=latest'), { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            if (data.count > 0) {
                // Update with more specific message
                return self.registration.showNotification('🍣 Neue Bestellung!', {
                    body: `${data.count} neue Bestellung(en) warten auf Bestätigung!`,
                    icon: '/assets/logo.png',
                    badge: '/assets/logo.png',
                    tag: 'new-order', // same tag = replaces the immediate one
                    renotify: true,
                    requireInteraction: true,
                    vibrate: [200, 100, 200, 100, 200],
                    data: { url: '/admin.html' },
                    actions: [
                        { action: 'open', title: '✅ Öffnen' },
                        { action: 'dismiss', title: 'Später' }
                    ]
                });
            }
        })
        .catch(() => {
            // Fetch failed — that's OK, the immediate notification already showed
            console.log('[SW] Could not fetch order details (offline/restricted), immediate notification shown.');
        });

    // STEP 3: Notify open admin windows to refresh data IMMEDIATELY
    const notifyClients = self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(windowClients => {
            windowClients.forEach(client => {
                client.postMessage({
                    type: 'REFRESH_ORDERS',
                    timestamp: Date.now()
                });
            });
        });

    // Wait for all (the immediate notification is critical)
    event.waitUntil(Promise.all([immediateNotify, notifyClients]));
});

// Notification click — open admin page
self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'dismiss') return;

    const urlToOpen = event.notification.data?.url || '/admin.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                // If admin is already open, focus it
                for (const client of windowClients) {
                    if (client.url.includes('admin.html') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise open new window
                return clients.openWindow(urlToOpen);
            })
    );
});

// Install event
self.addEventListener('install', function (event) {
    console.log('[SW] Installed v2');
    self.skipWaiting(); // activate immediately
});

// Activate event
self.addEventListener('activate', function (event) {
    console.log('[SW] Activated v2');
    event.waitUntil(clients.claim()); // take control immediately
});

// Helper: get API URL relative to SW scope
function getApiUrl(path) {
    return new URL(path, self.location.origin).href;
}
