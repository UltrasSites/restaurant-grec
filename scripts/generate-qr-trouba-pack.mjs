// generate-qr-trouba-pack.mjs
// Génère 2 QR codes pour le pack logo Trouba :
//   1. QR menu  → https://kalamakitroubas.gr/menu
//   2. QR avis  → https://kalamakitroubas.gr/avis
// Puis re-zippe le pack avec ces 2 QR ajoutés + titres en grec.

import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';

const PACK_DIR = 'C:\\Users\\User\\Desktop\\Ultras-Brain\\00-inbox\\trouba-logo-pack';
const ZIP_OUT = 'C:\\Users\\User\\Desktop\\Ultras-Brain\\00-inbox\\PACK_LOGO_TROUMPAS_COMPLET.zip';

const QR_MENU_URL = 'https://kalamakitroubas.gr/menu';
const QR_AVIS_URL = 'https://kalamakitroubas.gr/avis';

const log = (m) => console.log(m);

// Génère un QR code haute résolution avec titre grec en-dessous
async function makeQRWithTitle(text, titleGreek, titleLatin, outPath) {
  // 1. Génère le QR brut en buffer PNG (1200x1200, marge généreuse)
  const qrPng = await QRCode.toBuffer(text, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 4,
    width: 1200,
    color: {
      dark: '#0a0a0a',
      light: '#FFFFFF',
    },
  });

  // 2. Compose une image finale 1600x1800 avec QR + titre
  const finalW = 1600;
  const finalH = 1800;
  const qrSize = 1400;
  const qrX = (finalW - qrSize) / 2;
  const qrY = 100;

  // Resize le QR à 1400x1400
  const qrResized = await sharp(qrPng).resize(qrSize, qrSize).png().toBuffer();

  // Crée un SVG avec les titres
  const titleSvg = `<svg width="${finalW}" height="${finalH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${finalW}" height="${finalH}" fill="white"/>
    <text x="50%" y="${qrY + qrSize + 120}" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="#0a0a0a" text-anchor="middle">${titleGreek}</text>
    <text x="50%" y="${qrY + qrSize + 220}" font-family="Arial, sans-serif" font-size="56" fill="#666666" text-anchor="middle" font-style="italic">${titleLatin}</text>
  </svg>`;

  await sharp({
    create: { width: finalW, height: finalH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([
      { input: qrResized, top: qrY, left: qrX },
      { input: Buffer.from(titleSvg), top: 0, left: 0 },
    ])
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(outPath);

  log(`  ✅ ${outPath}`);
}

// Génère un QR composite "Avis" avec les 2 logos Google + TripAdvisor au-dessus
async function makeAvisQRWithLogos(outPath) {
  const qrPng = await QRCode.toBuffer(QR_AVIS_URL, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 4,
    width: 1200,
    color: { dark: '#0a0a0a', light: '#FFFFFF' },
  });

  const finalW = 1600;
  const finalH = 2000;
  const qrSize = 1300;
  const qrX = (finalW - qrSize) / 2;
  const qrY = 350; // place sous les logos

  const qrResized = await sharp(qrPng).resize(qrSize, qrSize).png().toBuffer();

  // SVG avec : titre haut "ΑΞΙΟΛΟΓΗΣΤΕ ΜΑΣ" + logos Google et TripAdvisor + sous-titre
  const composedSvg = `<svg width="${finalW}" height="${finalH}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${finalW}" height="${finalH}" fill="white"/>

    <!-- Titre principal grec -->
    <text x="50%" y="120" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#0a0a0a" text-anchor="middle">ΑΞΙΟΛΟΓΗΣΤΕ ΜΑΣ</text>
    <text x="50%" y="200" font-family="Arial, sans-serif" font-size="48" fill="#666666" text-anchor="middle" font-style="italic">Rate us — Google &amp; TripAdvisor</text>

    <!-- Google logo (simplifié G coloré) -->
    <g transform="translate(530, 220)">
      <circle cx="60" cy="60" r="55" fill="white" stroke="#dddddd" stroke-width="2"/>
      <text x="60" y="90" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle">
        <tspan fill="#4285F4">G</tspan>
      </text>
    </g>

    <!-- Séparateur -->
    <line x1="760" y1="265" x2="760" y2="335" stroke="#dddddd" stroke-width="2"/>

    <!-- TripAdvisor logo (cercle vert avec yeux) -->
    <g transform="translate(890, 220)">
      <circle cx="60" cy="60" r="55" fill="#34E0A1"/>
      <circle cx="40" cy="65" r="16" fill="white"/>
      <circle cx="80" cy="65" r="16" fill="white"/>
      <circle cx="40" cy="65" r="7" fill="#0a0a0a"/>
      <circle cx="80" cy="65" r="7" fill="#0a0a0a"/>
    </g>

    <!-- Pied de page -->
    <text x="50%" y="${finalH - 60}" font-family="Arial, sans-serif" font-size="40" fill="#999999" text-anchor="middle">kalamakitroubas.gr/avis</text>
  </svg>`;

  await sharp({
    create: { width: finalW, height: finalH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([
      { input: Buffer.from(composedSvg), top: 0, left: 0 },
      { input: qrResized, top: qrY, left: qrX },
    ])
    .png({ quality: 100, compressionLevel: 6 })
    .toFile(outPath);

  log(`  ✅ ${outPath}`);
}

(async () => {
  log('🎨 Génération des QR codes Trouba...');

  // 1. QR menu (titre grec : "ΣΑΡΩΣΤΕ ΤΟ QR — ΔΕΙΤΕ ΤΟ ΜΕΝΟΥ")
  const qrMenuPath = path.join(PACK_DIR, '11_QR_ΜΕΝΟΥ.png');
  await makeQRWithTitle(
    QR_MENU_URL,
    'ΣΑΡΩΣΤΕ — ΔΕΙΤΕ ΤΟ ΜΕΝΟΥ',
    'Scan — View the menu (7 languages)',
    qrMenuPath
  );

  // 2. QR avis composite (Google + TripAdvisor)
  const qrAvisPath = path.join(PACK_DIR, '12_QR_ΑΞΙΟΛΟΓΗΣΗ_GOOGLE_TRIPADVISOR.png');
  await makeAvisQRWithLogos(qrAvisPath);

  // 3. Recompose le zip
  log('\n📦 Création du zip final...');

  // Liste fichiers
  const files = fs.readdirSync(PACK_DIR).filter((f) => f !== '.' && f !== '..');
  log(`  Fichiers à zipper : ${files.length}`);
  files.forEach((f) => log(`    - ${f}`));

  // Utilise PowerShell Compress-Archive (natif Windows)
  if (fs.existsSync(ZIP_OUT)) fs.unlinkSync(ZIP_OUT);
  const psCmd = `Compress-Archive -Path '${PACK_DIR}\\*' -DestinationPath '${ZIP_OUT}' -CompressionLevel Optimal -Force`;
  const result = spawnSync('powershell.exe', ['-NoProfile', '-Command', psCmd], { encoding: 'utf8' });
  if (result.error) log('  ❌ PS error: ' + result.error.message);
  if (result.stderr) log('  stderr: ' + result.stderr.slice(0, 200));

  if (fs.existsSync(ZIP_OUT)) {
    const sz = fs.statSync(ZIP_OUT).size;
    log(`\n✅ Zip créé : ${ZIP_OUT} (${(sz / 1024).toFixed(0)} KB)`);
  } else {
    log('\n❌ Zip non créé');
  }
})();
