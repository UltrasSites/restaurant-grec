// rezip-pack-trouba.mjs — Recompose le zip pack logo Trouba avec UTF-8 propre
// (PowerShell Compress-Archive corrompt les noms de fichiers grecs)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');

const PACK_DIR = 'C:\\Users\\User\\Desktop\\Ultras-Brain\\00-inbox\\trouba-logo-pack';
const ZIP_OUT = 'C:\\Users\\User\\Desktop\\Ultras-Brain\\00-inbox\\PACK_LOGO_TROUMPAS_COMPLET.zip';

if (fs.existsSync(ZIP_OUT)) fs.unlinkSync(ZIP_OUT);

const zip = new AdmZip();
const files = fs.readdirSync(PACK_DIR).filter((f) => !f.startsWith('.'));

console.log(`📦 Construction du zip avec ${files.length} fichiers UTF-8...`);
files.forEach((f) => {
  const full = path.join(PACK_DIR, f);
  if (fs.statSync(full).isFile()) {
    // addLocalFile : préserve le nom UTF-8 grâce à adm-zip
    zip.addLocalFile(full);
    console.log(`  + ${f}`);
  }
});

zip.writeZip(ZIP_OUT);
const sz = fs.statSync(ZIP_OUT).size;
console.log(`\n✅ Zip UTF-8 créé : ${ZIP_OUT} (${(sz / 1024).toFixed(0)} KB)`);
console.log(`📋 ${files.length} fichiers, noms grecs préservés`);
