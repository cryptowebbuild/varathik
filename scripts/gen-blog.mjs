// ভাড়াঠিক? — SEO ব্লগ জেনারেটর।
// বিল্ডের শেষে চালু হয়: dist/blog/-এ স্ট্যাটিক HTML গাইড পেজ, ব্লগ সূচি,
// sitemap.xml আর robots.txt তৈরি করে — যাতে Google সরাসরি কনটেন্ট পড়তে পারে।
// সব ভাড়ার সংখ্যা অ্যাপের একই যাচাইকৃত রেট থেকে হিসাব করা (data/rates.ts-এর নিয়ম)।

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// রুট পেজের ডেটা — dump-data.ts অ্যাপের নিজের হিসাব থেকে বানিয়ে দেয়
const routesPath = new URL("../dist/routes-data.json", import.meta.url);
const ROUTES = existsSync(routesPath) ? JSON.parse(readFileSync(routesPath, "utf8")) : [];

const SITE = "https://cryptowebbuild.github.io/varathik";
const UPDATED = "২০২৬-১১-২৬";

// ---------- ভাড়ার নিয়ম (অ্যাপের সঙ্গে হুবহু এক) ----------
const busFare = (km) => Math.max(10, Math.round(km * 2.7));
const round5 = (n) => Math.round(n / 5) * 5;
const cngFare = (km) => Math.round(km <= 2 ? 40 : 40 + (km - 2) * 12);
const rickshaw = (km) => ({
  low: Math.max(30, round5(20 + km * 26)),
  high: Math.max(40, round5(30 + km * 38)),
});
const STATIONS = [
  ["উত্তরা নর্থ", 0], ["উত্তরা সেন্টার", 1.5], ["উত্তরা দক্ষিণ", 3.0], ["পল্লবী", 5.2],
  ["মিরপুর ১১", 6.3], ["মিরপুর ১০", 7.6], ["কাজীপাড়া", 8.9], ["শেওড়াপাড়া", 10.0],
  ["আগারগাঁও", 11.2], ["বিজয় সরণি", 12.4], ["ফার্মগেট", 13.7], ["কারওয়ান বাজার", 14.9],
  ["শাহবাগ", 16.1], ["ঢাকা বিশ্ববিদ্যালয়", 17.3], ["বাংলাদেশ সচিবালয়", 18.6], ["মতিঝিল", 20.1],
];
const metroFare = (a, b) => {
  const km = Math.abs(STATIONS[a][1] - STATIONS[b][1]);
  return Math.min(100, Math.max(20, Math.round((km * 5) / 10) * 10));
};

// ---------- টেবিল বানানোর হেল্পার ----------
const table = (head, rows) =>
  `<div class="tw"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${
    rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")
  }</tbody></table></div>`;

const busRows = [];
for (let km = 1; km <= 30; km++) busRows.push([`${km} কিমি`, `৳${busFare(km)}`, `৳${round5(busFare(km))}`]);

const metroMatrix = STATIONS.map((s, i) => [
  s[0],
  ...STATIONS.map((_, j) => (i === j ? "—" : `৳${metroFare(i, j)}`)),
]);

const cngRows = [];
for (let km = 1; km <= 20; km++) cngRows.push([`${km} কিমি`, `৳${cngFare(km)}`]);

const rickRows = [];
for (let km = 1; km <= 12; km++) {
  const r = rickshaw(km);
  rickRows.push([`${km} কিমি`, `৳${r.low}–${r.high}`]);
}

