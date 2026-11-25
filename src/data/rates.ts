// সরকারি ভাড়ার রেট — একটাই সোর্স ফাইল।
// সরকার গেজেট দিয়ে রেট বদলালে শুধু এই ফাইলটা আপডেট করলেই পুরো অ্যাপ আপডেট হয়ে যাবে।

export interface RateInfo {
  mode: string;
  labelBn: string;
  formulaBn: string;
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
    formulaBn: "কিমি প্রতি ৳২.৭০ · সর্বনিম্ন ভাড়া ৳১০ (মিনিবাস ৳২.৬০ · সর্বনিম্ন ৳৮)",
    source: "BRTA (বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ) — মহানগর ভাড়া চার্ট",
    effectiveFrom: "২২ সেপ্টেম্বর ২০২৬",
    official: true,
  },
  {
    mode: "metro",
    labelBn: "মেট্রোরেল (MRT-6)",
    formulaBn: "কিমি প্রতি ৳৫ · সর্বনিম্ন ৳২০ · সর্বোচ্চ ৳১০০ (উত্তরা নর্থ → মতিঝিল)",
    source: "DMTCL / DTCA — অফিসিয়াল স্টেশন-টু-স্টেশন ভাড়া চার্ট",
    effectiveFrom: "৮ সেপ্টেম্বর ২০২২ (চার্ট)",
    official: true,
  },
  {
    mode: "cng",
    labelBn: "CNG অটোরিকশা (মিটার)",
    formulaBn: "প্রথম ২ কিমি ৳৪০ · এরপর কিমি প্রতি ৳১২ · অপেক্ষা মিনিটে ৳২",
    source: "BRTA — সরকার নির্ধারিত মিটার রেট, সড়ক পরিবহন আইন ২০১৮",
    effectiveFrom: "১ নভেম্বর ২০১৫",
    official: true,
  },
  {
    mode: "intercity",
    labelBn: "আন্তঃজেলা বাস",
    formulaBn: "কিমি প্রতি ৳২.৪০ · রুটভিত্তিক চার্ট BRTA সাইটে",
    source: "BRTA — আন্তঃজেলা ভাড়া চার্ট",
    effectiveFrom: "২২ সেপ্টেম্বর ২০২৬",
    official: true,
  },
  {
    mode: "rickshaw",
    labelBn: "রিকশা",
    formulaBn: "সরকারি রেট নেই — চলতি বাজার ভাড়া থেকে আনুমানিক রেঞ্জ দেখানো হয়",
    source: "ভাড়াঠিক ফিল্ড সার্ভে + ব্যবহারকারীদের রিপোর্ট",
    effectiveFrom: "—",
    official: false,
  },
];
