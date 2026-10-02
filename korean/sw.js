// 오프라인 캐시: 앱 파일을 한 번 받아 두고, 이후엔 캐시에서 바로 띄움
// 파일을 바꿀 때마다 VERSION을 올리면 사용자 기기의 캐시가 교체됨
const VERSION = "v2";
const CACHE = "app-" + VERSION;
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./fonts/IBMPlexSansThai-Bold.ttf","./fonts/IBMPlexSansThai-Regular.ttf","./fonts/IBMPlexSansThai-SemiBold.ttf"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match("./index.html"))));
});