// ---------- আর্টিকেলগুলো ----------
const ARTICLES = [
  {
    slug: "dhaka-bus-fare",
    title: "ঢাকায় বাস ভাড়া ২০২৬: BRTA রেটে আপনার রুটের ভাড়া কত হওয়া উচিত?",
    description:
      "ঢাকা সিটি বাসের সরকারি ভাড়া কিমি প্রতি ৳২.৭০, সর্বনিম্ন ৳১০। দূরত্ব অনুযায়ী ভাড়ার পুরো তালিকা, ৳৫ রাউন্ডিংয়ের নিয়ম আর বেশি ভাড়া ঠেকানোর উপায় — ভাড়াঠিক গাইড।",
    cta: { from: "mirpur-10", to: "motijheel", label: "মিরপুর ১০ → মতিঝিলের ভাড়া দেখুন" },
    body: `
<p>ঢাকায় বাসে উঠলেই একটা প্রশ্ন সবার মনে ঘোরে — <strong>ভাড়াটা ঠিক আছে তো?</strong> উত্তরটা লুকিয়ে আছে BRTA (বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ)-এর মহানগর ভাড়া চার্টে। এই গাইডে নিয়মটা সহজ করে দেওয়া হলো, সঙ্গে দূরত্ব অনুযায়ী ভাড়ার পুরো তালিকা।</p>
<h2>সরকারি নিয়মটা কী?</h2>
<ul>
<li>ঢাকা মহানগরে সিটি বাসের ভাড়া <strong>কিলোমিটার প্রতি ৳২.৭০</strong></li>
<li>যত কম দূরত্বই হোক, <strong>সর্বনিম্ন ভাড়া ৳১০</strong></li>
<li>মিনিবাসের ক্ষেত্রে কিমি প্রতি ৳২.৬০, সর্বনিম্ন ৳৮</li>
<li>এই রেট কার্যকর হয়েছে <strong>২২ সেপ্টেম্বর ২০২৬</strong> থেকে (সূত্র: BRTA মহানগর ভাড়া চার্ট)</li>
</ul>
<h2>দূরত্ব অনুযায়ী ভাড়ার তালিকা</h2>
<p>নিচের তালিকা BRTA রেটে হিসাব করা। তৃতীয় কলামে দেওয়া হলো বাস্তবে যা হয় — বাসে ভাড়া সাধারণত <strong>৳৫-এর রাউন্ডে</strong> নেওয়া হয়, অর্থাৎ হিসাব ৳৩৩ হলে হাতে নেওয়া হয় ৳৩৫। এই রাউন্ডিং পর্যন্ত স্বাভাবিক ধরে নেওয়া যায়; এর বেশি চাইলেই সেটা বেশি নেওয়া।</p>
${table(["দূরত্ব", "BRTA রেটে ভাড়া", "সাধারণত নেওয়া হয় (৳৫ রাউন্ড)"], busRows)}
<h2>বেশি ভাড়া ঠেকাবেন কীভাবে?</h2>
<ul>
<li>ওঠার <strong>আগেই</strong> নিজের রুটের সঠিক ভাড়া জেনে নিন — ভাড়াঠিক অ্যাপে যেকোনো দুই এলাকার ভাড়া এক ট্যাপে পাবেন।</li>
<li>তর্কের বদলে <strong>ভাড়া কার্ড</strong> দেখান — অ্যাপ থেকে তৈরি কার্ডে রুট, সরকারি ভাড়া আর সূত্র লেখা থাকে; কন্ডাক্টরের সঙ্গে কথা বলা সহজ হয়।</li>
<li>মনে রাখুন: ভাড়া নির্ধারণ হয় <strong>দূরত্বে</strong>, জ্যামে আটকে থাকা সময়ে নয়। জ্যামের কারণে বাসের ভাড়া বাড়ার কোনো নিয়ম নেই।</li>
</ul>`,
    faq: [
      ["ঢাকায় বাসের সর্বনিম্ন ভাড়া কত?", "সিটি বাসে সর্বনিম্ন ভাড়া ৳১০ (মিনিবাসে ৳৮) — দূরত্ব যত কমই হোক। এরপর ভাড়া বাড়ে কিমি প্রতি ৳২.৭০ হারে।"],
      ["বাসে ৳৫ রাউন্ডিং কি বৈধ?", "সরকারি হিসাব যাই হোক, বাস্তবে প্রায় সব বাসেই ভাড়া ৳৫-এর রাউন্ডে নেওয়া হয় (যেমন ৳৩৩-এর বদলে ৳৩৫)। এই পর্যন্ত স্বাভাবিক; এর বেশি চাওয়া হলে সেটা অতিরিক্ত।"],
      ["জ্যামে বেশি সময় লাগলে কি ভাড়া বেশি দিতে হয়?", "না। বাসের ভাড়া শুধু দূরত্বের ওপর নির্ভর করে। সময় বা জ্যামের জন্য বাস ভাড়া বাড়ার কোনো সরকারি নিয়ম নেই।"],
    ],
  },
  {
    slug: "metro-rail-fare-chart",
    title: "মেট্রোরেল ভাড়ার চার্ট ২০২৬: সব স্টেশনের ভাড়া, কার্ড ছাড় ও সময়সূচি",
    description:
      "ঢাকা মেট্রোরেল MRT-6-এর পূর্ণ ভাড়া চার্ট — ১৬টি স্টেশনের যেকোনো দুটির মধ্যে ভাড়া, MRT/Rapid Pass-এ ১০% ছাড়, প্রথম ও শেষ ট্রেনের সময়সূচি।",
    cta: { from: "mirpur-10", to: "motijheel", label: "মিরপুর ১০ → মতিঝিল মেট্রো ভাড়া দেখুন" },
    body: `
<p>মেট্রোরেলের ভাড়া হিসাব হয় সহজ নিয়মে: <strong>কিলোমিটার প্রতি ৳৫</strong>, সর্বনিম্ন ৳২০, সর্বোচ্চ ৳১০০ (উত্তরা নর্থ থেকে মতিঝিল পুরো পথ)। নিচে ১৬টি স্টেশনের পূর্ণ ভাড়া চার্ট দেওয়া হলো — সারি থেকে ওঠার স্টেশন, কলাম থেকে নামার স্টেশন মিলিয়ে দেখুন।</p>
<h2>পূর্ণ ভাড়া চার্ট (টোকেন/একক যাত্রার ভাড়া)</h2>
${table(["থেকে \\ পর্যন্ত", ...STATIONS.map((s) => s[0])], metroMatrix)}
<h2>কার্ডে ১০% ছাড়</h2>
<p><strong>MRT Pass বা Rapid Pass</strong> ব্যবহার করলে প্রতিটি ভাড়ায় <strong>১০% ছাড়</strong> পাবেন — যেমন মতিঝিলের পূর্ণ রুট ৳১০০-এর বদলে ৳৯০। প্রতিদিন যাতায়াত করলে মাসে সাশ্রয় হাজার টাকার ওপরে যেতে পারে। ভাড়াঠিক অ্যাপে কার্ড-ছাড়ের টগল অন করলেই ছাড়সহ ভাড়া ও মাসিক সাশ্রয় দেখতে পাবেন।</p>
<h2>সময়সূচি</h2>
<ul>
<li><strong>প্রথম ট্রেন:</strong> উত্তরা নর্থ সকাল ৬:৩০ · মতিঝিল সকাল ৭:১৫</li>
<li><strong>শেষ ট্রেন:</strong> উত্তরা নর্থ রাত ৯:৫০ · মতিঝিল রাত ১০:৩০</li>
<li><strong>শুক্রবার:</strong> বিকেল ৩:০০ / ৩:২০ থেকে চলাচল শুরু</li>
<li><strong>ট্রেনের ব্যবধান:</strong> পিক আওয়ারে ৫–৮ মিনিট, অফ-পিকে ৮–১২ মিনিট পরপর</li>
</ul>
<p class="note">সূত্র: DMTCL প্রকাশিত ভাড়া চার্ট ও সময়সূচি (সময়সূচি পরিবর্তন হতে পারে)।</p>`,
    faq: [
      ["মেট্রোরেলের সর্বনিম্ন ও সর্বোচ্চ ভাড়া কত?", "সর্বনিম্ন ৳২০, সর্বোচ্চ ৳১০০ — উত্তরা নর্থ থেকে মতিঝিল পুরো ২০.১ কিমি পথের ভাড়া ৳১০০।"],
      ["MRT Pass বা Rapid Pass-এ কত ছাড়?", "সব ভাড়ায় ১০% ছাড়। যেমন ৳১০০-এর যাত্রা কার্ডে ৳৯০, ৳৬০-এর যাত্রা ৳৫৪।"],
      ["শুক্রবার মেট্রো কখন চলে?", "শুক্রবার চলাচল শুরু হয় বিকেলে — উত্তরা নর্থ থেকে প্রথম ট্রেন ৩:০০, মতিঝিল থেকে ৩:২০। সকালের দিকে ট্রেন চলে না।"],
      ["মিরপুর ১০ থেকে মতিঝিল মেট্রো ভাড়া কত?", "৳৬০ (কার্ডে ৳৫৪)। দূরত্ব ১২.৫ কিমি, সময় লাগে প্রায় ২৯ মিনিট।"],
    ],
  },
  {
    slug: "cng-meter-fare",
    title: "CNG অটোরিকশার মিটার ভাড়া: নিয়ম, হিসাব ও বেশি চাইলে করণীয়",
    description:
      "সরকারি মিটার রেট: প্রথম ২ কিমি ৳৪০, এরপর কিমি প্রতি ৳১২, অপেক্ষা মিনিটে ৳২। দূরত্ব অনুযায়ী ভাড়ার তালিকা আর মিটারে যেতে বাধ্য করার উপায়।",
    cta: { from: "dhanmondi", to: "motijheel", label: "ধানমন্ডি → মতিঝিল CNG ভাড়া দেখুন" },
    body: `
<p>CNG অটোরিকশা নিয়ে সবচেয়ে বড় ঝামেলা — <strong>মিটারে যেতে না চাওয়া</strong>। অথচ আইন পরিষ্কার: ঢাকায় CNG চালক <strong>মিটারে যেতে আইনত বাধ্য</strong>। মিটার রেটটা জানা থাকলে দরদামে ঠকতে হয় না।</p>
<h2>সরকারি মিটার রেট</h2>
<ul>
<li><strong>প্রথম ২ কিলোমিটার: ৳৪০</strong></li>
<li>এরপর <strong>প্রতি কিলোমিটার ৳১২</strong></li>
<li>জ্যামে/সিগন্যালে অপেক্ষা: <strong>প্রতি মিনিট ৳২</strong> (মিটারেই যোগ হয়)</li>
<li>কার্যকর: ১ নভেম্বর ২০১৫ থেকে (সূত্র: BRTA — সড়ক পরিবহন আইন ২০১৮ অনুযায়ী সরকার নির্ধারিত রেট)</li>
</ul>
<h2>দূরত্ব অনুযায়ী ভাড়া (অপেক্ষা ছাড়া)</h2>
${table(["দূরত্ব", "মিটার ভাড়া"], cngRows)}
<h2>বেশি চাইলে কী করবেন?</h2>
<ul>
<li>ওঠার আগে বলুন: <strong>"মিটারে যাব।"</strong> — এটা আপনার আইনি অধিকার।</li>
<li>আগে থেকেই নিজের রুটের মিটার ভাড়া জেনে রাখুন — ভাড়াঠিকের "বেশি নিয়েছে?" ট্যাবে কত নিয়েছে লিখলেই জ্যামের অপেক্ষা-সময়সহ ন্যায্য ভাড়া মিলিয়ে দেখতে পারবেন।</li>
<li>জ্যামে দাঁড়িয়ে থাকলে মিটারে অপেক্ষা-চার্জ (৳২/মিনিট) যোগ হওয়া <strong>বৈধ</strong> — সেটা বেশি নেওয়া নয়।</li>
</ul>`,
    faq: [
      ["CNG-র প্রথম ২ কিমি ভাড়া কত?", "৳৪০। এরপর প্রতি কিলোমিটারে ৳১২ করে যোগ হয়।"],
      ["জ্যামে আটকে থাকলে মিটার বেশি ওঠে কেন?", "মিটারে অপেক্ষা-চার্জ আছে — প্রতি মিনিট ৳২। যানজটে দাঁড়িয়ে থাকলে এই হারে ভাড়া বাড়ে, এটা সরকারি নিয়মেই আছে।"],
      ["চালক মিটারে যেতে না চাইলে কী করা যায়?", "মিটারে যাওয়া চালকের আইনি বাধ্যবাধকতা। অন্য CNG নিন, অথবা আগে থেকে মিটার-হিসাবের ভাড়া জেনে সেই অনুযায়ী কথা বলুন।"],
    ],
  },
  {
    slug: "rickshaw-fare-dhaka",
    title: "ঢাকায় রিকশা ভাড়া: সরকারি রেট নেই — তবু ঠকবেন না",
    description:
      "রিকশার কোনো সরকারি ভাড়া নেই, তাই দরদামই নিয়ম। দূরত্ব অনুযায়ী চলতি বাজার রেঞ্জের তালিকা, যাতে ওঠার আগেই আন্দাজ থাকে কত হওয়া উচিত।",
    cta: { from: "dhanmondi", to: "new-market", label: "ধানমন্ডি → নিউমার্কেট রিকশা ভাড়া দেখুন" },
    body: `
<p>সোজা সত্যি: <strong>রিকশার কোনো সরকারি ভাড়া নেই।</strong> কোনো গেজেট, কোনো চার্ট — কিছুই নেই। তাই রিকশায় ভাড়া ঠিক হয় দরদামে, আর সেখানেই ঠকার সুযোগ সবচেয়ে বেশি। তবে দূরত্ব অনুযায়ী বাজারে একটা চলতি রেঞ্জ আছে — সেটা জানা থাকলে দরদামে আপনি শক্ত অবস্থানে থাকবেন।</p>
<h2>দূরত্ব অনুযায়ী চলতি বাজার রেঞ্জ (আনুমানিক)</h2>
${table(["দূরত্ব", "সাধারণ রেঞ্জ"], rickRows)}
<p class="note">এই রেঞ্জ ভাড়াঠিকের ফিল্ড সার্ভে ও ব্যবহারকারীদের রিপোর্ট থেকে তৈরি — সরকারি রেট নয়। বৃষ্টি, জ্যাম বা রাতের বেলায় রেঞ্জের ওপরের দিকে যাওয়া স্বাভাবিক।</p>
<h2>ঠকা এড়ানোর ৩ নিয়ম</h2>
<ul>
<li><strong>ওঠার আগেই</strong> ভাড়া ঠিক করে নিন — চলতে শুরু করার পর দরদাম চলে না।</li>
<li>অচেনা রুটে আগে অ্যাপে দূরত্ব ও রেঞ্জ দেখে নিন — "ভাই, এত কিমি পথ, রেঞ্জ তো এত" বললেই আলোচনা সহজ হয়।</li>
<li>লম্বা দূরত্বে (৭+ কিমি) রিকশা ধীর ও ব্যয়বহুল — বাস বা মেট্রো থাকলে সেটাই সাশ্রয়ী।</li>
</ul>`,
    faq: [
      ["রিকশার সরকারি ভাড়া কত?", "রিকশার কোনো সরকারি ভাড়া নেই। ভাড়া পুরোপুরি দরদামের ওপর নির্ভর করে — তাই ওঠার আগে ঠিক করে নেওয়াই একমাত্র সুরক্ষা।"],
      ["১ কিমি রিকশা ভাড়া সাধারণত কত?", "চলতি বাজার রেঞ্জে প্রায় ৳৩০–৪০। এলাকা, সময় ও জ্যাম অনুযায়ী কমবেশি হতে পারে।"],
    ],
  },
];

