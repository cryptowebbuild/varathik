// ঢাকার প্রধান বাস করিডর — স্টপের ক্রম ও আনুমানিক ধাপ-দূরত্ব (কিমি)।
// ভাড়া BRTA রেটে হিসাব হয় (rates.ts)। রুটগুলো প্রধান সড়ক করিডর অনুযায়ী সাজানো;
// প্রতিটি করিডরে একাধিক কোম্পানির বাস চলে — পরিচিত নাম উদাহরণ হিসেবে দেওয়া।
import { RATES } from "./rates";

export interface BusRoute {
  id: string;
  nameBn: string;
  examples: string[];
  stops: string[]; // places.ts-এর id, ক্রমানুসারে
  segmentKm: number[]; // stops[i] -> stops[i+1] দূরত্ব, দৈর্ঘ্য = stops.length - 1
}

export const BUS_ROUTES: BusRoute[] = [
  {
    id: "gabtoli-motijheel",
    nameBn: "গাবতলী — মতিঝিল করিডর",
    examples: ["বাহন", "মিরপুর মেট্রো", "দিশারী"],
    stops: ["gabtoli", "kalyanpur", "shyamoli", "asad-gate", "farmgate", "karwan", "shahbag", "press-club", "motijheel"],
    segmentKm: [1.6, 1.4, 1.8, 1.9, 1.0, 1.6, 1.5, 1.4],
  },
  {
    id: "mirpur-motijheel",
    nameBn: "মিরপুর — মতিঝিল করিডর",
    examples: ["বিকাশ", "খাজাবাবা", "শিখর"],
    stops: ["mirpur-1", "mirpur-10", "kazipara", "shewrapara", "agargaon", "bijoy-sarani", "farmgate", "karwan", "shahbag", "press-club", "motijheel"],
    segmentKm: [2.2, 1.4, 1.2, 1.3, 1.3, 1.4, 1.0, 1.6, 1.5, 1.4],
  },
  {
    id: "pallabi-azimpur",
    nameBn: "পল্লবী — আজিমপুর করিডর",
    examples: ["মিরপুর লিংক", "বিকাশ"],
    stops: ["pallabi", "mirpur-11", "mirpur-10", "kazipara", "shewrapara", "agargaon", "bijoy-sarani", "farmgate", "science-lab", "new-market", "azimpur"],
    segmentKm: [1.1, 1.4, 1.4, 1.2, 1.3, 1.3, 1.4, 2.2, 1.2, 0.9],
  },
  {
    id: "uttara-jatrabari",
    nameBn: "উত্তরা — যাত্রাবাড়ী করিডর (এয়ারপোর্ট রোড)",
    examples: ["বিকাশ", "আকাশ", "তুরাগ"],
    stops: ["uttara", "airport", "khilkhet", "banani", "mohakhali", "tejgaon", "farmgate", "shahbag", "gulistan", "sayedabad", "jatrabari"],
    segmentKm: [3.4, 2.3, 4.4, 2.2, 1.9, 1.4, 2.4, 2.2, 1.7, 1.6],
  },
  {
    id: "uttara-motijheel-progati",
    nameBn: "উত্তরা — মতিঝিল করিডর (প্রগতি সরণি)",
    examples: ["রাইদা", "অনাবিল", "তুরাগ"],
    stops: ["uttara", "airport", "khilkhet", "kuril", "natun-bazar", "badda", "rampura", "malibagh", "motijheel"],
    segmentKm: [3.4, 2.3, 1.5, 3.0, 1.4, 2.9, 1.6, 3.4],
  },
  {
    id: "mohammadpur-motijheel",
    nameBn: "মোহাম্মদপুর — মতিঝিল করিডর",
    examples: ["মালঞ্চ", "প্রজাপতি"],
    stops: ["mohammadpur", "lalmatia", "dhanmondi", "science-lab", "new-market", "du", "shahbag", "press-club", "motijheel"],
    segmentKm: [1.4, 1.6, 1.3, 1.2, 1.1, 1.0, 1.5, 1.4],
  },
  {
    id: "gabtoli-gulistan-satmasjid",
    nameBn: "গাবতলী — গুলিস্তান করিডর (সাতমসজিদ রোড)",
    examples: ["রজনীগন্ধা", "মধুমতি"],
    stops: ["gabtoli", "mohammadpur", "lalmatia", "dhanmondi", "science-lab", "shahbag", "gulistan"],
    segmentKm: [3.2, 1.4, 1.6, 1.3, 2.6, 2.6],
  },
  {
    id: "mirpur-gabtoli-link",
    nameBn: "মিরপুর — গাবতলী লিংক",
    examples: ["মিরপুর মেট্রো"],
    stops: ["mirpur-1", "kalyanpur", "gabtoli"],
    segmentKm: [2.4, 1.8],
  },
  {
    id: "khilgaon-sayedabad-link",
    nameBn: "খিলগাঁও — মতিঝিল — সায়েদাবাদ লিংক",
    examples: ["বাহন", "রাইদা"],
    stops: ["khilgaon", "malibagh", "motijheel", "gulistan", "sayedabad", "jatrabari"],
    segmentKm: [1.8, 3.2, 1.6, 1.7, 1.6],
  },
  {
    id: "gulshan-banani-link",
    nameBn: "গুলশান — বনানী — মহাখালী লিংক",
    examples: ["ঢাকা চাকা"],
    stops: ["gulshan", "banani", "mohakhali"],
    segmentKm: [1.8, 2.2],
  },
  {
    id: "mirpur12-motijheel-ecb",
    nameBn: "মিরপুর ১২ — মতিঝিল করিডর (ECB / ক্যান্টনমেন্ট)",
    examples: ["বিকাশ", "শিখর"],
    stops: ["mirpur-12", "pallabi", "mirpur-11", "mirpur-10", "ecb", "cantonment", "mohakhali", "tejgaon", "farmgate", "karwan", "shahbag", "press-club", "motijheel"],
    segmentKm: [1.1, 0.9, 1.7, 3.8, 2.5, 3.6, 2.0, 1.0, 0.9, 1.7, 1.7, 1.5],
  },
  {
    id: "gabtoli-motijheel-mirpurroad",
    nameBn: "গাবতলী — মতিঝিল করিডর (মিরপুর রোড)",
    examples: ["দিশারী", "বাহন"],
    stops: ["gabtoli", "technical", "kalyanpur", "shyamoli", "asad-gate", "dhanmondi", "science-lab", "new-market", "du", "shahbag", "press-club", "paltan", "motijheel"],
    segmentKm: [1.3, 1.0, 1.2, 1.9, 2.2, 1.3, 0.8, 1.0, 1.0, 1.7, 0.8, 1.5],
  },
  {
    id: "banasree-motijheel",
    nameBn: "বনশ্রী — মতিঝিল করিডর",
    examples: ["রাইদা", "অনাবিল"],
    stops: ["banasree", "rampura", "malibagh", "kakrail", "paltan", "motijheel"],
    segmentKm: [1.8, 1.9, 1.0, 0.9, 1.5],
  },
  {
    id: "uttara-gulshan-link",
    nameBn: "উত্তরা — গুলশান লিংক (প্রগতি সরণি)",
    examples: ["রাইদা", "তুরাগ"],
    stops: ["uttara", "airport", "khilkhet", "kuril", "bashundhara", "natun-bazar", "gulshan"],
    segmentKm: [4.9, 3.0, 1.1, 1.7, 2.5, 1.6],
  },
  {
    id: "mirpur-uttara-link",
    nameBn: "মিরপুর — উত্তরা লিংক",
    examples: ["বিকাশ", "মিরপুর মেট্রো"],
    stops: ["mirpur-12", "pallabi", "uttara-south", "uttara", "uttara-north"],
    segmentKm: [1.1, 4.7, 2.5, 4.2],
  },
  {
    id: "jatrabari-mirpur-long",
    nameBn: "যাত্রাবাড়ী — মিরপুর করিডর (ক্রস-সিটি)",
    examples: ["খাজাবাবা", "বিকাশ"],
    stops: ["jatrabari", "sayedabad", "gulistan", "shahbag", "farmgate", "agargaon", "shewrapara", "kazipara", "mirpur-10", "mirpur-1"],
    segmentKm: [1.4, 2.3, 2.8, 2.6, 3.1, 1.7, 1.2, 1.3, 2.2],
  },
  {
    id: "azimpur-gabtoli-west",
    nameBn: "আজিমপুর — গাবতলী করিডর (পশ্চিম)",
    examples: ["রজনীগন্ধা", "মধুমতি"],
    stops: ["azimpur", "new-market", "science-lab", "dhanmondi", "lalmatia", "mohammadpur", "shyamoli", "kalyanpur", "gabtoli"],
    segmentKm: [0.9, 0.8, 1.3, 1.7, 1.8, 1.4, 1.2, 2.0],
  },
  {
    id: "khilgaon-banani-east",
    nameBn: "খিলগাঁও — বনানী করিডর (পূর্ব)",
    examples: ["ঢাকা চাকা", "রাইদা"],
    stops: ["khilgaon", "banasree", "rampura", "merul", "badda", "natun-bazar", "gulshan", "banani"],
    segmentKm: [1.8, 1.8, 2.0, 1.6, 1.5, 1.6, 1.1],
  },
  { id: "sav-corridor", nameBn: "গাবতলী — সাভার করিডর", examples: ["বলাকা, ধামরাই পরিবহন"], stops: ["gabtoli", "technical", "aminbazar", "hemayetpur", "savar"], segmentKm: [1.3, 7.7, 2.6, 7.8] },
  { id: "tongi-corridor", nameBn: "উত্তরা — টঙ্গী করিডর", examples: ["বিআরটিসি, গাজীপুর পরিবহন"], stops: ["uttara-north", "uttara", "rajlokkhi", "house-building", "abdullahpur", "tongi"], segmentKm: [4.2, 2.8, 0.8, 1.6, 3.0] },
  { id: "rupnagar-link", nameBn: "মিরপুর — রূপনগর — পল্লবী লিংক", examples: ["মিরপুর মেট্রো সার্ভিস"], stops: ["mirpur-1", "mirpur-2", "mirpur-6", "rupnagar", "pallabi", "mirpur-11", "mirpur-12"], segmentKm: [1.8, 0.7, 1.7, 1.9, 0.9, 1.7] },
  { id: "vasantek-link", nameBn: "মিরপুর ১৪ — ভাসানটেক — DOHS লিংক", examples: ["ক্যান্টনমেন্ট সার্ভিস"], stops: ["mirpur-14", "vasantek", "cantonment", "ecb", "mirpur-dohs"], segmentKm: [2.5, 0.7, 2.5, 3.6] },
  { id: "hatirjheel-link", nameBn: "গুলশান — হাতিরঝিল — তেজগাঁও লিংক", examples: ["হাতিরঝিল চক্রযান"], stops: ["gulshan", "gulshan-2", "niketan", "mohakhali", "sat-rasta", "tejgaon", "karwan"], segmentKm: [0.7, 1.8, 1.1, 2.4, 1.2, 1.8] },
  { id: "mugda-corridor", nameBn: "মতিঝিল — মুগদা — রামপুরা করিডর", examples: ["রাজধানী সুপার সার্ভিস"], stops: ["motijheel", "kamalapur", "mugda", "basabo", "khilgaon", "malibagh", "rampura"], segmentKm: [1.2, 0.7, 1.6, 1.7, 1.8, 1.9] },
  { id: "demra-link", nameBn: "যাত্রাবাড়ী — ডেমরা লিংক", examples: ["ডেমরা সার্ভিস"], stops: ["sayedabad", "jatrabari", "demra"], segmentKm: [1.4, 7.1] },
  { id: "sadarghat-link", nameBn: "গুলিস্তান — সদরঘাট — কেরানীগঞ্জ লিংক", examples: ["সদরঘাট সার্ভিস"], stops: ["gulistan", "chankharpul", "sadarghat", "keraniganj"], segmentKm: [1.3, 2.8, 1.6] },
  { id: "bosila-link", nameBn: "মোহাম্মদপুর — বসিলা লিংক", examples: ["বসিলা সার্ভিস"], stops: ["mohammadpur", "shankar", "bosila"], segmentKm: [2.7, 1.7] },
  { id: "dhanmondi-link", nameBn: "শংকর — ধানমন্ডি — আজিমপুর লিংক", examples: ["ধানমন্ডি সার্ভিস"], stops: ["shankar", "dhanmondi-27", "dhanmondi", "science-lab", "new-market", "azimpur"], segmentKm: [2.1, 1.4, 1.3, 0.8, 0.9] },
  { id: "satrasta-link", nameBn: "ফার্মগেট — সাতরাস্তা — এয়ারপোর্ট লিংক", examples: ["তেজগাঁও সার্ভিস"], stops: ["farmgate", "sat-rasta", "mohakhali", "banani", "khilkhet", "nikunja", "airport"], segmentKm: [1.3, 2.4, 2.4, 5.4, 0.7, 3.4] },
  { id: "dohs-link", nameBn: "পল্লবী — DOHS — মহাখালী লিংক", examples: ["DOHS সার্ভিস"], stops: ["pallabi", "mirpur-12", "mirpur-dohs", "cantonment", "mohakhali"], segmentKm: [1.1, 1.0, 5.5, 3.6] }
];

