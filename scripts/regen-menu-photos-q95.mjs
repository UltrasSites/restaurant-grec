// Regénère toutes les photos webp utilisées dans MenuBook depuis raw HD à quality 95
// (vs 90 actuel) pour améliorer la netteté visuelle
import sharp from 'sharp';
import { existsSync, statSync, createWriteStream } from 'fs';
import { readFileSync } from 'fs';
import { join } from 'path';
import https from 'https';

const RAW = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';
const OUT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';
const INBOX = 'C:/Users/User/Desktop/Ultras-Brain/00-inbox/efood-trouba';

// Re-fetch HD si raw < 50KB (signe de basse res)
const META = JSON.parse(readFileSync(join(INBOX, '_metadata.json'), 'utf8'));

async function fetchHD(srcUrl, dst) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dst);
    https.get(srcUrl, res => {
      if (res.statusCode === 200) { res.pipe(file); file.on('finish', () => { file.close(); resolve(); }); }
      else reject(new Error('HTTP ' + res.statusCode));
    }).on('error', reject);
  });
}

async function ensureHD(idx) {
  const dst = join(RAW, `efood-${idx}.jpg`);
  if (existsSync(dst) && statSync(dst).size > 100000) return; // déjà HD >100KB
  const meta = META.find(m => m.index === parseInt(idx, 10));
  if (!meta) return;
  const hdUrl = meta.src.replace(/cdn-cgi\/image\/[^/]+\//, '');
  console.log(`  re-fetch HD efood-${idx} from`, hdUrl.slice(0, 80));
  try { await fetchHD(hdUrl, dst); } catch(e) { console.error('  fail', idx, e.message); }
}

// Photos utilisées par menu-data.ts livre menu (pages 2-13)
const STEMS = [
  // Pages individuelles
  '01', '03', '04', '06', '07', '08', '09', '10', '25', '34', '35',
  '37', '40', '42', '43', '47', '55', '58', '60', '62', '64', '65', '66',
  '70', '74', '75', '76',
];

console.log('Step 1 — refetch HD si raw <100KB');
for (const idx of STEMS) {
  await ensureHD(idx);
}

console.log('\nStep 2 — regénère webp 400/800/1600 q=95 depuis raw HD');
for (const idx of STEMS) {
  const src = join(RAW, `efood-${idx}.jpg`);
  if (!existsSync(src)) { console.warn('  missing', src); continue; }
  const srcSize = statSync(src).size;
  for (const w of [400, 800, 1600]) {
    const dst = join(OUT, `efood-${idx}-${w}w.webp`);
    try {
      await sharp(src).resize(w).webp({ quality: 95, effort: 6 }).toFile(dst);
    } catch(e) { console.error('  fail', idx, w, e.message); }
  }
  process.stdout.write('.');
}
console.log();

// Composites custom à q=95 aussi
console.log('\nStep 3 — composites q=95');
async function pairComposite(filename, sources) {
  const W = 1600, H = 900;
  const cellW = W / 2;
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) continue;
    const buf = await sharp(src).resize(cellW, H, { fit: 'cover', position: 'center' }).toBuffer();
    tiles.push({ input: buf, top: 0, left: i * cellW });
  }
  const masterBuf = await sharp({ create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite(tiles).png().toBuffer();
  for (const w of [400, 800, 1600]) {
    await sharp(masterBuf).resize(w).webp({ quality: 95, effort: 6 })
      .toFile(join(OUT, `${filename}-${w}w.webp`));
  }
  console.log('  ✓', filename);
}

async function gridComposite(filename, sources) {
  const W = 1600, H = 1200;
  const cellW = W / 2, cellH = H / 2;
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) continue;
    const buf = await sharp(src).resize(cellW, cellH, { fit: 'cover', position: 'center' }).toBuffer();
    tiles.push({ input: buf, top: Math.floor(i / 2) * cellH, left: (i % 2) * cellW });
  }
  const masterBuf = await sharp({ create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite(tiles).png().toBuffer();
  for (const w of [400, 800, 1600]) {
    await sharp(masterBuf).resize(w).webp({ quality: 95, effort: 6 })
      .toFile(join(OUT, `${filename}-${w}w.webp`));
  }
  console.log('  ✓', filename);
}

await gridComposite('efood-soft-drinks-mix', ['efood-77.jpg', 'efood-80.jpg', 'efood-83.jpg', 'efood-84.jpg']);
await gridComposite('efood-alcool-mix', ['efood-85.jpg', 'efood-87.jpg', 'efood-94.jpg', 'efood-95.jpg']);
await gridComposite('efood-drinks-mix', ['efood-77.jpg', 'efood-80.jpg', 'efood-87.jpg', 'efood-94.jpg']);
await pairComposite('efood-veggie-fritters', ['efood-35.jpg', 'efood-34.jpg']);
await pairComposite('efood-veggie-mix', ['efood-35.jpg', 'efood-40.jpg']);
await pairComposite('efood-sandwich-skepasti', ['efood-47.jpg', 'efood-58.jpg']);

console.log('\nDone.');
