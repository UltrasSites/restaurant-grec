#!/usr/bin/env node
/**
 * Convertit toutes les photos raw/ en webp 3 tailles (400, 800, 1600).
 * Skip les images < 400px ou < 5KB.
 * Output : public/photos/{name}-{size}.webp
 */
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";

const RAW_DIR = "public/photos/raw";
const OUT_DIR = "public/photos";
const SIZES = [400, 800, 1600];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = await readdir(RAW_DIR);
  const images = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  console.log(`Found ${images.length} images to process`);

  let ok = 0, skip = 0, err = 0;
  for (const file of images) {
    const inPath = join(RAW_DIR, file);
    const name = basename(file, extname(file));

    try {
      const st = await stat(inPath);
      if (st.size < 5000) { skip++; continue; }

      const meta = await sharp(inPath).metadata();
      if (!meta.width || meta.width < 400) { skip++; continue; }

      for (const w of SIZES) {
        if (w > meta.width) continue;
        const outPath = join(OUT_DIR, `${name}-${w}w.webp`);
        await sharp(inPath)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 82, effort: 4 })
          .toFile(outPath);
      }
      ok++;
    } catch (e) {
      console.error(`  ✗ ${file}: ${e.message}`);
      err++;
    }
  }

  console.log(`Done: ${ok} processed, ${skip} skipped, ${err} errors`);
}

main().catch((e) => { console.error(e); process.exit(1); });
