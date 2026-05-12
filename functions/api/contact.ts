/**
 * Cloudflare Pages Function: POST /api/contact
 * Compatible avec un site Astro en output static.
 * Pattern identique au projet sarah-rodriguez-limpieza (100% Cloudflare).
 */
type Env = {
  TRACKING?: KVNamespace;
  TURNSTILE_SECRET_KEY?: string;
  EMAIL_SERVICE_URL?: string;
  ADMIN_KEY?: string;
};

const KALAMAKI_EMAIL = "kalamaki.troubas@gmail.com";
const FROM_EMAIL = "contact@kalamakitroubas.gr";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type ContactPayload = {
  name: string;
  guests: string;
  message: string;
  lang: string;
  turnstileToken: string;
};

function getSafeString(v: unknown, fallback = "—"): string {
  if (typeof v !== "string") return fallback;
  const trimmed = v.trim();
  return trimmed.length ? trimmed : fallback;
}

async function parsePayload(request: Request): Promise<ContactPayload> {
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const d = (await request.json()) as Record<string, unknown>;
    return {
      name: getSafeString(d.name, "?"),
      guests: getSafeString(d.guests),
      message: getSafeString(d.message),
      lang: getSafeString(d.lang, "el"),
      turnstileToken: getSafeString(d["cf-turnstile-response"], ""),
    };
  }
  const fd = await request.formData();
  return {
    name: getSafeString(fd.get("name"), "?"),
    guests: getSafeString(fd.get("guests")),
    message: getSafeString(fd.get("message")),
    lang: getSafeString(fd.get("lang"), "el"),
    turnstileToken: getSafeString(fd.get("cf-turnstile-response"), ""),
  };
}

type HandlerContext = {
  request: Request;
  env: Env;
};

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async (context: HandlerContext) => {
  const { request, env } = context;

  try {
    const { name, guests, message, lang, turnstileToken } = await parsePayload(request);

    if (!name || name === "?") {
      return new Response(JSON.stringify({ ok: false, error: "Name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const vRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: request.headers.get("CF-Connecting-IP") || "",
        }),
      });
      const vJson = (await vRes.json()) as { success: boolean };
      if (!vJson.success) {
        return new Response(JSON.stringify({ ok: false, error: "Captcha invalid" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const country = (request as Request & { cf?: { country?: string } }).cf?.country || "XX";
    const city = (request as Request & { cf?: { city?: string } }).cf?.city || "Unknown";
    const ua = request.headers.get("user-agent") || "";
    const device = /mobile/i.test(ua) ? "Mobile" : "Desktop";
    const ip = request.headers.get("cf-connecting-ip") || "0.0.0.0";

    if (env.TRACKING) {
      await env.TRACKING.put(
        `lead:${Date.now()}`,
        JSON.stringify({
          type: "contact",
          name,
          guests,
          message,
          lang,
          ts: Date.now(),
          geo: { country, city, ip },
          device,
        }),
        { expirationTtl: 60 * 60 * 24 * 365 }
      );
    }

    if (!env.EMAIL_SERVICE_URL || !env.ADMIN_KEY) {
      throw new Error("EMAIL_SERVICE_URL or ADMIN_KEY missing in Cloudflare env vars");
    }

    const subject = lang === "en"
      ? `New reservation — ${name}`
      : `Νέα κράτηση — ${name}`;

    const emailRes = await fetch(env.EMAIL_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: KALAMAKI_EMAIL,
        from: FROM_EMAIL,
        subject,
        replyTo: FROM_EMAIL,
        adminKey: env.ADMIN_KEY,
        body: [
          `Name / Όνομα   : ${name}`,
          `Guests / Άτομα : ${guests}`,
          `Lang           : ${lang}`,
          "",
          "Message / Μήνυμα:",
          message,
          "",
          `— Sent from kalamakitroubas.gr`,
        ].join("\n"),
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Email Service Error:", errText);
      throw new Error("Failed to send email via helper");
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("Contact API error:", err);
    return new Response(JSON.stringify({ ok: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};
