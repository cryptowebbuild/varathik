// ভাড়া ইঞ্জিন — সব হিসাব সরকারি রেট (data/rates.ts) থেকে।
import { RATES } from "../data/rates";
import { findPlace, type Place } from "../data/places";
import { metroFare, metroStation } from "../data/metro";
import { findDirectBuses, findTransferRoute, type BusOption } from "../data/busRoutes";

const toRad = (d: number) => (d * Math.PI) / 180;

/** সরলরেখা দূরত্ব (কিমি) */
export function haversineKm(a: Place, b: Place): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** সড়কপথের আনুমানিক দূরত্ব — ঢাকার রাস্তা সরলরেখার চেয়ে ~৩০% লম্বা */
export function roadKm(fromId: string, toId: string): number {
  const km = haversineKm(findPlace(fromId), findPlace(toId)) * 1.3;
  return Math.round(km * 10) / 10;
}

export function busFareForKm(km: number): number {
  return Math.max(RATES.busMinFare, Math.round(km * RATES.busPerKm));
}

/** বাসের দূরত্বের একটাই সূত্র: সরাসরি করিডর থাকলে তার km, নাহলে সড়ক-দূরত্ব */
export function busKmFor(fromId: string, toId: string): number {
  const buses = findDirectBuses(fromId, toId);
  return buses.length > 0 ? buses[0].km : roadKm(fromId, toId);
}

/** বাসে ভাড়া সাধারণত ৳৫-এর রাউন্ডে নেওয়া হয় */
export function round5(n: number): number {
  return Math.round(n / 5) * 5;
}

export function cngFareForKm(km: number, waitingMin = 0): number {
  const base =
    km <= RATES.cngFirstKm
      ? RATES.cngFirstFare
      : RATES.cngFirstFare + (km - RATES.cngFirstKm) * RATES.cngPerKmAfter;
  return Math.round(base + waitingMin * RATES.cngWaitingPerMin);
}

/** রিকশার কোনো সরকারি রেট নেই — বাজারভিত্তিক আনুমানিক রেঞ্জ */
export function rickshawRangeForKm(km: number): { low: number; high: number } {
  const round5 = (n: number) => Math.round(n / 5) * 5;
  return {
    low: Math.max(30, round5(20 + km * 26)),
    high: Math.max(40, round5(30 + km * 38)),
  };
}

export interface ModeResult {
  mode: "bus" | "metro" | "cng" | "rickshaw";
  titleBn: string;
  titleEn: string;
  fare: number;
  fareNote?: string;
  fareNoteEn?: string;
  km: number;
  minutes: number;
  official: boolean;
  detailBn: string;
  detailEn: string;
  buses?: BusOption[];
}

