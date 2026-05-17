// Dernières optims PSI :
// 1. efood-00 LCP : recompress aggressif (379 KB → ~180 KB)
// 2. logo-main responsive (200w pour header) + logo-dark-bg responsive (88w mobile)
// 3. Hero strip 400w : recompress quality 60 (gain ~10 KB chacun)
import sharp from 'sharp';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const PHOTOS = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';
const RAW = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';

async function recompress(src, dst, quality) {
  if (!existsSync(src)) { console.warn('miss', src); return; }
  const before = statSync(src).size;
  await sharp(src).webp({ quality }).toFile(dst + '.tmp');
  const after = statSync(dst + '.tmp').size;
  if (after < before) {
    await sharp(dst + '.tmp').toFile(dst);
    console.log(`  ✓ ${dst.split('/').pop()} : ${(before/1024).toFixed(1)}KB → ${(after/1024).toFixed(1)}KB (-${(100-after/before*100).toFixed(1)}%)`);
  } else {
    console.log(`  - ${dst.split('/').pop()} : déjà optimal`);
  }
  // cleanup tmp
  await import('fs').then(fs => fs.unlinkSync(dst + '.tmp'));
}

console.log('1. efood-00 LCP recompress…');
// Source HD raw efood-00.jpg (rescrappée HD par agent précédent)
const eFoodSrc = join(RAW, 'efood-00.jpg');
if (existsSync(eFoodSrc)) {
  // Régénère depuis source HD avec quality plus basse pour LCP
  for (const [w, q] of [[400, 70], [800, 65], [1600, 58]]) {
    const out = join(PHOTOS, `efood-00-${w}w.webp`);
    await sharp(eFoodSrc).resize(w).webp({ quality: q, effort: 6 }).toFile(out);
    console.log(`  ✓ efood-00-${w}w.webp q=${q}`);
  }
} else {
  // Fallback : recompress le webp existant
  for (const [size, q] of [[400, 70], [800, 65], [1600, 58]]) {
    const f = join(PHOTOS, `efood-00-${size}w.webp`);
    if (existsSync(f)) {
      const buf = await sharp(f).png().toBuffer();
      await sharp(buf).webp({ quality: q, effort: 6 }).toFile(f + '.new');
      const before = statSync(f).size;
      const after = statSync(f + '.new').size;
      if (after < before) {
        const fs = await import('fs');
        fs.renameSync(f + '.new', f);
        console.log(`  ✓ efood-00-${size}w.webp : ${(before/1024).toFixed(1)}KB → ${(after/1024).toFixed(1)}KB`);
      } else {
        const fs = await import('fs');
        fs.unlinkSync(f + '.new');
      }
    }
  }
}

console.log('\n2. Logos responsive smaller versions…');
// logo-main.png → versions WebP plus petites (88, 200) en plus de la 400 actuelle
const logoMain = join(PHOTOS, 'logo-main.png');
if (existsSync(logoMain)) {
  for (const w of [88, 200]) {
    const out = join(PHOTOS, `logo-main-${w}w.webp`);
    await sharp(logoMain).resize(w).webp({ quality: 92, effort: 6 }).toFile(out);
    console.log(`  ✓ logo-main-${w}w.webp`);
  }
}
// logo-dark-bg.png → versions plus petites (88)
const logoDark = join(PHOTOS, 'logo-dark-bg.png');
if (existsSync(logoDark)) {
  const out = join(PHOTOS, 'logo-dark-bg-88w.webp');
  await sharp(logoDark).resize(88).webp({ quality: 92, effort: 6 }).toFile(out);
  console.log('  ✓ logo-dark-bg-88w.webp');
}

console.log('\n3. Hero strip 400w aggressive recompress…');
for (const stem of ['trouba-storefront', 'trouba-grill-skewers', 'trouba-grill-chops', 'efood-00', 'efood-25']) {
  const f = join(PHOTOS, `${stem}-400w.webp`);
  if (!existsSync(f)) continue;
  const before = statSync(f).size;
  const buf = await sharp(f).png().toBuffer();
  await sharp(buf).webp({ quality: 62, effort: 6 }).toFile(f + '.new');
  const after = statSync(f + '.new').size;
  if (after < before * 0.9) {
    const fs = await import('fs');
    fs.renameSync(f + '.new', f);
    console.log(`  ✓ ${stem}-400w.webp : ${(before/1024).toFixed(1)}KB → ${(after/1024).toFixed(1)}KB`);
  } else {
    const fs = await import('fs');
    fs.unlinkSync(f + '.new');
  }
}

console.log('\nDone.');
