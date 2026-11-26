// ভাড়াঠিক? — UI রানটাইম পরীক্ষা (CDP দিয়ে আসল Chrome-এ ক্লিক/টাইপ করে যাচাই)।
// কনসোল এরর, ট্যাব বদল, যাচাই-ট্যাবের রায়, ভাষা/থিম টগল, পিকার সার্চ — সব চেক করে।
import { spawn } from "node:child_process";

const CHROME = "/home/hatch/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome";
const BASE = "http://localhost:4173";
const PORT = 9333;

const chrome = spawn(CHROME, [
  "--headless=new", "--no-sandbox", "--disable-gpu",
  `--remote-debugging-port=${PORT}`, "--remote-debugging-address=127.0.0.1",
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitJson(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return await r.json(); } catch {}
    await sleep(250);
  }
  throw new Error("CDP endpoint not ready: " + url);
}

const errors = [];
const results = [];
const check = (name, ok, extra = "") => results.push(`${ok ? "✓" : "✗ FAIL"} ${name} ${extra}`);

let ws, msgId = 0;
const pending = new Map();
function send(method, params = {}) {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
}
async function ev(expr) {
  const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) throw new Error("eval failed: " + JSON.stringify(r.result.exceptionDetails).slice(0, 300));
  return r.result?.result?.value;
}

try {
  const targets = await waitJson(`http://127.0.0.1:${PORT}/json/list`);
  const page = targets.find((t) => t.type === "page");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res) => (ws.onopen = res));
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id).res(d); pending.delete(d.id); }
    if (d.method === "Runtime.consoleAPICalled" && d.params.type === "error")
      errors.push("console.error: " + d.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200));
    if (d.method === "Runtime.exceptionThrown")
      errors.push("exception: " + (d.params.exceptionDetails?.exception?.description ?? "").slice(0, 200));
    if (d.method === "Log.entryAdded" && d.params.entry.level === "error")
      errors.push("log: " + d.params.entry.text.slice(0, 200));
  };
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Page.enable");

  // ১) হোম লোড
  await send("Page.navigate", { url: BASE + "/" });
  await sleep(2500);
  check("home loads with results", await ev(`document.body.innerText.includes("লোকাল বাস")`));
  check("default route mirpur-10→motijheel bus ৳33", await ev(`document.body.innerText.includes("৳33")`));

  // ২) "বেশি নিয়েছে?" ট্যাব — বাসে ৫০ টাকা লিখলে রায় আসতে হবে (ন্যায্য ৩৩, রাউন্ড ৩৫ → বেশি)
  await ev(`[...document.querySelectorAll('[role=tab]')][1].click()`);
  await sleep(400);
  await ev(`document.querySelector('input[inputmode]').focus()`);
  await send("Input.insertText", { text: "50" });
  await sleep(500);
  const verdict = await ev(`document.body.innerText`);
  check("checker verdict shows overcharge for ৳50 vs ৳33 (live, no blur)", /বেশি নিয়েছে!/.test(verdict), verdict.match(/.{0,10}বেশি নিয়েছে!.{0,30}/)?.[0] ?? "");

  // ৩) বাংলা সংখ্যা লিখলেও একই রায়
  await ev(`(() => { const i = document.querySelector('input[inputmode]'); i.focus(); i.select(); })()`);
  await send("Input.insertText", { text: "৩৩" });
  await sleep(500);
  const verdict2 = await ev(`document.body.innerText`);
  check("checker accepts Bengali digits ৩৩ → fair verdict", /ভাড়া ঠিক আছে/.test(verdict2));

  // ৪) ভাষা টগল EN
  await send("Page.navigate", { url: BASE + "/" });
  await sleep(2000);
  await ev(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'EN').click()`);
  await sleep(400);
  check("EN toggle switches UI", await ev(`document.body.innerText.includes("Local Bus") || document.body.innerText.includes("See fares")`));

  // ৫) থিম টগল
  const themeBefore = await ev(`document.documentElement.dataset.theme || ''`);
  await ev(`document.querySelector('button[aria-label="Dark mode"], button[aria-label="ডার্ক মোড"]').click()`);
  await sleep(300);
  const themeAfter = await ev(`document.documentElement.dataset.theme || ''`);
  check("theme toggle flips dataset.theme", themeBefore !== themeAfter, `${themeBefore}→${themeAfter}`);

  // ৬) পিকার: সার্চ করে জায়গা বদল
  await send("Page.navigate", { url: BASE + "/?lang=bn" });
  await sleep(2000);
  await ev(`document.querySelectorAll('.picker-btn')[0].click()`);
  await sleep(300);
  await ev(`document.querySelector('.picker-pop input').focus()`);
  await send("Input.insertText", { text: "সাভার" });
  await sleep(500);
  const firstOpt = await ev(`document.querySelector('.picker-pop li button span')?.textContent ?? ''`);
  check("picker search 'সাভার' filters live, first option is সাভার", firstOpt.includes("সাভার"), `first=${firstOpt}`);
  await ev(`document.querySelector('.picker-pop li button').click()`);
  await sleep(500);
  check("after picking, from shows সাভার", await ev(`document.querySelectorAll('.picker-btn')[0].innerText.includes("সাভার")`));

  // ৭) URL প্যারাম + EN
  await send("Page.navigate", { url: BASE + "/?from=savar&to=motijheel&lang=en" });
  await sleep(2000);
  check("param route savar→motijheel in EN", await ev(`document.body.innerText.includes("Savar") && document.body.innerText.includes("Motijheel")`));

  // ৮) ব্লগ ও রুট পেজ লোড
  await send("Page.navigate", { url: BASE + "/blog/metro-rail-fare-chart/" });
  await sleep(1200);
  check("blog metro page has fare matrix", await ev(`document.body.innerText.includes("মতিঝিল") && document.querySelectorAll('table').length > 0`));
  await send("Page.navigate", { url: BASE + "/route/savar-to-motijheel/" });
  await sleep(1200);
  check("route page savar shows transfer section", await ev(`document.body.innerText.includes("বদলি")`));

  const realErrors = errors.filter((e) => !/ERR_TUNNEL|Failed to load resource/.test(e));
  check("zero console/page errors (sandbox font-load failures excluded)", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));
} finally {
  console.log(results.join("\n"));
  if (errors.length) console.log("\nERRORS:\n" + errors.join("\n"));
  try { ws?.close(); } catch {}
  chrome.kill();
}
