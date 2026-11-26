// ভাড়াঠিক? — রুট পেজের ডেটা ডাম্প।
// অ্যাপের নিজের হিসাব (computeResults ইত্যাদি) চালিয়ে জনপ্রিয় রুটগুলোর
// ভাড়া JSON আকারে dist/routes-data.json-এ লেখে — যাতে SEO রুট পেজের সংখ্যা
// অ্যাপের সংখ্যার সঙ্গে হুবহু মেলে, আলাদা করে হিসাব করতে না হয়।
// চালানো হয় esbuild দিয়ে বান্ডল করে (package.json-এর build চেইনে আছে)।

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { PLACES, findPlace } from "../src/data/places";
import { computeResults, transferFareFor } from "../src/lib/fare";

// যেসব রুটের আলাদা পেজ হবে (মানুষ সার্চে এভাবেই খোঁজে)
const PAIRS: Array<[string, string]> = [
  ["mirpur-10", "motijheel"],
  ["uttara", "motijheel"],
  ["dhanmondi", "motijheel"],
  ["mirpur-10", "gulistan"],
  ["gabtoli", "motijheel"],
  ["mohammadpur", "motijheel"],
  ["uttara", "farmgate"],
  ["mirpur-10", "farmgate"],
  ["badda", "motijheel"],
  ["jatrabari", "motijheel"],
  ["savar", "motijheel"],
  ["tongi", "motijheel"],
  ["airport", "motijheel"],
  ["dhanmondi", "new-market"],
  ["demra", "motijheel"],
  ["kuril", "motijheel"],
];

const valid = new Set(PLACES.map((p) => p.id));
const routes = [];

for (const [fromId, toId] of PAIRS) {
  if (!valid.has(fromId) || !valid.has(toId)) {
    console.warn("skip (unknown place):", fromId, toId);
    continue;
  }
  const from = findPlace(fromId);
  const to = findPlace(toId);
  const results = computeResults(fromId, toId);
  const bus = results.find((r) => r.mode === "bus");
  const transfer = transferFareFor(fromId, toId);

  routes.push({
    slug: `${fromId}-to-${toId}`,
    fromId,
    toId,
    fromBn: from.bn,
    toBn: to.bn,
    fromEn: from.en,
    toEn: to.en,
    modes: results.map((r) => ({
      mode: r.mode,
      titleBn: r.titleBn,
      fare: r.fare,
      fareNote: r.fareNote ?? null,
      km: Math.round(r.km * 10) / 10,
      minutes: r.minutes,
      official: r.official,
      detailBn: r.detailBn,
    })),
    buses: (bus?.buses ?? []).map((b) => ({
      nameBn: b.route.nameBn,
      examples: b.route.examples,
      km: Math.round(b.km * 10) / 10,
      fare: Math.max(10, Math.round(b.km * 2.7)),
      stopsBn: b.directionStops.map((id) => findPlace(id).bn),
    })),
    transfer: transfer
      ? {
          firstRouteBn: transfer.firstRouteBn,
          secondRouteBn: transfer.secondRouteBn,
          transferBn: transfer.transferBn,
          fareFirst: transfer.fareFirst,
          fareSecond: transfer.fareSecond,
          totalFare: transfer.totalFare,
        }
      : null,
    cheapest: results.length
      ? { titleBn: results[0].titleBn, fare: results[0].fare }
      : null,
    monthlyCheapest: results.length ? results[0].fare * 2 * 26 : null,
  });
}

// আউটপুট পাথ প্রজেক্ট রুট (cwd) থেকে — বান্ডল যেখানেই থাকুক, ফল dist/-এই যাবে
const distDir = join(process.cwd(), "dist");
mkdirSync(distDir, { recursive: true });
writeFileSync(join(distDir, "routes-data.json"), JSON.stringify(routes, null, 1));
console.log(`routes-data: ${routes.length} routes dumped`);
