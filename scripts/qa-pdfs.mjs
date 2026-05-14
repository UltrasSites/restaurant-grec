// qa-pdfs.mjs — Contrôle qualité approfondi des 8 PDFs menu
// Vérifie : pages blanches réelles (texte), traductions présentes, images galerie, fontes

import { PDFDocument } from 'pdf-lib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public');
const LANGS = ['zh', 'el', 'en', 'fr', 'pt', 'it', 'es', 'de'];

// Décompresse les streams pour estimer le contenu textuel par page
function extractPageText(buf, pageRef, doc) {
  const node = doc.context.lookup(pageRef);
  if (!node) return '';
  const contents = node.Contents();
  if (!contents) return '';

  const streams = contents.constructor.name === 'PDFArray'
    ? contents.asArray().map((r) => doc.context.lookup(r))
    : [contents];

  let text = '';
  for (const s of streams) {
    if (!s || !s.contents) continue;
    let raw;
    try {
      // Decompress si /Filter /FlateDecode
      raw = zlib.inflateSync(Buffer.from(s.contents));
    } catch {
      raw = Buffer.from(s.contents);
    }
    text += raw.toString('latin1');
  }
  return text;
}

// Estime le nombre de glyphes "Tj" / "TJ" dans le content stream (operateurs texte PDF)
function countTextOps(streamText) {
  const tj = (streamText.match(/\)\s*Tj/g) || []).length;
  const tjArray = (streamText.match(/\]\s*TJ/g) || []).length;
  return tj + tjArray;
}

const KEYWORDS_PER_LANG = {
  zh: ['菜单', '饮料', '沙拉'],
  el: ['Καλαμάκι', 'Πίτες', 'Σαλάτες'],
  en: ['Menu', 'Drinks', 'Salad'],
  fr: ['Carte', 'Boissons', 'Salade'],
  pt: ['Cardápio', 'Bebidas', 'Salada'],
  it: ['Menu', 'Bevande', 'Insalata'],
  es: ['Carta', 'Bebidas', 'Ensalada'],
  de: ['Speisekarte', 'Getränke', 'Salat'],
};

const results = {};

for (const lang of LANGS) {
  const file = path.join(OUT_DIR, `menu-${lang}.pdf`);
  if (!fs.existsSync(file)) { results[lang] = { error: 'MISSING' }; continue; }
  const buf = fs.readFileSync(file);
  const doc = await PDFDocument.load(buf);
  const pages = doc.getPages();

  const pageReports = [];
  let imageRefs = 0;
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const streamText = extractPageText(buf, p.ref, doc);
    const textOps = countTextOps(streamText);
    // Compte les ressources XObject Image embed
    const resources = p.node.Resources();
    let pageImgCount = 0;
    if (resources) {
      const xobj = resources.lookup ? resources.lookup('XObject') : null;
      if (xobj && xobj.dict) pageImgCount = xobj.dict.size;
    }
    imageRefs += pageImgCount;
    pageReports.push({ page: i + 1, textOps, hasImages: pageImgCount > 0, imgCount: pageImgCount, streamLen: streamText.length });
  }

  // Cherche les keywords dans le PDF entier (texte concatenated)
  const fullText = pageReports.map((p, i) => extractPageText(buf, pages[i].ref, doc)).join(' ');
  const keywords = KEYWORDS_PER_LANG[lang] || [];
  const keywordsFound = keywords.filter((k) => fullText.includes(k));

  // Page blanche = pas d'opérateurs texte ET pas d'images
  const blankPages = pageReports.filter((p) => p.textOps === 0 && !p.hasImages);

  results[lang] = {
    fileSize: (buf.length / 1024).toFixed(1) + ' KB',
    totalPages: pages.length,
    totalImageRefs: imageRefs,
    blankPages: blankPages.length,
    blankPageNumbers: blankPages.map((p) => p.page),
    keywordsFound: `${keywordsFound.length}/${keywords.length} (${keywordsFound.join(', ')})`,
    pagesWithImages: pageReports.filter((p) => p.hasImages).map((p) => p.page),
    sample: pageReports.slice(0, 5).map((p) => ({ page: p.page, ops: p.textOps, imgs: p.imgCount })),
  };
}

console.log('=== QA REPORT PDFs ===\n');
for (const lang of LANGS) {
  const r = results[lang];
  console.log(`\n${lang.toUpperCase()}:`);
  if (r.error) { console.log('  ❌ ' + r.error); continue; }
  console.log(`  📄 ${r.totalPages} pages | ${r.fileSize}`);
  console.log(`  🖼️  Pages avec images : ${r.pagesWithImages.join(', ') || '(aucune)'}`);
  console.log(`  📝 Mots-clés langue : ${r.keywordsFound}`);
  if (r.blankPages > 0) {
    console.log(`  ⚠️  ${r.blankPages} PAGES BLANCHES : ${r.blankPageNumbers.join(', ')}`);
  } else {
    console.log(`  ✅ 0 page blanche`);
  }
}

fs.writeFileSync(path.join(__dirname, '..', 'qa-pdfs-report.json'), JSON.stringify(results, null, 2));
console.log('\n💾 Rapport complet : qa-pdfs-report.json');
