/**
 * POST /api/order
 * Reçoit une commande client, l'enregistre dans KV (binding ORDERS).
 * - Génère un ID court via counter KV (clé "counter").
 * - Rate-limit : max 5 commandes / IP / 10 min (clé "rate:<ip>").
 * - TTL : 24h sur la commande, 10min sur le rate-limit.
 */

type OrderItem = { id: string; name: string; price: number; qty: number };
type OrderPayload = {
  name: string;
  phone: string;
  items: OrderItem[];
  total: number;
  pickup_time: string;
  lang: string;
  mode: string;          // "takeaway" | "delivery"
  payment: string;       // "cash" | "card"
  address?: string;
  floor?: string;
  bell?: string;
  notes?: string;
};

type Env = {
  ORDERS?: KVNamespace;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sanitize(s: unknown, max = 200): string {
  if (typeof s !== "string") return "";
  // Strip tags + control chars, limit length
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

  if (!env.ORDERS) {
    return jsonResp({ ok: false, error: "ORDERS KV namespace not bound" }, 500);
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

  // Recalcul du total côté serveur
  const total = Math.round(items.reduce((s, it) => s + it.price * it.qty, 0) * 100) / 100;
  if (total <= 0 || total > 500) {
    return jsonResp({ ok: false, error: "Invalid total" }, 400);
  }

  const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";
  const cf = (request as Request & { cf?: { country?: string } }).cf;
  const country = cf?.country || "XX";

  // Rate limiting : max 5 commandes / IP / 10 min
  const rateKey = `rate:${ip}`;
  const rateRaw = await env.ORDERS.get(rateKey);
  const rateCount = rateRaw ? parseInt(rateRaw, 10) : 0;
  if (rateCount >= 5) {
    return jsonResp({ ok: false, error: "Too many orders. Try again in a few minutes." }, 429);
  }
  await env.ORDERS.put(rateKey, String(rateCount + 1), { expirationTtl: 600 });

  // Generate short ID via counter
  const counterRaw = await env.ORDERS.get("counter");
  const counter = counterRaw ? parseInt(counterRaw, 10) : 0;
  const nextNum = counter + 1;
  await env.ORDERS.put("counter", String(nextNum));

  const order_id = `K-${String(nextNum).padStart(3, "0")}`;
  const now = Date.now();

  const order = {
    id: order_id,
    name,
    phone,
    items,
    total,
    pickup_time,
    lang,
    mode,
    payment,
    address: mode === "delivery" ? address : "",
    floor: mode === "delivery" ? floor : "",
    bell: mode === "delivery" ? bell : "",
    notes,
    status: "new" as const,
    created_at: now,
    country,
  };

  // Key avec timestamp pour permettre listing chronologique
  const orderKey = `order:${now}:${order_id}`;
  await env.ORDERS.put(orderKey, JSON.stringify(order), { expirationTtl: 60 * 60 * 24 }); // 24h

  return jsonResp({ ok: true, order_id });
};
