/**
 * POST /api/caisse-logout
 * Supprime le cookie caisse_auth en cote serveur (HttpOnly impossible cote JS).
 * Appele quand la session localStorage cashd_session a expire (>2h inactivite).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export const onRequestOptions = async () =>
  new Response(null, { headers: corsHeaders });

export const onRequestPost = async () => {
  // Set cookie expire (Max-Age=0)
  const cookie = [
    "caisse_auth=",
    "Path=/",
    "Max-Age=0",
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
