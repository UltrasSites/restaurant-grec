// process-efood-photos.mjs
// Repart du _metadata.json scrapé, télécharge en HD, translit grec→latin,
// génère 3 tailles webp (400w/800w/1600w) dans public/photos/efood/
//
// Usage : node process-efood-photos.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Source absolue : metadata vit dans Ultras-Brain/00-inbox/efood-trouba/ (pas dans restaurant-grec)
const SRC = 'C:\\Users\\User\\Desktop\\Ultras-Brain\\00-inbox\\efood-trouba';
const META = path.join(SRC, '_metadata.json');
const DEST = path.join('C:', 'Users', 'User', 'Desktop', 'CODE ENTREPRISES', 'restaurant-grec', 'public', 'photos', 'efood');

// Map translittération grec → latin (lettres + accents communs)
const G2L = {
  'Α': 'A', 'Β': 'V', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'I',
  'Θ': 'Th', 'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'X',
  'Ο': 'O', 'Π': 'P', 'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F',
  'Χ': 'Ch', 'Ψ': 'Ps', 'Ω': 'O',
  'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i',
  'θ': 'th', 'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x',
  'ο': 'o', 'π': 'p', 'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y',
  'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o',
  'ά': 'a', 'έ': 'e', 'ή': 'i', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ώ': 'o',
  'Ά': 'A', 'Έ': 'E', 'Ή': 'I', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ώ': 'O',
  'ϊ': 'i', 'ϋ': 'y', 'ΐ': 'i', 'ΰ': 'y',
};

function translit(s) {
  return s.split('').map((c) => G2L[c] !== undefined ? G2L[c] : c).join('');
}

function slugify(s) {
  return translit(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

// Boisson detector : nom contient ml/lt/litre/bière/cola, ou matchs marques
function isDrink(name) {
  const n = name.toLowerCase();
  return /\b\d+\s*(ml|lt|cl|litre|liter)/i.test(n)
    || /amstel|heineken|mythos|fix|sprite|fanta|coca|coke|nestea|loux|water|νερό|κρασί|wine|beer|μπίρα|μπυρα/i.test(n);
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
  });
}

function toHdUrl(src) {
  // Retire le cdn-cgi/image/h=160,fit=cover etc. pour avoir l'origine
  // Ex : .../cdn-cgi/image/h=160,fit=cover,f=auto/restaurants/.../menu_item/X?c=Y
  //   → .../restaurants/.../menu_item/X?c=Y  (sans le cdn-cgi/image/.../)
  return src.replace(/\/cdn-cgi\/image\/[^/]+\//, '/');
}

const raw = JSON.parse(fs.readFileSync(META, 'utf8'));
fs.mkdirSync(DEST, { recursive: true });

const plats = [];
const boissons = [];
const seen = new Set();

for (const item of raw) {
  if (!item.name) continue;
  if (isDrink(item.name)) {
    boissons.push(item);
    continue;
  }
  const slug = slugify(item.name);
  if (!slug || seen.has(slug)) continue;
  seen.add(slug);
  plats.push({ ...item, slug });
}

console.log(`🍽️  ${plats.length} plats | 🥤 ${boissons.length} boissons (exclus)`);
console.log(`📁 Destination : ${DEST}\n`);

const SIZES = [400, 800, 1600];
const manifest = [];
let ok = 0;
let fail = 0;

for (let i = 0; i < plats.length; i++) {
  const p = plats[i];
  const hdUrl = toHdUrl(p.src);
  process.stdout.write(`[${i + 1}/${plats.length}] ${p.slug.padEnd(35)} `);

  try {
    const buf = await downloadBuffer(hdUrl);
    const img = sharp(buf);
    const meta = await img.metadata();

    for (const w of SIZES) {
      const outFile = path.join(DEST, `${p.slug}-${w}w.webp`);
      await sharp(buf)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outFile);
    }
    manifest.push({
      slug: p.slug,
      name_el: p.name,
      original_src: p.src,
      hd_src: hdUrl,
      orig_dimensions: `${meta.width}x${meta.height}`,
      files: SIZES.map((w) => `${p.slug}-${w}w.webp`),
    });
    console.log(`✅ ${meta.width}x${meta.height}`);
    ok++;
  } catch (e) {
    console.log(`❌ ${e.message.slice(0, 50)}`);
    fail++;
  }
}

const manifestFile = path.join(DEST, '_plats-manifest.json');
fs.writeFileSync(manifestFile, JSON.stringify({
  generated_at: new Date().toISOString(),
  count_plats: ok,
  count_failed: fail,
  count_boissons_excluded: boissons.length,
  sizes: SIZES,
  plats: manifest,
}, null, 2));

console.log(`\n✅ ${ok} plats traités (${ok * SIZES.length} fichiers webp générés)`);
console.log(`❌ ${fail} échecs`);
console.log(`📋 Manifest : ${manifestFile}`);
