// qa-pdfs-v2.mjs — QA solide avec pdf-parse (extraction texte fiable)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'public');
const LANGS = ['zh', 'el', 'en', 'fr', 'pt', 'it', 'es', 'de'];

// Keywords attendus par langue (présence = traduction OK)
const EXPECTED = {
  zh: ['菜单', '饮料', '沙拉', '汉堡', '皮塔'],
  el: ['Καλαμάκι', 'Πίτες', 'Σαλάτες', 'Ορεκτικά', 'Ποτά'],
  en: ['Menu', 'Drinks', 'Salads', 'Pita Wraps', 'Hamburger'],
  fr: ['Carte', 'Boissons', 'Salades', 'Pita', 'Hamburger'],
  pt: ['Cardápio', 'Bebidas', 'Saladas', 'Pita', 'Hambúrguer'],
  it: ['Menu', 'Bevande', 'Insalate', 'Pita', 'Hamburger'],
  es: ['Carta', 'Bebidas', 'Ensaladas', 'Pita', 'Hamburguesa'],
  de: ['Speisekarte', 'Getränke', 'Salate', 'Pita', 'Hamburger'],
};

// Sections qu'on s'attend à trouver dans toutes les langues
const PRICE_PATTERN = /\d+,\d{2}\s?€/g;

console.log('=== QA APPROFONDIE — 8 PDFs ===\n');
const summary = [];

for (const lang of LANGS) {
  const file = path.join(OUT_DIR, `menu-${lang}.pdf`);
  const buf = fs.readFileSync(file);
  const data = await pdfParse(buf);

  const numPages = data.numpages;
  const text = data.text;
  const expected = EXPECTED[lang] || [];
  const foundKeywords = expected.filter((k) => text.includes(k));
  const missingKeywords = expected.filter((k) => !text.includes(k));

  const prices = text.match(PRICE_PATTERN) || [];
  const uniquePrices = [...new Set(prices)];

  // Page texte length (estimation des pages "petites") via split par form-feed ou pas
  const pages = text.split(/\f|/);
  const blankishPages = pages.map((p, i) => ({ idx: i + 1, len: p.trim().length }))
    .filter((p) => p.len < 50);

  summary.push({
    lang,
    pages: numPages,
    size: (buf.length / 1024).toFixed(1) + 'KB',
    textLen: text.length,
    keywords: `${foundKeywords.length}/${expected.length}`,
    missing: missingKeywords,
    pricesUnique: uniquePrices.length,
    sampleText: text.replace(/\s+/g, ' ').slice(0, 200),
    blankishPages: blankishPages.length,
  });

  console.log(`\n[${lang.toUpperCase()}]`);
  console.log(`  📄 ${numPages} pages | ${(buf.length / 1024).toFixed(1)}KB | ${text.length} chars texte`);
  console.log(`  🔑 Keywords : ${foundKeywords.length}/${expected.length} trouvés${missingKeywords.length ? ' | MANQUE : ' + missingKeywords.join(', ') : ''}`);
  console.log(`  💶 ${prices.length} prix matchés (${uniquePrices.length} uniques)`);
  console.log(`  📝 Echantillon : "${text.replace(/\s+/g, ' ').slice(0, 150)}..."`);
}

console.log('\n\n=== SOMMAIRE ===\n');
console.log('Lang | Pages | Size  | TextLen | KW    | Prix uniques | Sample');
console.log('-'.repeat(110));
summary.forEach((s) => {
  console.log(`${s.lang.toUpperCase().padEnd(4)} | ${String(s.pages).padEnd(5)} | ${s.size.padEnd(5)} | ${String(s.textLen).padEnd(7)} | ${s.keywords.padEnd(5)} | ${String(s.pricesUnique).padEnd(12)} | ${s.sampleText.slice(0, 50)}...`);
});

fs.writeFileSync(path.join(__dirname, '..', 'qa-pdfs-v2-report.json'), JSON.stringify(summary, null, 2));
console.log('\n💾 Rapport : qa-pdfs-v2-report.json');
