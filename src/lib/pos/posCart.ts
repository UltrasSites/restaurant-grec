// ════════════════════════════════════════════════════════════════════════════
// POS CART & SESSION LOGIC — pure, framework-free, testable.
// Imported by PosCaisse.astro AND can be reused in any other project.
// ════════════════════════════════════════════════════════════════════════════

import type { PosProduct, PosConfig } from "../../data/pos-config";

// ───── Types ───────────────────────────────────────────────────────────────
export type CartLine = {
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
  vat: number;       // resolved rate (0–1)
  note?: string;     // optional ("sans oignon", etc.)
};

export type Payment = {
  mode: string;      // matches PosPaymentMode.id
  amount: number;
};

export type CompletedSale = {
  id: string;        // T-202605171234-001
  ts: number;        // epoch ms at completion
  server?: string;
  lines: CartLine[];
  subtotalHt: number;
  vatTotal: number;
  total: number;
  payments: Payment[];
  given: number;     // cash given by customer (>= cash payment)
  change: number;    // change due back
  prepMinutes?: number;     // estimated kitchen prep time
  deliveryMinutes?: number; // estimated delivery time (0 = dine-in / take-away)
  timeOverridden?: boolean; // true if patron manually overrode the auto value
};

export type SessionSummary = {
  dateKey: string;            // YYYY-MM-DD
  openedAt: number;
  closedAt?: number;
  openingFloat: number;
  closingFloat?: number;
  expectedCash?: number;      // computed = openingFloat + cash takings
  cashGap?: number;           // closingFloat - expectedCash
  sales: CompletedSale[];
  server?: string;
};

// ───── Cart math ───────────────────────────────────────────────────────────
export function lineSubtotalTtc(line: CartLine): number {
  return roundCents(line.unitPrice * line.qty);
}

export function cartTotals(lines: CartLine[], config: PosConfig) {
  let totalTtc = 0;
  let totalHt = 0;
  let totalVat = 0;
  const vatBreakdown: Record<string, { rate: number; base: number; vat: number }> = {};

  for (const line of lines) {
    const lineTtc = lineSubtotalTtc(line);
    const rate = line.vat;
    let lineHt: number;
    let lineVat: number;
    if (config.pricesIncludeVat) {
      lineHt = roundCents(lineTtc / (1 + rate));
      lineVat = roundCents(lineTtc - lineHt);
    } else {
      lineHt = lineTtc;
      lineVat = roundCents(lineTtc * rate);
    }
    totalTtc += lineTtc;
    totalHt += lineHt;
    totalVat += lineVat;
    const key = rate.toFixed(4);
    if (!vatBreakdown[key]) vatBreakdown[key] = { rate, base: 0, vat: 0 };
    vatBreakdown[key].base += lineHt;
    vatBreakdown[key].vat += lineVat;
  }
  // round breakdown
  Object.values(vatBreakdown).forEach((b) => {
    b.base = roundCents(b.base);
    b.vat = roundCents(b.vat);
  });

  return {
    totalTtc: roundCents(totalTtc),
    totalHt: roundCents(totalHt),
    totalVat: roundCents(totalVat),
    vatBreakdown,
    itemsCount: lines.reduce((s, l) => s + l.qty, 0),
  };
}

export function paymentsTotal(payments: Payment[]): number {
  return roundCents(payments.reduce((s, p) => s + (p.amount || 0), 0));
}

export function computeChange(total: number, given: number): number {
  return roundCents(Math.max(0, given - total));
}

export function roundCents(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calcAutoPrepMinutes(
  itemsCount: number,
  config: { autoTimePerItem?: number; minPrepTime?: number; maxPrepTime?: number }
): number {
  const perItem = config.autoTimePerItem ?? 2;
  const minT = config.minPrepTime ?? 5;
  const maxT = config.maxPrepTime ?? 60;
  const raw = minT + Math.ceil(itemsCount * perItem);
  return Math.min(maxT, Math.max(minT, raw));
}

// ───── Formatting ──────────────────────────────────────────────────────────
export function formatMoney(n: number, config: PosConfig): string {
  const fixed = (Math.round((Number(n) || 0) * 100) / 100).toFixed(2);
  const out = config.decimalSeparator === "," ? fixed.replace(".", ",") : fixed;
  return out + config.currency;
}

// ───── Cart mutations (immutable returns) ──────────────────────────────────
export function addToCart(lines: CartLine[], product: PosProduct, config: PosConfig, qty = 1): CartLine[] {
  const vat = product.vat ?? config.defaultVat;
  const idx = lines.findIndex((l) => l.productId === product.id);
  if (idx >= 0) {
    const updated = [...lines];
    updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
    return updated;
  }
  return [
    ...lines,
    { productId: product.id, name: product.name, unitPrice: product.price, qty, vat },
  ];
}

export function changeQty(lines: CartLine[], productId: string, delta: number): CartLine[] {
  return lines
    .map((l) => (l.productId === productId ? { ...l, qty: Math.max(0, l.qty + delta) } : l))
    .filter((l) => l.qty > 0);
}

export function removeLine(lines: CartLine[], productId: string): CartLine[] {
  return lines.filter((l) => l.productId !== productId);
}

// ───── Sale ID generator ───────────────────────────────────────────────────
export function makeSaleId(prevSales: CompletedSale[]): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const seq = String(prevSales.length + 1).padStart(3, "0");
  return `T${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${seq}`;
}

