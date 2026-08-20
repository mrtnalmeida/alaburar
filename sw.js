/* Cache del shell para que abra sin conexión. El CSV del Sheet siempre va a la red primero. */
const CACHE = "cuota-v1";
const SHELL = ["./", "./index.html", "./manifest.json", "./icono.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.hostname.includes("docs.google.com")) return;      // el Sheet nunca se cachea acá
  if (url.origin !== location.origin) return;                // fuentes y demás, al navegador
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match("./index.html")))
  );
});
