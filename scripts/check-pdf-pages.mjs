// check-pdf-pages.mjs — détecte pages blanches dans les PDFs générés
// Stratégie : pdfkit ne parse pas → on lit le PDF brut et on compte les pages
// + estime contenu via taille relative de chaque page object

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');
const LANGS = ['zh', 'el', 'en', 'fr', 'pt', 'it', 'es', 'de'];

function countPages(buf) {
  // Recherche des objets "/Type /Page" (single Page, pas /Pages)
  const s = buf.toString('latin1');
  // Regex stricte : "/Type /Page" suivi d'un caractère non-s (donc pas /Pages)
  const re = /\/Type\s*\/Page(?![s])/g;
  return (s.match(re) || []).length;
}

function getContentStreamLengths(buf) {
  // Trouve toutes les longueurs des content streams (stream / endstream pairs)
  const s = buf.toString('latin1');
  const lengths = [];
  let idx = 0;
  while (true) {
    const start = s.indexOf('stream\n', idx);
    if (start === -1) break;
    const end = s.indexOf('\nendstream', start);
    if (end === -1) break;
    lengths.push(end - start - 7);
    idx = end + 10;
  }
  return lengths;
}

for (const lang of LANGS) {
  const file = path.join(OUT_DIR, `menu-${lang}.pdf`);
  if (!fs.existsSync(file)) { console.log(`${lang}: MISSING`); continue; }
  const buf = fs.readFileSync(file);
  const pages = countPages(buf);
  const streams = getContentStreamLengths(buf);
  // En moyenne, une page utile a un content stream de quelques KB. Page blanche < 500 bytes.
  const tiny = streams.filter((l) => l < 500).length;
  const small = streams.filter((l) => l >= 500 && l < 2000).length;
  const normal = streams.filter((l) => l >= 2000).length;
  console.log(
    `${lang}: ${pages} pages | ${(buf.length/1024).toFixed(1)} KB | streams: ${streams.length} total `
    + `(tiny<500B: ${tiny}, small<2KB: ${small}, normal: ${normal})`
  );
  if (tiny > 0) {
    console.log(`  ⚠️  ${tiny} stream(s) très petits (<500B) — possibles pages vides`);
  }
}