// ---------- পেজের ছাঁচ (টেমপ্লেট) ----------
const CSS = `
:root { --g950:#052e1b; --gold:#f2b33d; --g600:#16a34a; --g100:#dcfce7; --ink:#14231a; --muted:#5b6b60; --border:#dce8de; }
* { box-sizing: border-box; }
body { margin:0; font-family:"Hind Siliguri","Noto Sans Bengali",system-ui,sans-serif; -webkit-font-smoothing:antialiased; color:var(--ink); background:#f2f7f3; line-height:1.75; }
header { position:sticky; top:0; z-index:40; background:rgba(6,43,24,.94); backdrop-filter:blur(10px); color:#fff; padding:14px 16px; box-shadow:0 1px 0 rgba(255,255,255,.06), 0 10px 30px rgba(5,46,27,.18); }
header .in { max-width:820px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; gap:12px; }
.logo { font-family:"Baloo Da 2","Hind Siliguri",sans-serif; font-size:27px; font-weight:800; color:#fff; text-decoration:none; display:flex; align-items:center; gap:10px; }
.logo img { width:36px; height:36px; border-radius:10px; background:#0a4d2a; box-shadow:0 6px 14px rgba(0,0,0,.35); }
.logo .q { color:var(--gold); }
h1 { font-family:"Baloo Da 2","Hind Siliguri",sans-serif; }
.cta { background:var(--g600); color:#fff; text-decoration:none; font-weight:700; padding:9px 16px; border-radius:999px; font-size:15px; white-space:nowrap; }
main { max-width:820px; margin:0 auto; padding:22px 16px 40px; }
h1 { font-size:30px; line-height:1.4; margin:6px 0 4px; }
h2 { font-size:22px; margin:34px 0 8px; color:var(--g950); }
h2::before { content:''; display:block; width:34px; height:3px; border-radius:2px; background:var(--gold); margin-bottom:10px; }
.meta { color:var(--muted); font-size:14px; margin-bottom:14px; }
p, li { font-size:17px; }
ul { padding-left:22px; }
.tw { overflow-x:auto; background:#fff; border:1.5px solid var(--border); border-radius:12px; margin:12px 0; }
table { border-collapse:collapse; width:100%; font-size:14.5px; font-variant-numeric:tabular-nums; }
td:first-child { font-weight:600; }
th, td { border-bottom:1px solid var(--border); padding:7px 10px; text-align:left; white-space:nowrap; }
th { background:var(--g100); }
.note { color:var(--muted); font-size:14.5px; }
.appcta { display:block; text-align:center; background:linear-gradient(120deg,var(--g600),#22c55e); color:#fff; text-decoration:none; font-weight:800; font-size:18px; padding:15px; border-radius:14px; margin:26px 0; box-shadow:0 8px 20px rgba(22,163,74,.35); }
.sticky-cta { display:none; }
.bar { height:6px; border-radius:3px; background:linear-gradient(90deg,var(--g600),#4ade80); margin-top:5px; min-width:12px; }
@media (max-width: 640px) {
  body { padding-bottom:78px; }
  .sticky-cta { display:block; position:fixed; left:12px; right:12px; bottom:12px; z-index:50; text-align:center; background:linear-gradient(120deg,var(--g600),#22c55e); color:#fff; text-decoration:none; font-weight:800; font-size:16.5px; padding:14px; border-radius:999px; box-shadow:0 10px 24px rgba(5,46,22,.4); }
}
.faq { background:#fff; border:1.5px solid var(--border); border-radius:12px; padding:6px 18px; margin:12px 0; }
.faq h3 { margin:14px 0 2px; font-size:17px; }
.faq p { margin:0 0 14px; color:#33473a; }
.card { display:block; background:#fff; border:1.5px solid var(--border); border-radius:14px; padding:16px 18px; margin:12px 0; text-decoration:none; color:var(--ink); transition:all .18s ease; }
.card:hover { transform:translateY(-2px); box-shadow:0 12px 26px rgba(5,46,27,.10); border-color:#bcd8c2; }
.card strong { font-size:19px; display:block; margin-bottom:4px; }
.card span { color:var(--muted); font-size:15px; }
footer { max-width:820px; margin:0 auto; padding:0 16px 34px; color:var(--muted); font-size:14px; }
footer a { color:var(--g600); }
`;

