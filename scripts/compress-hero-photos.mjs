// Recompress hero photos and convert PNG logos -> WebP for PageSpeed savings.
// Output: public/photos/. Sources: public/photos/raw/ (JPG) + public/photos/ (PNG logos).
import sharp from 'sharp';
import { existsSync, statSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';

const PHOTOS = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';
const RAW = join(PHOTOS, 'raw');

// Hero photos: source JPG -> webp at 3 widths
// Format: { srcJpg, stem, widths: [{ w, q }] }
const HERO_TASKS = [
  {
    srcJpg: 'trouba-storefront.jpg',
    stem: 'trouba-storefront',
    widths: [
      { w: 400, q: 70 },
      { w: 800, q: 68 },
      { w: 1600, q: 68 },
    ],
  },
  {
    srcJpg: 'trouba-grill-chops.jpg',
    stem: 'trouba-grill-chops',
    widths: [
      { w: 400, q: 70 },
      { w: 800, q: 68 },
      { w: 1600, q: 68 },
    ],
  },
  {
    srcJpg: 'trouba-grill-skewers.jpg',
    stem: 'trouba-grill-skewers',
    widths: [
      { w: 400, q: 70 },
      { w: 800, q: 68 },
      { w: 1600, q: 68 },
    ],
  },
];

// efood-00 LCP recompress: another background agent owns efood-* files; skip if locked.
const EFOOD_TASKS = [
  { src: 'efood-00-1600w.webp', dst: 'efood-00-1600w.webp', q: 65, resize: 1600 },
  { src: 'efood-00-800w.webp', dst: 'efood-00-800w.webp', q: 68, resize: 800 },
];

// Logos: PNG -> WebP (keep PNG fallback intact). Lossless for crisp logo edges, with high effort.
const LOGO_TASKS = [
  { srcPng: 'logo-main.png', dstWebp: 'logo-main.webp', lossless: true },
  { srcPng: 'logo-dark-bg.png', dstWebp: 'logo-dark-bg.webp', lossless: true },
];

function fmt(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

const report = [];

console.log('=== HERO photos (JPG -> WebP) ===');
for (const t of HERO_TASKS) {
  const src = join(RAW, t.srcJpg);
  if (!existsSync(src)) {
    console.warn('SKIP missing source:', src);
    continue;
  }
  const srcSize = statSync(src).size;
  for (const { w, q } of t.widths) {
    const out = join(PHOTOS, `${t.stem}-${w}w.webp`);
    const beforeSize = existsSync(out) ? statSync(out).size : 0;
    try {
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: q, effort: 6 })
        .toFile(out);
      const afterSize = statSync(out).size;
      const delta = beforeSize ? (((afterSize - beforeSize) / beforeSize) * 100).toFixed(1) : 'N/A';
      console.log(`  ${t.stem}-${w}w.webp  ${fmt(beforeSize)} -> ${fmt(afterSize)}  (${delta}%)  q=${q}`);
      report.push({ file: `${t.stem}-${w}w.webp`, before: beforeSize, after: afterSize, q });
    } catch (e) {
      console.error('FAIL', out, e.message);
    }
  }
}

console.log('\n=== EFOOD-00 LCP (WebP -> WebP recompress) ===');
for (const t of EFOOD_TASKS) {
  const src = join(PHOTOS, t.src);
  if (!existsSync(src)) {
    console.warn('SKIP missing source:', src);
    continue;
  }
  const beforeSize = statSync(src).size;
  // Read into buffer FIRST (file handle closed before write) — needed because sharp can't read+write same path
  const buf = await sharp(src).toBuffer();
  const out = join(PHOTOS, t.dst);
  const tmp = out + '.tmp.webp';
  try {
    await sharp(buf)
      .resize({ width: t.resize, withoutEnlargement: true })
      .webp({ quality: t.q, effort: 6 })
      .toFile(tmp);
    // Replace original atomically
    if (existsSync(out)) unlinkSync(out);
    renameSync(tmp, out);
    const afterSize = statSync(out).size;
    const delta = (((afterSize - beforeSize) / beforeSize) * 100).toFixed(1);
    console.log(`  ${t.dst}  ${fmt(beforeSize)} -> ${fmt(afterSize)}  (${delta}%)  q=${t.q}`);
    report.push({ file: t.dst, before: beforeSize, after: afterSize, q: t.q });
  } catch (e) {
    console.error('FAIL', out, e.message);
    if (existsSync(tmp)) unlinkSync(tmp);
  }
}

console.log('\n=== LOGOS (PNG -> WebP) ===');
for (const t of LOGO_TASKS) {
  const src = join(PHOTOS, t.srcPng);
  if (!existsSync(src)) {
    console.warn('SKIP missing source:', src);
    continue;
  }
  const beforeSize = statSync(src).size;
  const out = join(PHOTOS, t.dstWebp);
  try {
    // Try lossless first; if larger than 35 KB fall back to lossy q=88
    await sharp(src).webp({ lossless: true, effort: 6 }).toFile(out);
    let afterSize = statSync(out).size;
    if (afterSize > 35 * 1024) {
      await sharp(src).webp({ quality: 88, effort: 6 }).toFile(out);
      afterSize = statSync(out).size;
    }
    const delta = (((afterSize - beforeSize) / beforeSize) * 100).toFixed(1);
    console.log(`  ${t.dstWebp}  PNG ${fmt(beforeSize)} -> WebP ${fmt(afterSize)}  (${delta}%)`);
    report.push({ file: t.dstWebp, before: beforeSize, after: afterSize });
  } catch (e) {
    console.error('FAIL', out, e.message);
  }
}

const totalBefore = report.reduce((s, r) => s + r.before, 0);
const totalAfter = report.reduce((s, r) => s + r.after, 0);
console.log(`\n=== TOTAL: ${fmt(totalBefore)} -> ${fmt(totalAfter)}  (saved ${fmt(totalBefore - totalAfter)}) ===`);
