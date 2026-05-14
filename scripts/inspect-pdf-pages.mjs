// inspect-pdf-pages.mjs — utilise pdf-lib pour analyser le contenu de chaque page
import { PDFDocument } from 'pdf-lib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');

const file = path.join(OUT_DIR, 'menu-fr.pdf');
const buf = fs.readFileSync(file);
const doc = await PDFDocument.load(buf);
const pages = doc.getPages();
console.log(`menu-fr.pdf : ${pages.length} pages\n`);

for (let i = 0; i < pages.length; i++) {
  const p = pages[i];
  // Récupère le content stream brut
  const contents = p.node.Contents();
  let totalLen = 0;
  if (contents) {
    if (contents.constructor.name === 'PDFArray') {
      // Array de refs
      const arr = contents.asArray();
      for (const ref of arr) {
        const obj = doc.context.lookup(ref);
        if (obj && obj.contents) totalLen += obj.contents.length;
      }
    } else {
      // Single stream
      if (contents.contents) totalLen = contents.contents.length;
    }
  }
  const size = p.getSize();
  console.log(`Page ${String(i + 1).padStart(2)} | ${size.width.toFixed(0)}x${size.height.toFixed(0)} | content stream ~${totalLen}B ${totalLen < 200 ? '⚠️ TRÈS PETIT (possible vide)' : ''}`);
}
