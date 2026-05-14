/**
 * POST /api/order
 * Enregistre une commande client dans D1 (binding DB).
 * - ID court via counter SQL (UPDATE ... RETURNING).
 * - Rate-limit : max 5 commandes / IP / 10 min.
 * - TTL logique 24h (expires_at), nettoyage à la lecture.
 */

type OrderItem = { id: string; name: string; price: number; qty: number };
type OrderPayload = {
  name: string;
  phone: string;
  items: OrderItem[];
  total: number;
  pickup_time: string;
  lang: string;
  mode: string;
  payment: string;
  address?: string;
  floor?: string;
  bell?: string;
  notes?: string;
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
  const pickup_time = sanitize(body.pickup_time, 4);
  const lang = sanitize(body.lang, 4) || "el";
  const mode = sanitize(body.mode, 10) || "takeaway";
  const payment = sanitize(body.payment, 8) || "cash";
  const address = sanitize(body.address, 200);
  const floor = sanitize(body.floor, 30);
  const bell = sanitize(body.bell, 40);
  const notes = sanitize(body.notes, 200);

  if (!name || name.length < 2) return jsonResp({ ok: false, error: "Name required" }, 400);
  if (!phone || phone.length < 6) return jsonResp({ ok: false, error: "Phone required" }, 400);
  if (!["15", "30", "45", "60"].includes(pickup_time)) {
    return jsonResp({ ok: false, error: "Invalid pickup_time" }, 400);
  }
  if (!["takeaway", "delivery"].includes(mode)) {
    return jsonResp({ ok: false, error: "Invalid mode" }, 400);
  }
  if (!["cash", "card"].includes(payment)) {
    return jsonResp({ ok: false, error: "Invalid payment" }, 400);
  }
  if (mode === "delivery" && (!address || address.length < 6)) {
    return jsonResp({ ok: false, error: "Address required for delivery" }, 400);
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

  const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";
  const cf = (request as Request & { cf?: { country?: string } }).cf;
  const country = cf?.country || "XX";

  const now = Date.now();
  const expires = now + 24 * 60 * 60 * 1000;

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

  await env.DB
    .prepare(
      `INSERT INTO orders (
        id, num, name, phone, total, pickup_time, lang, mode, payment,
        address, floor, bell, notes, country, items_json, status, created_at, expires_at
      ) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,'new',?16,?17)`
    )
    .bind(
      order_id,
      nextNum,
      name,
      phone,
      total,
      pickup_time,
      lang,
      mode,
      payment,
      mode === "delivery" ? address : "",
      mode === "delivery" ? floor : "",
      mode === "delivery" ? bell : "",
      notes,
      country,
      JSON.stringify(items),
      now,
      expires
    )
    .run();

  return jsonResp({ ok: true, order_id });
};
