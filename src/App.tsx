// ভাড়াঠিক? — মূল অ্যাপ কম্পোনেন্ট।
// গঠন: ওপরে ছোট হেল্পার → PlacePicker → App (স্টেট → হিসাব → হ্যান্ডলার → JSX-এর ধাপগুলো)।
// প্রতিটা বড় অংশের আগে বাংলা বিভাজক-মন্তব্য দেওয়া আছে, যাতে যে কেউ সহজে পড়তে পারে।

import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { PLACES, findPlace, searchPlaces, type Place } from "./data/places";
import { BUS_ROUTES, chartFor } from "./data/busRoutes";
import { METRO_STATIONS, METRO_SCHEDULE, metroFare } from "./data/metro";
import { RATE_SOURCES } from "./data/rates";
import { computeResults, busFareForKm, busKmFor, round5, cngFareForKm, rickshawRangeForKm, roadKm, transferFareFor, type ModeResult } from "./lib/fare";
import { shareFareCard } from "./lib/fareCard";

/** বাংলা সংখ্যা (০-৯) ইংরেজিতে রূপান্তর — বাংলা কীবোর্ডের ইনপুটের জন্য */
const bn2en = (v: string) => v.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
const digitsOnly = (v: string) => bn2en(v).replace(/[^0-9]/g, "");

