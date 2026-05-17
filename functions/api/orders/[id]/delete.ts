/**
 * POST /api/orders/{id}/delete
 * Supprime une commande de l'historique caisse (action irréversible).
 * Le patron peut supprimer des lignes anciennes depuis la colonne History.
 * Auth : cookie "caisse_auth" === ADMIN_KEY.
 */

type Env = {
  DB?: D1Database;
  ADMIN_KEY?: string;
};

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

  // Supprime cascade : messages d'abord (par sécurité, même si FK ON DELETE CASCADE)
  await env.DB
    .prepare(`DELETE FROM order_messages WHERE order_id = ?1`)
    .bind(id)
    .run()
    .catch(() => {});

  const res = await env.DB
    .prepare(`DELETE FROM orders WHERE id = ?1`)
    .bind(id)
    .run();

  if (!res.meta || res.meta.changes === 0) {
    return jsonResp({ ok: false, error: "Order not found" }, 404);
  }

  // Miroir history anonymisé (best-effort)
  await env.DB
    .prepare(`DELETE FROM orders_history WHERE id = ?1`)
    .bind(id)
    .run()
    .catch(() => {});

  return jsonResp({ ok: true });
};
