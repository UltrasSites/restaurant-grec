/**
 * POST /api/orders/{id}/status
 * Met à jour le statut d'une commande (workflow caisse).
 * Statuts valides : new | seen | ready | paid | cancelled.
 * Auth : cookie "caisse_auth" === ADMIN_KEY.
 */

type Env = {
  DB?: D1Database;
  ADMIN_KEY?: string;
};

const VALID_STATUSES = new Set(["new", "seen", "ready", "paid", "cancelled"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async (ctx: { request: Request; env: Env; params: { id: string } }) => {
  const { request, env, params } = ctx;

  if (!isAuthed(request, env)) return jsonResp({ ok: false, error: "unauthorized" }, 401);
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const id = String(params.id || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 20);
  if (!id) return jsonResp({ ok: false, error: "Invalid id" }, 400);

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ ok: false, error: "Invalid JSON" }, 400);
  }

  const newStatus = String(body.status || "").toLowerCase();
  if (!VALID_STATUSES.has(newStatus)) {
    return jsonResp({ ok: false, error: "Invalid status" }, 400);
  }

  const nowTs = Date.now();
  const res = await env.DB
    .prepare(`UPDATE orders SET status = ?1, updated_at = ?2 WHERE id = ?3`)
    .bind(newStatus, nowTs, id)
    .run();

  if (!res.meta || res.meta.changes === 0) {
    return jsonResp({ ok: false, error: "Order not found" }, 404);
  }

  // Miroir dans l'historique anonymisé (best-effort)
  await env.DB
    .prepare(`UPDATE orders_history SET status = ?1 WHERE id = ?2`)
    .bind(newStatus, id)
    .run()
    .catch(() => {});

  return jsonResp({ ok: true, status: newStatus });
};
