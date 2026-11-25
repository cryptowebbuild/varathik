// শেয়ারযোগ্য অফিসিয়াল ভাড়া কার্ড — Canvas দিয়ে PNG তৈরি (কন্ডাক্টর/ড্রাইভারকে দেখানোর জন্য)
import { RATES } from "../data/rates";

export interface FareCardData {
  fromBn: string;
  toBn: string;
  modeBn: string;
  fare: number;
  km: number;
  sourceBn: string;
}

export function drawFareCard(data: FareCardData): HTMLCanvasElement {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ব্যাকগ্রাউন্ড — গাঢ় সবুজ
  ctx.fillStyle = "#052e16";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(0, 0, W, 18);

  ctx.textAlign = "center";
  ctx.fillStyle = "#bbf7d0";
  ctx.font = "700 44px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  ctx.fillText("ভাড়াঠিক? — অফিসিয়াল ভাড়া কার্ড", W / 2, 120);

  // রুট
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 84px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  ctx.fillText(data.fromBn, W / 2, 300);
  ctx.fillStyle = "#4ade80";
  ctx.font = "800 72px sans-serif";
  ctx.fillText("↓", W / 2, 400);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 84px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  ctx.fillText(data.toBn, W / 2, 520);

  ctx.fillStyle = "#d1fae5";
  ctx.font = "600 48px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  ctx.fillText(`${data.modeBn} · দূরত্ব ${data.km} কিমি`, W / 2, 630);

  // ভাড়া বক্স
  ctx.fillStyle = "#ffffff";
  const bx = 90, by = 700, bw = W - 180, bh = 300;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 36);
  ctx.fill();
  ctx.fillStyle = "#052e16";
  ctx.font = "700 52px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  ctx.fillText("সরকার নির্ধারিত ভাড়া", W / 2, by + 100);
  ctx.fillStyle = "#16a34a";
  ctx.font = "900 150px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  ctx.fillText(`৳${data.fare}`, W / 2, by + 260);

  // সূত্র
  ctx.fillStyle = "#a7f3d0";
  ctx.font = "500 38px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  wrapText(ctx, `সূত্র: ${data.sourceBn}`, W / 2, 1090, W - 140, 52);
  ctx.fillStyle = "#6ee7b7";
  ctx.font = "500 34px 'Hind Siliguri','Noto Sans Bengali',sans-serif";
  ctx.fillText(`বাস রেট: কিমি প্রতি ৳${RATES.busPerKm} · সর্বনিম্ন ৳${RATES.busMinFare} (BRTA)`, W / 2, 1230);
  ctx.fillText("varathik — ঠকবেন না, জেনে উঠুন", W / 2, 1290);

  return canvas;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = w;
      cy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, cy);
}

export async function shareFareCard(data: FareCardData) {
  const canvas = drawFareCard(data);
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
  if (!blob) return;
  const file = new File([blob], "varathik-fare-card.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare && nav.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: "অফিসিয়াল ভাড়া কার্ড" });
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "varathik-fare-card.png";
  a.click();
  URL.revokeObjectURL(url);
}