export function dateKey(ts: number = Date.now()): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ───── Session storage (localStorage) ──────────────────────────────────────
const SESSION_KEY = (storageKey: string) => `${storageKey}:session`;
const ARCHIVE_KEY = (storageKey: string, day: string) => `${storageKey}:archive:${day}`;
const ARCHIVE_INDEX = (storageKey: string) => `${storageKey}:archive:index`;

export function loadSession(storageKey: string): SessionSummary | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY(storageKey));
    return raw ? (JSON.parse(raw) as SessionSummary) : null;
  } catch {
    return null;
  }
}

export function saveSession(storageKey: string, session: SessionSummary): void {
  try {
    localStorage.setItem(SESSION_KEY(storageKey), JSON.stringify(session));
  } catch {}
}

export function openSession(storageKey: string, openingFloat: number, server?: string): SessionSummary {
  const session: SessionSummary = {
    dateKey: dateKey(),
    openedAt: Date.now(),
    openingFloat,
    sales: [],
    server,
  };
  saveSession(storageKey, session);
  return session;
}

export function appendSale(storageKey: string, session: SessionSummary, sale: CompletedSale): SessionSummary {
  const updated: SessionSummary = { ...session, sales: [...session.sales, sale] };
  saveSession(storageKey, updated);
  return updated;
}

export function closeSession(
  storageKey: string,
  session: SessionSummary,
  closingFloat: number
): SessionSummary {
  const cashTakings = session.sales.reduce(
    (s, sale) => s + sale.payments.filter((p) => p.mode === "cash").reduce((a, p) => a + p.amount, 0),
    0
  );
  const expectedCash = roundCents(session.openingFloat + cashTakings);
  const cashGap = roundCents(closingFloat - expectedCash);
  const closed: SessionSummary = {
    ...session,
    closedAt: Date.now(),
    closingFloat,
    expectedCash,
    cashGap,
  };
  // archive
  try {
    localStorage.setItem(ARCHIVE_KEY(storageKey, session.dateKey), JSON.stringify(closed));
    const idxRaw = localStorage.getItem(ARCHIVE_INDEX(storageKey));
    const idx: string[] = idxRaw ? JSON.parse(idxRaw) : [];
    if (!idx.includes(session.dateKey)) {
      idx.push(session.dateKey);
      localStorage.setItem(ARCHIVE_INDEX(storageKey), JSON.stringify(idx));
    }
    localStorage.removeItem(SESSION_KEY(storageKey));
  } catch {}
  return closed;
}

export function loadArchive(storageKey: string): SessionSummary[] {
  try {
    const idxRaw = localStorage.getItem(ARCHIVE_INDEX(storageKey));
    if (!idxRaw) return [];
    const idx: string[] = JSON.parse(idxRaw);
    return idx
      .map((day) => {
        const raw = localStorage.getItem(ARCHIVE_KEY(storageKey, day));
        return raw ? (JSON.parse(raw) as SessionSummary) : null;
      })
      .filter((s): s is SessionSummary => s !== null)
      .sort((a, b) => b.openedAt - a.openedAt);
  } catch {
    return [];
  }
}

// ───── Stats ───────────────────────────────────────────────────────────────
export function sessionStats(session: SessionSummary) {
  let ca = 0;
  let cashTotal = 0;
  let cardTotal = 0;
  let otherTotal = 0;
  let itemsSold = 0;
  const byProduct: Record<string, { name: string; qty: number; revenue: number }> = {};

  for (const sale of session.sales) {
    ca += sale.total;
    for (const p of sale.payments) {
      if (p.mode === "cash") cashTotal += p.amount;
      else if (p.mode === "card") cardTotal += p.amount;
      else otherTotal += p.amount;
    }
    for (const l of sale.lines) {
      itemsSold += l.qty;
      const k = l.productId;
      if (!byProduct[k]) byProduct[k] = { name: l.name, qty: 0, revenue: 0 };
      byProduct[k].qty += l.qty;
      byProduct[k].revenue += lineSubtotalTtc(l);
    }
  }
  const top = Object.values(byProduct).sort((a, b) => b.qty - a.qty).slice(0, 10);
  return {
    salesCount: session.sales.length,
    ca: roundCents(ca),
    cashTotal: roundCents(cashTotal),
    cardTotal: roundCents(cardTotal),
    otherTotal: roundCents(otherTotal),
    itemsSold,
    avgTicket: session.sales.length ? roundCents(ca / session.sales.length) : 0,
    topProducts: top,
  };
}

// ───── CSV export ──────────────────────────────────────────────────────────
export function salesToCsv(session: SessionSummary, config: PosConfig): string {
  const sep = ";";
  const lines: string[] = [];
  lines.push(["sale_id", "datetime", "server", "items_count", "subtotal_ht", "vat", "total_ttc", "payment_modes", "currency"].join(sep));
  for (const s of session.sales) {
    const d = new Date(s.ts);
    const pad = (n: number) => String(n).padStart(2, "0");
    const dt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const itemsCount = s.lines.reduce((a, l) => a + l.qty, 0);
    const pay = s.payments.map((p) => `${p.mode}:${p.amount.toFixed(2)}`).join("|");
    lines.push([
      s.id,
      dt,
      (s.server || "").replace(/[;\n]/g, " "),
      String(itemsCount),
      s.subtotalHt.toFixed(2),
      s.vatTotal.toFixed(2),
      s.total.toFixed(2),
      pay,
      config.currencyCode,
    ].join(sep));
  }
  return lines.join("\n");
}
