/**
 * GET /api/orders/poll?since=<ts>
 * Long-poll : retourne les commandes status="new" créées depuis `since` (D1).
 * D1 strongly consistent → plus de boucle marker, simple SELECT.
 * Auth : cookie "caisse_auth" === ADMIN_KEY.
 */

type Env = {
  DB?: D1Database;
  ADMIN_KEY?: string;
};

type StoredOrder = {
  id: string;
  name: string;
  phone: string;
  items: Array<{ id: string; name: string; price: number; qty: number }>;
  total: number;
  pickup_time: string;
  lang: string;
  mode: string;
  payment: string;
  address?: string;
  floor?: string;
  bell?: string;
  notes?: string;
  status: string;
  created_at: number;
  country?: string;
};

type OrderRow = {
  id: string;
  name: string;
  phone: string;
  total: number;
  pickup_time: string;
  lang: string;
  mode: string;
  payment: string;
  address: string | null;
  floor: string | null;
  bell: string | null;
  notes: string | null;
  country: string | null;
  items_json: string;
  status: string;
  created_at: number;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Admin-Key",
  "Access-Control-Allow-Credentials": "true",
};

function readCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(new RegExp("(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]+)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function isAuthed(request: Request, env: Env): boolean {
  if (!env.ADMIN_KEY) return false;
  const cookieKey = readCookie(request, "caisse_auth");
  const headerKey = request.headers.get("x-admin-key");
  return cookieKey === env.ADMIN_KEY || headerKey === env.ADMIN_KEY;
}

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

function rowToOrder(r: OrderRow): StoredOrder {
  let items: StoredOrder["items"] = [];
  try { items = JSON.parse(r.items_json); } catch { /* skip */ }
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    items,
    total: r.total,
    pickup_time: r.pickup_time,
    lang: r.lang,
    mode: r.mode,
    payment: r.payment,
    address: r.address || "",
    floor: r.floor || "",
    bell: r.bell || "",
    notes: r.notes || "",
    status: r.status,
    created_at: r.created_at,
    country: r.country || "XX",
  };
}

async function fetchNew(env: Env, since: number): Promise<StoredOrder[]> {
  if (!env.DB) return [];
  const res = await env.DB
    .prepare(
      `SELECT id, name, phone, total, pickup_time, lang, mode, payment,
              address, floor, bell, notes, country, items_json, status, created_at
       FROM orders
       WHERE status = 'new' AND created_at > ?1
       ORDER BY created_at ASC
       LIMIT 100`
    )
    .bind(since)
    .all<OrderRow>();
  return (res.results || []).map(rowToOrder);
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestGet = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  if (!isAuthed(request, env)) {
    return jsonResp({ ok: false, error: "unauthorized" }, 401);
  }

  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const url = new URL(request.url);
  const sinceParam = url.searchParams.get("since");
  const since = sinceParam ? parseInt(sinceParam, 10) : 0;

  // Cleanup opportuniste : supprime expired rows (rate_limit + orders > 24h)
  const now = Date.now();
  await env.DB
    .prepare(`DELETE FROM orders WHERE expires_at < ?1`)
    .bind(now)
    .run()
    .catch(() => {});
  await env.DB
    .prepare(`DELETE FROM rate_limit WHERE expires_at < ?1`)
    .bind(now)
    .run()
    .catch(() => {});

  // 1er check : immédiat
  let orders = await fetchNew(env, since);
  if (orders.length > 0) return jsonResp({ ok: true, orders, now: Date.now() });

  // Long-poll soft : 4 essais espacés sur ~12s max (D1 = consistent, donc court suffit)
  const deadline = Date.now() + 12_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    orders = await fetchNew(env, since);
    if (orders.length > 0) break;
  }

  return jsonResp({ ok: true, orders, now: Date.now() });
};
