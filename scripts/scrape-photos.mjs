// Scrape photos depuis efood et Facebook page Kalamaki Troumpas
// Usage : node scripts/scrape-photos.mjs
import pkg from "../../../../Desktop/Ultras-Brain/node_modules/playwright/index.js";
const { chromium } = pkg;
import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const PROJECT = path.resolve(process.cwd());
const RAW_DIR = path.join(PROJECT, "public", "photos", "raw");
fs.mkdirSync(RAW_DIR, { recursive: true });

const EFOOD_URL = "https://www.e-food.gr/delivery/peiraias/to-kalamaki-ths-troympas";
const FB_PAGE = "https://www.facebook.com/to.kalamaki.tis.troumpas/";
const FB_PHOTOS = "https://www.facebook.com/to.kalamaki.tis.troumpas/photos";

const MIN_SIZE = 200; // pixels mini pour conserver
const SCROLL_TIMES = 12;

const log = (...a) => console.log("[scrape]", ...a);

function download(url, dest, cookieHeader = "") {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        Referer: "https://www.facebook.com/",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // follow redirect
        download(res.headers.location, dest, cookieHeader).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} on ${url.slice(0,80)}`));
      }
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on("finish", () => out.close(() => resolve(dest)));
      out.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(new Error("timeout")); });
  });
}

async function scrapeEfood(page) {
  log("Navigating efood...");
  // Intercepter TOUTES les images
  const imageUrls = new Set();
  page.on("response", (resp) => {
    const ct = resp.headers()["content-type"] || "";
    if (ct.startsWith("image/")) {
      const u = resp.url();
      if (u.length < 500) imageUrls.add(u);
    }
  });

  try {
    await page.goto(EFOOD_URL, { waitUntil: "networkidle", timeout: 60000 });
  } catch (e) {
    log("efood goto warning:", e.message);
  }
  // accept cookies si besoin
  try { await page.click('button:has-text("Συμφωνώ")', { timeout: 3000 }); } catch {}
  try { await page.click('button:has-text("Accept")', { timeout: 2000 }); } catch {}
  try { await page.click('#onetrust-accept-btn-handler', { timeout: 2000 }); } catch {}
  try { await page.click('button:has-text("ΑΠΟΔΟΧΗ")', { timeout: 2000 }); } catch {}
  await page.waitForTimeout(3000);

  // scroll progressif pour charger toutes les images lazy
  for (let i = 0; i < 25; i++) {
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(700);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  // Aussi images via DOM
  const domUrls = await page.evaluate(() => {
    const out = new Set();
    Array.from(document.querySelectorAll("img")).forEach(img => {
      const src = img.currentSrc || img.src;
      if (src && /^https?:\/\//.test(src)) out.add(src);
    });
    // background-image dans style inline
    Array.from(document.querySelectorAll("*[style*='background-image']")).forEach(el => {
      const m = (el.getAttribute("style") || "").match(/url\(["']?([^"')]+)["']?\)/);
      if (m && /^https?:\/\//.test(m[1])) out.add(m[1]);
    });
    return Array.from(out);
  });
  domUrls.forEach(u => imageUrls.add(u));

  const all = Array.from(imageUrls);
  log(`efood: ${all.length} candidate image URLs (network+dom)`);

  // Filtrer : on garde les images probablement de plats — e-food utilise CDN, ex: //cdn-icons / //food-cdn
  // On garde toutes les images ext jpg/png/webp de taille raisonnable
  const filtered = all.filter(u => /\.(jpe?g|png|webp)/i.test(u) || /image\//.test(u))
    .filter(u => !/svg\b|sprite|placeholder|logo|icon|avatar/i.test(u));

  log(`efood: ${filtered.length} after filter`);

  const urls = filtered.map(src => ({ src }));
  const seen = new Set();
  let i = 0;
  for (const u of urls) {
    const key = u.src.replace(/\?.*$/, "").split("/").pop();
    if (seen.has(key)) continue;
    seen.add(key);
    const ext = (u.src.match(/\.(jpe?g|png|webp|gif)/i) || ["", "jpg"])[1].toLowerCase().replace("jpeg","jpg");
    const dest = path.join(RAW_DIR, `efood-${String(i).padStart(2,"0")}.${ext}`);
    try {
      try {
        await download(u.src.replace(/\?.*$/, ""), dest);
      } catch {
        await download(u.src, dest);
      }
      const sz = fs.statSync(dest).size;
      if (sz < 5000) { fs.unlinkSync(dest); continue; }
      log(` saved ${path.basename(dest)} (${sz}b)`);
      i++;
    } catch (e) {}
  }
  log(`efood: ${i} images saved`);
  return i;
}

async function scrapeFacebook(context, page) {
  log("Navigating Facebook page...");
  const fbImageUrls = new Set();
  page.on("response", (resp) => {
    const ct = resp.headers()["content-type"] || "";
    const u = resp.url();
    if (ct.startsWith("image/") && /scontent|fbcdn/.test(u)) fbImageUrls.add(u);
  });

  // accept / dismiss cookie consent FIRST - sometimes there's a m.facebook redirect
  try {
    await page.goto(FB_PAGE, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch (e) {
    log("FB goto warning:", e.message);
  }
  // FB cookie banner — try multiple variants
  for (const sel of [
    'div[role="dialog"] [aria-label="Decline optional cookies"]',
    'div[role="dialog"] [aria-label="Allow all cookies"]',
    'button[data-cookiebanner="accept_button"]',
    'button:has-text("Allow all cookies")',
    'button:has-text("Accept all")',
    'button:has-text("Only allow essential cookies")',
  ]) {
    try { await page.click(sel, { timeout: 2000 }); break; } catch {}
  }
  await page.waitForTimeout(2500);

  // Onglet photos
  try {
    await page.goto(FB_PHOTOS, { waitUntil: "domcontentloaded", timeout: 30000 });
  } catch {}
  await page.waitForTimeout(3500);

  // scroll progressif
  for (let i = 0; i < SCROLL_TIMES; i++) {
    await page.evaluate(() => window.scrollBy(0, 900));
    await page.waitForTimeout(1500);
  }
  await page.waitForTimeout(2500);

  const domUrls = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs
      .map(img => ({ src: img.currentSrc || img.src, w: img.naturalWidth, h: img.naturalHeight, alt: img.alt || "" }))
      .filter(o => o.src && /scontent|fbcdn/.test(o.src))
      .filter(o => (o.w >= 200 && o.h >= 200) || o.w === 0); // w=0 if not yet rendered
  });
  domUrls.forEach(o => fbImageUrls.add(o.src));

  const all = Array.from(fbImageUrls);
  // dégager profile pic et favicons : filter avoir taille > minimal
  const urls = all.map(src => ({ src })).filter(o => !/safe_image|sticker|emoji|p32x32|p48x48|p60x60|p100x100/i.test(o.src));
  log(`facebook: ${urls.length} candidate image URLs`);

  // récupère les cookies (pour FB CDN signé)
  const cookies = await context.cookies();
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");

  const seen = new Set();
  let i = 0;
  for (const u of urls) {
    const key = u.src.split("?")[0].split("/").pop();
    if (seen.has(key)) continue;
    seen.add(key);
    const ext = (u.src.match(/\.(jpe?g|png|webp)/i) || ["", "jpg"])[1].toLowerCase().replace("jpeg","jpg");
    const dest = path.join(RAW_DIR, `facebook-${String(i).padStart(2,"0")}.${ext}`);
    try {
      await download(u.src, dest, cookieHeader);
      const sz = fs.statSync(dest).size;
      if (sz < 5000) { fs.unlinkSync(dest); continue; }
      log(` saved ${path.basename(dest)} (${sz}b)`);
      i++;
    } catch (e) {}
  }
  log(`facebook: ${i} images saved`);
  return i;
}

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: "C:\\Users\\User\\AppData\\Local\\ms-playwright\\chromium-1217\\chrome-win64\\chrome.exe",
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    locale: "el-GR",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  let nEfood = 0, nFb = 0;
  try { nEfood = await scrapeEfood(page); } catch (e) { log("efood error:", e.message); }
  try { nFb = await scrapeFacebook(context, page); } catch (e) { log("fb error:", e.message); }

  log(`TOTAL : efood=${nEfood} facebook=${nFb}`);
  await browser.close();
})();
