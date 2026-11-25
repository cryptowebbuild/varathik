// বিল্ডের পর dist/sw.js তৈরি — hashed অ্যাসেটসহ পুরো অ্যাপ শেল precache,
// ক্যাশ নামে বিল্ড হ্যাশ, শুধু সফল (res.ok) রেসপন্স ক্যাশ হয়।
import { readdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
const assets = readdirSync("dist/assets").filter((f) => /\.(js|css)$/.test(f)).sort();
const precache = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./qr.svg", ...assets.map((a) => "./assets/" + a)];
const hash = createHash("md5").update(precache.join("|")).digest("hex").slice(0, 8);
const sw = `// ভাড়াঠিক? — অফলাইন ক্যাশ (স্বয়ংক্রিয়ভাবে তৈরি, বিল্ড ${hash})
const CACHE = "varathik-${hash}";
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); }
      return res;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
`;
writeFileSync("dist/sw.js", sw);
console.log("sw.js generated:", hash, precache.length, "entries");
