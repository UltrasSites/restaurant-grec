/**
 * GET /api/orders/poll?since=<ts>
 * Long-poll : retourne TOUTES les commandes actives (status IN 'new','seen')
 * créées dans les dernières 24h. La caisse affiche 2 colonnes (En attente / En préparation).
 * Le param `since` sert uniquement à débloquer le long-poll quand une nouvelle commande
 * apparaît (>= since). À la première charge, since=0 → renvoie tout l'actif.
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
  notes_translated?: string;
  status: string;
  created_at: number;
  country?: string;
  prep_minutes: number | null;
  delivery_minutes: number | null;
  accepted_at: number | null;
  eta_changed_at: number | null;
  delivery_zone: string | null;
  unread_client_messages: number;
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
  notes_translated: string | null;
  country: string | null;
  items_json: string;
  status: string;
  created_at: number;
  prep_minutes: number | null;
  delivery_minutes: number | null;
  accepted_at: number | null;
  eta_changed_at: number | null;
  delivery_zone: string | null;
  unread_client_messages: number;
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
    notes_translated: r.notes_translated || "",
    status: r.status,
    created_at: r.created_at,
    country: r.country || "XX",
    prep_minutes: r.prep_minutes,
    delivery_minutes: r.delivery_minutes,
    accepted_at: r.accepted_at,
    eta_changed_at: r.eta_changed_at,
    delivery_zone: r.delivery_zone,
    unread_client_messages: Number(r.unread_client_messages) || 0,
  };
}

// Fenêtre d'activité de la caisse : on garde toutes les commandes
// 'new' / 'seen' des dernières 24h pour les afficher dans les 2 colonnes.
const ACTIVE_WINDOW_MS = 24 * 60 * 60 * 1000;

async function fetchActive(env: Env): Promise<StoredOrder[]> {
  if (!env.DB) return [];
  const cutoff = Date.now() - ACTIVE_WINDOW_MS;
  // LEFT JOIN sur order_messages pour compter messages client non-vus (>= accepted_at)
  const res = await env.DB
    .prepare(
      `SELECT o.id, o.name, o.phone, o.total, o.pickup_time, o.lang, o.mode, o.payment,
              o.address, o.floor, o.bell, o.notes, o.notes_translated, o.country, o.items_json,
              o.status, o.created_at, o.prep_minutes, o.delivery_minutes, o.accepted_at, o.eta_changed_at, o.delivery_zone,
              (SELECT COUNT(*) FROM order_messages m
                 WHERE m.order_id = o.id AND m.sender = 'client'
              ) AS unread_client_messages
       FROM orders o
       WHERE o.status IN ('new','seen') AND o.created_at > ?1
       ORDER BY o.created_at ASC
       LIMIT 100`
    )
    .bind(cutoff)
    .all<OrderRow>();
  return (res.results || []).map(rowToOrder);
}

async function hasNewSince(env: Env, since: number): Promise<boolean> {
  if (!env.DB) return false;
  const row = await env.DB
    .prepare(
      `SELECT 1 AS x FROM orders
       WHERE status = 'new' AND created_at > ?1
       LIMIT 1`
    )
    .bind(since)
    .first<{ x: number }>();
  return !!row;
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

  // Cleanup opportuniste : supprime expired rows (rate_limit + orders > 24h + history > 50j)
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
  await env.DB
    .prepare(`DELETE FROM orders_history WHERE expires_at < ?1`)
    .bind(now)
    .run()
    .catch(() => {});

  // 1er check immédiat : si on a déjà des nouvelles depuis `since`,
  // on renvoie tout l'actif (pour que la caisse refresh ses 2 colonnes).
  // Sinon on attend dans la boucle long-poll.
  if (since === 0 || (await hasNewSince(env, since))) {
    const orders = await fetchActive(env);
    return jsonResp({ ok: true, orders, now: Date.now() });
  }

  // Long-poll soft : 8 essais espacés sur ~12s max (D1 = consistent, donc court suffit)
  const deadline = Date.now() + 12_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    if (await hasNewSince(env, since)) break;
  }

  // À la fin du long-poll on renvoie toujours l'état actif complet,
  // que ce soit timeout ou nouvelle commande détectée.
  const orders = await fetchActive(env);
  return jsonResp({ ok: true, orders, now: Date.now() });
};
