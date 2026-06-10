/**
 * POST /api/order
 * Enregistre une commande client dans D1 (binding DB).
 * - ID court via counter SQL (UPDATE ... RETURNING).
 * - Rate-limit : max 5 commandes / IP / 10 min.
 * - TTL logique 60j (expires_at).
 * - Si lang !== 'el' et notes présent → traduction auto vers grec via Google Translate (best-effort, 3s timeout).
 */

type OrderItem = { id: string; name: string; price: number; qty: number };
type OrderPayload = {
  name: string;
  phone: string;
  items: OrderItem[];
  total: number;
  lang: string;
  mode: string;
  payment: string;
  address?: string;
  floor?: string;
  bell?: string;
  notes?: string;
  delivery_zone?: string;          // 'green' | 'red' — applique min€
};

// Minimums commande par zone de livraison (en EUR)
const DELIVERY_MIN: Record<string, number> = {
  green: 5,   // Pirée centre proche Trouba
  red: 7,     // Korydallós, Keratsíni, Aigáleo, Ν.Φάληρο
};

type Env = {
  DB?: D1Database;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sanitize(s: unknown, max = 200): string {
  if (typeof s !== "string") return "";
  return s.replace(/[<>]/g, "").replace(/[\x00-\x1F\x7F]/g, "").slice(0, max).trim();
}

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Traduit `text` vers le grec via l'endpoint non-officiel Google Translate.
 * - Timeout 3s via AbortController.
 * - Retourne null si erreur, timeout, ou réponse vide.
 */
async function translateToGreek(text: string): Promise<string | null> {
  if (!text) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3000);
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=el&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    // Format attendu : [ [ [ "translation", "original", null, null, ... ], ... ], ... ]
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
    const segments = data[0] as unknown[];
    if (segments.length === 0) return null;
    let out = "";
    for (const seg of segments) {
      if (Array.isArray(seg) && typeof seg[0] === "string") {
        out += seg[0];
      }
    }
    out = out.trim();
    return out || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  if (!env.DB) {
    return jsonResp({ ok: false, error: "DB binding missing" }, 500);
  }

  let body: Partial<OrderPayload>;
  try {
    body = (await request.json()) as Partial<OrderPayload>;
  } catch {
    return jsonResp({ ok: false, error: "Invalid JSON" }, 400);
  }

  const name = sanitize(body.name, 60);
  const phone = sanitize(body.phone, 20);
  const lang = sanitize(body.lang, 4) || "el";
  const mode = sanitize(body.mode, 10) || "takeaway";
  const payment = sanitize(body.payment, 10) || (mode === "delivery" ? "cash" : "on_site");
  const address = sanitize(body.address, 200);
  const floor = sanitize(body.floor, 30);
  const bell = sanitize(body.bell, 40);
  const notes = sanitize(body.notes, 300);
  const deliveryZoneRaw = sanitize(body.delivery_zone, 10).toLowerCase();
  const delivery_zone =
    mode === "delivery" && (deliveryZoneRaw === "green" || deliveryZoneRaw === "red")
      ? deliveryZoneRaw
      : null;

  if (!["takeaway", "delivery", "surplace"].includes(mode)) {
    return jsonResp({ ok: false, error: "Invalid mode" }, 400);
  }

  // Dine-in (surplace) : le client est à table → pas de nom/tél requis.
  // On génère un code de suivi 4 chiffres qui sert de clé anti-énumération
  // pour la page de suivi public (réutilise le champ phone, aucune migration).
  const isDinein = mode === "surplace";
  let finalName = name;
  let finalPhone = phone;
  if (isDinein) {
    if (!finalName || finalName.length < 2) finalName = "Επιτόπου"; // dine-in (grec, pour la cuisine)
    finalPhone = String(Math.floor(1000 + Math.random() * 9000));   // code suivi 4 chiffres
  } else {
    if (!name || name.length < 2) return jsonResp({ ok: false, error: "Name required" }, 400);
    if (!phone || phone.length < 6) return jsonResp({ ok: false, error: "Phone required" }, 400);
  }
  if (!["cash", "card", "on_site"].includes(payment)) {
    return jsonResp({ ok: false, error: "Invalid payment" }, 400);
  }
  if (mode === "delivery" && (!address || address.length < 6)) {
    return jsonResp({ ok: false, error: "Address required for delivery" }, 400);
  }
  if (mode === "delivery" && !delivery_zone) {
    return jsonResp({ ok: false, error: "Delivery zone required" }, 400);
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return jsonResp({ ok: false, error: "Cart empty" }, 400);
  }
  if (body.items.length > 50) {
    return jsonResp({ ok: false, error: "Too many items" }, 400);
  }

  const items: OrderItem[] = body.items.map((it) => ({
    id: sanitize(it.id, 20),
    name: sanitize(it.name, 120),
    price: typeof it.price === "number" && it.price >= 0 && it.price < 1000 ? it.price : 0,
    qty: typeof it.qty === "number" && it.qty > 0 && it.qty <= 50 ? Math.floor(it.qty) : 0,
  })).filter((it) => it.qty > 0 && it.name);

  if (items.length === 0) return jsonResp({ ok: false, error: "Cart empty" }, 400);

  const total = Math.round(items.reduce((s, it) => s + it.price * it.qty, 0) * 100) / 100;
  if (total <= 0 || total > 500) {
    return jsonResp({ ok: false, error: "Invalid total" }, 400);
  }

  // Validation min commande selon zone livraison (sécurité serveur — ceinture + bretelles)
  if (mode === "delivery" && delivery_zone) {
    const minTotal = DELIVERY_MIN[delivery_zone];
    if (total < minTotal) {
      return jsonResp({
        ok: false,
        error: `Minimum order for this zone: ${minTotal}€`,
        min_total: minTotal,
        delivery_zone,
      }, 400);
    }
  }

  const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";
  const cf = (request as Request & { cf?: { country?: string } }).cf;
  const country = cf?.country || "XX";

  const now = Date.now();
  // 60 jours de rétention : la caisse a besoin de l'historique complet
  // (nom, tel, adresse, items) pour la conformité comptable / litiges.
  // Le poll caisse filtre déjà sur created_at > now - 24h pour l'écran actif.
  const expires = now + 60 * 24 * 60 * 60 * 1000;

  // Rate limiting : max 5 commandes / IP / 10 min — atomique via UPSERT
  const rateExpires = now + 10 * 60 * 1000;
  const rateRow = await env.DB
    .prepare(`SELECT count, expires_at FROM rate_limit WHERE ip = ?1`)
    .bind(ip)
    .first<{ count: number; expires_at: number }>();

  if (rateRow && rateRow.expires_at > now) {
    if (rateRow.count >= 5) {
      return jsonResp({ ok: false, error: "Too many orders. Try again in a few minutes." }, 429);
    }
    await env.DB
      .prepare(`UPDATE rate_limit SET count = count + 1 WHERE ip = ?1`)
      .bind(ip)
      .run();
  } else {
    await env.DB
      .prepare(`INSERT OR REPLACE INTO rate_limit (ip, count, expires_at) VALUES (?1, 1, ?2)`)
      .bind(ip, rateExpires)
      .run();
  }

  // Increment counter et récupère valeur — atomique D1
  const counterRow = await env.DB
    .prepare(`UPDATE counters SET value = value + 1 WHERE name = 'orders' RETURNING value`)
    .first<{ value: number }>();
  const nextNum = counterRow?.value ?? 1;
  const order_id = `K-${String(nextNum).padStart(3, "0")}`;

  // Traduction notes vers grec si lang !== 'el' (best-effort, ne bloque pas si fail)
  let notes_translated: string | null = null;
  if (notes && lang !== "el") {
    notes_translated = await translateToGreek(notes);
    // Évite de stocker une "traduction" identique à l'original
    if (notes_translated && notes_translated.trim() === notes.trim()) {
      notes_translated = null;
    }
  }

  // pickup_time conservé en colonne (NOT NULL côté schema initial) — valeur "0" pour ne pas casser.
  const pickup_time = "0";

  await env.DB
    .prepare(
      `INSERT INTO orders (
        id, num, name, phone, total, pickup_time, lang, mode, payment,
        address, floor, bell, notes, notes_translated, country, items_json,
        delivery_zone, status, created_at, expires_at
      ) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,'new',?18,?19)`
    )
    .bind(
      order_id,
      nextNum,
      finalName,
      finalPhone,
      total,
      pickup_time,
      lang,
      mode,
      payment,
      mode === "delivery" ? address : "",
      mode === "delivery" ? floor : "",
      mode === "delivery" ? bell : "",
      notes,
      notes_translated,
      country,
      JSON.stringify(items),
      delivery_zone,
      now,
      expires
    )
    .run();

  // Historique anonymisé (60 jours) — best-effort, ne bloque pas la commande
  const historyExpires = now + 60 * 24 * 60 * 60 * 1000;
  await env.DB
    .prepare(
      `INSERT OR IGNORE INTO orders_history (id, total, created_at, status, expires_at)
       VALUES (?1, ?2, ?3, 'new', ?4)`
    )
    .bind(order_id, total, now, historyExpires)
    .run()
    .catch(() => {});

  return jsonResp({ ok: true, order_id, track_code: isDinein ? finalPhone : undefined });
};