export function computeResults(fromId: string, toId: string): ModeResult[] {
  const from = findPlace(fromId);
  const to = findPlace(toId);
  const dist = roadKm(fromId, toId);
  const results: ModeResult[] = [];

  // বাস — সরাসরি রুট পেলে রুট-দূরত্বে, না পেলে সড়ক-দূরত্বে BRTA রেট
  const buses = findDirectBuses(fromId, toId);
  if (buses.length > 0) {
    const km = buses[0].km;
    results.push({
      mode: "bus",
      titleBn: "লোকাল বাস",
      titleEn: "Local Bus",
      fare: busFareForKm(km),
      km,
      minutes: Math.round((km / 12) * 60) + 10,
      official: true,
      detailBn: `${buses.length}টি সরাসরি রুট পাওয়া গেছে — ${buses[0].route.examples.join(", ")}সহ`,
      detailEn: `${buses.length} direct route(s) found — incl. ${buses[0].route.examples.join(", ")}`,
      buses,
    });
  } else {
    results.push({
      mode: "bus",
      titleBn: "লোকাল বাস",
      titleEn: "Local Bus",
      fare: busFareForKm(dist),
      km: dist,
      minutes: Math.round((dist / 12) * 60) + 10,
      official: true,
      detailBn: "সরাসরি রুটের ডেটা এখনো যোগ হয়নি — BRTA রেটে সড়ক-দূরত্ব অনুযায়ী ভাড়া",
      detailEn: "No direct route data yet — fare by road distance at the BRTA rate",
    });
  }

  // মেট্রো — দুই প্রান্তেই স্টেশন থাকলে
  if (from.metro && to.metro && from.metro !== to.metro) {
    const m = metroFare(from.metro, to.metro);
    if (m) {
      results.push({
        mode: "metro",
        titleBn: "মেট্রোরেল",
        titleEn: "Metro Rail",
        fare: m.fare,
        km: m.km,
        minutes: Math.round((m.km / 32) * 60) + 6,
        official: true,
        detailBn: `${metroStation(from.metro)?.bn ?? ""} স্টেশন → ${metroStation(to.metro)?.bn ?? ""} স্টেশন · জ্যামমুক্ত — সময় প্রায় নিশ্চিত`,
        detailEn: `${metroStation(from.metro)?.en ?? ""} station → ${metroStation(to.metro)?.en ?? ""} station · Jam-free, predictable timing`,
      });
    }
  }

  // CNG — মিটার ফর্মুলা
  results.push({
    mode: "cng",
    titleBn: "CNG অটোরিকশা (মিটার)",
    titleEn: "CNG Auto-rickshaw (Meter)",
    fare: cngFareForKm(dist),
    fareNote: "অপেক্ষা/জ্যামের সময় ছাড়া",
    fareNoteEn: "Excluding waiting / jam time",
    km: dist,
    minutes: Math.round((dist / 15) * 60) + 5,
    official: true,
    detailBn: "সরকারি মিটার রেট — ড্রাইভার মিটারে যেতে আইনত বাধ্য",
    detailEn: "Official meter rate — the driver is legally bound to run the meter",
  });

  // রিকশা — ছোট দূরত্বে
  if (dist <= 12) {
    const r = rickshawRangeForKm(dist);
    results.push({
      mode: "rickshaw",
      titleBn: "রিকশা",
      titleEn: "Rickshaw",
      fare: r.low,
      fareNote: `আনুমানিক ৳${r.low}–${r.high}`,
      fareNoteEn: `Approx ৳${r.low}–${r.high}`,
      km: dist,
      minutes: Math.round((dist / 9) * 60),
      official: false,
      detailBn:
        dist > 7
          ? "লম্বা দূরত্বে রিকশা ধীর ও ব্যয়বহুল — তবু বাজার রেঞ্জ দেওয়া হলো (সরকারি রেট নেই)"
          : "সরকারি রেট নেই — চলতি বাজার ভাড়ার রেঞ্জ",
      detailEn:
        dist > 7
          ? "Slow and pricey over long distances — market range shown anyway (no official rate)"
          : "No official rate — current market fare range",
    });
  }

  return results.sort((a, b) => a.fare - b.fare);
}

export interface TransferFare {
  firstRouteBn: string;
  secondRouteBn: string;
  transferBn: string;
  transferEn: string;
  kmFirst: number;
  kmSecond: number;
  fareFirst: number;
  fareSecond: number;
  totalFare: number;
  totalKm: number;
}

/** এক বদলির মোট ভাড়া (দুই লেগের আলাদা টিকিট) */
export function transferFareFor(fromId: string, toId: string): TransferFare | null {
  const t = findTransferRoute(fromId, toId);
  if (!t) return null;
  const stop = findPlace(t.transferStopId);
  const fareFirst = busFareForKm(t.kmFirst);
  const fareSecond = busFareForKm(t.kmSecond);
  return {
    firstRouteBn: t.firstRoute.nameBn,
    secondRouteBn: t.secondRoute.nameBn,
    transferBn: stop.bn,
    transferEn: stop.en,
    kmFirst: t.kmFirst,
    kmSecond: t.kmSecond,
    fareFirst,
    fareSecond,
    totalFare: fareFirst + fareSecond,
    totalKm: t.totalKm,
  };
}
