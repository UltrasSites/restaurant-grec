/**
 * GET /api/orders/messages-summary
 * Vue agregee de toutes les conversations clients actives (60 derniers jours).
 * Retourne pour chaque commande ayant au moins 1 message :
 *   { id, name, phone4, mode, total, status, last_message, last_at, unread_client }
 * Trie : unread_client > 0 en tete (priorite non-lues), puis last_at DESC.
 *
 * Source : table `order_messages` JOIN `orders` (D1).
 * Note : history.orders (sql migration 0002) garde les commandes terminees apres expires_at d'orders.
 * On lit donc UNION orders + orders_history sur 60j.
 *
 * Auth : cookie "caisse_auth" === ADMIN_KEY (ou header X-Admin-Key).
 */

type Env = {
  DB?: D1Database;
  ADMIN_KEY?: string;
};

type Row = {
  id: string;
  name: string;
  phone: string;
  mode: string;
  total: number;
  status: string;
  last_message: string | null;
  last_at: number | null;
  unread_client: number;
  total_msgs: number;
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

export const onRequestOptions = async () => new Response(null, { headers: corsHeaders });

export const onRequestGet = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;
  if (!isAuthed(request, env)) return jsonResp({ ok: false, error: "unauthorized" }, 401);
  if (!env.DB) return jsonResp({ ok: false, error: "DB binding missing" }, 500);

  const cutoff = Date.now() - 60 * 86400 * 1000;

  // Plan : on prend toutes les order_messages des 60j, on group by order_id,
  // puis on rejoint orders ou orders_history pour metadata.
  // SQLite (D1) ne supporte pas FILTER avant 3.30+, donc on calcule unread cote app
  // a partir des derniers timestamps (sender='client' apres dernier patron message).

  // 1) Trouver tous les order_id ayant des messages dans les 60j (avec last message)
  let activeIds: Array<{ order_id: string; last_message: string; last_at: number; total_msgs: number }> = [];
  try {
    const idsRes = await env.DB
      .prepare(
        `SELECT m.order_id,
                MAX(m.created_at) AS last_at,
                COUNT(*) AS total_msgs
         FROM order_messages m
         WHERE m.created_at > ?1
         GROUP BY m.order_id
         ORDER BY last_at DESC
         LIMIT 200`
      )
      .bind(cutoff)
      .all<{ order_id: string; last_at: number; total_msgs: number }>();
    activeIds = (idsRes.results || []).map((r) => ({
      order_id: r.order_id,
      last_at: Number(r.last_at) || 0,
      last_message: "",
      total_msgs: Number(r.total_msgs) || 0,
    }));
  } catch (e) {
    return jsonResp({ ok: false, error: "DB query failed (ids)" }, 500);
  }

  if (activeIds.length === 0) {
    return jsonResp({ ok: true, conversations: [], now: Date.now() });
  }

  // 2) Recuperer le DERNIER message pour chacun
  const lastMsgs: Record<string, { text: string; sender: string; created_at: number }> = {};
  try {
    // On limite a 200 commandes : on fait 1 query par chunk de 50 (UNION lourd, mais OK)
    // Plus simple : on prend tous les messages des 60j puis on filtre
    const allRes = await env.DB
      .prepare(
        `SELECT order_id, sender, text, created_at
         FROM order_messages
         WHERE created_at > ?1
         ORDER BY created_at ASC
         LIMIT 5000`
      )
      .bind(cutoff)
      .all<{ order_id: string; sender: string; text: string; created_at: number }>();

    const byOrder: Record<string, Array<{ sender: string; text: string; created_at: number }>> = {};
    for (const m of allRes.results || []) {
      const oid = String(m.order_id);
      if (!byOrder[oid]) byOrder[oid] = [];
      byOrder[oid].push({ sender: m.sender, text: m.text, created_at: Number(m.created_at) || 0 });
    }

    // Pour chaque order : dernier message + calcul unread_client
    const unreadByOrder: Record<string, number> = {};
    for (const oid in byOrder) {
      const arr = byOrder[oid];
      const last = arr[arr.length - 1];
      lastMsgs[oid] = { text: last.text, sender: last.sender, created_at: last.created_at };
      // unread_client = client messages APRES last patron message
      let lastPatronAt = 0;
      for (const m of arr) {
        if (m.sender === "patron" && m.created_at > lastPatronAt) lastPatronAt = m.created_at;
      }
      let unread = 0;
      for (const m of arr) {
        if (m.sender === "client" && m.created_at > lastPatronAt) unread++;
      }
      unreadByOrder[oid] = unread;
    }

    // Assign back
    activeIds = activeIds.map((r) => ({
      ...r,
      last_message: lastMsgs[r.order_id] ? lastMsgs[r.order_id].text : "",
    }));

    // 3) Recuperer metadata orders + orders_history
    // Construit IN clause
    const ids = activeIds.map((r) => r.order_id);
    const placeholders = ids.map((_, i) => "?" + (i + 1)).join(",");
    const meta: Record<string, { name: string; phone: string; mode: string; total: number; status: string }> = {};

    if (ids.length > 0) {
      // orders
      try {
        const oRes = await env.DB
          .prepare(`SELECT id, name, phone, mode, total, status FROM orders WHERE id IN (${placeholders})`)
          .bind(...ids)
          .all<{ id: string; name: string; phone: string; mode: string; total: number; status: string }>();
        for (const r of oRes.results || []) {
          meta[r.id] = {
            name: r.name || "",
            phone: r.phone || "",
            mode: r.mode || "",
            total: Number(r.total) || 0,
            status: r.status || "",
          };
        }
      } catch {}

      // orders_history (statuts finis) - schema anonymise : pas de name/phone/mode
      // On l'utilise juste pour retrouver les totals/status des commandes deja archivees.
      try {
        const hRes = await env.DB
          .prepare(`SELECT id, total, status FROM orders_history WHERE id IN (${placeholders})`)
          .bind(...ids)
          .all<{ id: string; total: number; status: string }>();
        for (const r of hRes.results || []) {
          if (!meta[r.id]) {
            meta[r.id] = {
              name: "",
              phone: "",
              mode: "",
              total: Number(r.total) || 0,
              status: r.status || "completed",
            };
          }
        }
      } catch {}
    }

    // 4) Composer les conversations
    const conversations = activeIds.map((r) => {
      const m = meta[r.order_id] || { name: "", phone: "", mode: "", total: 0, status: "" };
      const phone4 = String(m.phone || "").replace(/\D/g, "").slice(-4);
      return {
        id: r.order_id,
        name: m.name,
        phone4,
        mode: m.mode,
        total: m.total,
        status: m.status,
        last_message: r.last_message || "",
        last_sender: lastMsgs[r.order_id] ? lastMsgs[r.order_id].sender : "",
        last_at: r.last_at,
        unread_client: unreadByOrder[r.order_id] || 0,
        total_msgs: r.total_msgs,
      };
    });

    // Tri : unread first DESC, last_at DESC
    conversations.sort((a, b) => {
      if ((a.unread_client > 0 ? 1 : 0) !== (b.unread_client > 0 ? 1 : 0)) {
        return (b.unread_client > 0 ? 1 : 0) - (a.unread_client > 0 ? 1 : 0);
      }
      return b.last_at - a.last_at;
    });

    return jsonResp({ ok: true, conversations, now: Date.now() });
  } catch (e) {
    return jsonResp({ ok: false, error: "DB query failed" }, 500);
  }
};