export interface BusOption {
  route: BusRoute;
  km: number;
  fromIdx: number;
  toIdx: number;
  directionStops: string[];
}

/** from → to সরাসরি বাস অপশনগুলো (একই রুটে দুটো স্টপই থাকলে) */
export function findDirectBuses(fromId: string, toId: string): BusOption[] {
  const out: BusOption[] = [];
  for (const route of BUS_ROUTES) {
    const i = route.stops.indexOf(fromId);
    const j = route.stops.indexOf(toId);
    if (i === -1 || j === -1 || i === j) continue;
    const [a, b] = i < j ? [i, j] : [j, i];
    let km = 0;
    for (let k = a; k < b; k++) km += route.segmentKm[k];
    const slice = route.stops.slice(a, b + 1);
    out.push({
      route,
      km: Math.round(km * 10) / 10,
      fromIdx: i,
      toIdx: j,
      directionStops: i < j ? slice : [...slice].reverse(),
    });
  }
  return out.sort((x, y) => x.km - y.km);
}

export interface ChartRow {
  stopId: string;
  km: number; // ওঠার স্টপ থেকে দূরত্ব
  fare: number; // BRTA রেটে ভাড়া
}

/**
 * বাসের ভেতরে টাঙানো চার্টের মতো: ওঠার স্টপ থেকে রুটের শেষ পর্যন্ত
 * প্রতিটি স্টপের দূরত্ব ও BRTA রেটে ভাড়া।
 */
