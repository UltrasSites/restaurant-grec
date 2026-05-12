// Generate QR pointing to https://kalamakitroubas.gr/menu
// Run: node scripts/generate-qr.mjs

import QRCode from "qrcode";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT = path.resolve(__dirname, "..", "public", "menu-qr.png");

const URL_MENU = "https://kalamakitroubas.gr/menu";

await QRCode.toFile(OUT, URL_MENU, {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 600,
  color: {
    dark: "#0a0a0a",
    light: "#ffffff",
  },
});

const size = fs.statSync(OUT).size;
console.log(`QR generated → ${OUT} (${(size / 1024).toFixed(1)} KB)`);
console.log(`Points to: ${URL_MENU}`);
