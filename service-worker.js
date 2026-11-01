// CareRoute Service Worker — Phase 7 offline support
// Caches static shell assets for offline use.
// IMPORTANT: Never cache authenticated API responses or patient-identifiable data.

const CACHE_NAME   = 'careroute-v1';
const OFFLINE_URL  = '/offline.html';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/find-care.html',
  '/about.html',
  '/how-it-works.html',
  '/contact.html',
  '/offline.html',
  '/css/variables.css',
  '/css/reset.css',
  '/css/global.css',
  '/css/components.css',
  '/css/landing.css',
  '/css/patient.css',
  '/css/admin.css',
  '/css/facility.css',
  '/css/auth.css',
  '/css/responsive.css',
  '/js/config/api-config.js',
  '/js/config/translations.js',
  '/js/components/icons.js',
  '/js/components/toast.js',
  '/js/components/modal.js',
  '/js/components/layout.js',
  '/js/components/navigation.js',
  '/js/components/form-validation.js',
  '/js/components/language-switcher.js',
  '/js/components/app-shell.js',
  '/js/services/api-service.js',
  '/js/services/auth-service.js',
  '/js/services/mock-data.js',
  '/js/services/facility-service.js',
  '/js/main.js',
  '/js/pages/landing.js',
  '/js/pages/contact.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests; skip API calls so we never cache private data
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() =>
        caches.match(OFFLINE_URL)
      );
    })
  );
});
