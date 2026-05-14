// qa-pdfs-v3.mjs — Extraction texte fiable via pdfjs-dist
// Vérifie page par page : pas de pages blanches + keywords langue + prix + galerie

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'public');
const LANGS = ['zh', 'el', 'en', 'fr', 'pt', 'it', 'es', 'de'];

const EXPECTED = {
  zh: ['菜单', '饮料', '沙拉', '汉堡'],
  el: ['Καλαμάκι', 'Πίτες', 'Σαλάτες', 'Ορεκτικά', 'Ποτά'],
  en: ['Menu', 'Drinks', 'Salads', 'Pita Wraps'],
  fr: ['Carte', 'Boissons', 'Salades', 'Pita', 'Brochette'],
  pt: ['Cardápio', 'Bebidas', 'Saladas', 'Espetada'],
  it: ['Menu', 'Bevande', 'Insalate', 'Spiedino'],
  es: ['Carta', 'Bebidas', 'Ensaladas', 'Brocheta'],
  de: ['Speisekarte', 'Getränke', 'Salate', 'Spieß'],
};

const GALLERY_LABELS = {
  fr: 'SPÉCIALITÉS', en: 'SPECIALITIES', el: 'ΣΠΕΣΙΑΛΙΤΕ', de: 'SPEZIALITÄTEN',
  es: 'ESPECIALIDADES', it: 'SPECIALITÀ', pt: 'ESPECIALIDADES', zh: '特色',
};

const reports = {};

for (const lang of LANGS) {
  const file = path.join(OUT_DIR, `menu-${lang}.pdf`);
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjsLib.getDocument({ data, useSystemFonts: false }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const p = await doc.getPage(i);
    const tc = await p.getTextContent();
    const text = tc.items.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
    // Compte images via opérateurs
    const ops = await p.getOperatorList();
    const imgCount = (ops.fnArray || []).filter((op) => op === pdfjsLib.OPS.paintImageXObject).length;
    pages.push({ num: i, textLen: text.length, text, imgCount });
  }

  const fullText = pages.map((p) => p.text).join(' ');
  const expected = EXPECTED[lang] || [];
  const found = expected.filter((k) => fullText.includes(k));
  const missing = expected.filter((k) => !fullText.includes(k));

  const prices = (fullText.match(/\d+,\d{2}\s?€/g) || []);
  const galleryLabel = GALLERY_LABELS[lang];
  const galleryFound = galleryLabel ? fullText.includes(galleryLabel) : false;

  // Pages "blanches" : ni texte ni images
  const blank = pages.filter((p) => p.textLen < 30 && p.imgCount === 0);

  reports[lang] = {
    pages: pages.length,
    blank: blank.map((p) => p.num),
    found: `${found.length}/${expected.length}`,
    missing,
    prices: prices.length,
    galleryFound,
    galleryPage: pages.find((p) => p.imgCount >= 3)?.num || null,
    sample_p2: pages[1]?.text.slice(0, 150),
  };
}

console.log('=== QA pdfjs-dist v3 ===\n');
for (const lang of LANGS) {
  const r = reports[lang];
  const status = r.blank.length === 0 && r.missing.length === 0 && r.galleryFound ? '✅' : '⚠️';
  console.log(`${status} [${lang.toUpperCase()}] ${r.pages}pgs | blank: ${r.blank.length ? r.blank.join(',') : '0'} | keywords: ${r.found}${r.missing.length ? ' (manque: ' + r.missing.join(', ') + ')' : ''} | prix: ${r.prices} | galerie p${r.galleryPage || '?'}: ${r.galleryFound ? 'OK' : 'NON'}`);
  console.log(`   sample p2: "${r.sample_p2}..."`);
}

fs.writeFileSync(path.join(__dirname, '..', 'qa-pdfs-v3.json'), JSON.stringify(reports, null, 2));
