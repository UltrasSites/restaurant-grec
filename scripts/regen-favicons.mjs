// Régénère favicons Kalamaki depuis le vrai logo (Tiago 27/05)
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const SOURCE = 'public/photos/logo-dark-bg.png';
const PUBLIC = 'public';

const sizes = [
  { name: 'icon-180.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-192-maskable.png', size: 192, padding: 0.1 }, // maskable safe zone 10%
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-512-maskable.png', size: 512, padding: 0.1 },
  { name: 'favicon-32.png', size: 32 },
];

for (const { name, size, padding } of sizes) {
  const img = sharp(SOURCE).resize(size, size, { fit: 'contain', background: { r: 10, g: 10, b: 10, alpha: 1 } });
  if (padding) {
    const inner = Math.round(size * (1 - padding * 2));
    await sharp(SOURCE)
      .resize(inner, inner, { fit: 'contain', background: { r: 10, g: 10, b: 10, alpha: 1 } })
      .extend({
        top: Math.round(size * padding),
        bottom: Math.round(size * padding),
        left: Math.round(size * padding),
        right: Math.round(size * padding),
        background: { r: 10, g: 10, b: 10, alpha: 1 },
      })
      .png()
      .toFile(`${PUBLIC}/${name}`);
  } else {
    await img.png().toFile(`${PUBLIC}/${name}`);
  }
  console.log(`✓ ${name} (${size}×${size})`);
}

// Generate favicon.svg embedding the PNG as base64
import { readFileSync } from 'node:fs';
const png32 = readFileSync(`${PUBLIC}/favicon-32.png`).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><image href="data:image/png;base64,${png32}" width="32" height="32"/></svg>`;
writeFileSync(`${PUBLIC}/favicon.svg`, svg, 'utf-8');
console.log('✓ favicon.svg (embedded PNG)');
