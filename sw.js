// ponytail: minimal shell cache, no offline image caching (catalog images live under pages/g* and are network-only)
const CACHE = 'kg-spares-v47';
const SHELL = ['./', './index.html', './manifest.json'];
// exact-path match for the shell network-first branch below — NOT p.replace('./','')+endsWith,
// which degenerately matched every request (endsWith('') is always true)
const SHELL_PATHS = new Set(['/', '/index.html', '/ledger.html', '/manifest.json']);

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// ---- web push: notify suppliers of new requests / retail orders even when app is closed ----
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || 'FarmingTools.in Spares', {
    body: d.body || 'You have a new order.', tag: 'ft-order', renotify: true
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cls) => {
    for (const c of cls) { if (c.url.indexOf('ledger.html') !== -1) return c.focus(); }
    return clients.openWindow('./ledger.html');
  }));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // never intercept cross-origin (esm.sh, Supabase, …)
  const isData = url.pathname.endsWith('/catalog.json'); // accounts/stock/prices now live in Supabase

  if (isData) {
    // network-first so dealers/catalog edits show up immediately; fall back to cache offline
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  if (SHELL_PATHS.has(url.pathname)) {
    // network-first: app updates must reach dealers immediately; cache is only the offline fallback
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
