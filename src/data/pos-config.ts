// ════════════════════════════════════════════════════════════════════════════
// POS CONFIG — Drop-in configuration for the reusable PosCaisse component.
//
// To deploy on another Ultras-Sites client : COPY this file, change the values.
// Nothing else to touch (besides feeding products to <PosCaisse products={...} />).
// ════════════════════════════════════════════════════════════════════════════

import { menuPages, parsePrice } from "./menu-data";

export type PosProduct = {
  id: string;
  name: string;        // primary label (clerk language)
  name_alt?: string;   // optional secondary (e.g. EN translation)
  price: number;       // unit price, currency-agnostic float
  category: string;    // for the tab/grid grouping
  vat?: number;        // override default VAT rate (0–1)
};

export type PosPaymentMode = {
  id: string;          // "cash" | "card" | "ticket" | custom
  label: string;
  label_alt?: string;
  icon?: string;       // emoji or short text
  needsChange?: boolean; // show change-due UI (cash only by default)
};

export type PosConfig = {
  // Identity
  shopName: string;
  shopSubtitle?: string;
  vatNumber?: string;        // printed on tickets if set
  address?: string;

  // Currency
  currency: string;          // "€" | "$" | "£" | ...
  currencyCode: string;      // "EUR" | "USD" | "GBP"
  decimalSeparator: "," | ".";

  // VAT (default applied unless product overrides)
  defaultVat: number;        // 0.13 (GR food), 0.10 (FR resto), 0.24 (GR drinks)
  vatLabel: string;          // "ΦΠΑ" | "TVA" | "VAT"
  pricesIncludeVat: boolean; // true = TTC, false = HT

  // Payment modes (order = display order)
  paymentModes: PosPaymentMode[];

  // Behaviour
  allowMixedPayment: boolean;   // split between cash + card
  askServerName: boolean;       // ask clerk name at session open
  defaultOpeningFloat: number;  // cash drawer opening fund

  // Storage
  storageKey: string;           // unique key per shop ("kalamaki_pos")

  // i18n
  defaultLang: "el" | "en" | "fr" | "es" | "pt";

  // Time estimation (POS adds prep/delivery time to each sale)
  hasTimeEstimate?: boolean;    // show the time UI in the payment modal
  hasDelivery?: boolean;        // show delivery input (0 = take-away only)
  autoTimePerItem?: number;     // minutes added per item in the auto calc (default 2)
  minPrepTime?: number;         // floor of the auto calc in minutes (default 5)
  maxPrepTime?: number;         // ceil of the auto calc in minutes (default 60)
  defaultDeliveryMinutes?: number; // initial delivery value when hasDelivery=true (default 10)
};

// ════════════════════════════════════════════════════════════════════════════
// KALAMAKI — first instance
// ════════════════════════════════════════════════════════════════════════════
export const kalamakiPosConfig: PosConfig = {
  shopName: "Καλαμάκι Της Τρούμπας",
  shopSubtitle: "Μπουμπουλίνας 8 & Νοταρά — Πειραιάς",
  address: "Μπουμπουλίνας 8 & Νοταρά, 18535 Πειραιάς",
  currency: "€",
  currencyCode: "EUR",
  decimalSeparator: ",",
  defaultVat: 0.13,          // Greek restaurant food rate
  vatLabel: "ΦΠΑ",
  pricesIncludeVat: true,    // prices in menu are TTC
  paymentModes: [
    { id: "cash",   label: "Μετρητά",   label_alt: "Cash",   icon: "💶", needsChange: true },
    { id: "card",   label: "Κάρτα",     label_alt: "Card",   icon: "💳" },
    { id: "ticket", label: "Κουπόνι",   label_alt: "Voucher", icon: "🎟" },
  ],
  allowMixedPayment: true,
  askServerName: true,
  defaultOpeningFloat: 100,
  storageKey: "kalamaki_pos",
  defaultLang: "el",
  hasTimeEstimate: true,
  hasDelivery: true,
  autoTimePerItem: 2,
  minPrepTime: 8,
  maxPrepTime: 45,
  defaultDeliveryMinutes: 10,
};

// ════════════════════════════════════════════════════════════════════════════
// Bridge : transform menu-data into POS products.
// On another project, replace this with your own loader.
// ════════════════════════════════════════════════════════════════════════════
export function getKalamakiProducts(): PosProduct[] {
  const out: PosProduct[] = [];
  menuPages.forEach((page, pIdx) => {
    page.items.forEach((it, iIdx) => {
      const priceStr = it.price.split("/")[0].trim(); // take first if "2,30€ / 3,00€"
      const price = parsePrice(priceStr);
      if (price <= 0) return; // skip "+0,70€" supplements as standalone
      out.push({
        id: `p${pIdx}-i${iIdx}`,
        name: it.el,
        name_alt: it.en,
        price,
        category: page.title_el,
      });
    });
  });
  return out;
}

export function getKalamakiCategories(): string[] {
  return menuPages.map((p) => p.title_el);
}
