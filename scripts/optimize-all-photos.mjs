import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, basename, extname } from 'path';

const SRC = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';
const OUT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter(f => /\.(jpe?g|png|webp)$/i.test(f) && /^(efood|facebook)-/i.test(f));
console.log(`Found ${files.length} files`);

const widths = [400, 800];

for (const f of files) {
  const stem = basename(f, extname(f));
  const src = join(SRC, f);
  for (const w of widths) {
    const out = join(OUT, `${stem}-${w}w.webp`);
    if (existsSync(out)) continue;
    try {
      await sharp(src).resize(w).webp({ quality: 80 }).toFile(out);
      process.stdout.write('.');
    } catch (e) {
      console.error('\nFAIL', f, e.message);
    }
  }
}
console.log('\nDone.');
