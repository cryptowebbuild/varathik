// মেট্রোরেল MRT-6 — স্টেশন তালিকা (উত্তর → দক্ষিণ) ও আনুমানিক সঞ্চিত দূরত্ব (কিমি)
// ভাড়া: DMTCL চার্টের নিয়ম — কিমি প্রতি ৳৫, ৳১০-এর ধাপে, সর্বনিম্ন ৳২০, সর্বোচ্চ ৳১০০
import { RATES } from "./rates";

export interface MetroStation {
  id: string;
  bn: string;
  en: string;
  kmFromStart: number;
}

export const METRO_STATIONS: MetroStation[] = [
  { id: "uttara-north", bn: "উত্তরা নর্থ", en: "Uttara North", kmFromStart: 0 },
  { id: "uttara-center", bn: "উত্তরা সেন্টার", en: "Uttara Center", kmFromStart: 1.5 },
  { id: "uttara-south", bn: "উত্তরা দক্ষিণ", en: "Uttara South", kmFromStart: 3.0 },
  { id: "pallabi", bn: "পল্লবী", en: "Pallabi", kmFromStart: 5.2 },
  { id: "mirpur-11", bn: "মিরপুর ১১", en: "Mirpur 11", kmFromStart: 6.3 },
  { id: "mirpur-10", bn: "মিরপুর ১০", en: "Mirpur 10", kmFromStart: 7.6 },
  { id: "kazipara", bn: "কাজীপাড়া", en: "Kazipara", kmFromStart: 8.9 },
  { id: "shewrapara", bn: "শেওড়াপাড়া", en: "Shewrapara", kmFromStart: 10.0 },
  { id: "agargaon", bn: "আগারগাঁও", en: "Agargaon", kmFromStart: 11.2 },
  { id: "bijoy-sarani", bn: "বিজয় সরণি", en: "Bijoy Sarani", kmFromStart: 12.4 },
  { id: "farmgate", bn: "ফার্মগেট", en: "Farmgate", kmFromStart: 13.7 },
  { id: "karwan-bazar", bn: "কারওয়ান বাজার", en: "Karwan Bazar", kmFromStart: 14.9 },
  { id: "shahbag", bn: "শাহবাগ", en: "Shahbag", kmFromStart: 16.1 },
  { id: "du", bn: "ঢাকা বিশ্ববিদ্যালয়", en: "Dhaka University", kmFromStart: 17.3 },
  { id: "secretariat", bn: "বাংলাদেশ সচিবালয়", en: "Bangladesh Secretariat", kmFromStart: 18.6 },
  { id: "motijheel", bn: "মতিঝিল", en: "Motijheel", kmFromStart: 20.1 },
];

export function metroStation(id: string): MetroStation | undefined {
  return METRO_STATIONS.find((s) => s.id === id);
}

/** দুই স্টেশনের অফিসিয়াল ধাঁচের ভাড়া */
export function metroFare(fromId: string, toId: string): { fare: number; km: number } | null {
  const a = metroStation(fromId);
  const b = metroStation(toId);
  if (!a || !b || a.id === b.id) return null;
  const km = Math.round(Math.abs(a.kmFromStart - b.kmFromStart) * 10) / 10;
  // DMTCL চার্টের ধাঁচ: ৳৫/কিমি, নিকটতম ৳১০-এ রাউন্ড (যেমন মিরপুর ১০ → মতিঝিল ৳৬০, উত্তরা নর্থ → সচিবালয় ৳৯০)
  const raw = Math.round((km * RATES.metroPerKm) / 10) * 10;
  const fare = Math.min(RATES.metroMaxFare, Math.max(RATES.metroMinFare, raw));
  return { fare, km };
}
