/**
 * POST /api/caisse-login
 * Body : { password }
 * Si password === ADMIN_KEY, set cookie "caisse_auth" httpOnly secure.
 */

type Env = { ADMIN_KEY?: string };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export const onRequestOptions = async () => new Response(null, { headers: corsHeaders });

export const onRequestPost = async (ctx: { request: Request; env: Env }) => {
  const { request, env } = ctx;
  if (!env.ADMIN_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "ADMIN_KEY not set" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const pw = String(body.password || "");
  if (pw !== env.ADMIN_KEY) {
    // petit délai anti-bruteforce
    await new Promise((r) => setTimeout(r, 500));
    return new Response(JSON.stringify({ ok: false, error: "Wrong password" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Cookie 12h, Secure, SameSite=Lax (HttpOnly = false pour permettre read côté client si besoin, mais on garde HttpOnly)
  const cookie = [
    `caisse_auth=${encodeURIComponent(env.ADMIN_KEY)}`,
    "Path=/",
    "Max-Age=43200", // 12h
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ].join("; ");

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
    },
  });
};