export function chartFor(option: BusOption): ChartRow[] {
  const { route, fromIdx, toIdx } = option;
  const step = fromIdx < toIdx ? 1 : -1;
  const rows: ChartRow[] = [];
  let km = 0;
  let i = fromIdx;
  for (;;) {
    rows.push({
      stopId: route.stops[i],
      km: Math.round(km * 10) / 10,
      fare: Math.max(RATES.busMinFare, Math.round(km * RATES.busPerKm)),
    });
    if (i === route.stops.length - 1 && step === 1) break;
    if (i === 0 && step === -1) break;
    km += step === 1 ? route.segmentKm[i] : route.segmentKm[i - 1];
    i += step;
  }
  return rows;
}

export interface TransferRoute {
  firstRoute: BusRoute;
  secondRoute: BusRoute;
  transferStopId: string;
  kmFirst: number;
  kmSecond: number;
  totalKm: number;
}

function segSum(route: BusRoute, i: number, j: number): number {
  const [a, b] = i < j ? [i, j] : [j, i];
  let km = 0;
  for (let k = a; k < b; k++) km += route.segmentKm[k];
  return Math.round(km * 10) / 10;
}

/** সরাসরি বাস না থাকলে এক বদলির সেরা (সবচেয়ে কম দূরত্বের) অপশন */
export function findTransferRoute(fromId: string, toId: string): TransferRoute | null {
  let best: TransferRoute | null = null;
  for (const r1 of BUS_ROUTES) {
    const i1 = r1.stops.indexOf(fromId);
    if (i1 < 0) continue;
    for (const r2 of BUS_ROUTES) {
      if (r2.id === r1.id) continue;
      const j2 = r2.stops.indexOf(toId);
      if (j2 < 0) continue;
      for (const s of r1.stops) {
        if (s === fromId || s === toId) continue;
        const jS = r2.stops.indexOf(s);
        if (jS < 0) continue;
        const kmFirst = segSum(r1, i1, r1.stops.indexOf(s));
        const kmSecond = segSum(r2, jS, j2);
        const totalKm = Math.round((kmFirst + kmSecond) * 10) / 10;
        if (!best || totalKm < best.totalKm) {
          best = { firstRoute: r1, secondRoute: r2, transferStopId: s, kmFirst, kmSecond, totalKm };
        }
      }
    }
  }
  return best;
}
