// সরকারি ভাড়ার রেট — একটাই সোর্স ফাইল।
// সরকার গেজেট দিয়ে রেট বদলালে শুধু এই ফাইলটা আপডেট করলেই পুরো অ্যাপ আপডেট হয়ে যাবে।

export interface RateInfo {
  mode: string;
  labelBn: string;
  labelEn: string;
  formulaBn: string;
  formulaEn: string;
  source: string;
  effectiveFrom: string;
  official: boolean;
}

export const RATES = {
  // BRTA — ঢাকা ও চট্টগ্রাম মহানগর সিটি বাস (ডিজেল), সংশোধিত রেট
  busPerKm: 2.7,
  busMinFare: 10,
  minibusPerKm: 2.6,
  minibusMinFare: 8,
  // BRTA — আন্তঃজেলা বাস
  intercityPerKm: 2.4,
  // DMTCL — মেট্রোরেল MRT-6
  metroPerKm: 5,
  metroMinFare: 20,
  metroMaxFare: 100,
  // BRTA — CNG অটোরিকশা মিটার রেট
  cngFirstKm: 2,
  cngFirstFare: 40,
  cngPerKmAfter: 12,
  cngWaitingPerMin: 2,
} as const;

export const RATE_SOURCES: RateInfo[] = [
  {
    mode: "bus",
    labelBn: "সিটি বাস (ঢাকা)",
    labelEn: "City Bus (Dhaka)",
    formulaBn: "কিমি প্রতি ৳২.৭০ · সর্বনিম্ন ভাড়া ৳১০ (মিনিবাস ৳২.৬০ · সর্বনিম্ন ৳৮)",
    formulaEn: "৳2.70 per km · minimum fare ৳10 (minibus ৳2.60 · min ৳8)",
    source: "BRTA (বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ) — মহানগর ভাড়া চার্ট",
    effectiveFrom: "২২ সেপ্টেম্বর ২০২৬",
    official: true,
  },
  {
    mode: "metro",
    labelBn: "মেট্রোরেল (MRT-6)",
    labelEn: "Metro Rail (MRT-6)",
    formulaBn: "কিমি প্রতি ৳৫ · সর্বনিম্ন ৳২০ · সর্বোচ্চ ৳১০০ (উত্তরা নর্থ → মতিঝিল)",
    formulaEn: "৳5 per km · minimum ৳20 · maximum ৳100",
    source: "DMTCL / DTCA — অফিসিয়াল স্টেশন-টু-স্টেশন ভাড়া চার্ট",
    effectiveFrom: "৮ সেপ্টেম্বর ২০২২ (চার্ট)",
    official: true,
  },
  {
    mode: "cng",
    labelBn: "CNG অটোরিকশা (মিটার)",
    labelEn: "CNG Auto-rickshaw (Meter)",
    formulaBn: "প্রথম ২ কিমি ৳৪০ · এরপর কিমি প্রতি ৳১২ · অপেক্ষা মিনিটে ৳২",
    formulaEn: "First 2 km ৳40 · then ৳12 per km · waiting ৳2 per minute",
    source: "BRTA — সরকার নির্ধারিত মিটার রেট, সড়ক পরিবহন আইন ২০১৮",
    effectiveFrom: "১ নভেম্বর ২০১৫",
    official: true,
  },
  {
    mode: "intercity",
    labelBn: "আন্তঃজেলা বাস",
    labelEn: "Intercity Bus",
    formulaBn: "কিমি প্রতি ৳২.৪০ · রুটভিত্তিক চার্ট BRTA সাইটে",
    formulaEn: "৳2.40 per km · route charts on the BRTA site",
    source: "BRTA — আন্তঃজেলা ভাড়া চার্ট",
    effectiveFrom: "২২ সেপ্টেম্বর ২০২৬",
    official: true,
  },
  {
    mode: "rickshaw",
    labelBn: "রিকশা",
    labelEn: "Rickshaw",
    formulaBn: "সরকারি রেট নেই — চলতি বাজার ভাড়া থেকে আনুমানিক রেঞ্জ দেখানো হয়",
    formulaEn: "No official rate — market-based estimate",
    source: "ভাড়াঠিক ফিল্ড সার্ভে + ব্যবহারকারীদের রিপোর্ট",
    effectiveFrom: "—",
    official: false,
  },
];
