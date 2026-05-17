// Refait 2 composites en haute qualité avec les BONNES photos :
// - sandwich-skepasti = vrai sandwich (47) + skepasti (58)
// - veggie-mix = zucchini fritters solo (35) + falafel-pita (40) → "falafels dans le sukini" visible
import sharp from 'sharp';
import { existsSync, readFileSync, statSync, createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import https from 'https';

const INBOX = 'C:/Users/User/Desktop/Ultras-Brain/00-inbox/efood-trouba';
const RAW = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';
const OUT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';
if (!existsSync(RAW)) mkdirSync(RAW, { recursive: true });

async function fetchHD(srcUrl, dst) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dst);
    https.get(srcUrl, res => {
      if (res.statusCode === 200) { res.pipe(file); file.on('finish', () => { file.close(); resolve(); }); }
      else reject(new Error('HTTP ' + res.statusCode));
    }).on('error', reject);
  });
}

const META = JSON.parse(readFileSync(join(INBOX, '_metadata.json'), 'utf8'));

async function ensureHD(idx) {
  const dst = join(RAW, `efood-${idx}.jpg`);
  if (existsSync(dst) && statSync(dst).size > 8000) return;
  const meta = META.find(m => m.index === parseInt(idx, 10));
  if (!meta) { console.warn('no meta for', idx); return; }
  const hdUrl = meta.src.replace(/cdn-cgi\/image\/[^/]+\//, '');
  console.log('  fetching HD', idx, '→', hdUrl.slice(0, 90));
  try { await fetchHD(hdUrl, dst); } catch(e) { console.error('  fail', e.message); }
}

await ensureHD(47);
await ensureHD(58);
await ensureHD(35);
await ensureHD(40);

async function pairComposite(filename, sources) {
  const W = 1600, H = 900;
  const cellW = W / 2;
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) { console.warn('missing', sources[i]); continue; }
    const buf = await sharp(src).resize(cellW, H, { fit: 'cover', position: 'center' }).toBuffer();
    tiles.push({ input: buf, top: 0, left: i * cellW });
  }
  // Compose once en 1600x900 puis dérive les 3 tailles depuis ce buffer
  const masterBuf = await sharp({ create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } } })
    .composite(tiles).png().toBuffer();
  for (const w of [400, 800, 1600]) {
    await sharp(masterBuf).resize(w).webp({ quality: 88 })
      .toFile(join(OUT, `${filename}-${w}w.webp`));
  }
  console.log('  ✓', filename);
}

console.log('Composite sandwich-skepasti (real sandwich 47 + skepasti 58)…');
await pairComposite('efood-sandwich-skepasti', ['efood-47.jpg', 'efood-58.jpg']);

console.log('Composite veggie-mix V2 (zucchini 35 + falafel-pita 40)…');
await pairComposite('efood-veggie-mix', ['efood-35.jpg', 'efood-40.jpg']);

console.log('\nDone.');
