// gen-composites-hires.mjs
// Regenerate all custom composites in HIGH quality (q=90) with 3 sizes (400/800/1600)
// Using freshly rescraped HD source jpgs in public/photos/raw/efood-NN.jpg
//
// Composites:
//   efood-soft-drinks-mix : Coca77 + Fanta80 + Νερό83 + Νερό84 (2x2)
//   efood-alcool-mix      : Amstel85 + Heineken87 + Mythos94 + Krasi95 (2x2)
//   efood-drinks-mix      : Coca77 + Fanta80 + Heineken87 + Mythos94 (2x2)
//   efood-veggie-fritters : Kolokytho35 + Revitho34 (side-by-side)
//   efood-veggie-mix      : Veggie65 + Chickpea wrap 40 (side-by-side)
//   efood-sandwich-skepasti: Burger64 + Skepasti58 (side-by-side)

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const RAW = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';
const OUT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const QUALITY = 90;
const SIZES = [400, 800, 1600];

// Build a 2x2 grid 1600x1200 then resize to 3 widths
async function gridComposite(filename, sources) {
  const W = 1600, H = 1200;
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
  const masterBuf = await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(tiles)
    .webp({ quality: QUALITY })
    .toBuffer();

  for (const w of SIZES) {
    await sharp(masterBuf)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(join(OUT, `${filename}-${w}w.webp`));
  }
  console.log(`  OK ${filename} (3 sizes)`);
}

// Side-by-side 1600x900 (16:9), then resize to 3 widths
async function pairComposite(filename, sources) {
  const W = 1600, H = 900;
  const cellW = W / 2;
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) { console.warn('  missing', sources[i]); continue; }
    const buf = await sharp(src).resize(cellW, H, { fit: 'cover', position: 'center' }).toBuffer();
    tiles.push({ input: buf, top: 0, left: i * cellW });
  }
  const masterBuf = await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(tiles)
    .webp({ quality: QUALITY })
    .toBuffer();

  for (const w of SIZES) {
    await sharp(masterBuf)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(join(OUT, `${filename}-${w}w.webp`));
  }
  console.log(`  OK ${filename} (3 sizes)`);
}

console.log('Composite soft-drinks (Coca77, Fanta80, Νερό83, Νερό84)...');
await gridComposite('efood-soft-drinks-mix', ['efood-77.jpg', 'efood-80.jpg', 'efood-83.jpg', 'efood-84.jpg']);

console.log('Composite alcool (Amstel85, Heineken87, Mythos94, Krasi95)...');
await gridComposite('efood-alcool-mix', ['efood-85.jpg', 'efood-87.jpg', 'efood-94.jpg', 'efood-95.jpg']);

console.log('Composite drinks-mix (Coca77, Fanta80, Heineken87, Mythos94)...');
await gridComposite('efood-drinks-mix', ['efood-77.jpg', 'efood-80.jpg', 'efood-87.jpg', 'efood-94.jpg']);

console.log('Composite veggie-fritters (Kolokytho35, Revitho34)...');
await pairComposite('efood-veggie-fritters', ['efood-35.jpg', 'efood-34.jpg']);

console.log('Composite veggie-mix (Veggie65, Chickpea wrap 40)...');
await pairComposite('efood-veggie-mix', ['efood-65.jpg', 'efood-40.jpg']);

console.log('Composite sandwich-skepasti (Burger64, Skepasti58)...');
await pairComposite('efood-sandwich-skepasti', ['efood-64.jpg', 'efood-58.jpg']);

console.log('\nDone.');
