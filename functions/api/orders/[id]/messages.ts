/**
 * GET /api/orders/{id}/messages
 * Endpoint ADMIN (auth cookie caisse_auth) qui retourne tous les messages
 * d'une commande, plus un compteur "unread_client" (messages du client après
 * le dernier message envoyé par le patron — utile pour badge sur la ligne d'historique).
 *
 * Auth : cookie "caisse_auth" === ADMIN_KEY (ou header X-Admin-Key).
 */

type Env = {
  DB?: D1Database;
  ADMIN_KEY?: string;
};

type MessageRow = {
  id: number;
  sender: string;
  text: string;
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
    },
  });
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestGet = async (ctx: { request: Request; env: Env; params: { id: string } }) => {
  const { request, env, params } = ctx;

  if (!isAuthed(request, env)) return jsonResp({ ok: false, error: "unauthorized" }, 401);
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const id = String(params.id || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 20);
  if (!id) return jsonResp({ ok: false, error: "Invalid id" }, 400);

  const msgRes = await env.DB
    .prepare(
      `SELECT id, sender, text, created_at
       FROM order_messages
       WHERE order_id = ?1
       ORDER BY created_at ASC
       LIMIT 500`
    )
    .bind(id)
    .all<MessageRow>();

  const messages = msgRes.results || [];

  // unread_client = messages du client envoyés APRES le dernier message du patron.
  // Si le patron n'a jamais répondu, on compte tous les messages client.
  let lastPatronAt = 0;
  for (const m of messages) {
    if (m.sender === "patron" && m.created_at > lastPatronAt) lastPatronAt = m.created_at;
  }
  let unreadClient = 0;
  let totalClient = 0;
  let totalPatron = 0;
  for (const m of messages) {
    if (m.sender === "client") {
      totalClient++;
      if (m.created_at > lastPatronAt) unreadClient++;
    } else if (m.sender === "patron") {
      totalPatron++;
    }
  }

  return jsonResp({
    ok: true,
    messages,
    unread_client: unreadClient,
    total_client: totalClient,
    total_patron: totalPatron,
    now: Date.now(),
  });
};