type Lang = "bn" | "en";
const store = {
  get(k: string): string | null { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  getList(k: string): string[] { try { return JSON.parse(store.get(k) || "[]") as string[]; } catch { return []; } },
};

const MODE_ICON: Record<ModeResult["mode"], string> = {
  bus: "🚌",
  metro: "🚇",
  cng: "🛺",
  rickshaw: "🚲",
};

const POPULAR: Array<[string, string]> = [
  ["mirpur-10", "motijheel"],
  ["uttara", "motijheel"],
  ["gabtoli", "motijheel"],
  ["mohammadpur", "motijheel"],
  ["uttara", "farmgate"],
  ["mirpur-10", "gulistan"],
];

function PlacePicker({
  label,
  value,
  onChange,
  exclude,
  lang,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  exclude: string;
  lang: Lang;
}) {
  const L = lang === "bn";
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const place = findPlace(value);

  // ড্রপডাউন খোলা থাকলে বাইরে ক্লিক বা Escape চাপলেই বন্ধ হবে
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);
  const results = useMemo(() => searchPlaces(q).filter((p) => p.id !== exclude).slice(0, 8), [q, exclude]);

  return (
    <div className="picker" ref={rootRef}>
      <label>{label}</label>
      <button type="button" className="picker-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="picker-name">{L ? place.bn : place.en}</span>
        <span className="picker-en">{L ? place.en : place.bn} ▾</span>
      </button>
      {open && (
        <div className="picker-pop">
          <input
            autoFocus
            placeholder={L ? "এলাকা খুঁজুন… (Mirpur, মিরপুর, mirpur 10)" : "Search area… (Mirpur, মিরপুর)"}
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
          <ul>
            {results.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(p.id);
                    setOpen(false);
                    setQ("");
                  }}
                >
                  <span>{L ? p.bn : p.en}</span>
                  <small>{L ? p.en : p.bn}</small>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="empty">{L ? "পাওয়া যায়নি" : "Not found"}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  // ব্লগ/শেয়ার লিংক থেকে সরাসরি রুট খোলা যায়: ?from=mirpur-10&to=motijheel&lang=en
  // ভুল বা অজানা আইডি এলে নিরাপদ ডিফল্টে ফিরে যাওয়া হয়।
  const params = new URLSearchParams(window.location.search);
  const paramPlace = (key: string, fallback: string) => {
    const v = params.get(key);
    return v && PLACES.some((pl) => pl.id === v) ? v : fallback;
  };
  const [from, setFrom] = useState(() => paramPlace("from", "mirpur-10"));
  const [to, setTo] = useState(() => {
    const f = paramPlace("from", "mirpur-10");
    const t = paramPlace("to", "motijheel");
    return t === f ? (f === "motijheel" ? "gulistan" : "motijheel") : t;
  });
  const [tab, setTab] = useState<"fare" | "check" | "rates">("fare");
  const [chargedMode, setChargedMode] = useState<"bus" | "cng" | "metro" | "rickshaw">("bus");
  const [charged, setCharged] = useState("");
  const [waitMin, setWaitMin] = useState("");
  const [metroCard, setMetroCard] = useState(false);
  const [chartRoute, setChartRoute] = useState<string | null>(null);
  const cardBusy = useRef(false);
  const [lang, setLang] = useState<Lang>(() => (params.get("lang") === "en" || store.get("vt-lang") === "en" ? "en" : "bn"));
  const [theme, setTheme] = useState(() => (store.get("vt-theme") === "dark" ? "dark" : "light"));
  const [favs, setFavs] = useState<string[]>(() => store.getList("vt-favs"));
  const [recent, setRecent] = useState<string[]>(() => store.getList("vt-recent"));
  const [voteX, setVoteX] = useState(() => store.get("vt-vote-x") === "1");
  const L = lang === "bn";
  const nm = (pl: Place) => (L ? pl.bn : pl.en);

  useEffect(() => { document.documentElement.dataset.theme = theme; store.set("vt-theme", theme); }, [theme]);
  useEffect(() => { store.set("vt-lang", lang); }, [lang]);
  useEffect(() => { store.set("vt-favs", JSON.stringify(favs)); }, [favs]);
  useEffect(() => {
    if (from === to) return;
    const key = from + ">" + to;
    setRecent((r) => {
      const next = [key, ...r.filter((k) => k !== key)].slice(0, 6);
      store.set("vt-recent", JSON.stringify(next));
      return next;
    });
  }, [from, to]);

  const pairKey = from + ">" + to;
  const isFav = favs.includes(pairKey);
  function toggleFav() {
    setFavs((f) => (isFav ? f.filter((k) => k !== pairKey) : [pairKey, ...f].slice(0, 8)));
  }
  const transfer = useMemo(() => (from !== to ? transferFareFor(from, to) : null), [from, to]);

  function onWhatsApp(r: ModeResult) {
    const text = L
      ? `ভাড়াঠিক? অনুযায়ী ${fromPlace.bn} → ${toPlace.bn} — ${r.titleBn} ভাড়া ৳${r.fare} (${r.km} কিমি)। নিজে যাচাই করুন: https://cryptowebbuild.github.io/varathik/`
      : `According to VaraThik: ${fromPlace.en} → ${toPlace.en} — ${r.titleEn} fare ৳${r.fare} (${r.km} km). Check yours: https://cryptowebbuild.github.io/varathik/`;
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  }

  const results = useMemo(() => (from !== to ? computeResults(from, to) : []), [from, to]);
  const cheapest = results[0];
  const busResult = results.find((r) => r.mode === "bus");
  const fromPlace = findPlace(from);
  const toPlace = findPlace(to);

  const metroCheck = fromPlace.metro && toPlace.metro ? metroFare(fromPlace.metro, toPlace.metro) : null;
  // নতুন রুটে মেট্রো না থাকলে চেক-ট্যাবের মোড বাসে ফিরিয়ে দাও (না হলে ভাড়া ৳০ ধরে ভুল রায় আসত)
  useEffect(() => {
    if (!metroCheck && chargedMode === "metro") setChargedMode("bus");
  }, [metroCheck, chargedMode]);
  const checkKm = chargedMode === "bus" ? busKmFor(from, to) : chargedMode === "metro" && metroCheck ? metroCheck.km : roadKm(from, to);
  const waitNum = parseInt(waitMin || "0", 10) || 0;
  const rickRange = rickshawRangeForKm(checkKm);
  const fairForCheck =
    chargedMode === "bus" ? busFareForKm(checkKm) :
    chargedMode === "cng" ? cngFareForKm(checkKm, waitNum) :
    chargedMode === "metro" ? (metroCheck?.fare ?? 0) : rickRange.low;
  const chargedNum = parseInt(charged, 10);
  const extra = !isNaN(chargedNum) ? chargedNum - fairForCheck : null;

  async function onShareCard(r: ModeResult) {
    if (cardBusy.current) return;
    cardBusy.current = true;
    try {
      await shareFareCard({
        fromBn: fromPlace.bn,
        toBn: toPlace.bn,
        modeBn: r.titleBn,
        fare: r.fare,
        km: r.km,
        sourceBn:
          r.mode === "metro"
            ? "DMTCL অফিসিয়াল ভাড়া চার্ট"
            : r.mode === "cng"
              ? "BRTA সরকারি মিটার রেট (প্রথম ২ কিমি ৳৪০, এরপর ৳১২/কিমি)"
              : "BRTA মহানগর ভাড়া চার্ট (৳২.৭০/কিমি, সর্বনিম্ন ৳১০)",
      });
    } catch {
      /* ব্যবহারকারী শেয়ার বাতিল করেছেন */
    }
    cardBusy.current = false;
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-tools">
              <button type="button" className="tool-btn" aria-label={L ? "ডার্ক মোড" : "Dark mode"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "☀️" : "🌙"}</button>
              <button type="button" className="tool-btn lang-btn" aria-label="Language" onClick={() => setLang(L ? "en" : "bn")}>{L ? "EN" : "বাংলা"}</button>
            </div>
            <div className="logo">{L ? "ভাড়াঠিক?" : "VaraThik?"}</div>
            <p className="tagline">{L ? "ঠকবেন না, জেনে উঠুন — বাস · মেট্রো · CNG · রিকশার সঠিক ভাড়া এক জায়গায়" : "Know before you ride — the right fare for bus, metro, CNG & rickshaw in one place"}</p>
            <div className="stats">
              <div><strong>{PLACES.length}{L ? "টি" : ""}</strong><span>{L ? "এলাকা" : "areas"}</span></div>
              <div><strong>{BUS_ROUTES.length}{L ? "টি" : ""}</strong><span>{L ? "বাস করিডর" : "bus corridors"}</span></div>
              <div><strong>{METRO_STATIONS.length}{L ? "টি" : ""}</strong><span>{L ? "মেট্রো স্টেশন" : "metro stations"}</span></div>
              <div><strong>{L ? "৪টি" : "4"}</strong><span>{L ? "যানবাহন" : "modes"}</span></div>
            </div>
          </div>

          <div className="hero-panel">
        <div className="search-card">
          <div className="pickers">
            <PlacePicker label={L ? "কোথা থেকে" : "From"} value={from} onChange={setFrom} exclude={to} lang={lang} />
            <button
              type="button"
              className="swap"
              aria-label="অদলবদল"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              ⇄
            </button>
            <PlacePicker label={L ? "কোথায় যাবেন" : "To"} value={to} onChange={setTo} exclude={from} lang={lang} />
          </div>
          <div className="chips">
            <button type="button" className={"fav-btn" + (isFav ? " on" : "")} onClick={toggleFav}>{isFav ? (L ? "⭐ প্রিয় রুট" : "⭐ Favourite") : (L ? "☆ প্রিয় করুন" : "☆ Save route")}</button>
            {POPULAR.map(([a, b]) => (
              <button
                key={a + b}
                type="button"
                onClick={() => {
                  setFrom(a);
                  setTo(b);
                  setTab("fare");
                }}
              >
                {nm(findPlace(a))} → {nm(findPlace(b))}
              </button>
            ))}
          </div>
          {(favs.length > 0 || recent.some((k) => k !== pairKey)) && (
            <div className="chips sub">
              {favs.map((k) => { const [a, b] = k.split(">"); return (
                <button key={"f" + k} type="button" onClick={() => { setFrom(a); setTo(b); setTab("fare"); }}>⭐ {nm(findPlace(a))} → {nm(findPlace(b))}</button> ); })}
              {recent.filter((k) => k !== pairKey && !favs.includes(k)).slice(0, 3).map((k) => { const [a, b] = k.split(">"); return (
                <button key={"r" + k} type="button" onClick={() => { setFrom(a); setTo(b); setTab("fare"); }}>🕘 {nm(findPlace(a))} → {nm(findPlace(b))}</button> ); })}
            </div>
          )}
        </div>

        <nav className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "fare"} className={tab === "fare" ? "on" : ""} onClick={() => setTab("fare")}>{L ? "ভাড়া দেখুন" : "Check fare"}</button>
          <button role="tab" aria-selected={tab === "check"} className={tab === "check" ? "on" : ""} onClick={() => setTab("check")}>{L ? "বেশি নিয়েছে?" : "Overcharged?"}</button>
          <button role="tab" aria-selected={tab === "rates"} className={tab === "rates" ? "on" : ""} onClick={() => setTab("rates")}>{L ? "সরকারি রেট" : "Official rates"}</button>
        </nav>
          </div>
        </div>
      </header>

      <main>
        {/* ===== ভোটের আহ্বান ব্যানার ===== */}
        {!voteX && (
          <div className="vote-banner">
            <span>{L ? "❤️ অ্যাপটা কাজে লাগছে? Arohon 'Build for Bangladesh'-এ ভাড়াঠিক? টপ-৩-তে আছে — একটা ভোট দিয়ে টপ-২-এ তুলুন!" : "❤️ Finding this useful? VaraThik is in the top 3 on the Arohon 'Build for Bangladesh' leaderboard — one vote lifts it into the top 2!"}</span>
            <a href="https://arohon.co/challenges/build-for-bangladesh" target="_blank" rel="noreferrer">{L ? "🗳️ ভোট দিন" : "🗳️ Vote now"}</a>
            <button type="button" aria-label={L ? "বন্ধ করুন" : "Close"} onClick={() => { setVoteX(true); store.set("vt-vote-x", "1"); }}>×</button>
          </div>
        )}
        {/* ===== ট্যাব ১: ভাড়া দেখুন ===== */}
        {tab === "fare" && (
          <section className="results" aria-live="polite">
            {from === to ? (
              <p className="notice">{L ? "শুরু আর গন্তব্য আলাদা এলাকা বেছে নিন।" : "Please pick two different areas."}</p>
            ) : (
              <>
                <h2>
                  {nm(fromPlace)} → {nm(toPlace)}
                  {cheapest && <span className="best"> · {L ? "সবচেয়ে সস্তা" : "Cheapest"}: {L ? cheapest.titleBn : cheapest.titleEn} ৳{cheapest.fare}</span>}
                </h2>
                {results.some((r) => r.mode === "metro") && (
                  <label className="card-toggle">
                    <input type="checkbox" checked={metroCard} onChange={(e) => setMetroCard(e.currentTarget.checked)} />
                    <span>{L ? "💳 MRT Pass / Rapid Pass আছে — মেট্রো ভাড়ায় ১০% ছাড় দেখান" : "💳 I have an MRT / Rapid Pass — show the 10% metro discount"}</span>
                  </label>
                )}
                <div className="cards-grid">
                {results.map((r) => {
                  const isMetro = r.mode === "metro";
                  const fare = isMetro && metroCard ? Math.round(r.fare * 0.9) : r.fare;
                  const shown: ModeResult = {
                    ...r,
                    fare,
                    fareNote: isMetro && metroCard ? (L ? `কার্ড ছাড়ে ৳${r.fare - fare} সাশ্রয়` : r.fareNote) : r.fareNote,
                    fareNoteEn: isMetro && metroCard ? `Save ৳${r.fare - fare} with the card` : r.fareNoteEn,
                  };
                  return (
                  <article key={r.mode} className={"mode-card" + (r === cheapest ? " cheapest" : "")}>
                    {r === cheapest && <span className="best-pill">⭐ {L ? "সবচেয়ে সস্তা" : "Cheapest"}</span>}
                    <div className="mode-head">
                      <span className="mode-icon">{MODE_ICON[r.mode]}</span>
                      <div>
                        <h3>{L ? shown.titleBn : shown.titleEn}</h3>
                        <p>{L ? shown.detailBn : shown.detailEn}</p>
                      </div>
                      {shown.official ? <span className="badge official">{L ? "সরকারি রেট" : "Official"}</span> : <span className="badge est">{L ? "আনুমানিক" : "Estimate"}</span>}
                    </div>
                    <div className="mode-stats">
                      <div className="fare">
                        ৳{shown.fare}
                        {(L ? shown.fareNote : shown.fareNoteEn) && <small>{L ? shown.fareNote : shown.fareNoteEn}</small>}
                    {shown.mode === "bus" && shown.fare % 5 !== 0 && (
                      <small>{L ? `বাসে সাধারণত ৳৫ রাউন্ডে ৳${round5(shown.fare)} নেওয়া হয়` : `Buses usually round to ৳${round5(shown.fare)}`}</small>
                    )}
                      </div>
                      <div className="meta">
                        <span>{shown.km} {L ? "কিমি" : "km"}</span>
                        <span>~{shown.minutes} {L ? "মিনিট" : "min"}</span>
                      </div>
                    </div>
                    {shown.buses && shown.buses.length > 0 && (
                      <div className="bus-list">
                        {shown.buses.slice(0, 3).map((b) => (
                          <div key={b.route.id} className="bus-row">
                            <strong>{L ? b.route.nameBn : `${findPlace(b.directionStops[0]).en} — ${findPlace(b.directionStops[b.directionStops.length - 1]).en} corridor`}</strong>
                            <span>{b.directionStops.map((s) => nm(findPlace(s))).join(" → ")}</span>
                            <span className="bus-fare">৳{busFareForKm(b.km)} · {b.km} {L ? "কিমি" : "km"}</span>
                            <button
                              type="button"
                              className="chart-btn"
                              onClick={() => setChartRoute(chartRoute === b.route.id ? null : b.route.id)}
                            >
                              📋 {chartRoute === b.route.id ? (L ? "চার্ট লুকান" : "Hide chart") : (L ? `${fromPlace.bn} থেকে পুরো রুটের ভাড়া চার্ট` : `Full fare chart from ${fromPlace.en}`)}
                            </button>
                            {chartRoute === b.route.id && (
                              <>
                              <div className="route-line">
                                {chartFor(b).map((row, i) => (
                                  <div key={row.stopId} className={"rl-stop" + (row.stopId === to ? " dest" : "") + (i === 0 ? " start" : "")}>
                                    <i></i><span>{nm(findPlace(row.stopId))}</span>
                                  </div>
                                ))}
                              </div>
                              <table className="chart-table">
                                <thead>
                                  <tr><th>{L ? "স্টপ" : "Stop"}</th><th>{L ? "দূরত্ব" : "Distance"}</th><th>{L ? "ভাড়া" : "Fare"}</th></tr>
                                </thead>
                                <tbody>
                                  {chartFor(b).map((row) => (
                                    <tr key={row.stopId} className={row.stopId === to ? "dest" : ""}>
                                      <td>{nm(findPlace(row.stopId))}</td>
                                      <td>{row.km} {L ? "কিমি" : "km"}</td>
                                      <td>৳{row.fare}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              </>
                            )}
                            {chartRoute === b.route.id && <p className="chart-note">{L ? "BRTA রেটে তৈরি স্টপ-ভিত্তিক চার্ট · বাসে ভাড়া সাধারণত ৳৫-এর রাউন্ডে নেওয়া হয়" : "Stop-by-stop chart at the BRTA rate · buses usually round fares to the nearest ৳5"}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                    {r.mode === "metro" && <p className="sched">🕒 {L ? METRO_SCHEDULE.bn : METRO_SCHEDULE.en}</p>}
                    {r.official && (
                      <div className="card-actions">
                        <button type="button" className="share-btn" onClick={() => onShareCard(shown)}>
                          {L ? "📤 ভাড়া কার্ড শেয়ার করুন — কন্ডাক্টর/ড্রাইভারকে দেখান" : "📤 Share fare card — show the conductor/driver"}
                        </button>
                        <button type="button" className="wa-btn" aria-label="WhatsApp" onClick={() => onWhatsApp(shown)}><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg><span>{L ? "শেয়ার" : "Share"}</span></button>
                      </div>
                    )}
                  </article>
                  );
                })}
                </div>
                <div className="trust">
                  <span>🛡️ {L ? "সূত্র: BRTA · DMTCL · Rapid Pass" : "Sources: BRTA · DMTCL · Rapid Pass"}</span>
                  <span>{L ? "রেট আপডেট: নভেম্বর ২০২৬" : "Rates updated: November 2026"}</span>
                </div>
                <div className="how">
                  <div><strong>{L ? "১ · রুট বাছুন" : "1 · Pick a route"}</strong><span>{L ? `যেকোনো দুই এলাকা — ${PLACES.length}টি জায়গা থেকে` : `Any two areas — from ${PLACES.length} places`}</span></div>
                  <div><strong>{L ? "২ · সঠিক ভাড়া দেখুন" : "2 · See the right fare"}</strong><span>{L ? "BRTA ও DMTCL-এর সরকারি রেটে হিসাব" : "Calculated at official BRTA & DMTCL rates"}</span></div>
                  <div><strong>{L ? "৩ · কার্ড দেখান" : "3 · Show the card"}</strong><span>{L ? "ভাড়া কার্ড শেয়ার করে বেশি ভাড়া ঠেকান" : "Share the fare card to stop overcharging"}</span></div>
                </div>
                {cheapest && (
                  <div className="monthly">
                    <strong>{L ? "🧮 প্রতিদিন এই রুটে যাতায়াত করলে" : "🧮 If you commute this route daily"}</strong>
                    <p>
                      {L ? cheapest.titleBn : cheapest.titleEn}: {L ? `একমুখী ৳${cheapest.fare} · যাওয়া-আসা ৳${cheapest.fare * 2}/দিন · মাসে (২৬ কর্মদিবস)` : `one-way ৳${cheapest.fare} · return ৳${cheapest.fare * 2}/day · monthly (26 workdays)`} <b>৳{cheapest.fare * 52}</b>
                    </p>
                    {(() => {
                      const m = results.find((x) => x.mode === "metro");
                      if (!m) return null;
                      const cardFare = Math.round(m.fare * 0.9);
                      return metroCard ? (
                        <p>{L ? `মেট্রো কার্ডে: যাওয়া-আসা ৳${cardFare * 2}/দিন · মাসে ৳${cardFare * 52} — কার্ড ছাড়াই বাঁচছে প্রতি মাসে ৳${(m.fare - cardFare) * 52}।` : `With a metro card: return ৳${cardFare * 2}/day · ৳${cardFare * 52}/month — the card already saves you ৳${(m.fare - cardFare) * 52} every month.`}</p>
                      ) : (
                        <p>{L ? `টিপস: মেট্রোতে MRT/Rapid Pass নিলে মাসে আরও ৳${(m.fare - cardFare) * 52} বাঁচবে (প্রতি যাত্রায় ১০% ছাড়)।` : `Tip: an MRT/Rapid Pass saves another ৳${(m.fare - cardFare) * 52} a month on the metro (10% off every ride).`}</p>
                      );
                    })()}
                  </div>
                )}
                {/* বদলি কার্ড: সরাসরি বাস না থাকলে, অথবা বদলিতে ভাড়া কম হলেই শুধু দেখাও */}
                {transfer && busResult && (!busResult.buses?.length || transfer.totalFare < busResult.fare) && (
                  <div className="transfer">
                    <strong>{L ? "🔁 বদলি করে গেলে" : "🔁 With one transfer"}</strong>
                    <p>{L ? `${transfer.firstRouteBn}: ${fromPlace.bn} → ${transfer.transferBn} (৳${transfer.fareFirst}) · তারপর ${transfer.secondRouteBn}: ${transfer.transferBn} → ${toPlace.bn} (৳${transfer.fareSecond})` : `${fromPlace.en} → ${transfer.transferEn} (৳${transfer.fareFirst}), then ${transfer.transferEn} → ${toPlace.en} (৳${transfer.fareSecond})`}</p>
                    <p>{L ? `মোট ভাড়া ৳${transfer.totalFare} (দুই টিকিট) · মোট দূরত্ব ${transfer.totalKm} কিমি` : `Total fare ৳${transfer.totalFare} (two tickets) · ${transfer.totalKm} km in all`}</p>
                  </div>
                )}
                <p className="fineprint">
                  {L ? "বাসের ভাড়া BRTA রেটে (৳২.৭০/কিমি, সর্বনিম্ন ৳১০) হিসাব করা। কোনো কোনো অপারেটরের নিজস্ব চার্টে ১–২ টাকা এদিক-সেদিক হতে পারে।" : "Bus fares are calculated at the BRTA rate (৳2.70/km, minimum ৳10). Some operators' own charts may differ by a taka or two."}
                </p>
              </>
            )}
          </section>
        )}

        {/* ===== ট্যাব ২: বেশি নিয়েছে? ===== */}
        {tab === "check" && (
          <section className="check">
            <h2>{nm(fromPlace)} → {nm(toPlace)} — {L ? "কত নেওয়া উচিত ছিল?" : "What should it have cost?"}</h2>
            <div className="check-modes">
              <button className={chargedMode === "bus" ? "on" : ""} onClick={() => setChargedMode("bus")}>{L ? "🚌 বাস" : "🚌 Bus"}</button>
              <button className={chargedMode === "cng" ? "on" : ""} onClick={() => setChargedMode("cng")}>{L ? "🛺 CNG (মিটার)" : "🛺 CNG (Meter)"}</button>
              {metroCheck && <button className={chargedMode === "metro" ? "on" : ""} onClick={() => setChargedMode("metro")}>{L ? "🚇 মেট্রো" : "🚇 Metro"}</button>}
              <button className={chargedMode === "rickshaw" ? "on" : ""} onClick={() => setChargedMode("rickshaw")}>{L ? "🚲 রিকশা" : "🚲 Rickshaw"}</button>
            </div>
            <label className="charged-label">
              {L ? "আপনার কাছ থেকে কত টাকা নিয়েছে?" : "How much were you charged?"}
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={L ? "যেমন: ৫০" : "e.g. 50"}
                value={charged}
                onChange={(e) => setCharged(digitsOnly(e.currentTarget.value))}
              />
            </label>
            {chargedMode === "cng" && (
              <label className="charged-label">
                {L ? "জ্যামে কত মিনিট দাঁড়িয়েছিল? (ঐচ্ছিক — মিটারে অপেক্ষা-চার্জ বৈধ)" : "Minutes stuck in traffic? (optional — meter waiting charge is legal)"}
                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={L ? "যেমন: ১০" : "e.g. 10"}
                  value={waitMin}
                  onChange={(e) => setWaitMin(digitsOnly(e.currentTarget.value))}
                />
              </label>
            )}
            {charged === "" && <p className="fineprint">{L ? "সংখ্যায় টাকার পরিমাণ লিখুন — বাংলা (৫০) বা ইংরেজি (50), দুটোই চলবে।" : "Type the amount — Bengali (৫০) or English (50) digits both work."}</p>}
            {extra !== null && chargedMode !== "rickshaw" && (
              <>
              <div className="bars">
                <div className="bar-row">
                  <span>{L ? "ন্যায্য ভাড়া" : "Fair fare"} ৳{fairForCheck}</span>
                  <div className="bar"><i style={{ width: `${Math.max(8, Math.round((fairForCheck / Math.max(fairForCheck, chargedNum)) * 100))}%` }} /></div>
                </div>
                <div className="bar-row">
                  <span>{L ? "নিয়েছে" : "Charged"} ৳{chargedNum}</span>
                  <div className={"bar" + (extra > 0 ? " over" : "")}><i style={{ width: `${Math.max(8, Math.round((chargedNum / Math.max(fairForCheck, chargedNum)) * 100))}%` }} /></div>
                </div>
              </div>
              <div className={"verdict " + (extra > 0 && chargedNum > round5(fairForCheck) ? "bad" : "good")} aria-live="polite">
                {extra <= 0 ? (
                  <>
                    <strong>{L ? "ভাড়া ঠিক আছে ✓" : "The fare was fair ✓"}</strong>
                    <p>{L ? `সরকারি ভাড়া ৳${fairForCheck} (${checkKm} কিমি) — আপনার দেওয়া ভাড়া এর বেশি নয়।` : `The official fare is ৳${fairForCheck} (${checkKm} km) — you paid no more than that.`}{chargedMode === "metro" && (L ? " কার্ড (MRT/Rapid Pass) থাকলে আরও ১০% কম লাগত।" : " With an MRT/Rapid Pass card it would have been 10% less.")}</p>
                  </>
                ) : chargedNum <= round5(fairForCheck) ? (
                  <>
                    <strong>{L ? "প্রায় ঠিক আছে ✓" : "Close enough ✓"}</strong>
                    <p>{L ? `সরকারি হিসাব ৳${fairForCheck} (${checkKm} কিমি) — বাসে ভাড়া সাধারণত ৳৫-এ রাউন্ড হয়, তাই ৳${round5(fairForCheck)} পর্যন্ত স্বাভাবিক।` : `The official fare is ৳${fairForCheck} (${checkKm} km) — buses usually round to the nearest ৳5, so up to ৳${round5(fairForCheck)} is normal.`}</p>
                  </>
                ) : (
                  <>
                    <strong>{L ? `৳${extra} বেশি নিয়েছে!` : `Overcharged by ৳${extra}!`}</strong>
                    <p>{L ? `সরকারি ভাড়া ছিল ৳${fairForCheck} (${checkKm} কিমি)। পরের বার ওঠার আগেই ভাড়া কার্ডটা দেখিয়ে নিন।` : `The official fare was ৳${fairForCheck} (${checkKm} km). Next time, show the fare card before you ride.`}</p>
                    <button
                      type="button"
                      className="share-btn"
                      onClick={() =>
                        onShareCard({
                          mode: chargedMode,
                          titleBn: chargedMode === "bus" ? "লোকাল বাস" : chargedMode === "cng" ? "CNG অটোরিকশা (মিটার)" : "মেট্রোরেল (MRT-6)",
                          titleEn: chargedMode === "bus" ? "Local Bus" : chargedMode === "cng" ? "CNG Auto-rickshaw (Meter)" : "Metro Rail (MRT-6)",
                          fare: fairForCheck,
                          km: checkKm,
                          minutes: 0,
                          official: true,
                          detailBn: "",
                          detailEn: "",
                        })
                      }
                    >
                      {L ? "📤 সঠিক ভাড়ার কার্ড শেয়ার করুন" : "📤 Share the correct fare card"}
                    </button>
                  </>
                )}
              </div>
              </>
            )}
            {extra !== null && chargedMode === "rickshaw" && (
              <div className={"verdict " + (chargedNum > rickRange.high ? "bad" : "good")} aria-live="polite">
                {chargedNum > rickRange.high ? (
                  <>
                    <strong>{L ? `বাজার রেঞ্জের চেয়ে ৳${chargedNum - rickRange.high} বেশি!` : `৳${chargedNum - rickRange.high} above the market range!`}</strong>
                    <p>{L ? `এই দূরত্বে (${checkKm} কিমি) চলতি বাজার রেঞ্জ ৳${rickRange.low}–${rickRange.high}। রিকশার সরকারি রেট নেই — ওঠার আগে দর ঠিক করে নিন।` : `For this distance (${checkKm} km) the going range is ৳${rickRange.low}–${rickRange.high}. Rickshaws have no official rate — agree the fare before you ride.`}</p>
                  </>
                ) : chargedNum < rickRange.low ? (
                  <>
                    <strong>{L ? "রেঞ্জের চেয়েও কমে পেয়েছেন ✓" : "You paid below the range ✓"}</strong>
                    <p>{L ? `এই দূরত্বে (${checkKm} কিমি) চলতি বাজার রেঞ্জ ৳${rickRange.low}–${rickRange.high}।` : `For this distance (${checkKm} km) the going range is ৳${rickRange.low}–${rickRange.high}.`}</p>
                  </>
                ) : (
                  <>
                    <strong>{L ? "বাজার রেঞ্জের মধ্যে আছে ✓" : "Within the market range ✓"}</strong>
                    <p>{L ? `এই দূরত্বে (${checkKm} কিমি) চলতি বাজার রেঞ্জ ৳${rickRange.low}–${rickRange.high} — আপনার ভাড়া এর মধ্যেই।` : `For this distance (${checkKm} km) the going range is ৳${rickRange.low}–${rickRange.high} — your fare is inside it.`}</p>
                  </>
                )}
              </div>
            )}
          </section>
        )}

        {/* ===== ট্যাব ৩: সরকারি রেট ===== */}
        {tab === "rates" && (
          <section className="rates">
            <h2>{L ? "সরকারি ভাড়ার রেট ও সূত্র" : "Official fare rates & sources"}</h2>
            {RATE_SOURCES.map((r) => (
              <article key={r.mode} className="rate-card">
                <h3>
                  {L ? r.labelBn : r.labelEn}
                  {r.official ? <span className="badge official">{L ? "অফিসিয়াল" : "Official"}</span> : <span className="badge est">{L ? "অফিসিয়াল নয়" : "Not official"}</span>}
                </h3>
                <p className="formula">{L ? r.formulaBn : r.formulaEn}</p>
                <p className="source">{L ? "সূত্র" : "Source"}: {r.source}</p>
                <p className="source">{L ? "কার্যকর" : "Effective"}: {r.effectiveFrom}</p>
              </article>
            ))}
            <article className="rate-card">
              <h3>{L ? "মেট্রো কার্ড ছাড়" : "Metro card discount"} <span className="badge official">{L ? "অফিসিয়াল" : "Official"}</span></h3>
              <p className="formula">{L ? "MRT Pass / Rapid Pass-এ সব মেট্রো ভাড়ায় ১০% ছাড়" : "10% off every metro fare with MRT Pass / Rapid Pass"}</p>
              <p className="source">{L ? "সূত্র: DMTCL / Rapid Pass (DTCA) — যেমন পূর্ণ রুট ৳১০০-এর বদলে ৳৯০" : "Source: DMTCL / Rapid Pass (DTCA) — e.g. the full route costs ৳90 instead of ৳100"}</p>
            </article>
            <article className="rate-card">
              <h3>{L ? "মেট্রোর সময়সূচি" : "Metro schedule"} <span className="badge official">{L ? "অফিসিয়াল" : "Official"}</span></h3>
              <p className="formula">{L ? METRO_SCHEDULE.bn : METRO_SCHEDULE.en}</p>
              <p className="source">{L ? "সূত্র: DMTCL প্রকাশিত সময়সূচি (পরিবর্তন হতে পারে)" : "Source: DMTCL published timetable (subject to change)"}</p>
            </article>
            <p className="fineprint">
              {L ? "ভাড়াঠিক কোনো সরকারি প্রতিষ্ঠান নয়। ভাড়াগুলো উপরের প্রকাশিত সরকারি রেট থেকে হিসাব করা — যাচাই করতে সূত্রের ওয়েবসাইট দেখুন।" : "VaraThik is not a government body. Fares are calculated from the published official rates above — check the source websites to verify."}
            </p>
          </section>
        )}
      </main>

      {/* ===== ফুটার: QR, কৃতিত্ব ===== */}
      <footer>
        <div className="qr-block">
          <img src={import.meta.env.BASE_URL + "qr.svg"} alt="ভাড়াঠিক অ্যাপের QR কোড" width="92" height="92" />
          <div>
            <strong>{L ? "মোবাইলে স্ক্যান করে খুলুন" : "Scan to open on your phone"}</strong>
            <span>{L ? "যাত্রাপথে ফোনেই ভাড়া যাচাই করুন — ইন্সটল ছাড়াই চলে" : "Check fares on the go — no install needed"}</span>
          </div>
        </div>
        <p>{L ? "ভাড়াঠিক? — Build for Bangladesh চ্যালেঞ্জের জন্য তৈরি · ডেটা: BRTA, DMTCL, OpenStreetMap" : "VaraThik — built for the Build for Bangladesh challenge · Data: BRTA, DMTCL, OpenStreetMap"}</p>
        <p><a href={import.meta.env.BASE_URL + "blog/"}>{L ? "📚 ভাড়া গাইড ও ব্লগ — বাস, মেট্রো, CNG, রিকশার পূর্ণ চার্ট" : "📚 Fare guides & blog — full bus, metro, CNG & rickshaw charts"}</a></p>
        <p className="places-count">{L ? `এখন ${PLACES.length}টি এলাকা · ${BUS_ROUTES.length}টি বাস করিডর · ঢাকা শহর · ` : `Now ${PLACES.length} areas · ${BUS_ROUTES.length} bus corridors · Dhaka · `}<a href="https://github.com/cryptowebbuild/varathik" target="_blank" rel="noreferrer">{L ? "GitHub-এ কোড দেখুন" : "View the code on GitHub"}</a></p>
        <a className="credit" href="https://cryptowebbuild.com/" target="_blank" rel="noreferrer">
          <span className="credit-top">{L ? "⚡ তৈরি ও পরিচালনায়" : "⚡ Built & run by"}</span>
          <strong>CryptoWebBuild.com</strong>
          <span className="credit-sub">{L ? "Sub-second ওয়েবসাইট · ১-ক্লিক ই-কমার্স স্টোর · 100/100 SEO" : "Sub-second websites · 1-click e-commerce stores · 100/100 SEO"}</span>
        </a>
      </footer>
    </div>
  );
}