const page = (a) => {
  const url = `${SITE}/blog/${a.slug}/`;
  const faqLd = {
    "@type": "FAQPage",
    mainEntity: a.faq.map(([q, ans]) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: ans },
    })),
  };
  const articleLd = {
    "@type": "Article", headline: a.title, description: a.description,
    mainEntityOfPage: url, author: { "@type": "Organization", name: "ভাড়াঠিক? (CryptoWebBuild)" },
  };
  return `<!doctype html>
<html lang="bn">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${a.title} — ভাড়াঠিক?</title>
<meta name="description" content="${a.description}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${a.title}" />
<meta property="og:description" content="${a.description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/og.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@700;800&family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet" />
<link rel="icon" type="image/svg+xml" href="${SITE}/icon.svg" />
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [articleLd, faqLd] })}</script>
</head>
<body>
<header><div class="in">
<a class="logo" href="${SITE}/"><img src="${SITE}/icon.svg" alt="" /><span>ভাড়াঠিক<span class="q">?</span></span></a>
<a class="cta" href="${SITE}/">অ্যাপে ভাড়া দেখুন</a>
</div></header>
<main>
<p class="meta"><a href="${SITE}/blog/">← সব গাইড</a> · আপডেট: ${UPDATED}</p>
<h1>${a.title}</h1>
${a.body}
<a class="appcta" href="${SITE}/?from=${a.cta.from}&amp;to=${a.cta.to}">${a.cta.label} →</a>
<h2>সাধারণ প্রশ্ন</h2>
<div class="faq">
${a.faq.map(([q, ans]) => `<h3>${q}</h3><p>${ans}</p>`).join("\n")}
</div>
<h2>আরও গাইড</h2>
${ARTICLES.filter((x) => x.slug !== a.slug).map((x) => `<a class="card" href="${SITE}/blog/${x.slug}/"><strong>${x.title}</strong><span>${x.description}</span></a>`).join("\n")}
</main>
<footer>ভাড়াঠিক? — BRTA ও DMTCL-এর প্রকাশিত সরকারি রেট থেকে হিসাব করা ভাড়া। <a href="${SITE}/">অ্যাপে ফিরে যান</a> · তৈরি: <a href="https://cryptowebbuild.com/">CryptoWebBuild</a></footer>
<a class="sticky-cta" href="${SITE}/?from=${a.cta.from}&amp;to=${a.cta.to}">অ্যাপে ভাড়া দেখুন</a>
</body>
</html>`;
};

