// Generate 6 PDFs (zh, el, fr, pt, it, es) for Kalamaki Troubas menu
// Run: node scripts/generate-menus.mjs

import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { LANGS, RESTAURANT, PAGES, pick } from "./menu-data.mjs";

// Cache des conversions WebP → JPEG (pdfkit ne supporte pas WebP).
// Pré-rempli au démarrage via preloadGalleryImages() → utilisable de manière synchrone ensuite.
const _imgCache = new Map();
function getJpeg(filePath) {
  return _imgCache.get(filePath) || null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const FONT_DIR = path.join(__dirname, "fonts");
const OUT_DIR = path.join(ROOT, "public");
const LOGO_PATH = path.join(OUT_DIR, "photos", "logo-main.png");

const GOLD = "#E5B32A";
const DARK = "#0a0a0a";
const PAGE_BG = "#0d0d0d";
const WHITE = "#f4f4f4";
const GREY = "#9a9a9a";
const DIM = "#6a6a6a";
const ACCENT_DIM = "#3a2e0e";

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 48;

// Font picker — for Chinese we use NotoSansSC, else NotoSerif/NotoSans
function fontsFor(lang) {
  if (lang === "zh") {
    return {
      regular: path.join(FONT_DIR, "NotoSansSC-Regular.ttf"),
      bold: path.join(FONT_DIR, "NotoSansSC-Regular.ttf"),
      italic: path.join(FONT_DIR, "NotoSansSC-Regular.ttf"),
      boldItalic: path.join(FONT_DIR, "NotoSansSC-Regular.ttf"),
      sans: path.join(FONT_DIR, "NotoSansSC-Regular.ttf"),
      sansBold: path.join(FONT_DIR, "NotoSansSC-Regular.ttf"),
    };
  }
  return {
    regular: path.join(FONT_DIR, "NotoSerif-Regular.ttf"),
    bold: path.join(FONT_DIR, "NotoSerif-Bold.ttf"),
    italic: path.join(FONT_DIR, "NotoSerif-Italic.ttf"),
    boldItalic: path.join(FONT_DIR, "NotoSerif-BoldItalic.ttf"),
    sans: path.join(FONT_DIR, "NotoSans-Regular.ttf"),
    sansBold: path.join(FONT_DIR, "NotoSans-Bold.ttf"),
  };
}

function registerFonts(doc, lang) {
  const f = fontsFor(lang);
  doc.registerFont("Regular", f.regular);
  doc.registerFont("Bold", f.bold);
  doc.registerFont("Italic", f.italic);
  doc.registerFont("BoldItalic", f.boldItalic);
  doc.registerFont("Sans", f.sans);
  doc.registerFont("SansBold", f.sansBold);
}

// ============ DRAWING HELPERS ============

function fillBg(doc) {
  doc.save();
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(PAGE_BG);
  doc.restore();
}

function drawTopBorder(doc) {
  // Gold gradient bar top
  doc.save();
  const grad = doc.linearGradient(MARGIN, 0, PAGE_W - MARGIN, 0);
  grad.stop(0, PAGE_BG).stop(0.5, GOLD).stop(1, PAGE_BG);
  doc.rect(MARGIN, 0, PAGE_W - 2 * MARGIN, 2).fill(grad);
  doc.restore();
}

function drawFrame(doc) {
  doc.save();
  doc.lineWidth(0.5).strokeColor(GOLD).opacity(0.25);
  doc.rect(MARGIN - 14, MARGIN - 14, PAGE_W - 2 * (MARGIN - 14), PAGE_H - 2 * (MARGIN - 14)).stroke();
  doc.opacity(1);
  doc.restore();
}

function drawHeader(doc, lang) {
  drawTopBorder(doc);
  doc.save();
  // Mini logo en haut à gauche (si disponible)
  let textX = MARGIN;
  let textW = PAGE_W - 2 * MARGIN;
  if (fs.existsSync(LOGO_PATH)) {
    const h = 22;
    doc.opacity(0.85);
    doc.image(LOGO_PATH, MARGIN, 18, { height: h });
    doc.opacity(1);
    textX = MARGIN + 60;
    textW = PAGE_W - MARGIN - textX;
  }
  doc.fillColor(GOLD).font("SansBold").fontSize(8);
  doc.text(RESTAURANT.name_el.toUpperCase(), textX, 24, { width: textW, align: "left", characterSpacing: 2 });
  doc.fillColor(DIM).font("Sans").fontSize(7);
  doc.text(RESTAURANT.address, textX, 36, { width: textW, align: "right" });
  doc.restore();
}

function drawFooter(doc, lang, pageNum, totalPages) {
  const y = PAGE_H - 30;
  doc.save();
  // gold separator
  const grad = doc.linearGradient(MARGIN, 0, PAGE_W - MARGIN, 0);
  grad.stop(0, PAGE_BG).stop(0.5, GOLD).stop(1, PAGE_BG);
  doc.rect(MARGIN, y - 8, PAGE_W - 2 * MARGIN, 0.5).fill(grad);

  doc.fillColor(DIM).font("Sans").fontSize(7);
  doc.text(RESTAURANT.phone + "  ·  " + RESTAURANT.email, MARGIN, y, { width: PAGE_W - 2 * MARGIN, align: "left", lineBreak: false });
  doc.fillColor(GOLD).font("SansBold").fontSize(7);
  doc.text(`${pageNum} / ${totalPages}`, MARGIN, y, { width: PAGE_W - 2 * MARGIN, align: "right" });
  doc.restore();
}

function drawCover(doc, lang) {
  fillBg(doc);
  drawFrame(doc);
  drawTopBorder(doc);

  // Logo principal sur la couverture (sans fond, centré)
  const hasLogo = fs.existsSync(LOGO_PATH);
  if (hasLogo) {
    const logoH = 110;
    const logoMaxW = PAGE_W - 2 * (MARGIN + 30);
    doc.image(LOGO_PATH, (PAGE_W - logoMaxW) / 2, 80, { fit: [logoMaxW, logoH], align: "center" });
  } else {
    doc.save();
    doc.fillColor(GOLD).opacity(0.5);
    doc.fontSize(14).font("Regular").text("◆", 0, 110, { width: PAGE_W, align: "center" });
    doc.opacity(1);
    doc.restore();
  }

  // Tagline (small caps) — sous le logo
  const taglineY = hasLogo ? 220 : 140;
  doc.fillColor(GOLD).font("SansBold").fontSize(9);
  doc.text(pick(RESTAURANT.tagline, lang).toUpperCase(), MARGIN, taglineY, {
    width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 3,
  });

  // Main title — in Greek (original)
  const titleY = taglineY + 22;
  doc.fillColor(WHITE).font(lang === "zh" ? "Regular" : "BoldItalic").fontSize(26);
  doc.text(RESTAURANT.name_el, MARGIN, titleY, { width: PAGE_W - 2 * MARGIN, align: "center" });

  // Subtitle (translit / latin)
  if (lang !== "el") {
    doc.fillColor(GREY).font("Italic").fontSize(13);
    doc.text(RESTAURANT.name_translit, MARGIN, titleY + 36, { width: PAGE_W - 2 * MARGIN, align: "center" });
  }

  // Gold divider
  const dy = 310;
  doc.save();
  doc.fillColor(GOLD).opacity(0.7);
  doc.fontSize(10).font("Regular").text("◆ · · · ◆", 0, dy, { width: PAGE_W, align: "center", characterSpacing: 4 });
  doc.opacity(1);
  doc.restore();

  // Address
  doc.fillColor(WHITE).font("Italic").fontSize(11);
  doc.text(RESTAURANT.address, MARGIN, 350, { width: PAGE_W - 2 * MARGIN, align: "center" });
  if (lang !== "el") {
    doc.fillColor(GREY).font("Regular").fontSize(9);
    doc.text(RESTAURANT.address_translit, MARGIN, 370, { width: PAGE_W - 2 * MARGIN, align: "center" });
  }

  // Menu title
  doc.fillColor(GOLD).font("SansBold").fontSize(11);
  doc.text(pick(RESTAURANT.menu_title, lang).toUpperCase(), MARGIN, 420, {
    width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 4,
  });

  // QR code (centered) — embedded if available
  const qrPath = path.join(OUT_DIR, "menu-qr.png");
  if (fs.existsSync(qrPath)) {
    const qrSize = 120;
    doc.image(qrPath, (PAGE_W - qrSize) / 2, 470, { width: qrSize, height: qrSize });
    // White panel behind QR
  }

  // Scan label
  doc.fillColor(DIM).font("Sans").fontSize(8);
  doc.text(pick(RESTAURANT.footer_scan, lang), MARGIN, 605, {
    width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 1,
  });

  // Hours strip
  doc.fillColor(GOLD).font("SansBold").fontSize(7);
  doc.text(pick(RESTAURANT.hours, lang), MARGIN, 680, {
    width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 1,
  });

  // Phone bottom
  doc.fillColor(WHITE).font("Bold").fontSize(13);
  doc.text(RESTAURANT.phone, MARGIN, 720, { width: PAGE_W - 2 * MARGIN, align: "center" });

  // Bottom diamond
  doc.save();
  doc.fillColor(GOLD).opacity(0.4);
  doc.fontSize(11).font("Regular").text("◆", 0, 760, { width: PAGE_W, align: "center" });
  doc.opacity(1);
  doc.restore();
}

function drawSectionPage(doc, lang, section, pageNum, totalPages) {
  fillBg(doc);
  drawFrame(doc);
  drawHeader(doc, lang);

  let y = 80;

  // Section title
  doc.fillColor(GOLD).font(lang === "zh" ? "Bold" : "BoldItalic").fontSize(22);
  doc.text(pick(section.title, lang), MARGIN, y, { width: PAGE_W - 2 * MARGIN, align: "left", lineBreak: false });
  y += 32;

  // Divider
  doc.save();
  const grad = doc.linearGradient(MARGIN, 0, PAGE_W - MARGIN, 0);
  grad.stop(0, GOLD).stop(1, PAGE_BG);
  doc.rect(MARGIN, y, PAGE_W - 2 * MARGIN, 0.7).fill(grad);
  doc.restore();
  y += 14;

  // Note (italic, dim)
  if (section.note) {
    const noteText = pick(section.note, lang);
    if (noteText) {
      doc.fillColor(GREY).font("Italic").fontSize(9);
      const noteH = doc.heightOfString(noteText, { width: PAGE_W - 2 * MARGIN });
      doc.text(noteText, MARGIN, y, { width: PAGE_W - 2 * MARGIN, height: noteH + 4 });
      y += noteH + 14;
    }
  }

  // Items
  const innerW = PAGE_W - 2 * MARGIN;
  const priceColW = 70;
  const nameColW = innerW - priceColW - 10;

  for (const item of section.items) {
    const itemName = pick(item.name, lang);
    const descText = item.desc ? pick(item.desc, lang) : "";

    // Predict height
    doc.font("Bold").fontSize(11);
    const nameH = doc.heightOfString(itemName, { width: nameColW });
    let descH = 0;
    if (descText) {
      doc.font("Italic").fontSize(8.5);
      descH = doc.heightOfString(descText, { width: nameColW }) + 2;
    }
    const rowH = Math.max(nameH + descH, 14) + 8;

    // page break if needed
    if (y + rowH > PAGE_H - 60) {
      drawFooter(doc, lang, pageNum, totalPages);
      doc.addPage();
      fillBg(doc);
      drawFrame(doc);
      drawHeader(doc, lang);
      y = 80;
      doc.fillColor(GOLD).font(lang === "zh" ? "Bold" : "BoldItalic").fontSize(16);
      doc.text(pick(section.title, lang) + " (suite)", MARGIN, y, { width: PAGE_W - 2 * MARGIN, align: "left", lineBreak: false });
      y += 30;
    }

    // Name — height limit pour empêcher auto-paginate de pdfkit
    doc.fillColor(WHITE).font("Bold").fontSize(11);
    doc.text(itemName, MARGIN, y, { width: nameColW, height: nameH + 4 });

    // Price (right aligned)
    doc.fillColor(GOLD).font("Bold").fontSize(11.5);
    doc.text(item.price, MARGIN + nameColW + 10, y, { width: priceColW, align: "right", lineBreak: false });

    let descY = y + nameH + 2;
    if (descText) {
      doc.fillColor(DIM).font("Italic").fontSize(8.5);
      doc.text(descText, MARGIN, descY, { width: nameColW, height: descH + 4 });
    }

    y += rowH;

    // thin separator
    doc.save();
    doc.strokeColor(GOLD).opacity(0.08).lineWidth(0.5);
    doc.moveTo(MARGIN, y - 4).lineTo(PAGE_W - MARGIN, y - 4).stroke();
    doc.opacity(1);
    doc.restore();
  }

  // Image de section (en bas, si place dispo + slug fourni)
  if (section.imageSlug) {
    const PHOTOS_DIR = path.join(OUT_DIR, "photos", "efood");
    const imgPath = path.join(PHOTOS_DIR, `${section.imageSlug}-800w.webp`);
    const jpegBuf = getJpeg(imgPath);
    if (jpegBuf) {
      const imgMaxH = 180; // hauteur max de l'image en bas
      const imgMaxW = PAGE_W - 2 * MARGIN;
      const footerReserve = 60; // espace pour le footer
      const spaceLeft = PAGE_H - footerReserve - y;
      if (spaceLeft >= 100) { // au moins 100px pour afficher une image utile
        const drawH = Math.min(imgMaxH, spaceLeft - 16);
        const drawW = Math.min(imgMaxW * 0.8, 380); // image centrée, pas trop large
        const drawX = (PAGE_W - drawW) / 2;
        const drawY = y + 8;

        doc.save();
        // Border doré subtil
        doc.lineWidth(0.6).strokeColor(GOLD).opacity(0.4);
        doc.rect(drawX - 2, drawY - 2, drawW + 4, drawH + 4).stroke();
        doc.opacity(1);
        doc.image(jpegBuf, drawX, drawY, { fit: [drawW, drawH], align: "center", valign: "center" });
        doc.restore();
      }
    }
  }

  drawFooter(doc, lang, pageNum, totalPages);
}

// (Galerie 4-photos séparée supprimée — images désormais intégrées dans chaque section)
function drawGalleryPage(doc, lang) {
  fillBg(doc);
  drawFrame(doc);
  drawTopBorder(doc);

  // Titre
  const galleryTitle = {
    zh: "我们的特色", el: "Οι Σπεσιαλιτέ μας", en: "Our Specialities",
    fr: "Nos Spécialités", pt: "As Nossas Especialidades", it: "Le Nostre Specialità",
    es: "Nuestras Especialidades", de: "Unsere Spezialitäten",
  }[lang] || "Our Specialities";

  doc.fillColor(GOLD).font("SansBold").fontSize(18);
  doc.text(galleryTitle.toUpperCase(), MARGIN, 60, {
    width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 4, lineBreak: false,
  });

  // Divider
  doc.save();
  doc.fillColor(GOLD).opacity(0.5);
  doc.fontSize(10).font("Regular").text("◆ · · · ◆", 0, 92, { width: PAGE_W, align: "center", characterSpacing: 4, lineBreak: false });
  doc.opacity(1);
  doc.restore();

  // 4 photos en grid 2x2, avec leur libellé multilingue
  const PHOTOS_DIR = path.join(OUT_DIR, "photos", "efood");
  const labels = {
    pita: { zh: "皮塔卷饼", el: "Πίτα τυλιχτή", en: "Wrapped Pita", fr: "Pita roulée", pt: "Pita enrolada", it: "Pita arrotolata", es: "Pita enrollada", de: "Pita-Wrap" },
    salad: { zh: "特鲁巴沙拉", el: "Σαλάτα Τρούμπας", en: "Trouba's Salad", fr: "Salade de Trouba", pt: "Salada da Trouba", it: "Insalata Trouba", es: "Ensalada de Trouba", de: "Trouba-Salat" },
    fries: { zh: "新鲜炸薯条", el: "Φρέσκιες Πατάτες", en: "Fresh Fried Potatoes", fr: "Frites maison", pt: "Batatas fritas frescas", it: "Patatine fresche", es: "Patatas fritas frescas", de: "Frische Pommes" },
    skewer: { zh: "希腊烤串", el: "Καλαμάκι", en: "Greek Skewer", fr: "Brochette grecque", pt: "Espetada grega", it: "Spiedino greco", es: "Brocheta griega", de: "Griechischer Spieß" },
  };
  const photos = [
    { slug: "kalamaki-choirino-se-pita", label: labels.pita },
    { slug: "i-salata-tis-troympas", label: labels.salad },
    { slug: "patates-tiganites", label: labels.fries },
    { slug: "kalamaki-choirino", label: labels.skewer },
  ];

  // Grid 2x2 : zone disponible 110 → 760, width 499 (margins-to-margins)
  const gridStartY = 130;
  const cellW = (PAGE_W - 2 * MARGIN - 20) / 2; // 2 colonnes avec 20px gap
  const cellH = 280; // 2 rangées (incluant libellé)
  const imgH = cellH - 40; // image height (laisser place au libellé)

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * (cellW + 20);
    const y0 = gridStartY + row * (cellH + 16);

    const imgPath = path.join(PHOTOS_DIR, `${p.slug}-800w.webp`);
    const jpegBuf = getJpeg(imgPath);
    if (jpegBuf) {
      doc.save();
      // Border doré subtil
      doc.lineWidth(0.6).strokeColor(GOLD).opacity(0.4);
      doc.rect(x - 2, y0 - 2, cellW + 4, imgH + 4).stroke();
      doc.opacity(1);
      doc.image(jpegBuf, x, y0, { fit: [cellW, imgH], align: "center", valign: "center" });
      doc.restore();
    } else {
      // Placeholder si image manquante
      doc.save();
      doc.fillColor(ACCENT_DIM).rect(x, y0, cellW, imgH).fill();
      doc.fillColor(DIM).font("Italic").fontSize(8);
      doc.text("(image)", x, y0 + imgH / 2 - 4, { width: cellW, align: "center", lineBreak: false });
      doc.restore();
    }

    // Libellé sous l'image
    doc.fillColor(GOLD).font("SansBold").fontSize(9);
    doc.text(pick(p.label, lang).toUpperCase(), x, y0 + imgH + 8, {
      width: cellW, align: "center", characterSpacing: 2, lineBreak: false,
    });
  }

  // Petit footer galerie
  doc.fillColor(DIM).font("Sans").fontSize(7);
  doc.text(pick(RESTAURANT.tagline, lang), MARGIN, PAGE_H - 40, {
    width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 2, lineBreak: false,
  });
}

