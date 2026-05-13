/**
 * Cloudflare Pages Function: POST /api/contact
 * Sends an email via MailChannels (free on Cloudflare Pages, no third-party).
 */
type Env = {
  TURNSTILE_SECRET_KEY?: string;
  ADMIN_KEY?: string;
  FROM_EMAIL?: string;
  TO_EMAIL?: string;
};

const DEFAULT_TO = "kalamaki.troubas@gmail.com";
const DEFAULT_FROM = "contact@kalamakitroubas.gr";

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

async function sendMail(opts: {
  to: string;
  from: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<Response> {
  return fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: opts.to }] }],
      from: { email: opts.from, name: "Καλαμάκι Της Τρούμπας" },
      reply_to: opts.replyTo ? { email: opts.replyTo } : undefined,
      subject: opts.subject,
      content: [{ type: "text/plain", value: opts.text }],
    }),
  });
}

type HandlerContext = { request: Request; env: Env };

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
    const subject =
      lang === "en" ? `New reservation — ${name}` : `Νέα κράτηση — ${name}`;
    const text = [
      `Name / Όνομα   : ${name}`,
      `Guests / Άτομα : ${guests}`,
      `Lang           : ${lang}`,
      `Country        : ${country}`,
      "",
      "Message / Μήνυμα:",
      message,
      "",
      `— kalamakitroubas.gr`,
    ].join("\n");

    const to = env.TO_EMAIL || DEFAULT_TO;
    const from = env.FROM_EMAIL || DEFAULT_FROM;

    const emailRes = await sendMail({ to, from, subject, text });
    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("MailChannels error:", emailRes.status, errText);
      throw new Error(`Mail send failed: ${emailRes.status}`);
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
