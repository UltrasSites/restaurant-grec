// Génère src/data/menu-i18n-names.json : nom des produits en 12 langues, clé = nom grec.
// Combine menu-data.ts (el/en/de/ru/ja + prix/ids) + scripts/menu-data.mjs (el/en/de/fr/es/it/pt/zh).
// Noms de plats grecs gardés en grec (via menu-data.mjs greek()). tr/nl → fallback EN (conforme "le reste anglais ou grec").
// Ne modifie PAS menu-data.ts. Le ticket cuisine reste en grec (name_el).
import { readFileSync, writeFileSync } from "fs";
import { PAGES, LANG_FLAGS, LANG_LABELS, LANGS } from "./menu-data.mjs";

// 1) Map des noms multilingues du .mjs, clé = nom grec
const mjs = {};
for (const p of PAGES) for (const it of p.items || []) {
  const n = it.name;
  if (n && n.el) mjs[n.el] = n;
}

// 2) Extraire le littéral menuPages de menu-data.ts (data pure → eval sûr)
const tsText = readFileSync(new URL("../src/data/menu-data.ts", import.meta.url), "utf8");
const eq = tsText.indexOf("=", tsText.indexOf("menuPages"));
const arrStart = tsText.indexOf("[", eq);
let depth = 0, end = -1;
for (let i = arrStart; i < tsText.length; i++) {
  const c = tsText[i];
  if (c === "[") depth++;
  else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
}
const menuPages = eval("(" + tsText.slice(arrStart, end + 1) + ")");

// 3) Merge → nom en 12 langues par nom grec
const ALL = ["el", "en", "fr", "pt", "it", "es", "de", "ru", "ja", "tr", "nl", "zh"];
const names = {};
let matched = 0, total = 0;
for (const page of menuPages) for (const it of page.items || []) {
  const el = it.el;
  if (!el) continue;
  total++;
  const m = mjs[el];
  if (m) matched++;
  const en = it.en || el;
  names[el] = {
    el,
    en,
    de: it.de || (m && m.de) || en,
    ru: it.ru || en,
    ja: it.ja || en,
    fr: (m && m.fr) || en,
    es: (m && m.es) || en,
    it: (m && m.it) || en,
    pt: (m && m.pt) || en,
    zh: (m && m.zh) || en,
    tr: en,
    nl: en,
  };
}

writeFileSync(
  new URL("../src/data/menu-i18n-names.json", import.meta.url),
  JSON.stringify({ langs: LANGS, flags: LANG_FLAGS, labels: LANG_LABELS, names }, null, 2)
);
console.log("menuPages items:", total, "| matched .mjs:", matched, "| names written:", Object.keys(names).length);
