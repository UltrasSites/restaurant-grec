/**
 * GET /api/orders/history
 * Renvoie les 100 dernières lignes de l'historique anonymisé (50 jours).
 * Auth : cookie "caisse_auth" === ADMIN_KEY (ou header X-Admin-Key).
 */

type Env = {
  DB?: D1Database;
  ADMIN_KEY?: string;
};

type HistoryRow = {
  id: string;
  total: number;
  created_at: number;
  acked_at: number | null;
  status: string;
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

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestGet = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  if (!isAuthed(request, env)) {
    return jsonResp({ ok: false, error: "unauthorized" }, 401);
  }
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  // Cleanup auto en passant
  const now = Date.now();
  await env.DB
    .prepare(`DELETE FROM orders_history WHERE expires_at < ?1`)
    .bind(now)
    .run()
    .catch(() => {});

  const res = await env.DB
    .prepare(
      `SELECT id, total, created_at, acked_at, status
       FROM orders_history
       ORDER BY created_at DESC
       LIMIT 100`
    )
    .all<HistoryRow>();

  return jsonResp({ ok: true, rows: res.results || [], now });
};
