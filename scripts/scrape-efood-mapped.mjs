// Scrape e-food.gr menu items WITH item names mapped to photos
// Output: /public/photos/raw/efood-mapped/<slug>.jpg + manifest.json
// Usage: node scripts/scrape-efood-mapped.mjs
import pkg from "../../../../Desktop/Ultras-Brain/node_modules/playwright/index.js";
const { chromium } = pkg;
import fs from "fs";
import path from "path";
import https from "https";

const PROJECT = path.resolve(process.cwd());
const OUT_DIR = path.join(PROJECT, "public", "photos", "raw", "efood-mapped");
const MANIFEST = path.join(OUT_DIR, "manifest.json");
fs.mkdirSync(OUT_DIR, { recursive: true });

const EFOOD_URL = "https://www.e-food.gr/delivery/peiraias/to-kalamaki-ths-troympas";
const log = (...a) => console.log("[scrape]", ...a);

function slugify(s) {
  return String(s).toLowerCase()
    .replace(/[άα]/g, 'a').replace(/[έε]/g, 'e').replace(/[ήι]/g, 'i').replace(/[όο]/g, 'o')
    .replace(/[ύυ]/g, 'y').replace(/ώ/g, 'o')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 Chrome/130.0" },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve, reject); return;
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on("finish", () => out.close(() => resolve(dest)));
      out.on("error", reject);
    }).on("error", reject);
  });
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
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0",
  });
  const page = await context.newPage();

  log("Navigating efood...");
  await page.goto(EFOOD_URL, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  for (const sel of [
    'button:has-text("Συμφωνώ")', 'button:has-text("Accept")', '#onetrust-accept-btn-handler',
    'button:has-text("ΑΠΟΔΟΧΗ")', '[data-testid="cookie-banner-accept"]',
  ]) {
    try { await page.click(sel, { timeout: 2000 }); break; } catch {}
  }
  await page.waitForTimeout(3000);

  // Scroll exhaustif
  for (let i = 0; i < 40; i++) {
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(600);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  // Extraction structurée : on cherche chaque card produit avec son nom + image
  const items = await page.evaluate(() => {
    // e-food utilise des cards avec [data-testid*="product"] ou des div clickables
    const out = [];
    const seen = new Set();

    // Stratégie 1 : data-testid product
    const candidates = document.querySelectorAll(
      '[data-testid*="product-card"], [data-testid*="ProductCard"], article, li, div[class*="product"], div[class*="Product"]'
    );

    candidates.forEach((el) => {
      const img = el.querySelector('img');
      if (!img) return;
      const src = img.currentSrc || img.src;
      if (!src || !/^https?:\/\//.test(src)) return;
      if (src.length < 30 || src.length > 600) return;
      if (/logo|icon|sprite|placeholder|avatar/i.test(src)) return;

      // Nom du produit : h2/h3/h4 ou data-testid avec text
      let name = '';
      const headings = el.querySelectorAll('h2, h3, h4, [class*="title"], [class*="Title"], [class*="name"], [class*="Name"]');
      for (const h of headings) {
        const t = (h.textContent || '').trim();
        if (t && t.length >= 3 && t.length <= 120) { name = t; break; }
      }

      if (!name) {
        // Fallback : alt text
        name = (img.alt || '').trim();
      }
      if (!name) return;
      const key = name + '|' + src.split('?')[0].split('/').pop();
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ name, src });
    });

    return out;
  });

  log(`Found ${items.length} mapped items`);

  // Catégoriser approximativement par mot-clé
  function categoryOf(name) {
    const n = name.toLowerCase();
    if (/καλαμάκι|σουβλάκι|skewer/i.test(name)) return 'skewer';
    if (/μπιφτέκι|burger|χάμπουργκερ/i.test(name)) return 'burger';
    if (/πανσετ|πανσέτα|belly/i.test(name)) return 'pork-belly';
    if (/λουκάνικ|sausage/i.test(name)) return 'sausage';
    if (/μπριζολ|chop/i.test(name)) return 'pork-chop';
    if (/σαλάτα|salad/i.test(name)) return 'salad';
    if (/πατάτ|fries|fritter/i.test(name)) return 'sides';
    if (/τζατζίκ|τυρ|feta|κουρ/i.test(name)) return 'dip';
    if (/πίτα|skepasti|σκεπαστή/i.test(name)) return 'pita';
    if (/βεγκαν|σεϊτάν|veggie|vegan/i.test(name)) return 'veggie';
    if (/κρασ|μπύρα|amstel|fix|alfa|mythos|heineken|wine|beer|coke|cola|νερό|water/i.test(name)) return 'drink';
    if (/κεμπάπ|kebap/i.test(name)) return 'kebap';
    if (/sandwich|σάντουιτς/i.test(name)) return 'sandwich';
    return 'other';
  }

  const manifest = [];
  let i = 0;
  for (const it of items) {
    const cat = categoryOf(it.name);
    const slug = slugify(it.name);
    const filename = `${String(i).padStart(3, '0')}-${cat}-${slug}.jpg`;
    const dest = path.join(OUT_DIR, filename);
    const cleanSrc = it.src.replace(/\?.*$/, '');
    try {
      try { await download(cleanSrc, dest); } catch { await download(it.src, dest); }
      const sz = fs.statSync(dest).size;
      if (sz < 5000) { fs.unlinkSync(dest); continue; }
      manifest.push({ index: i, name: it.name, category: cat, file: filename, src: it.src, size: sz });
      log(` saved ${filename} (${sz}b)`);
      i++;
    } catch (e) {
      log(' fail', it.name, e.message);
    }
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');
  log(`TOTAL : ${i} mapped items saved → ${MANIFEST}`);
  await browser.close();
})();
