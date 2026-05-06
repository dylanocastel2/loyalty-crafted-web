import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function b64url(str: string) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, company, subject, message } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: settings } = await supabase
      .from("page_content")
      .select("key, content")
      .eq("page", "settings")
      .in("key", ["notify_email", "notify_enabled"]);

    const map: Record<string, string> = {};
    (settings || []).forEach((r: any) => (map[r.key] = r.content));

    if (map.notify_enabled !== "true" || !map.notify_email) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_MAIL_API_KEY = Deno.env.get("GOOGLE_MAIL_API_KEY");
    if (!LOVABLE_API_KEY || !GOOGLE_MAIL_API_KEY) {
      throw new Error("Mailverbinding niet geconfigureerd");
    }

    const to = map.notify_email;
    const mailSubject = `Nieuw formulier: ${subject || "Aanvraag"}`;
    const html = `
      <h2>Nieuw ingevuld formulier</h2>
      <p><strong>Onderwerp:</strong> ${escapeHtml(subject || "")}</p>
      <p><strong>Naam:</strong> ${escapeHtml(name || "")}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email || "")}</p>
      ${company ? `<p><strong>Organisatie:</strong> ${escapeHtml(company)}</p>` : ""}
      <p><strong>Bericht:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message || "")}</pre>
    `;

    const rfc = [
      `To: ${to}`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(mailSubject)))}?=`,
      email ? `Reply-To: ${email}` : "",
      "MIME-Version: 1.0",
      'Content-Type: text/html; charset="UTF-8"',
      "",
      html,
    ].filter(Boolean).join("\r\n");

    const raw = b64url(rfc);

    const res = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Gmail API error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-contact-notification error", e);
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});