// ---------- রুট পেজের ছাঁচ ----------
const routePage = (r) => {
  const url = `${SITE}/route/${r.slug}/`;
  const title = `${r.fromBn} থেকে ${r.toBn} ভাড়া: বাস, মেট্রো, CNG ও রিকশায় কত লাগবে?`;
  const description = `${r.fromBn} থেকে ${r.toBn} যাওয়ার সব যানের ভাড়া একসঙ্গে — সবচেয়ে সস্তা ${r.cheapest.titleBn} ৳${r.cheapest.fare}। সরাসরি বাসের তালিকা, স্টপ ও বদলি রুটসহ।`;
  const busMode = r.modes.find((m) => m.mode === "bus");
  const metroMode = r.modes.find((m) => m.mode === "metro");
  const faq = [
    [`${r.fromBn} থেকে ${r.toBn} সবচেয়ে সস্তা যান কোনটি?`, `সবচেয়ে সস্তা ${r.cheapest.titleBn} — ভাড়া ৳${r.cheapest.fare}। প্রতিদিন যাতায়াত করলে এই যানে মাসিক খরচ প্রায় ৳${r.monthlyCheapest} (দিনে ২ ট্রিপ × ২৬ দিন)।`],
    ...(busMode ? [[`${r.fromBn} থেকে ${r.toBn} বাস ভাড়া কত?`, `বাস ভাড়া ৳${busMode.fare} (দূরত্ব ${busMode.km} কিমি, BRTA রেট কিমি প্রতি ৳২.৭০)। ${r.buses.length ? `সরাসরি বাস আছে ${r.buses.length}টি রুটে।` : ""}`]] : []),
    ...(metroMode ? [[`${r.fromBn} থেকে ${r.toBn} মেট্রো ভাড়া কত?`, `মেট্রো ভাড়া ৳${metroMode.fare} (কার্ডে ১০% ছাড়ে ৳${Math.round(metroMode.fare * 0.9)})। সময় লাগে প্রায় ${metroMode.minutes} মিনিট।`]] : []),
    [`${r.fromBn} থেকে ${r.toBn} CNG ভাড়া কত?`, (() => { const c = r.modes.find((m) => m.mode === "cng"); return c ? `মিটার ভাড়া প্রায় ৳${c.fare} (দূরত্ব ${c.km} কিমি; প্রথম ২ কিমি ৳৪০, এরপর কিমি প্রতি ৳১২, জ্যামে অপেক্ষা ৳২/মিনিট অতিরিক্ত)।` : "এই রুটে CNG ভাড়া অ্যাপে দেখুন।"; })()],
  ];
  const faqLd = {
    "@type": "FAQPage",
    mainEntity: faq.map(([q, ans]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: ans } })),
  };
  const articleLd = { "@type": "Article", headline: title, description, mainEntityOfPage: url, author: { "@type": "Organization", name: "ভাড়াঠিক? (CryptoWebBuild)" } };
  return `<!doctype html>
<html lang="bn">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} — ভাড়াঠিক?</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${SITE}/og.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@700;800&family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet" />
<link rel="icon" type="image/svg+xml" href="${SITE}/icon.svg" />
<style>${CSS}</style>
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [articleLd, faqLd] })}</script>
</head>
<body>
<header><div class="in">
<a class="logo" href="${SITE}/"><img src="${SITE}/icon.svg" alt="" />ভাড়াঠিক<span class="q">?</span></a>
<a class="cta" href="${SITE}/?from=${r.fromId}&amp;to=${r.toId}">অ্যাপে এই রুট খুলুন</a>
</div></header>
<main>
<p class="meta"><a href="${SITE}/blog/">← সব গাইড ও রুট</a> · আপডেট: ${UPDATED}</p>
<h1>${title}</h1>
<p><strong>${r.fromBn} → ${r.toBn}</strong> — সবচেয়ে সস্তা অপশন <strong>${r.cheapest.titleBn} ৳${r.cheapest.fare}</strong>। নিচে প্রতিটা যানের ভাড়া, দূরত্ব ও আনুমানিক সময় সরকারি রেটে হিসাব করে দেওয়া হলো।</p>
<h2>যান অনুযায়ী ভাড়া</h2>
${table(["যানবাহন", "ভাড়া", "দূরত্ব", "আনুমানিক সময়"], r.modes.map((m) => [m.titleBn, `৳${m.fare}${m.fareNote ? `<br/><span class="note">${m.fareNote}</span>` : ""}<div class="bar" style="width:${Math.max(6, Math.round((m.fare / Math.max(...r.modes.map((x) => x.fare))) * 100))}%"></div>`, `${m.km} কিমি`, `~${m.minutes} মিনিট`]))}
${r.buses.length ? `<h2>সরাসরি বাস</h2>${r.buses.map((b) => `<p><strong>${b.nameBn}</strong>${b.examples.length ? ` (যেমন: ${b.examples.join(", ")})` : ""} — ভাড়া ৳${b.fare}, দূরত্ব ${b.km} কিমি<br/><span class="note">স্টপ: ${b.stopsBn.join(" → ")}</span></p>`).join("\n")}` : ""}
${r.transfer && !r.buses.length ? `<h2>বদলি করে বাসে</h2><p>সরাসরি বাস নেই। <strong>${r.transfer.firstRouteBn}</strong>-এ ${r.transfer.transferBn} পর্যন্ত (৳${r.transfer.fareFirst}), তারপর <strong>${r.transfer.secondRouteBn}</strong>-এ ${r.toBn} (৳${r.transfer.fareSecond}) — মোট <strong>৳${r.transfer.totalFare}</strong> (দুটি আলাদা টিকিট)।</p>` : ""}
<a class="appcta" href="${SITE}/?from=${r.fromId}&amp;to=${r.toId}">অ্যাপে ${r.fromBn} → ${r.toBn} ভাড়া কার্ডসহ দেখুন →</a>
<h2>সাধারণ প্রশ্ন</h2>
<div class="faq">
${faq.map(([q, ans]) => `<h3>${q}</h3><p>${ans}</p>`).join("\n")}
</div>
<h2>আরও জনপ্রিয় রুট</h2>
${ROUTES.filter((x) => x.slug !== r.slug).slice(0, 6).map((x) => `<a class="card" href="${SITE}/route/${x.slug}/"><strong>${x.fromBn} → ${x.toBn} ভাড়া</strong><span>সবচেয়ে সস্তা: ${x.cheapest.titleBn} ৳${x.cheapest.fare}</span></a>`).join("\n")}
</main>
<footer>ভাড়াঠিক? — BRTA ও DMTCL-এর প্রকাশিত সরকারি রেট থেকে হিসাব করা ভাড়া। <a href="${SITE}/">অ্যাপে ফিরে যান</a> · তৈরি: <a href="https://cryptowebbuild.com/">CryptoWebBuild</a></footer>
<a class="sticky-cta" href="${SITE}/?from=${r.fromId}&amp;to=${r.toId}">অ্যাপে ${r.fromBn} → ${r.toBn} ভাড়া দেখুন</a>
</body>
</html>`;
};

