// V3 — split Drinks en 2 pages : composites soft + alcool
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const RAW = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';
const OUT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Composite "soft-drinks" : Coca, Fanta, Νερό 500ml, Νερό 1L
async function makeSoft() {
  const W = 1200, H = 900;
  const cellW = W / 2, cellH = H / 2;
  const sources = [
    'efood-77.jpg', // Coca 330ml
    'efood-80.jpg', // Fanta 330ml
    join(RAW, '083--500ml.jpg').includes('083') ? null : null, // placeholder
  ];
  // Nous avons besoin de copier 083 et 084 (water) depuis inbox
  return null;
}

// On va plutôt utiliser des photos individuelles déjà disponibles via inbox.
// Copions d'abord 083 (Νερό 500ml) et 084 (Νερό 1L) depuis inbox.
import { copyFileSync, readdirSync } from 'fs';
const INBOX = 'C:/Users/User/Desktop/Ultras-Brain/00-inbox/efood-trouba';
const inboxFiles = readdirSync(INBOX);
function findJpg(idx) { return inboxFiles.find(f => f.startsWith(idx + '-') || f.startsWith(idx + '.jpg')); }

const TO_COPY = [
  { idx: '083', stem: 'efood-83' }, // Νερό 500ml
  { idx: '084', stem: 'efood-84' }, // Νερό 1L
  { idx: '085', stem: 'efood-85' }, // Amstel 330ml
  { idx: '086', stem: 'efood-86' }, // Amstel 500ml
  { idx: '088', stem: 'efood-88' }, // Heineken 500ml
  { idx: '089', stem: 'efood-89' }, // Alfa 330ml
  { idx: '091', stem: 'efood-91' }, // Alfa 500ml
  { idx: '092', stem: 'efood-92' }, // Fix 500ml
  { idx: '095', stem: 'efood-95' }, // Krasi 500ml
  { idx: '096', stem: 'efood-96' }, // Krasi 1L
];
for (const { idx, stem } of TO_COPY) {
  const jpg = findJpg(idx);
  if (!jpg) { console.warn('no jpg for', idx); continue; }
  const dst = join(RAW, `${stem}.jpg`);
  if (!existsSync(dst)) copyFileSync(join(INBOX, jpg), dst);
}

// Helper composite 2x2 grid 1200x900
async function gridComposite(filename, sources) {
  const W = 1200, H = 900;
  const cellW = W / 2, cellH = H / 2;
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) { console.warn('  missing', sources[i]); continue; }
    const buf = await sharp(src).resize(cellW, cellH, { fit: 'cover', position: 'center' }).toBuffer();
    const x = (i % 2) * cellW;
    const y = Math.floor(i / 2) * cellH;
    tiles.push({ input: buf, top: y, left: x });
  }
  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(tiles)
    .webp({ quality: 84 })
    .toFile(join(OUT, `${filename}-800w.webp`));
  await sharp(join(OUT, `${filename}-800w.webp`)).resize(400).webp({ quality: 80 }).toFile(join(OUT, `${filename}-400w.webp`));
  console.log('  ✓', filename);
}

console.log('Composite soft-drinks (Coca, Fanta, Νερό 500, Νερό 1L)…');
await gridComposite('efood-soft-drinks-mix', ['efood-77.jpg', 'efood-80.jpg', 'efood-83.jpg', 'efood-84.jpg']);

console.log('Composite alcool (Amstel, Heineken, Mythos, Vin)…');
await gridComposite('efood-alcool-mix', ['efood-85.jpg', 'efood-87.jpg', 'efood-94.jpg', 'efood-95.jpg']);

// Refaire le composite drinks-mix existant en plus large (900x900 au lieu de 800x800), images plus visibles
console.log('Composite drinks-mix v2 (plus grand, mieux centré)…');
await gridComposite('efood-drinks-mix', ['efood-77.jpg', 'efood-80.jpg', 'efood-87.jpg', 'efood-94.jpg']);

// Refaire veggie-fritters et sandwich-skepasti aussi en plus grand
async function pairComposite(filename, sources) {
  const W = 1200, H = 700;
  const cellW = W / 2;
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) { console.warn('  missing', sources[i]); continue; }
    const buf = await sharp(src).resize(cellW, H, { fit: 'cover', position: 'center' }).toBuffer();
    tiles.push({ input: buf, top: 0, left: i * cellW });
  }
  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(tiles)
    .webp({ quality: 84 })
    .toFile(join(OUT, `${filename}-800w.webp`));
  await sharp(join(OUT, `${filename}-800w.webp`)).resize(400).webp({ quality: 80 }).toFile(join(OUT, `${filename}-400w.webp`));
  console.log('  ✓', filename);
}

console.log('Composite veggie-fritters v2 (plus grand)…');
await pairComposite('efood-veggie-fritters', ['efood-35.jpg', 'efood-34.jpg']);

console.log('Composite sandwich-skepasti v2 (plus grand)…');
await pairComposite('efood-sandwich-skepasti', ['efood-64.jpg', 'efood-58.jpg']);

console.log('\nDone.');
