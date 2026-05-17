/**
 * GET /api/orders/{id}/public
 * Endpoint PUBLIC (pas d'auth) pour le client qui suit sa propre commande.
 * Retourne le statut, le temps estimé, et les messages du chat.
 * Anti-énumération : on demande un paramètre phone partiel (?phone=NNNN, derniers 4 chiffres)
 * qui doit matcher la commande, sinon 404.
 * Données sensibles minimisées : pas d'adresse complète, pas d'items détaillés.
 *
 * Query params :
 *   - phone : 4 derniers chiffres du téléphone (obligatoire)
 *   - since : timestamp ms du dernier message reçu (long-poll soft)
 */

type Env = {
  DB?: D1Database;
};

type OrderRow = {
  id: string;
  name: string;
  total: number;
  mode: string;
  payment: string;
  status: string;
  prep_minutes: number | null;
  delivery_minutes: number | null;
  accepted_at: number | null;
  eta_changed_at: number | null;
  created_at: number;
  phone: string;
  lang: string;
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
  "Access-Control-Allow-Headers": "Content-Type",
};

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

function last4(phone: string): string {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.slice(-4);
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestGet = async (ctx: { request: Request; env: Env; params: { id: string } }) => {
  const { request, env, params } = ctx;
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const id = String(params.id || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 20);
  if (!id) return jsonResp({ ok: false, error: "Invalid id" }, 400);

  const url = new URL(request.url);
  const phoneParam = String(url.searchParams.get("phone") || "").replace(/\D/g, "").slice(-4);
  const sinceParam = url.searchParams.get("since");
  const since = sinceParam ? parseInt(sinceParam, 10) || 0 : 0;

  if (!phoneParam || phoneParam.length < 4) {
    return jsonResp({ ok: false, error: "phone query required" }, 400);
  }

  const row = await env.DB
    .prepare(
      `SELECT id, name, total, mode, payment, status, prep_minutes, delivery_minutes,
              accepted_at, eta_changed_at, created_at, phone, lang
       FROM orders WHERE id = ?1`
    )
    .bind(id)
    .first<OrderRow>();

  // Vérifie phone match avant tout retour pour éviter user enumeration
  if (!row || last4(row.phone) !== phoneParam) {
    return jsonResp({ ok: false, error: "not found" }, 404);
  }

  // Fetch messages (sans l'horloge, polling court côté client)
  const msgRes = await env.DB
    .prepare(
      `SELECT id, sender, text, created_at
       FROM order_messages
       WHERE order_id = ?1 AND created_at > ?2
       ORDER BY created_at ASC
       LIMIT 200`
    )
    .bind(id, since)
    .all<MessageRow>();

  const messages = msgRes.results || [];

  return jsonResp({
    ok: true,
    order: {
      id: row.id,
      name: row.name,
      total: row.total,
      mode: row.mode,
      payment: row.payment,
      status: row.status,
      prep_minutes: row.prep_minutes,
      delivery_minutes: row.delivery_minutes,
      accepted_at: row.accepted_at,
      eta_changed_at: row.eta_changed_at,
      created_at: row.created_at,
      lang: row.lang,
    },
    messages,
    now: Date.now(),
  });
};
