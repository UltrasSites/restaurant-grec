/**
 * GET /api/orders/poll?since=<ts>
 * Long-poll : retourne les commandes status="new" créées depuis `since`.
 * Si rien après ~25s, retourne tableau vide.
 * Auth : cookie "caisse_auth" === ADMIN_KEY (set par /caisse).
 */

type Env = {
  ORDERS?: KVNamespace;
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
  status: string;
  created_at: number;
  country?: string;
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
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function fetchNewOrders(env: Env, since: number): Promise<StoredOrder[]> {
  if (!env.ORDERS) return [];
  const listed = await env.ORDERS.list({ prefix: "order:", limit: 100 });
  const out: StoredOrder[] = [];
  for (const k of listed.keys) {
    // key format order:<ts>:<id>
    const parts = k.name.split(":");
    const ts = parseInt(parts[1] || "0", 10);
    if (ts <= since) continue;
    const raw = await env.ORDERS.get(k.name);
    if (!raw) continue;
    try {
      const o = JSON.parse(raw) as StoredOrder;
      if (o.status === "new") out.push(o);
    } catch {
      // skip
    }
  }
  out.sort((a, b) => a.created_at - b.created_at);
  return out;
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestGet = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  if (!isAuthed(request, env)) {
    return jsonResp({ ok: false, error: "unauthorized" }, 401);
  }

  if (!env.ORDERS) return jsonResp({ ok: false, error: "ORDERS KV not bound" }, 500);

  const url = new URL(request.url);
  const sinceParam = url.searchParams.get("since");
  const since = sinceParam ? parseInt(sinceParam, 10) : 0;

  // Premier check immédiat
  let orders = await fetchNewOrders(env, since);
  if (orders.length > 0) return jsonResp({ ok: true, orders, now: Date.now() });

  // Long polling : check toutes les 2s pendant 25s max
  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2000));
    orders = await fetchNewOrders(env, since);
    if (orders.length > 0) break;
  }

  return jsonResp({ ok: true, orders, now: Date.now() });
};
