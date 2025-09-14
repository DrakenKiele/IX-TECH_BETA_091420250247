
const CACHE_NAME = 'aniota-ix-tech-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main-ixtech.js',
  
  // CHRYSALIX user journey
  '/CHRYSALIX/aniota_splash.html',
  '/CHRYSALIX/aniota_splash.css',
  '/CHRYSALIX/aniota_splash.js',
  '/CHRYSALIX/aniota_launcher.html',
  '/CHRYSALIX/aniota_launcher.css',
  '/CHRYSALIX/aniota_launcher.js',
  '/CHRYSALIX/aniota_about.html',
  '/CHRYSALIX/aniota_about.css',
  '/CHRYSALIX/aniota_about.js',
  '/CHRYSALIX/aniota_subscribix.html',
  '/CHRYSALIX/aniota_subscribix.css',
  '/CHRYSALIX/aniota_subscribix.js',
  '/CHRYSALIX/aniota_epicenter.html',
  '/CHRYSALIX/aniota_epicenter.css',
  '/CHRYSALIX/aniota_epicenter.js',
  
  // Core assets
  '/assets/hope.png',
  '/assets/background.png',
  '/assets/aniota_human_scene.png',
  '/assets/dksoftworks128.png',
  '/assets/dksoftworks256.png',
  '/assets/dksoftworks512.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  
  // Module stubs
  '/RADIX/radix_dashboard.html',
  '/PHONEMIX/phonemix_dashboard.html',
  '/MAQNETIX/maqnetix_dashboard.html',
  '/SECURIX/securix_dashboard.html',
  '/GRAFIX/grafix_dashboard.html'
];

self.addEventListener('install', event => {
  console.log('ANIOTA Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ANIOTA Service Worker: Caching app shell');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('ANIOTA Service Worker: Skip waiting');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  console.log('ANIOTA Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('ANIOTA Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('ANIOTA Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('ANIOTA Service Worker: Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('ANIOTA Service Worker: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/CHRYSALIX/aniota_splash.html');
            }
          });
      })
  );
});

// Background sync for learning data
self.addEventListener('sync', event => {
  if (event.tag === 'learning-sync') {
    console.log('ANIOTA Service Worker: Syncing learning data');
    event.waitUntil(syncLearningData());
  }
});

// Sync learning moments when online
async function syncLearningData() {
  try {
    // Get pending learning moments from IndexedDB or localStorage
    const pendingMoments = await getPendingLearningMoments();
    
    if (pendingMoments.length > 0) {
      // Send to backend API
      const response = await fetch('/api/learning/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moments: pendingMoments })
      });
      
      if (response.ok) {
        // Clear synced moments
        await clearSyncedLearningMoments();
        console.log('ANIOTA Service Worker: Learning data synced successfully');
      }
    }
  } catch (error) {
    console.error('ANIOTA Service Worker: Learning sync failed:', error);
  }
}

// Helper functions for learning data management
async function getPendingLearningMoments() {
  // Implementation would retrieve from IndexedDB
  return [];
}

async function clearSyncedLearningMoments() {
  // Implementation would clear from IndexedDB
  return true;
}

// Push notifications (for future Symbie integration)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/icon-192.png',
      badge: '/assets/icon-128.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/CHRYSALIX/aniota_epicenter.html'
      },
      actions: [
        {
          action: 'open',
          title: 'Open ANIOTA',
          icon: '/assets/icon-128.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/assets/close.svg'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'ANIOTA Learning', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url || '/CHRYSALIX/aniota_epicenter.html';
    
    event.waitUntil(
      clients.matchAll().then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

console.log('ANIOTA Service Worker: Loaded successfully');
# 2025-09-11 | [XX]    | [Description]                        | [Reason]
# -----------------------------------------------------------------------------
