// 27/05 — force compression des 3 cibles PageSpeed principales (q=65)
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public/photos');

async function force(file, q) {
  const src = path.join(ROOT, file);
  const before = (await fs.stat(src)).size;
  const inputBuf = await fs.readFile(src);
  const buf = await sharp(inputBuf).webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer();
  const tmp = src + '.tmp';
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, src);
  console.log(`OK ${file}: ${(before/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB (q=${q})`);
}

await force('efood-00-1600w.webp', 60);
await force('efood-00-800w.webp', 60);
await force('logo-main-200w.webp', 70);
// resize trouba-storefront-800w à 640 (taille affichée 606x455)
{
  const src = path.join(ROOT, 'trouba-storefront-800w.webp');
  const before = (await fs.stat(src)).size;
  const inputBuf = await fs.readFile(src);
  const buf = await sharp(inputBuf).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 70, effort: 6 }).toBuffer();
  const tmp = src + '.tmp';
  await fs.writeFile(tmp, buf);
  await fs.rename(tmp, src);
  console.log(`OK trouba-storefront-800w.webp: ${(before/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB (resize 640)`);
}
