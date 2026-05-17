/**
 * POST /api/orders/{id}/eta
 * Met à jour le temps de préparation/livraison estimé (peut être changé plusieurs fois,
 * même APRÈS validation : livreur bloqué dans le trafic, etc.).
 * Insère aussi un message système dans le chat pour notifier le client.
 * Body : { prep_minutes?: number, delivery_minutes?: number, reason?: string }
 *   - au moins un des deux champs requis
 *   - delivery_minutes peut être 0 ou null pour "À emporter / annulé"
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

function sanitize(s: unknown, max = 200): string {
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

  let body: { prep_minutes?: number; delivery_minutes?: number; reason?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ ok: false, error: "Invalid JSON" }, 400);
  }

  const hasPrep = body.prep_minutes != null;
  const hasDelivery = body.delivery_minutes != null;
  if (!hasPrep && !hasDelivery) {
    return jsonResp({ ok: false, error: "prep_minutes or delivery_minutes required" }, 400);
  }

  // Charger l'état courant pour patch partiel sans écraser l'autre champ.
  const current = await env.DB
    .prepare(`SELECT prep_minutes, delivery_minutes, status FROM orders WHERE id = ?1`)
    .bind(id)
    .first<{ prep_minutes: number | null; delivery_minutes: number | null; status: string }>();

  if (!current) return jsonResp({ ok: false, error: "Order not found" }, 404);
  if (!["new", "seen", "ready"].includes(current.status)) {
    return jsonResp({ ok: false, error: "Order closed" }, 400);
  }

  let prepMin: number = current.prep_minutes ?? 20;
  if (hasPrep) {
    const p = Number(body.prep_minutes);
    if (!Number.isFinite(p) || p < 1 || p > 180) {
      return jsonResp({ ok: false, error: "Invalid prep_minutes (1-180)" }, 400);
    }
    prepMin = Math.round(p);
  }

  let deliveryMin: number | null = current.delivery_minutes;
  if (hasDelivery) {
    const d = Number(body.delivery_minutes);
    if (!Number.isFinite(d) || d < 0 || d > 180) {
      return jsonResp({ ok: false, error: "Invalid delivery_minutes (0-180)" }, 400);
    }
    deliveryMin = Math.round(d);
  }

  const reason = sanitize(body.reason, 120);

  const nowTs = Date.now();
  const res = await env.DB
    .prepare(
      `UPDATE orders
       SET prep_minutes = ?1, delivery_minutes = ?2, eta_changed_at = ?3, updated_at = ?3
       WHERE id = ?4 AND status IN ('new','seen','ready')`
    )
    .bind(prepMin, deliveryMin, nowTs, id)
    .run();

  if (!res.meta || res.meta.changes === 0) {
    return jsonResp({ ok: false, error: "Order not found or closed" }, 404);
  }

  // Message système dans le chat
  // Format : eta:<prep>[:<delivery>][|<reason>]
  let payload = `eta:${prepMin}`;
  if (deliveryMin != null) payload += `:${deliveryMin}`;
  if (reason) payload += `|${reason}`;
  await env.DB
    .prepare(
      `INSERT INTO order_messages (order_id, sender, text, created_at) VALUES (?1, 'system', ?2, ?3)`
    )
    .bind(id, payload, nowTs)
    .run()
    .catch(() => {});

  return jsonResp({ ok: true, prep_minutes: prepMin, delivery_minutes: deliveryMin });
};
