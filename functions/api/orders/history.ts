/**
 * GET /api/orders/history
 * Renvoie les commandes des 60 derniers jours avec TOUTES les colonnes
 * (id, created_at, name, phone, mode, payment, address, floor, bell, notes,
 *  items_json, total, status, updated_at).
 * Auth : cookie "caisse_auth" === ADMIN_KEY (ou header X-Admin-Key).
 */

type Env = {
  DB?: D1Database;
  ADMIN_KEY?: string;
};

type HistoryRow = {
  id: string;
  created_at: number;
  updated_at: number | null;
  name: string;
  phone: string;
  mode: string;
  payment: string;
  address: string | null;
  floor: string | null;
  bell: string | null;
  notes: string | null;
  items_json: string;
  total: number;
  status: string;
  delivery_zone: string | null;
  prep_minutes: number | null;
};

const RETENTION_MS = 60 * 24 * 60 * 60 * 1000; // 60 jours

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

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestGet = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  if (!isAuthed(request, env)) {
    return jsonResp({ ok: false, error: "unauthorized" }, 401);
  }
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const now = Date.now();
  const cutoff = now - RETENTION_MS;

  const res = await env.DB
    .prepare(
      `SELECT o.id, o.created_at, o.updated_at, o.name, o.phone, o.mode, o.payment,
              o.address, o.floor, o.bell, o.notes, o.items_json, o.total, o.status,
              o.delivery_zone, o.prep_minutes,
              (SELECT COUNT(*) FROM order_messages m
                WHERE m.order_id = o.id AND m.sender IN ('patron','client')
              ) AS msg_total,
              (SELECT COUNT(*) FROM order_messages mc
                WHERE mc.order_id = o.id AND mc.sender = 'client'
                  AND mc.created_at > COALESCE(
                    (SELECT MAX(created_at) FROM order_messages mp
                       WHERE mp.order_id = o.id AND mp.sender = 'patron'),
                    0)
              ) AS msg_unread_client
       FROM orders o
       WHERE o.created_at > ?1
       ORDER BY o.created_at DESC
       LIMIT 1000`
    )
    .bind(cutoff)
    .all<HistoryRow & { msg_total: number; msg_unread_client: number }>();

  // Parse items_json côté serveur pour simplifier le client.
  const rows = (res.results || []).map((r) => {
    let items: Array<{ name: string; qty: number; price: number }> = [];
    try { items = JSON.parse(r.items_json || "[]"); } catch { /* skip */ }
    return {
      id: r.id,
      created_at: r.created_at,
      updated_at: r.updated_at || 0,
      name: r.name || "",
      phone: r.phone || "",
      mode: r.mode || "",
      payment: r.payment || "",
      address: r.address || "",
      floor: r.floor || "",
      bell: r.bell || "",
      notes: r.notes || "",
      items,
      items_count: items.reduce((s, it) => s + (Number(it.qty) || 0), 0),
      total: r.total,
      status: r.status,
      delivery_zone: r.delivery_zone || null,
      prep_minutes: r.prep_minutes,
      msg_total: Number((r as any).msg_total) || 0,
      msg_unread_client: Number((r as any).msg_unread_client) || 0,
    };
  });

  return jsonResp({ ok: true, rows, now, retention_days: 60 });
};
