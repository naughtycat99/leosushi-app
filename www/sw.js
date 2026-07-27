// Service Worker cho LEO SUSHI PWA
// v2 — Network-first for dynamic assets, cache-first for static assets
const CACHE_NAME = 'leosushi-v3';

// Only cache truly static assets (images, fonts)
const STATIC_ASSETS = [
  '/assets/logo.png',
  '/manifest.json'
];

// These file types should ALWAYS be fetched from network first
// so that code updates are picked up immediately without reinstalling
const NETWORK_FIRST_EXTENSIONS = ['.js', '.css', '.html', '.php'];

// Install event - cache static resources only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.log('[SW] Cache install failed:', error);
      })
  );
  self.skipWaiting(); // Activate immediately, don't wait for tabs to close
});

// Activate event - clean up ALL old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all tabs immediately
});

// Fetch event - NETWORK-FIRST for code files, cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests (POST, PUT, DELETE etc.)
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip API requests - never cache these
  if (event.request.url.includes('/api/')) return;

  const url = new URL(event.request.url);
  const isCodeFile = NETWORK_FIRST_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
  const isNavigationRequest = event.request.mode === 'navigate';

  if (isCodeFile || isNavigationRequest) {
    // NETWORK-FIRST: Try network, fall back to cache
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Got fresh response — cache it for offline use
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed — serve from cache (offline mode)
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // If navigating and nothing cached, try index.html
            if (isNavigationRequest) {
              return caches.match('/index.html');
            }
            return new Response('Offline', { status: 503 });
          });
        })
    );
  } else {
    // CACHE-FIRST: For static assets (images, fonts, manifest)
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) return response;
          return fetch(event.request).then((fetchResponse) => {
            if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return fetchResponse;
          });
        })
        .catch(() => {
          return new Response('Offline', { status: 503 });
        })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Neue Nachricht von LEO SUSHI',
    icon: 'assets/logo.png',
    badge: 'assets/logo.png',
    vibrate: [200, 100, 200],
    tag: 'leosushi-notification'
  };

  event.waitUntil(
    self.registration.showNotification('LEO SUSHI', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
