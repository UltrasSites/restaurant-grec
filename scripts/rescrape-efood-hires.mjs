// rescrape-efood-hires.mjs
// Re-scrape ALL e-food photos in HIGH RESOLUTION (no h=160 cap) and regenerate
// webp variants at quality 90 with sizes 400/800/1600.
//
// - Reads C:/Users/User/Desktop/Ultras-Brain/00-inbox/efood-trouba/_metadata.json
// - For each entry, strips /cdn-cgi/image/.../ from the URL to get the full-res origin
// - Saves HD JPG to public/photos/raw/efood-NN.jpg (overwrites old 160px junk)
// - Generates public/photos/efood-NN-{400,800,1600}w.webp at q=90
// - For drink items (excluded by previous process-efood-photos.mjs), also generates
//   slug-based files in public/photos/efood/ so the NAME_TO_SLUG mapping works
//
// Usage: node scripts/rescrape-efood-hires.mjs

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import sharp from 'sharp';

const META = 'C:/Users/User/Desktop/Ultras-Brain/00-inbox/efood-trouba/_metadata.json';
const PROJECT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec';
const RAW = path.join(PROJECT, 'public', 'photos', 'raw');
const OUT_NUM = path.join(PROJECT, 'public', 'photos');           // efood-NN-XXXw.webp
const OUT_SLUG = path.join(PROJECT, 'public', 'photos', 'efood'); // <slug>-XXXw.webp

fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(OUT_SLUG, { recursive: true });

const SIZES = [400, 800, 1600];
const QUALITY = 90;

// Greek -> latin transliteration (same as process-efood-photos.mjs)
const G2L = {
  'Α':'A','Β':'V','Γ':'G','Δ':'D','Ε':'E','Ζ':'Z','Η':'I','Θ':'Th','Ι':'I','Κ':'K',
  'Λ':'L','Μ':'M','Ν':'N','Ξ':'X','Ο':'O','Π':'P','Ρ':'R','Σ':'S','Τ':'T','Υ':'Y',
  'Φ':'F','Χ':'Ch','Ψ':'Ps','Ω':'O',
  'α':'a','β':'v','γ':'g','δ':'d','ε':'e','ζ':'z','η':'i','θ':'th','ι':'i','κ':'k',
  'λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t',
  'υ':'y','φ':'f','χ':'ch','ψ':'ps','ω':'o',
  'ά':'a','έ':'e','ή':'i','ί':'i','ό':'o','ύ':'y','ώ':'o',
  'Ά':'A','Έ':'E','Ή':'I','Ί':'I','Ό':'O','Ύ':'Y','Ώ':'O',
  'ϊ':'i','ϋ':'y','ΐ':'i','ΰ':'y',
};
function translit(s) { return s.split('').map(c => G2L[c] !== undefined ? G2L[c] : c).join(''); }
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
function isDrink(name) {
  const n = name.toLowerCase();
  return /\b\d+\s*(ml|lt|cl|litre|liter)/i.test(n)
    || /amstel|heineken|mythos|fix|sprite|fanta|coca|coke|nestea|loux|water|νερό|κρασί|wine|beer|μπίρα|μπυρα|alpha|άλφα|σόδα|soda/i.test(n);
}

function toHdUrl(src) {
  // .../cdn-cgi/image/h=160,fit=cover,f=auto/restaurants/.../X?c=Y -> .../restaurants/.../X?c=Y
  return src.replace(/\/cdn-cgi\/image\/[^/]+\//, '/');
}

function downloadBuffer(url, redirCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirCount > 5) return reject(new Error('too many redirects'));
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
      },
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        return downloadBuffer(res.headers.location, redirCount + 1).then(resolve).catch(reject);
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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const meta = JSON.parse(fs.readFileSync(META, 'utf8'));
console.log(`Found ${meta.length} entries in metadata`);

let okJpg = 0, failJpg = 0, okWebp = 0, slugWebp = 0;

for (const item of meta) {
  const idx = String(item.index).padStart(2, '0');
  const stem = `efood-${idx}`;
  const rawJpg = path.join(RAW, `${stem}.jpg`);
  const hdUrl = toHdUrl(item.src);

  process.stdout.write(`[${idx}] ${item.name.padEnd(40).slice(0, 40)} `);

  try {
    const buf = await downloadBuffer(hdUrl);
    if (buf.length < 5000) throw new Error(`too small (${buf.length}b)`);
    fs.writeFileSync(rawJpg, buf);
    const meta1 = await sharp(buf).metadata();
    okJpg++;

    // Generate efood-NN-XXXw.webp (used by MenuBook)
    for (const w of SIZES) {
      const out = path.join(OUT_NUM, `${stem}-${w}w.webp`);
      await sharp(buf)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out);
      okWebp++;
    }

    // For drinks: also generate slug-based for the mapping (efood/<slug>-XXXw.webp)
    if (isDrink(item.name)) {
      const slug = slugify(item.name);
      if (slug) {
        for (const w of SIZES) {
          const out = path.join(OUT_SLUG, `${slug}-${w}w.webp`);
          await sharp(buf)
            .resize({ width: w, withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toFile(out);
          slugWebp++;
        }
        console.log(`OK ${meta1.width}x${meta1.height} -> drink slug=${slug}`);
      } else {
        console.log(`OK ${meta1.width}x${meta1.height}`);
      }
    } else {
      console.log(`OK ${meta1.width}x${meta1.height}`);
    }
  } catch (e) {
    console.log(`FAIL ${e.message.slice(0, 60)}`);
    failJpg++;
  }

  await sleep(150);
}

console.log(`\n---`);
console.log(`HD JPG: ${okJpg} OK, ${failJpg} FAIL`);
console.log(`webp efood-NN: ${okWebp} files`);
console.log(`webp slug (drinks): ${slugWebp} files`);
