import { useMemo, useRef, useState } from "preact/hooks";
import { PLACES, findPlace, searchPlaces } from "./data/places";
import { BUS_ROUTES } from "./data/busRoutes";
import { METRO_STATIONS } from "./data/metro";
import { RATE_SOURCES } from "./data/rates";
import { computeResults, busFareForKm, cngFareForKm, roadKm, type ModeResult } from "./lib/fare";
import { shareFareCard } from "./lib/fareCard";

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
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  exclude: string;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const place = findPlace(value);
  const results = useMemo(() => searchPlaces(q).filter((p) => p.id !== exclude).slice(0, 8), [q, exclude]);

  return (
    <div className="picker">
      <label>{label}</label>
      <button type="button" className="picker-btn" onClick={() => setOpen(!open)}>
        <span className="picker-name">{place.bn}</span>
        <span className="picker-en">{place.en} ▾</span>
      </button>
      {open && (
        <div className="picker-pop">
          <input
            autoFocus
            placeholder="এলাকা খুঁজুন… (Mirpur, মিরপুর, mirpur 10)"
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
                  <span>{p.bn}</span>
                  <small>{p.en}</small>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="empty">পাওয়া যায়নি</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [from, setFrom] = useState("mirpur-10");
  const [to, setTo] = useState("motijheel");
  const [tab, setTab] = useState<"fare" | "check" | "rates">("fare");
  const [chargedMode, setChargedMode] = useState<"bus" | "cng">("bus");
  const [charged, setCharged] = useState("");
  const cardBusy = useRef(false);

  const results = useMemo(() => (from !== to ? computeResults(from, to) : []), [from, to]);
  const cheapest = results[0];
  const fromPlace = findPlace(from);
  const toPlace = findPlace(to);

  const checkKm = roadKm(from, to);
  const fairForCheck = chargedMode === "bus" ? busFareForKm(checkKm) : cngFareForKm(checkKm);
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
            <div className="logo">ভাড়াঠিক?</div>
            <p className="tagline">ঠকবেন না, জেনে উঠুন — বাস · মেট্রো · CNG · রিকশার সঠিক ভাড়া এক জায়গায়</p>
            <div className="stats">
              <div><strong>{PLACES.length}টি</strong><span>এলাকা</span></div>
              <div><strong>{BUS_ROUTES.length}টি</strong><span>বাস করিডর</span></div>
              <div><strong>{METRO_STATIONS.length}টি</strong><span>মেট্রো স্টেশন</span></div>
              <div><strong>৪টি</strong><span>যানবাহন</span></div>
            </div>
          </div>

          <div className="hero-panel">
        <div className="search-card">
          <div className="pickers">
            <PlacePicker label="কোথা থেকে" value={from} onChange={setFrom} exclude={to} />
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
            <PlacePicker label="কোথায় যাবেন" value={to} onChange={setTo} exclude={from} />
          </div>
          <div className="chips">
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
                {findPlace(a).bn} → {findPlace(b).bn}
              </button>
            ))}
          </div>
        </div>

        <nav className="tabs">
          <button className={tab === "fare" ? "on" : ""} onClick={() => setTab("fare")}>ভাড়া দেখুন</button>
          <button className={tab === "check" ? "on" : ""} onClick={() => setTab("check")}>বেশি নিয়েছে?</button>
          <button className={tab === "rates" ? "on" : ""} onClick={() => setTab("rates")}>সরকারি রেট</button>
        </nav>
          </div>
        </div>
      </header>

      <main>
        {tab === "fare" && (
          <section className="results">
            {from === to ? (
              <p className="notice">শুরু আর গন্তব্য আলাদা এলাকা বেছে নিন।</p>
            ) : (
              <>
                <h2>
                  {fromPlace.bn} → {toPlace.bn}
                  {cheapest && <span className="best"> · সবচেয়ে সস্তা: {cheapest.titleBn} ৳{cheapest.fare}</span>}
                </h2>
                <div className="cards-grid">
                {results.map((r) => (
                  <article key={r.mode} className={"mode-card" + (r === cheapest ? " cheapest" : "")}>
                    <div className="mode-head">
                      <span className="mode-icon">{MODE_ICON[r.mode]}</span>
                      <div>
                        <h3>{r.titleBn}</h3>
                        <p>{r.detailBn}</p>
                      </div>
                      {r.official ? <span className="badge official">সরকারি রেট</span> : <span className="badge est">আনুমানিক</span>}
                    </div>
                    <div className="mode-stats">
                      <div className="fare">
                        ৳{r.fare}
                        {r.fareNote && <small>{r.fareNote}</small>}
                      </div>
                      <div className="meta">
                        <span>{r.km} কিমি</span>
                        <span>~{r.minutes} মিনিট</span>
                      </div>
                    </div>
                    {r.buses && r.buses.length > 0 && (
                      <div className="bus-list">
                        {r.buses.slice(0, 3).map((b) => (
                          <div key={b.route.id} className="bus-row">
                            <strong>{b.route.nameBn}</strong>
                            <span>{b.directionStops.map((s) => findPlace(s).bn).join(" → ")}</span>
                            <span className="bus-fare">৳{busFareForKm(b.km)} · {b.km} কিমি</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {r.official && (
                      <button type="button" className="share-btn" onClick={() => onShareCard(r)}>
                        📤 ভাড়া কার্ড শেয়ার করুন — কন্ডাক্টর/ড্রাইভারকে দেখান
                      </button>
                    )}
                  </article>
                ))}
                </div>
                <div className="how">
                  <div><strong>১ · রুট বাছুন</strong><span>যেকোনো দুই এলাকা — {PLACES.length}টি জায়গা থেকে</span></div>
                  <div><strong>২ · সঠিক ভাড়া দেখুন</strong><span>BRTA ও DMTCL-এর সরকারি রেটে হিসাব</span></div>
                  <div><strong>৩ · কার্ড দেখান</strong><span>ভাড়া কার্ড শেয়ার করে বেশি ভাড়া ঠেকান</span></div>
                </div>
                <p className="fineprint">
                  বাসের ভাড়া BRTA রেটে (৳২.৭০/কিমি, সর্বনিম্ন ৳১০) হিসাব করা। কোনো কোনো অপারেটরের নিজস্ব চার্টে ১–২ টাকা এদিক-সেদিক হতে পারে।
                </p>
              </>
            )}
          </section>
        )}

        {tab === "check" && (
          <section className="check">
            <h2>{fromPlace.bn} → {toPlace.bn} — কত নেওয়া উচিত ছিল?</h2>
            <div className="check-modes">
              <button className={chargedMode === "bus" ? "on" : ""} onClick={() => setChargedMode("bus")}>🚌 বাস</button>
              <button className={chargedMode === "cng" ? "on" : ""} onClick={() => setChargedMode("cng")}>🛺 CNG (মিটার)</button>
            </div>
            <label className="charged-label">
              আপনার কাছ থেকে কত টাকা নিয়েছে?
              <input
                inputMode="numeric"
                placeholder="যেমন: ৫০"
                value={charged}
                onChange={(e) => setCharged(e.currentTarget.value.replace(/[^0-9]/g, ""))}
              />
            </label>
            {extra !== null && (
              <>
              <div className="bars">
                <div className="bar-row">
                  <span>ন্যায্য ভাড়া ৳{fairForCheck}</span>
                  <div className="bar"><i style={{ width: `${Math.max(8, Math.round((fairForCheck / Math.max(fairForCheck, chargedNum)) * 100))}%` }} /></div>
                </div>
                <div className="bar-row">
                  <span>নিয়েছে ৳{chargedNum}</span>
                  <div className={"bar" + (extra > 0 ? " over" : "")}><i style={{ width: `${Math.max(8, Math.round((chargedNum / Math.max(fairForCheck, chargedNum)) * 100))}%` }} /></div>
                </div>
              </div>
              <div className={"verdict " + (extra > 0 ? "bad" : "good")}>
                {extra > 0 ? (
                  <>
                    <strong>৳{extra} বেশি নিয়েছে!</strong>
                    <p>সরকারি ভাড়া ছিল ৳{fairForCheck} ({checkKm} কিমি)। পরের বার ওঠার আগেই ভাড়া কার্ডটা দেখিয়ে নিন।</p>
                    <button
                      type="button"
                      className="share-btn"
                      onClick={() =>
                        onShareCard({
                          mode: chargedMode,
                          titleBn: chargedMode === "bus" ? "লোকাল বাস" : "CNG অটোরিকশা (মিটার)",
                          fare: fairForCheck,
                          km: checkKm,
                          minutes: 0,
                          official: true,
                          detailBn: "",
                        })
                      }
                    >
                      📤 সঠিক ভাড়ার কার্ড শেয়ার করুন
                    </button>
                  </>
                ) : (
                  <>
                    <strong>ভাড়া ঠিক আছে ✓</strong>
                    <p>সরকারি ভাড়া ৳{fairForCheck} ({checkKm} কিমি) — আপনার দেওয়া ভাড়া এর বেশি নয়।</p>
                  </>
                )}
              </div>
              </>
            )}
          </section>
        )}

        {tab === "rates" && (
          <section className="rates">
            <h2>সরকারি ভাড়ার রেট ও সূত্র</h2>
            {RATE_SOURCES.map((r) => (
              <article key={r.mode} className="rate-card">
                <h3>
                  {r.labelBn}
                  {r.official ? <span className="badge official">অফিসিয়াল</span> : <span className="badge est">অফিসিয়াল নয়</span>}
                </h3>
                <p className="formula">{r.formulaBn}</p>
                <p className="source">সূত্র: {r.source}</p>
                <p className="source">কার্যকর: {r.effectiveFrom}</p>
              </article>
            ))}
            <p className="fineprint">
              ভাড়াঠিক কোনো সরকারি প্রতিষ্ঠান নয়। ভাড়াগুলো উপরের প্রকাশিত সরকারি রেট থেকে হিসাব করা — যাচাই করতে সূত্রের ওয়েবসাইট দেখুন।
            </p>
          </section>
        )}
      </main>

      <footer>
        <p>ভাড়াঠিক? — Build for Bangladesh চ্যালেঞ্জের জন্য তৈরি · ডেটা: BRTA, DMTCL, OpenStreetMap</p>
        <p className="places-count">এখন {PLACES.length}টি এলাকা · {BUS_ROUTES.length}টি বাস করিডর · ঢাকা শহর · <a href="https://github.com/cryptowebbuild/varathik" target="_blank" rel="noreferrer">GitHub-এ কোড দেখুন</a></p>
        <a className="credit" href="https://cryptowebbuild.com/" target="_blank" rel="noreferrer">
          <span className="credit-top">⚡ তৈরি ও পরিচালনায়</span>
          <strong>CryptoWebBuild.com</strong>
          <span className="credit-sub">Sub-second ওয়েবসাইট · ১-ক্লিক ই-কমার্স স্টোর · 100/100 SEO</span>
        </a>
      </footer>
    </div>
  );
}
