// Composite veggie : burger veggie (065) + chickpea wrap (040) — montre "falafel dans le sukini"
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const RAW = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';
const OUT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

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

console.log('Composite veggie-mix (Veggie burger + Chickpea/Zucchini wrap)…');
// 065 = veggie burger, 040 = chickpea fritter wrap (closest to "falafel dans sukini")
await pairComposite('efood-veggie-mix', ['efood-65.jpg', 'efood-40.jpg']);
