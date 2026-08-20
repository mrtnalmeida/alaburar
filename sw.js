/* Estrategia:
   - index.html y navegación: red primero, cache como respaldo. Así los cambios llegan siempre.
   - Resto de archivos propios: cache primero, y se refresca en segundo plano.
   - El CSV del Sheet nunca pasa por acá.
*/
const CACHE = "cuota-v2";
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
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.hostname.includes("docs.google.com")) return;   // el Sheet siempre va a la red
  if (url.origin !== location.origin) return;             // fuentes y demás, al navegador

  const esPagina = req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");

  if (esPagina) {
    // Red primero: si hay señal, siempre ves la última versión.
    e.respondWith(
      fetch(req).then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copia));
        return r;
      }).catch(() => caches.match("./index.html").then(hit => hit || caches.match("./")))
    );
    return;
  }

  // Estáticos: responde del cache y actualiza atrás.
  e.respondWith(
    caches.match(req).then(hit => {
      const red = fetch(req).then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(req, copia));
        return r;
      }).catch(() => hit);
      return hit || red;
    })
  );
});
