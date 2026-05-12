/**
 * POST /api/orders/{id}/ack
 * Marque la commande comme "seen" (acquittée par la caisse).
 * Auth : cookie "caisse_auth" === ADMIN_KEY.
 */

type Env = {
  ORDERS?: KVNamespace;
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
  if (!env.ORDERS) return jsonResp({ ok: false, error: "ORDERS KV not bound" }, 500);

  const id = String(params.id || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 20);
  if (!id) return jsonResp({ ok: false, error: "Invalid id" }, 400);

  // Find the key by listing (id suffix)
  const listed = await env.ORDERS.list({ prefix: "order:", limit: 100 });
  const match = listed.keys.find((k) => k.name.endsWith(":" + id));
  if (!match) return jsonResp({ ok: false, error: "Order not found" }, 404);

  const raw = await env.ORDERS.get(match.name);
  if (!raw) return jsonResp({ ok: false, error: "Order missing" }, 404);

  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    o.status = "seen";
    o.acked_at = Date.now();
    await env.ORDERS.put(match.name, JSON.stringify(o), { expirationTtl: 60 * 60 * 24 });
  } catch {
    return jsonResp({ ok: false, error: "Parse error" }, 500);
  }

  return jsonResp({ ok: true });
};