function drawBackCover(doc, lang) {
  fillBg(doc);
  drawFrame(doc);
  drawTopBorder(doc);

  // Centered thank you
  doc.fillColor(GOLD).font("SansBold").fontSize(10);
  const thanks = {
    zh: "感谢您的光临",
    el: "Σας ευχαριστούμε",
    en: "Thank you for your visit",
    fr: "Merci de votre visite",
    pt: "Obrigado pela visita",
    it: "Grazie per la visita",
    es: "Gracias por su visita",
  }[lang] || "Thank you";
  doc.text(thanks.toUpperCase(), MARGIN, 200, { width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 3 });

  doc.fillColor(WHITE).font(lang === "zh" ? "Bold" : "BoldItalic").fontSize(28);
  doc.text(pick(RESTAURANT.tagline, lang), MARGIN, 240, { width: PAGE_W - 2 * MARGIN, align: "center" });

  // Big diamond
  doc.save();
  doc.fillColor(GOLD).opacity(0.5);
  doc.fontSize(16).font("Regular").text("◆ · · · ◆", 0, 310, { width: PAGE_W, align: "center", characterSpacing: 5 });
  doc.opacity(1);
  doc.restore();

  // Contact card
  const cx = PAGE_W / 2;
  const cardY = 360;
  doc.save();
  doc.strokeColor(GOLD).opacity(0.4).lineWidth(0.6);
  doc.rect(MARGIN + 60, cardY, PAGE_W - 2 * MARGIN - 120, 200).stroke();
  doc.opacity(1);
  doc.restore();

  doc.fillColor(WHITE).font("Italic").fontSize(11);
  doc.text(RESTAURANT.address, MARGIN, cardY + 24, { width: PAGE_W - 2 * MARGIN, align: "center" });

  doc.fillColor(GOLD).font("Bold").fontSize(16);
  doc.text(RESTAURANT.phone, MARGIN, cardY + 56, { width: PAGE_W - 2 * MARGIN, align: "center" });

  doc.fillColor(GREY).font("Regular").fontSize(10);
  doc.text(RESTAURANT.email, MARGIN, cardY + 90, { width: PAGE_W - 2 * MARGIN, align: "center" });

  doc.fillColor(DIM).font("Italic").fontSize(8);
  doc.text(pick(RESTAURANT.hours, lang), MARGIN, cardY + 120, { width: PAGE_W - 2 * MARGIN, align: "center" });

  // QR small
  const qrPath = path.join(OUT_DIR, "menu-qr.png");
  if (fs.existsSync(qrPath)) {
    doc.image(qrPath, (PAGE_W - 80) / 2, cardY + 150, { width: 80, height: 80 });
  }

  // Domain footer
  doc.fillColor(GOLD).font("SansBold").fontSize(8);
  doc.text("kalamakitroubas.gr", MARGIN, PAGE_H - 60, {
    width: PAGE_W - 2 * MARGIN, align: "center", characterSpacing: 4,
  });
}

