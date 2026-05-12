/**
 * Cloudflare Pages Function — Réception du formulaire de contact / réservation.
 * Envoie un email vers kalamaki.troubas@gmail.com via MailChannels (gratuit pour CF Pages).
 *
 * Pour que MailChannels accepte les envois, ajouter aux DNS de kalamakitroubas.gr :
 *   - Enregistrement SPF : "v=spf1 a mx include:relay.mailchannels.net ~all"
 *   - Enregistrement TXT _mailchannels : "v=mc1 cfid=<DOMAIN>.pages.dev"
 *   - DKIM optionnel pour meilleure delivrabilite
 */

interface Env {
  RESEND_API_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const data = await request.json<{
      name?: string;
      guests?: string;
      message?: string;
      lang?: string;
    }>();

    const name = (data.name || "").trim().slice(0, 200);
    const guests = (data.guests || "").trim().slice(0, 100);
    const message = (data.message || "").trim().slice(0, 2000);
    const lang = data.lang === "en" ? "en" : "el";

    if (!name) {
      return new Response(JSON.stringify({ ok: false, error: "name_required" }), { status: 400, headers: cors });
    }

    const subject = lang === "en"
      ? `New reservation request — ${name}`
      : `Νέα κράτηση — ${name}`;

    const textBody = [
      `Name / Όνομα: ${name}`,
      `Guests / Άτομα: ${guests || "—"}`,
      message ? `Message / Μήνυμα: ${message}` : "",
      "",
      `— Sent from kalamakitroubas.gr (${lang})`,
    ].join("\n");

    // 1) Tentative via Resend si une cle est presente (plus fiable, pas besoin DNS)
    if (env.RESEND_API_KEY) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Kalamaki Troubas <noreply@kalamakitroubas.gr>",
          to: ["kalamaki.troubas@gmail.com"],
          reply_to: "kalamaki.troubas@gmail.com",
          subject,
          text: textBody,
        }),
      });
      if (r.ok) return new Response(JSON.stringify({ ok: true, via: "resend" }), { headers: cors });
    }

    // 2) Fallback : MailChannels (natif Cloudflare, gratuit, sans cle)
    const mc = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: "kalamaki.troubas@gmail.com", name: "Kalamaki Troubas" }],
        }],
        from: { email: "noreply@kalamakitroubas.gr", name: "Kalamaki Troubas — Site" },
        reply_to: { email: "kalamaki.troubas@gmail.com", name: "Kalamaki Troubas" },
        subject,
        content: [{ type: "text/plain", value: textBody }],
      }),
    });

    if (!mc.ok) {
      const errText = await mc.text();
      return new Response(JSON.stringify({ ok: false, error: "send_failed", detail: errText }), { status: 502, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true, via: "mailchannels" }), { headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "bad_request" }), { status: 400, headers: cors });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
