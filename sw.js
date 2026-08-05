// Shell precache now includes the vendored Supabase lib + catalog so the app boots
// fully offline. Catalog images (pages/**) are cached on first view (cache-first runtime),
// not precached — 1800 files / 37MB is far too much to push on install.
const CACHE = 'kg-spares-v117';
const IMG_CACHE = 'kg-img-v1';
// Brand assets belong in the shell rather than the runtime image cache: the header mark and the
// login logo are chrome, and a logo that only shows up once you are online is worse than none.
// They are NOT added to SHELL_PATHS below — these stay cache-first, not network-first.
const SHELL = ['./', './index.html', './manifest.json', './vendor/supabase.js', './supabase/config.js', './catalog.json',
  './brand/mark.svg', './brand/logo-64.png', './brand/logo-256.png'];
// Exact-path match for the shell network-first branch below. Resolve each entry against this
// worker's OWN location: the app is served from /farmingtools-spares-site/, not the domain root,
// so hard-coded '/index.html' never matched and the precached shell was never read — offline was
// a white screen even though install() had cached every file correctly.
const SHELL_PATHS = new Set(
  ['./', './index.html', './manifest.json', './vendor/supabase.js', './supabase/config.js']
    .map((p) => new URL(p, self.location).pathname)
);

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== IMG_CACHE).map((k) => caches.delete(k))))
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
// ---- Background Sync: when the phone regains connectivity, wake any open app window to
// flush its IndexedDB order outbox. The auth session lives in the page, so the SW delegates
// the actual send to a client rather than replicating Supabase auth here. ----
self.addEventListener('sync', (e) => {
  if (e.tag !== 'flush-orders') return;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((cls) => { cls.forEach((c) => c.postMessage({ go: 'flush' })); }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cls) => {
    // one unified app: focus any open app window (and route it to Requests), else open it there
    for (const c of cls) { if (c.url.indexOf('index.html') !== -1 || c.url.endsWith('/')) { c.postMessage({ go: 'requests' }); return c.focus(); } }
    return clients.openWindow('./index.html#requests');
  }));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // never intercept cross-origin (Supabase API, …)

  // catalog images: cache-first, cached on first view — makes browsing instant + offline
  if (url.pathname.indexOf('/pages/') !== -1) {
    e.respondWith(
      caches.open(IMG_CACHE).then((c) => c.match(e.request).then((hit) =>
        hit || fetch(e.request).then((res) => { if (res.ok) c.put(e.request, res.clone()); return res; })
                     .catch(() => hit)))
    );
    return;
  }

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