// ============ MAIN ============

async function generatePDF(lang) {
  return new Promise((resolve, reject) => {
    const outPath = path.join(OUT_DIR, `menu-${lang}.pdf`);
    const doc = new PDFDocument({
      size: "A4",
      // margins à 0 : on positionne tout en absolu (drawFooter, drawHeader sont au-delà des marges Astro standard).
      // Sans ça, pdfkit auto-paginate quand on dessine hors-zone → pages blanches.
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      bufferPages: true,
      info: {
        Title: `Kalamaki Troubas — Menu (${lang})`,
        Author: "Kalamaki Troubas",
        Subject: "Restaurant Menu",
        Keywords: "kalamaki, greek, piraeus, menu",
      },
    });

    registerFonts(doc, lang);

    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    // Cover
    drawCover(doc, lang);

    // Pages: figure total
    const totalPages = PAGES.length + 2; // cover + sections + back

    PAGES.forEach((section, idx) => {
      doc.addPage();
      drawSectionPage(doc, lang, section, idx + 2, totalPages);
    });

    // (Plus de gallery page séparée — images sont dans chaque section)

    // Back cover
    doc.addPage();
    drawBackCover(doc, lang);

    doc.end();
    stream.on("finish", () => {
      const size = fs.statSync(outPath).size;
      console.log(`  ${lang}: ${outPath} (${(size / 1024).toFixed(1)} KB)`);
      resolve(outPath);
    });
    stream.on("error", reject);
  });
}

// Pré-charge toutes les photos requises par les sections (champ imageSlug) en JPEG
async function preloadGalleryImages() {
  const PHOTOS_DIR = path.join(OUT_DIR, "photos", "efood");
  // Récupère tous les slugs uniques utilisés dans les sections
  const slugs = [...new Set(PAGES.map((s) => s.imageSlug).filter(Boolean))];
  for (const slug of slugs) {
    const p = path.join(PHOTOS_DIR, `${slug}-800w.webp`);
    if (fs.existsSync(p)) {
      const buf = await sharp(p).jpeg({ quality: 88 }).toBuffer();
      _imgCache.set(p, buf);
    }
  }
  console.log(`  Préchargé ${_imgCache.size} images de section`);
}

(async () => {
  console.log("Generating menus...");
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  await preloadGalleryImages();
  for (const lang of LANGS) {
    await generatePDF(lang);
  }
  console.log("Done.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
