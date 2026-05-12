// Downloads Noto fonts required by generate-menus.mjs into scripts/fonts/
// Run once after fresh clone: node scripts/download-fonts.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT = path.join(__dirname, "fonts");

const FILES = [
  ["NotoSans-Regular.ttf",       "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf"],
  ["NotoSans-Bold.ttf",          "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf"],
  ["NotoSerif-Regular.ttf",      "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSerif/NotoSerif-Regular.ttf"],
  ["NotoSerif-Bold.ttf",         "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSerif/NotoSerif-Bold.ttf"],
  ["NotoSerif-Italic.ttf",       "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSerif/NotoSerif-Italic.ttf"],
  ["NotoSerif-BoldItalic.ttf",   "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoSerif/NotoSerif-BoldItalic.ttf"],
  ["NotoSansSC-Regular.ttf",     "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf"],
];

fs.mkdirSync(OUT, { recursive: true });

for (const [name, url] of FILES) {
  const dest = path.join(OUT, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    console.log(`  skip ${name} (already present)`);
    continue;
  }
  console.log(`  fetching ${name}...`);
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`    → ${(buf.length / 1024).toFixed(1)} KB`);
}

console.log("Done.");