const indexPage = `<!doctype html>
<html lang="bn">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ভাড়া গাইড ও ব্লগ — ভাড়াঠিক?</title>
<meta name="description" content="ঢাকার বাস, মেট্রোরেল, CNG ও রিকশা ভাড়ার পূর্ণাঙ্গ গাইড — BRTA ও DMTCL-এর সরকারি রেট, ভাড়া চার্ট, সময়সূচি আর বেশি ভাড়া ঠেকানোর উপায়।" />
<link rel="canonical" href="${SITE}/blog/" />
<meta property="og:title" content="ভাড়া গাইড ও ব্লগ — ভাড়াঠিক?" />
<meta property="og:description" content="ঢাকার সব যানবাহনের সরকারি ভাড়ার গাইড ও চার্ট।" />
<meta property="og:image" content="${SITE}/og.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@700;800&family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet" />
<link rel="icon" type="image/svg+xml" href="${SITE}/icon.svg" />
<style>${CSS}</style>
</head>
<body>
<header><div class="in">
<a class="logo" href="${SITE}/"><img src="${SITE}/icon.svg" alt="" />ভাড়াঠিক<span class="q">?</span></a>
<a class="cta" href="${SITE}/">অ্যাপে ভাড়া দেখুন</a>
</div></header>
<main>
<h1>ভাড়া গাইড ও ব্লগ</h1>
<p>ঢাকায় চলাচলের প্রতিটা যানের সরকারি ভাড়ার নিয়ম, চার্ট আর বাস্তব টিপস — সব সূত্রসহ যাচাই করা।</p>
${ARTICLES.map((x) => `<a class="card" href="${SITE}/blog/${x.slug}/"><strong>${x.title}</strong><span>${x.description}</span></a>`).join("\n")}
<h2>জনপ্রিয় রুটের ভাড়া</h2>
${ROUTES.map((x) => `<a class="card" href="${SITE}/route/${x.slug}/"><strong>${x.fromBn} → ${x.toBn} ভাড়া</strong><span>সবচেয়ে সস্তা: ${x.cheapest.titleBn} ৳${x.cheapest.fare} · বাস, মেট্রো, CNG, রিকশা তুলনা</span></a>`).join("\n")}
<a class="appcta" href="${SITE}/">অ্যাপে যেকোনো রুটের ভাড়া দেখুন →</a>
</main>
<footer>ভাড়াঠিক? — ঠকবেন না, জেনে উঠুন। তৈরি: <a href="https://cryptowebbuild.com/">CryptoWebBuild</a></footer>
<a class="sticky-cta" href="${SITE}/">অ্যাপে যেকোনো রুটের ভাড়া দেখুন</a>
</body>
</html>`;

// ---------- ফাইলগুলো লেখা ----------
const out = (rel, content) => {
  const p = new URL(`../dist/${rel}`, import.meta.url).pathname;
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};

for (const a of ARTICLES) out(`blog/${a.slug}/index.html`, page(a));
for (const r of ROUTES) out(`route/${r.slug}/index.html`, routePage(r));
out("blog/index.html", indexPage);

const urls = [`${SITE}/`, `${SITE}/blog/`, ...ARTICLES.map((a) => `${SITE}/blog/${a.slug}/`), ...ROUTES.map((r) => `${SITE}/route/${r.slug}/`)];
out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
  urls.map((u) => `  <url><loc>${u}</loc><changefreq>weekly</changefreq></url>`).join("\n")
}\n</urlset>\n`);
out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`blog generated: ${ARTICLES.length} articles + ${ROUTES.length} route pages + index + sitemap + robots`);
