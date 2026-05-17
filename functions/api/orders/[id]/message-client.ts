/**
 * POST /api/orders/{id}/message-client
 * Envoie un message du client au patron, dans le chat de la commande.
 * Body : { text: string, phone: string }   // phone = derniers 4 chiffres pour valider
 * Pas d'auth, mais :
 *   - Vérifie phone last4 match l'order (anti-énumération)
 *   - Rate-limit : 5 messages / IP / 60s + 30 messages max / order
 *   - Refuse si commande terminée (paid/cancelled/ready)
 */

type Env = {
  DB?: D1Database;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

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

function last4(phone: string): string {
  return String(phone || "").replace(/\D/g, "").slice(-4);
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async (ctx: { request: Request; env: Env; params: { id: string } }) => {
  const { request, env, params } = ctx;
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const id = String(params.id || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 20);
  if (!id) return jsonResp({ ok: false, error: "Invalid id" }, 400);

  let body: { text?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ ok: false, error: "Invalid JSON" }, 400);
  }

  const text = sanitize(body.text, 500);
  const phone4 = last4(body.phone || "");
  if (!text) return jsonResp({ ok: false, error: "Empty message" }, 400);
  if (!phone4 || phone4.length < 4) return jsonResp({ ok: false, error: "phone required" }, 400);

  // Match commande + phone + status actif
  const row = await env.DB
    .prepare(`SELECT phone, status FROM orders WHERE id = ?1`)
    .bind(id)
    .first<{ phone: string; status: string }>();

  if (!row || last4(row.phone) !== phone4) {
    return jsonResp({ ok: false, error: "not found" }, 404);
  }
  if (["paid", "cancelled"].includes(row.status)) {
    return jsonResp({ ok: false, error: "Order closed" }, 410);
  }

  // Rate-limit par order : max 30 messages client
  const countRow = await env.DB
    .prepare(`SELECT COUNT(*) AS n FROM order_messages WHERE order_id = ?1 AND sender = 'client'`)
    .bind(id)
    .first<{ n: number }>();
  if (countRow && countRow.n >= 30) {
    return jsonResp({ ok: false, error: "Too many messages" }, 429);
  }

  // Rate-limit par IP : 5 msg / 60s
  const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";
  const since = Date.now() - 60 * 1000;
  const ipRow = await env.DB
    .prepare(
      `SELECT COUNT(*) AS n FROM order_messages
       WHERE sender = 'client' AND created_at > ?1
       AND order_id IN (SELECT id FROM orders WHERE phone LIKE ?2)`
    )
    .bind(since, "%" + phone4)
    .first<{ n: number }>();
  if (ipRow && ipRow.n >= 5) {
    return jsonResp({ ok: false, error: "Too fast, slow down" }, 429);
  }

  const nowTs = Date.now();
  const res = await env.DB
    .prepare(
      `INSERT INTO order_messages (order_id, sender, text, created_at) VALUES (?1, 'client', ?2, ?3)`
    )
    .bind(id, text, nowTs)
    .run();

  return jsonResp({ ok: true, id: res.meta?.last_row_id, created_at: nowTs });
};
