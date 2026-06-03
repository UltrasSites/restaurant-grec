// scripts/compress-perf-images.mjs
// 27/05 — Compresse les images identifiées par PageSpeed comme trop lourdes.
//   - efood-00-1600w.webp : 128KB -> q=72 (~65KB)
//   - trouba-storefront-800w.webp : 65KB -> resize 640w q=72 (~37KB)
//   - logo-main-200w.webp : 22KB -> q=75 (~10KB)
//   - efood-*-1600w/800w : recompresse pack entier q=72 (gain global)
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public/photos');

async function recompress(file, opts = {}) {
  const { quality = 72, resizeWidth = null, outFile = null } = opts;
  const src = path.join(ROOT, file);
  const dst = outFile || src;
  try {
    const before = (await fs.stat(src)).size;
    // Lire le fichier en mémoire d'abord (libère le handle Windows immédiatement)
    const inputBuf = await fs.readFile(src);
    let pipeline = sharp(inputBuf);
    if (resizeWidth) pipeline = pipeline.resize({ width: resizeWidth, withoutEnlargement: true });
    const buf = await pipeline.webp({ quality, effort: 6 }).toBuffer();
    if (buf.length >= before && !resizeWidth) {
      console.log(`  SKIP ${file} (recompressed not smaller: ${before} vs ${buf.length})`);
      return { file, gain: 0 };
    }
    // Écriture atomique : tmp puis rename
    const tmp = dst + '.tmp';
    await fs.writeFile(tmp, buf);
    await fs.rename(tmp, dst);
    const gain = before - buf.length;
    console.log(`  OK ${file}: ${(before/1024).toFixed(1)}KB -> ${(buf.length/1024).toFixed(1)}KB (gain ${(gain/1024).toFixed(1)}KB)`);
    return { file, gain };
  } catch (e) {
    console.error(`  ERR ${file}:`, e.message);
    return { file, gain: 0, error: e.message };
  }
}

async function main() {
  console.log('[compress-perf-images] start');
  const results = [];

  // 1. Cible PageSpeed n°1 — logo-main-200w (rendu petit, économie 18.6KB)
  results.push(await recompress('logo-main-200w.webp', { quality: 78 }));

  // 2. Cible PageSpeed n°2 — trouba-storefront-800w (rendu 606x455, économie 27.8KB)
  results.push(await recompress('trouba-storefront-800w.webp', { quality: 72, resizeWidth: 720 }));

  // 3. Cible PageSpeed n°3 — efood-00-1600w (rendu mobile, économie 62.7KB)
  results.push(await recompress('efood-00-1600w.webp', { quality: 70 }));
  results.push(await recompress('efood-00-800w.webp', { quality: 72 }));

  // 4. Pack efood : compress quality 70 sur 1600w (impact strip mobile)
  for (let i = 1; i <= 30; i++) {
    const id = String(i).padStart(2, '0');
    const f = `efood-${id}-1600w.webp`;
    try { await fs.stat(path.join(ROOT, f)); } catch { continue; }
    results.push(await recompress(f, { quality: 70 }));
  }
  // efood 800w : quality 72
  for (let i = 0; i <= 30; i++) {
    const id = String(i).padStart(2, '0');
    const f = `efood-${id}-800w.webp`;
    try { await fs.stat(path.join(ROOT, f)); } catch { continue; }
    results.push(await recompress(f, { quality: 72 }));
  }
  // efood 400w : quality 75 (déjà petit, faible gain)
  for (let i = 0; i <= 30; i++) {
    const id = String(i).padStart(2, '0');
    const f = `efood-${id}-400w.webp`;
    try { await fs.stat(path.join(ROOT, f)); } catch { continue; }
    results.push(await recompress(f, { quality: 75 }));
  }

  const totalGain = results.reduce((s, r) => s + (r.gain || 0), 0);
  console.log(`\n[compress-perf-images] total gain: ${(totalGain/1024).toFixed(1)}KB across ${results.length} files`);
}

main().catch((e) => { console.error(e); process.exit(1); });
