/**
 * POST /api/contact
 * Reçoit un message du formulaire de contact visiteur.
 * Forward vers EMAIL_SERVICE_URL (pattern Sara Rodriguez — service mail Cloudflare-only).
 * Si EMAIL_SERVICE_URL pas configuré, sauvegarde dans D1 + return ok (best-effort).
 */

type Env = {
  DB?: D1Database;
  EMAIL_SERVICE_URL?: string;
  EMAIL_SERVICE_KEY?: string;
  ADMIN_KEY?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sanitize(s: unknown, max = 1000): string {
  if (typeof s !== "string") return "";
  return s.replace(/[<>]/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").slice(0, max).trim();
}

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;

  let body: { name?: string; email?: string; message?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResp({ ok: false, error: "Invalid JSON" }, 400);
  }

  const name = sanitize(body.name, 80);
  const email = sanitize(body.email, 120);
  const message = sanitize(body.message, 2000);
  const phone = sanitize(body.phone, 30);

  if (!name || name.length < 2) return jsonResp({ ok: false, error: "Name required" }, 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResp({ ok: false, error: "Valid email required" }, 400);
  }
  if (!message || message.length < 5) return jsonResp({ ok: false, error: "Message too short" }, 400);

  // Forward vers EMAIL_SERVICE_URL (pattern Sara)
  if (env.EMAIL_SERVICE_URL && env.EMAIL_SERVICE_KEY) {
    try {
      const res = await fetch(env.EMAIL_SERVICE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": env.EMAIL_SERVICE_KEY,
        },
        body: JSON.stringify({
          to: "kalamaki.troubas@gmail.com",
          from_name: "Καλαμάκι Της Τρούμπας — Site web",
          subject: `Nouveau message de ${name}`,
          html: `
            <h2>Nouveau message contact site Kalamaki</h2>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
            <p><strong>Message :</strong></p>
            <p style="white-space:pre-wrap;border-left:3px solid #E5B32A;padding-left:12px;">${message}</p>
            <hr/>
            <p style="color:#888;font-size:12px;">Reçu via kalamakitroubas.gr/#contact</p>
          `,
        }),
      });
      if (!res.ok) {
        // log mais ne fail pas — on a aussi la copie D1
        console.error("EMAIL_SERVICE failed:", res.status);
      }
    } catch (e) {
      console.error("EMAIL_SERVICE error:", (e as Error).message);
    }
  }

  // Sauvegarde D1 (toujours, comme backup)
  if (env.DB) {
    await env.DB
      .prepare(
        `CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          message TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )`
      )
      .run()
      .catch(() => {});

    await env.DB
      .prepare(`INSERT INTO contact_messages (name, email, phone, message, created_at) VALUES (?1, ?2, ?3, ?4, ?5)`)
      .bind(name, email, phone, message, Date.now())
      .run()
      .catch(() => {});
  }

  return jsonResp({ ok: true });
};
