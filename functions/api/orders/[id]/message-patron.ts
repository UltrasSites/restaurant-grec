/**
 * POST /api/orders/{id}/message-patron
 * Envoie un message du patron au client, dans le chat de la commande.
 * Body : { text: string }
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

function sanitize(s: unknown, max = 500): string {
  if (typeof s !== "string") return "";
  return s.replace(/[<>]/g, "").replace(/[\x00-\x1F\x7F]/g, "").slice(0, max).trim();
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async (ctx: { request: Request; env: Env; params: { id: string } }) => {
  const { request, env, params } = ctx;

  if (!isAuthed(request, env)) return jsonResp({ ok: false, error: "unauthorized" }, 401);
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const id = String(params.id || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 20);
  if (!id) return jsonResp({ ok: false, error: "Invalid id" }, 400);

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ ok: false, error: "Invalid JSON" }, 400);
  }

  const text = sanitize(body.text, 500);
  if (!text || text.length < 1) return jsonResp({ ok: false, error: "Empty message" }, 400);

  // Vérifie que la commande existe
  const exists = await env.DB
    .prepare(`SELECT 1 AS x FROM orders WHERE id = ?1 LIMIT 1`)
    .bind(id)
    .first<{ x: number }>();
  if (!exists) return jsonResp({ ok: false, error: "Order not found" }, 404);

  const nowTs = Date.now();
  const res = await env.DB
    .prepare(
      `INSERT INTO order_messages (order_id, sender, text, created_at) VALUES (?1, 'patron', ?2, ?3)`
    )
    .bind(id, text, nowTs)
    .run();

  return jsonResp({ ok: true, id: res.meta?.last_row_id, created_at: nowTs });
};
