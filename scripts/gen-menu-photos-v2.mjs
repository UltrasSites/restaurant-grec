// Génère les photos manquantes pour le nouveau menu v2 :
// - Convertit les jpg depuis l'inbox e-food en webp 800w
// - Génère 2 composites : drinks-mix (4 boissons), veggie-fritters (zucchini + chickpea)
import sharp from 'sharp';
import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';

const INBOX = 'C:/Users/User/Desktop/Ultras-Brain/00-inbox/efood-trouba';
const RAW = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos/raw';
const OUT = 'C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/photos';

if (!existsSync(RAW)) mkdirSync(RAW, { recursive: true });
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// jpg index → cible nom
const NEEDED = [
  { idx: '031', stem: 'efood-31' }, // Μπιφτέκι λαχανικών (veggie patty - solo)
  { idx: '034', stem: 'efood-34' }, // Ρεβυθοκεφτές (falafel)
  { idx: '035', stem: 'efood-35' }, // Κολοκυθοκεφτές (zucchini fritter)
  { idx: '039', stem: 'efood-39' }, // Κολοκυθοκεφτέδες σε πίτα (zucchini in pita)
  { idx: '040', stem: 'efood-40' }, // Ρεβυθοκεφτέδες σε πίτα
  { idx: '055', stem: 'efood-55' }, // Σκεπαστή καλαμάκι χοιρινό
  { idx: '058', stem: 'efood-58' }, // Σκεπαστή μπιφτέκι μοσχαρίσιο (best skepasti for page 13)
  { idx: '064', stem: 'efood-64' }, // Burger μοσχαρίσιο (real hamburger)
  { idx: '065', stem: 'efood-65' }, // Veggie burger
  { idx: '066', stem: 'efood-66' }, // Καλαμάκι χοιρινό μερίδα (skewers portion plate)
  { idx: '070', stem: 'efood-70' }, // Special μπιφτέκι μερίδα (Trouba special plate)
  { idx: '075', stem: 'efood-75' }, // Κεμπάπ σεϊτάν σε πίτα (seitan kebab in pita - veggie wrap)
  // Drinks composite sources
  { idx: '077', stem: 'efood-77' }, // Coca-Cola 330ml
  { idx: '080', stem: 'efood-80' }, // Fanta 330ml
  { idx: '087', stem: 'efood-87' }, // Heineken 330ml
  { idx: '094', stem: 'efood-94' }, // Mythos 500ml
];

// Trouve le fichier jpg correspondant à un index dans inbox
import { readdirSync } from 'fs';
const inboxFiles = readdirSync(INBOX);

function findJpg(idx) {
  return inboxFiles.find(f => f.startsWith(idx + '-') || f.startsWith(idx + '.jpg'));
}

console.log('Step 1 — copy jpg from inbox to raw…');
for (const { idx, stem } of NEEDED) {
  const jpg = findJpg(idx);
  if (!jpg) { console.warn('  no jpg for idx', idx); continue; }
  const src = join(INBOX, jpg);
  const dst = join(RAW, `${stem}.jpg`);
  if (!existsSync(dst)) copyFileSync(src, dst);
}

console.log('Step 2 — generate webp 400w + 800w…');
const widths = [400, 800];
for (const { stem } of NEEDED) {
  const src = join(RAW, `${stem}.jpg`);
  if (!existsSync(src)) continue;
  for (const w of widths) {
    const out = join(OUT, `${stem}-${w}w.webp`);
    if (existsSync(out)) continue;
    try {
      await sharp(src).resize(w).webp({ quality: 80 }).toFile(out);
      process.stdout.write('.');
    } catch (e) { console.error('\nFAIL', stem, w, e.message); }
  }
}
console.log();

// Composite "drinks-mix" : 2x2 grid (Coca, Fanta, Heineken, Mythos)
console.log('Step 3 — composite drinks-mix…');
async function makeDrinksMix() {
  const W = 800, H = 800;
  const cellW = W / 2, cellH = H / 2;
  const sources = [
    'efood-77.jpg', // Coca
    'efood-80.jpg', // Fanta
    'efood-87.jpg', // Heineken
    'efood-94.jpg', // Mythos
  ];
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) { console.warn('  missing tile', sources[i]); continue; }
    const buf = await sharp(src).resize(cellW, cellH, { fit: 'cover' }).toBuffer();
    const x = (i % 2) * cellW;
    const y = Math.floor(i / 2) * cellH;
    tiles.push({ input: buf, top: y, left: x });
  }
  const composite = await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(tiles)
    .webp({ quality: 82 })
    .toFile(join(OUT, 'efood-drinks-mix-800w.webp'));
  console.log('  → efood-drinks-mix-800w.webp', composite.width, 'x', composite.height);

  // 400w version for srcset
  await sharp(join(OUT, 'efood-drinks-mix-800w.webp'))
    .resize(400)
    .webp({ quality: 80 })
    .toFile(join(OUT, 'efood-drinks-mix-400w.webp'));
}
await makeDrinksMix();

// Composite "veggie-fritters" : zucchini + chickpea side-by-side
console.log('Step 4 — composite veggie-fritters…');
async function makeVeggieFritters() {
  const W = 800, H = 600;
  const cellW = W / 2;
  const sources = [
    'efood-35.jpg', // Κολοκυθοκεφτές (zucchini)
    'efood-34.jpg', // Ρεβυθοκεφτές (chickpea/falafel)
  ];
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) { console.warn('  missing tile', sources[i]); continue; }
    const buf = await sharp(src).resize(cellW, H, { fit: 'cover' }).toBuffer();
    tiles.push({ input: buf, top: 0, left: i * cellW });
  }
  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(tiles)
    .webp({ quality: 82 })
    .toFile(join(OUT, 'efood-veggie-fritters-800w.webp'));
  await sharp(join(OUT, 'efood-veggie-fritters-800w.webp'))
    .resize(400)
    .webp({ quality: 80 })
    .toFile(join(OUT, 'efood-veggie-fritters-400w.webp'));
  console.log('  → efood-veggie-fritters-{400,800}w.webp');
}
await makeVeggieFritters();

// Composite "page13-mix" : burger (064) + skepasti (058) for page 13
console.log('Step 5 — composite sandwich-skepasti…');
async function makePage13() {
  const W = 800, H = 600;
  const cellW = W / 2;
  const sources = ['efood-64.jpg', 'efood-58.jpg'];
  const tiles = [];
  for (let i = 0; i < sources.length; i++) {
    const src = join(RAW, sources[i]);
    if (!existsSync(src)) continue;
    const buf = await sharp(src).resize(cellW, H, { fit: 'cover' }).toBuffer();
    tiles.push({ input: buf, top: 0, left: i * cellW });
  }
  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite(tiles)
    .webp({ quality: 82 })
    .toFile(join(OUT, 'efood-sandwich-skepasti-800w.webp'));
  await sharp(join(OUT, 'efood-sandwich-skepasti-800w.webp'))
    .resize(400)
    .webp({ quality: 80 })
    .toFile(join(OUT, 'efood-sandwich-skepasti-400w.webp'));
  console.log('  → efood-sandwich-skepasti-{400,800}w.webp');
}
await makePage13();

console.log('\nDone.');
