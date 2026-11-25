// ঢাকার প্রধান বাস করিডর — স্টপের ক্রম ও আনুমানিক ধাপ-দূরত্ব (কিমি)।
// ভাড়া BRTA রেটে হিসাব হয় (rates.ts)। রুটগুলো প্রধান সড়ক করিডর অনুযায়ী সাজানো;
// প্রতিটি করিডরে একাধিক কোম্পানির বাস চলে — পরিচিত নাম উদাহরণ হিসেবে দেওয়া।

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
