// ঢাকার প্রধান এলাকা/স্টপ — নাম (বাংলা + English + Banglish alias), অবস্থান, নিকটতম মেট্রো স্টেশন

export interface Place {
  id: string;
  bn: string;
  en: string;
  aliases: string[];
  lat: number;
  lng: number;
  metro?: string; // নিকটতম মেট্রো স্টেশনের id (metro.ts)
}

export const PLACES: Place[] = [
  { id: "uttara", bn: "উত্তরা", en: "Uttara", aliases: ["uttara", "উত্তরা"], lat: 23.8759, lng: 90.3795, metro: "uttara-center" },
  { id: "uttara-north", bn: "উত্তরা নর্থ (দিয়াবাড়ী)", en: "Uttara North", aliases: ["diabari", "দিয়াবাড়ী"], lat: 23.905, lng: 90.367, metro: "uttara-north" },
  { id: "airport", bn: "এয়ারপোর্ট", en: "Airport", aliases: ["airport", "বিমানবন্দর"], lat: 23.8513, lng: 90.4089 },
  { id: "khilkhet", bn: "খিলক্ষেত", en: "Khilkhet", aliases: ["khilkhet"], lat: 23.831, lng: 90.418 },
  { id: "kuril", bn: "কুড়িল বিশ্বরোড", en: "Kuril Bishwa Road", aliases: ["kuril", "কুড়িল"], lat: 23.824, lng: 90.423 },
  { id: "bashundhara", bn: "বসুন্ধরা আবাসিক", en: "Bashundhara R/A", aliases: ["bashundhara", "বসুন্ধরা"], lat: 23.815, lng: 90.432 },
  { id: "natun-bazar", bn: "নতুন বাজার", en: "Natun Bazar", aliases: ["notun bazar", "natun bazar"], lat: 23.797, lng: 90.427 },
  { id: "badda", bn: "বাড্ডা", en: "Badda", aliases: ["badda"], lat: 23.786, lng: 90.426 },
  { id: "rampura", bn: "রামপুরা", en: "Rampura", aliases: ["rampura"], lat: 23.761, lng: 90.421 },
  { id: "malibagh", bn: "মালিবাগ", en: "Malibagh", aliases: ["malibagh", "মালিবাগ"], lat: 23.749, lng: 90.413 },
  { id: "khilgaon", bn: "খিলগাঁও", en: "Khilgaon", aliases: ["khilgaon"], lat: 23.752, lng: 90.427 },
  { id: "banani", bn: "বনানী", en: "Banani", aliases: ["banani"], lat: 23.793, lng: 90.406 },
  { id: "gulshan", bn: "গুলশান", en: "Gulshan", aliases: ["gulshan"], lat: 23.792, lng: 90.415 },
  { id: "mohakhali", bn: "মহাখালী", en: "Mohakhali", aliases: ["mohakhali"], lat: 23.777, lng: 90.397 },
  { id: "tejgaon", bn: "তেজগাঁও", en: "Tejgaon", aliases: ["tejgaon"], lat: 23.764, lng: 90.39 },
  { id: "farmgate", bn: "ফার্মগেট", en: "Farmgate", aliases: ["farmgate", "ফার্মগেট"], lat: 23.757, lng: 90.389, metro: "farmgate" },
  { id: "karwan", bn: "কারওয়ান বাজার", en: "Karwan Bazar", aliases: ["karwan", "kawran", "কারওয়ান"], lat: 23.751, lng: 90.392, metro: "karwan-bazar" },
  { id: "shahbag", bn: "শাহবাগ", en: "Shahbag", aliases: ["shahbag", "শাহবাগ"], lat: 23.739, lng: 90.396, metro: "shahbag" },
  { id: "du", bn: "ঢাকা বিশ্ববিদ্যালয়", en: "Dhaka University", aliases: ["du", "ঢাবি", "tsc"], lat: 23.733, lng: 90.392, metro: "du" },
  { id: "press-club", bn: "প্রেস ক্লাব / সচিবালয়", en: "Press Club", aliases: ["press club", "সচিবালয়", "secretariat"], lat: 23.731, lng: 90.407, metro: "secretariat" },
  { id: "motijheel", bn: "মতিঝিল", en: "Motijheel", aliases: ["motijheel", "মতিঝিল"], lat: 23.727, lng: 90.418, metro: "motijheel" },
  { id: "gulistan", bn: "গুলিস্তান", en: "Gulistan", aliases: ["gulistan"], lat: 23.724, lng: 90.411 },
  { id: "sayedabad", bn: "সায়েদাবাদ", en: "Sayedabad", aliases: ["sayedabad", "সায়দাবাদ"], lat: 23.718, lng: 90.428 },
  { id: "jatrabari", bn: "যাত্রাবাড়ী", en: "Jatrabari", aliases: ["jatrabari"], lat: 23.71, lng: 90.435 },
  { id: "pallabi", bn: "পল্লবী", en: "Pallabi", aliases: ["pallabi"], lat: 23.826, lng: 90.365, metro: "pallabi" },
  { id: "mirpur-11", bn: "মিরপুর ১১", en: "Mirpur 11", aliases: ["mirpur 11", "মিরপুর ১১"], lat: 23.819, lng: 90.365, metro: "mirpur-11" },
  { id: "mirpur-10", bn: "মিরপুর ১০", en: "Mirpur 10", aliases: ["mirpur 10", "mirpur10", "মিরপুর ১০"], lat: 23.807, lng: 90.368, metro: "mirpur-10" },
  { id: "mirpur-1", bn: "মিরপুর ১", en: "Mirpur 1", aliases: ["mirpur 1", "মিরপুর ১"], lat: 23.798, lng: 90.353 },
  { id: "kazipara", bn: "কাজীপাড়া", en: "Kazipara", aliases: ["kazipara"], lat: 23.799, lng: 90.373, metro: "kazipara" },
  { id: "shewrapara", bn: "শেওড়াপাড়া", en: "Shewrapara", aliases: ["shewrapara"], lat: 23.79, lng: 90.375, metro: "shewrapara" },
  { id: "agargaon", bn: "আগারগাঁও", en: "Agargaon", aliases: ["agargaon"], lat: 23.778, lng: 90.38, metro: "agargaon" },
  { id: "bijoy-sarani", bn: "বিজয় সরণি", en: "Bijoy Sarani", aliases: ["bijoy sarani"], lat: 23.767, lng: 90.383, metro: "bijoy-sarani" },
  { id: "shyamoli", bn: "শ্যামলী", en: "Shyamoli", aliases: ["shyamoli"], lat: 23.774, lng: 90.365 },
  { id: "kalyanpur", bn: "কল্যাণপুর", en: "Kalyanpur", aliases: ["kalyanpur", "kallyanpur"], lat: 23.78, lng: 90.358 },
  { id: "gabtoli", bn: "গাবতলী", en: "Gabtoli", aliases: ["gabtoli", "গাবতলি"], lat: 23.783, lng: 90.342 },
  { id: "asad-gate", bn: "আসাদ গেট", en: "Asad Gate", aliases: ["asad gate", "asadgate"], lat: 23.762, lng: 90.373 },
  { id: "dhanmondi", bn: "ধানমন্ডি", en: "Dhanmondi", aliases: ["dhanmondi", "ধানমণ্ডি"], lat: 23.746, lng: 90.376 },
  { id: "science-lab", bn: "সায়েন্স ল্যাব", en: "Science Lab", aliases: ["science lab", "sciencelab"], lat: 23.739, lng: 90.383 },
  { id: "new-market", bn: "নিউ মার্কেট", en: "New Market", aliases: ["new market", "newmarket"], lat: 23.733, lng: 90.384 },
  { id: "azimpur", bn: "আজিমপুর", en: "Azimpur", aliases: ["azimpur"], lat: 23.728, lng: 90.379 },
  { id: "mohammadpur", bn: "মোহাম্মদপুর", en: "Mohammadpur", aliases: ["mohammadpur", "মোহাম্মদপুর"], lat: 23.766, lng: 90.358 },
  { id: "lalmatia", bn: "লালমাটিয়া", en: "Lalmatia", aliases: ["lalmatia"], lat: 23.756, lng: 90.368 },
  { id: "uttara-south", bn: "উত্তরা দক্ষিণ", en: "Uttara South", aliases: ["uttara south"], lat: 23.86, lng: 90.37, metro: "uttara-south" },
  { id: "baridhara", bn: "বারিধারা", en: "Baridhara", aliases: ["baridhara"], lat: 23.803, lng: 90.42 },
  { id: "wari", bn: "ওয়ারী", en: "Wari", aliases: ["wari"], lat: 23.718, lng: 90.42 },
  { id: "kamalapur", bn: "কমলাপুর", en: "Kamalapur", aliases: ["kamalapur", "কমলাপুর"], lat: 23.732, lng: 90.426 },
  { id: "mirpur-12", bn: "মিরপুর ১২", en: "Mirpur 12", aliases: ["mirpur 12", "mirpur12", "মিরপুর ১২"], lat: 23.8285, lng: 90.3735, metro: "pallabi" },
  { id: "ecb", bn: "ECB চত্বর", en: "ECB Chattar", aliases: ["ecb", "ইসিবি"], lat: 23.8215, lng: 90.3945 },
  { id: "cantonment", bn: "ক্যান্টনমেন্ট", en: "Cantonment", aliases: ["cantonment", "ক্যান্টনমেন্ট"], lat: 23.8035, lng: 90.3975 },
  { id: "technical", bn: "টেকনিক্যাল মোড়", en: "Technical Mor", aliases: ["technical", "টেকনিক্যাল"], lat: 23.7845, lng: 90.352 },
  { id: "banasree", bn: "বনশ্রী", en: "Banasree", aliases: ["banasree", "বনশ্রী", "banashree"], lat: 23.7625, lng: 90.4355 },
  { id: "merul", bn: "মেরুল বাড্ডা", en: "Merul Badda", aliases: ["merul", "মেরুল"], lat: 23.7745, lng: 90.4275 },
  { id: "paltan", bn: "পল্টন", en: "Paltan", aliases: ["paltan", "পল্টন"], lat: 23.736, lng: 90.4105 },
  { id: "kakrail", bn: "কাকরাইল", en: "Kakrail", aliases: ["kakrail", "কাকরাইল"], lat: 23.7425, lng: 90.4095 },
  { id: "mirpur-2", bn: "মিরপুর ২", en: "Mirpur 2", aliases: ["mirpur 2", "মিরপুর ২"], lat: 23.8068, lng: 90.3635 },
  { id: "mirpur-6", bn: "মিরপুর ৬", en: "Mirpur 6", aliases: ["mirpur 6", "মিরপুর ৬"], lat: 23.8065, lng: 90.3662, metro: "mirpur-10" },
  { id: "mirpur-14", bn: "মিরপুর ১৪ (কাফরুল)", en: "Mirpur 14 (Kafrul)", aliases: ["mirpur 14", "kafrul", "কাফরুল"], lat: 23.7901, lng: 90.3833 },
  { id: "rupnagar", bn: "রূপনগর", en: "Rupnagar", aliases: ["rupnagar", "রূপনগর"], lat: 23.815, lng: 90.3561 },
  { id: "mirpur-dohs", bn: "মিরপুর DOHS", en: "Mirpur DOHS", aliases: ["dohs", "ডিওএইচএস"], lat: 23.8345, lng: 90.3694 },
  { id: "vasantek", bn: "ভাসানটেক", en: "Vasantek", aliases: ["vasantek", "ভাসানটেক"], lat: 23.8055, lng: 90.395 },
  { id: "niketan", bn: "নিকেতন", en: "Niketan", aliases: ["niketan", "নিকেতন"], lat: 23.7827, lng: 90.4032 },
  { id: "gulshan-2", bn: "গুলশান ২", en: "Gulshan 2", aliases: ["gulshan 2", "গুলশান ২"], lat: 23.7886, lng: 90.4165 },
  { id: "jamuna", bn: "যমুনা ফিউচার পার্ক", en: "Jamuna Future Park", aliases: ["jamuna", "যমুনা"], lat: 23.8127, lng: 90.4213 },
  { id: "nikunja", bn: "নিকুঞ্জ", en: "Nikunja", aliases: ["nikunja", "নিকুঞ্জ"], lat: 23.828, lng: 90.42 },
  { id: "house-building", bn: "হাউজ বিল্ডিং (উত্তরা)", en: "House Building", aliases: ["house building", "হাউজ বিল্ডিং"], lat: 23.8733, lng: 90.3968, metro: "uttara-center" },
  { id: "rajlokkhi", bn: "রাজলক্ষ্মী (উত্তরা)", en: "Rajlokkhi", aliases: ["rajlokkhi", "রাজলক্ষ্মী"], lat: 23.868, lng: 90.4004, metro: "uttara-center" },
  { id: "abdullahpur", bn: "আবদুল্লাহপুর", en: "Abdullahpur", aliases: ["abdullahpur", "আবদুল্লাহপুর"], lat: 23.8843, lng: 90.4004 },
  { id: "tongi", bn: "টঙ্গী", en: "Tongi", aliases: ["tongi", "টঙ্গী"], lat: 23.9059, lng: 90.3938 },
  { id: "aminbazar", bn: "আমিনবাজার", en: "Amin Bazar", aliases: ["amin bazar", "আমিনবাজার"], lat: 23.7837, lng: 90.2898 },
  { id: "hemayetpur", bn: "হেমায়েতপুর", en: "Hemayetpur", aliases: ["hemayetpur", "হেমায়েতপুর"], lat: 23.7932, lng: 90.2717 },
  { id: "savar", bn: "সাভার", en: "Savar", aliases: ["savar", "সাভার"], lat: 23.8488, lng: 90.2563 },
  { id: "dhanmondi-27", bn: "ধানমন্ডি ২৭", en: "Dhanmondi 27", aliases: ["dhanmondi 27", "ধানমন্ডি ২৭"], lat: 23.7564, lng: 90.3753 },
  { id: "shankar", bn: "শংকর", en: "Shankar", aliases: ["shankar", "শংকর"], lat: 23.7465, lng: 90.3624 },
  { id: "bosila", bn: "বসিলা", en: "Bosila", aliases: ["bosila", "বসিলা"], lat: 23.7555, lng: 90.353 },
  { id: "chankharpul", bn: "চানখাঁরপুল", en: "Chankharpul", aliases: ["chankharpul", "চানখাঁরপুল"], lat: 23.7238, lng: 90.4004 },
  { id: "sadarghat", bn: "সদরঘাট", en: "Sadarghat", aliases: ["sadarghat", "সদরঘাট"], lat: 23.7075, lng: 90.4139 },
  { id: "keraniganj", bn: "কেরানীগঞ্জ", en: "Keraniganj", aliases: ["keraniganj", "কেরানীগঞ্জ", "babubazar"], lat: 23.7083, lng: 90.4013 },
  { id: "postogola", bn: "পোস্তগোলা", en: "Postogola", aliases: ["postogola", "পোস্তগোলা"], lat: 23.6976, lng: 90.4274 },
  { id: "demra", bn: "ডেমরা", en: "Demra", aliases: ["demra", "ডেমরা"], lat: 23.725, lng: 90.49 },
  { id: "mugda", bn: "মুগদা", en: "Mugda", aliases: ["mugda", "মুগদা"], lat: 23.7295, lng: 90.4275 },
  { id: "basabo", bn: "বাসাবো", en: "Basabo", aliases: ["basabo", "বাসাবো"], lat: 23.7403, lng: 90.4329 },
  { id: "shahjadpur", bn: "শাহজাদপুর", en: "Shahjadpur", aliases: ["shahjadpur", "শাহজাদপুর"], lat: 23.79, lng: 90.4228 },
  { id: "sat-rasta", bn: "সাতরাস্তা (তেজগাঁও)", en: "Sat Rasta", aliases: ["sat rasta", "সাতরাস্তা"], lat: 23.7597, lng: 90.3987 }
];
export function findPlace(id: string): Place {
  return PLACES.find((pl) => pl.id === id) ?? PLACES[0];
}

export function searchPlaces(q: string): Place[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return PLACES;
  return PLACES.filter(
    (pl) =>
      pl.bn.includes(q.trim()) ||
      pl.en.toLowerCase().includes(needle) ||
      pl.aliases.some((a) => a.toLowerCase().includes(needle) || a.includes(q.trim()))
  );
}
