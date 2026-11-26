// ভাড়াঠিক? — ডিপ অডিট স্ক্রিপ্ট (শুধু যাচাই, কিছু বদলায় না)।
// সব ডেটা ও ভাড়া-লজিকের অসঙ্গতি খুঁজে রিপোর্ট করে।
import { PLACES, findPlace } from "../src/data/places";
import { BUS_ROUTES } from "../src/data/busRoutes";
import { METRO_STATIONS } from "../src/data/metro";
import { computeResults, transferFareFor, busKmFor, cngFareForKm, rickshawRangeForKm } from "../src/lib/fare";

const problems: string[] = [];
const warn: string[] = [];

// ---------- জায়গা (places) ----------
const ids = new Set<string>();
for (const p of PLACES) {
  if (ids.has(p.id)) problems.push(`place id duplicate: ${p.id}`);
  ids.add(p.id);
  if (p.lat < 23.55 || p.lat > 24.1 || p.lng < 90.1 || p.lng > 90.7)
    problems.push(`place coords out of Dhaka range: ${p.id} ${p.lat},${p.lng}`);
  if (p.metro && !METRO_STATIONS.some((s) => s.id === p.metro))
    problems.push(`place ${p.id} references unknown metro station ${p.metro}`);
  if (!p.bn || !p.en) problems.push(`place missing name: ${p.id}`);
}

// ---------- বাস রুট ----------
for (const r of BUS_ROUTES) {
  if (r.segmentKm.length !== r.stops.length - 1)
    problems.push(`route ${r.id}: segmentKm ${r.segmentKm.length} != stops-1 ${r.stops.length - 1}`);
  for (const s of r.stops) if (!ids.has(s)) problems.push(`route ${r.id}: unknown stop ${s}`);
  for (const km of r.segmentKm) if (!(km > 0 && km < 15)) problems.push(`route ${r.id}: bad segment ${km}`);
  const total = r.segmentKm.reduce((a, b) => a + b, 0);
  if (total > 50) warn.push(`route ${r.id}: very long ${total.toFixed(1)} km`);
  const seen = new Set<string>();
  for (const s of r.stops) { if (seen.has(s)) warn.push(`route ${r.id}: stop repeated ${s}`); seen.add(s); }
}

// ---------- মেট্রো ----------
for (let i = 1; i < METRO_STATIONS.length; i++)
  if (!(METRO_STATIONS[i].kmFromStart > METRO_STATIONS[i - 1].kmFromStart))
    problems.push(`metro km not increasing at ${METRO_STATIONS[i].id}`);

// ---------- সব জোড়া রুটে ভাড়া-লজিক ----------
let pairs = 0, withMetro = 0, withTransferOnly = 0;
for (const a of PLACES) for (const b of PLACES) {
  if (a.id === b.id) continue;
  pairs++;
  const res = computeResults(a.id, b.id);
  if (!res.length) { problems.push(`no results ${a.id}->${b.id}`); continue; }
  for (const m of res) {
    if (!Number.isFinite(m.fare) || m.fare <= 0) problems.push(`bad fare ${a.id}->${b.id} ${m.mode} ${m.fare}`);
    if (!Number.isFinite(m.km) || m.km <= 0) problems.push(`bad km ${a.id}->${b.id} ${m.mode} ${m.km}`);
    if (!Number.isFinite(m.minutes) || m.minutes <= 0) problems.push(`bad minutes ${a.id}->${b.id} ${m.mode}`);
    if (m.mode === "rickshaw" && m.km > 12.6) problems.push(`rickshaw too far ${a.id}->${b.id} ${m.km}`);
  }
  const fares = res.map((m) => m.fare);
  if (fares.some((f, i) => i > 0 && f < fares[i - 1])) problems.push(`results not sorted ${a.id}->${b.id}`);
  if (res.some((m) => m.mode === "metro")) withMetro++;
  const bus = res.find((m) => m.mode === "bus");
  if (bus?.buses?.length) {
    const bk = busKmFor(a.id, b.id);
    if (Math.abs(bk - bus.km) > 0.11) problems.push(`bus km mismatch ${a.id}->${b.id}: mode ${bus.km} vs busKmFor ${bk}`);
  }
  const t = transferFareFor(a.id, b.id);
  if (t) {
    if (Math.abs(t.totalFare - (t.fareFirst + t.fareSecond)) > 0) problems.push(`transfer fare sum ${a.id}->${b.id}`);
    if (Math.abs(t.totalKm - (t.kmFirst + t.kmSecond)) > 0.11) problems.push(`transfer km sum ${a.id}->${b.id}`);
    if (!bus?.buses?.length) withTransferOnly++;
  }
}

// ---------- ফাংশন-স্তরের পরীক্ষা ----------
for (let km = 0.5; km < 30; km += 0.5) {
  if (cngFareForKm(km + 0.5, 0) < cngFareForKm(km, 0)) problems.push(`cng fare not monotonic at ${km}`);
  const r = rickshawRangeForKm(km);
  if (r.low > r.high) problems.push(`rickshaw low>high at ${km}`);
}

console.log(`places=${PLACES.length} routes=${BUS_ROUTES.length} pairs=${pairs} metroPairs=${withMetro} transferOnlyPairs=${withTransferOnly}`);
console.log(`PROBLEMS (${problems.length}):`);
for (const p of problems.slice(0, 40)) console.log("  ✗", p);
console.log(`WARNINGS (${warn.length}):`);
for (const w of warn.slice(0, 15)) console.log("  !", w);
