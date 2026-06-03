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
    const body = await req.json();
    const name: string = body.name || "";
    const email: string = body.email || "";
    const company: string = body.company || "";
    const subject: string = body.subject || body.form_subject || body.form_title || "Aanvraag";
    const message: string = body.message || "";
    const attachments = body.attachments;
    const formTitle: string | undefined = body.form_title;
    const pagePath: string | undefined = body.page_path;
    const extraFields: Record<string, any> | undefined = body.extra_fields;

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

    // Allow comma-separated list of notification emails
    const recipients = map.notify_email
      .split(/[,;\n]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
    if (recipients.length === 0) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: "no_valid_recipients" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const to = recipients.join(", ");

    const extraHtml = extraFields && typeof extraFields === "object"
      ? Object.entries(extraFields)
          .map(([k, v]) => `<p><strong>${escapeHtml(String(k))}:</strong> ${escapeHtml(
              Array.isArray(v) ? v.join(", ") : (v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v))
            )}</p>`)
          .join("")
      : "";

    const formLabel = (formTitle && formTitle.trim()) || subject || "Aanvraag";
    const mailSubject = `Formulier ingevuld: ${formLabel}`;
    const html = `
      <h2>Nieuw ingevuld formulier</h2>
      ${formTitle ? `<p><strong>Formulier:</strong> ${escapeHtml(formTitle)}</p>` : ""}
      <p><strong>Onderwerp:</strong> ${escapeHtml(subject || "")}</p>
      ${name ? `<p><strong>Naam:</strong> ${escapeHtml(name)}</p>` : ""}
      ${email ? `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>` : ""}
      ${company ? `<p><strong>Organisatie:</strong> ${escapeHtml(company)}</p>` : ""}
      ${pagePath ? `<p><strong>Pagina:</strong> ${escapeHtml(pagePath)}</p>` : ""}
      ${extraHtml}
      ${message ? `<p><strong>Bericht:</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>` : ""}
    `;

    // Fetch attachments (each: { url, name })
    const fetched: { name: string; mime: string; b64: string }[] = [];
    if (Array.isArray(attachments)) {
      for (const a of attachments.slice(0, 5)) {
        const path = a?.path || (typeof a?.url === "string" ? a.url.split("/form-uploads/")[1] : null);
        if (!path) continue;
        try {
          const { data: blob, error: dlErr } = await supabase.storage
            .from("form-uploads")
            .download(path);
          if (dlErr || !blob) continue;
          const buf = new Uint8Array(await blob.arrayBuffer());
          if (buf.byteLength > 15 * 1024 * 1024) continue;
          let bin = "";
          for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
          fetched.push({
            name: (a.name || "bijlage").replace(/[\r\n"]/g, "_"),
            mime: blob.type || "application/octet-stream",
            b64: btoa(bin),
          });
        } catch (_) { /* skip */ }
      }
    }

    const headerLines = [
      `To: ${to}`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(mailSubject)))}?=`,
      email ? `Reply-To: ${email}` : "",
      "MIME-Version: 1.0",
    ].filter(Boolean);

    let rfc: string;
    if (fetched.length === 0) {
      rfc = [
        ...headerLines,
        'Content-Type: text/html; charset="UTF-8"',
        "",
        html,
      ].join("\r\n");
    } else {
      const boundary = `=_lg_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      const parts: string[] = [];
      parts.push(`--${boundary}`);
      parts.push('Content-Type: text/html; charset="UTF-8"');
      parts.push("Content-Transfer-Encoding: 7bit");
      parts.push("");
      parts.push(html);
      for (const f of fetched) {
        parts.push(`--${boundary}`);
        parts.push(`Content-Type: ${f.mime}; name="${f.name}"`);
        parts.push("Content-Transfer-Encoding: base64");
        parts.push(`Content-Disposition: attachment; filename="${f.name}"`);
        parts.push("");
        parts.push(f.b64.replace(/(.{76})/g, "$1\r\n"));
      }
      parts.push(`--${boundary}--`);
      rfc = [
        ...headerLines,
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        "",
        ...parts,
      ].join("\r\n");
    }

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

    // Send confirmation email to the submitter (if a valid email was provided)
    let confirmationId: string | null = null;
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        const confirmSubject = `Bevestiging: ${formLabel}`;
        const confirmHtml = `
          <p>Beste ${escapeHtml(name || "")},</p>
          <p>Bedankt voor het invullen van het formulier${formTitle ? ` "<strong>${escapeHtml(formTitle)}</strong>"` : ""}. We hebben je bericht goed ontvangen en nemen zo snel mogelijk contact met je op.</p>
          ${message ? `<p><strong>Jouw bericht:</strong></p><pre style="white-space:pre-wrap;font-family:inherit;background:#f6f6f6;padding:12px;border-radius:6px">${escapeHtml(message)}</pre>` : ""}
          <p>Met vriendelijke groet,<br/>Loyaltygroup</p>
        `;
        const confirmRfc = [
          `To: ${email}`,
          `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(confirmSubject)))}?=`,
          "MIME-Version: 1.0",
          'Content-Type: text/html; charset="UTF-8"',
          "",
          confirmHtml,
        ].join("\r\n");
        const confirmRes = await fetch(`${GATEWAY_URL}/users/me/messages/send`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": GOOGLE_MAIL_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: b64url(confirmRfc) }),
        });
        const confirmData = await confirmRes.json();
        if (confirmRes.ok) confirmationId = confirmData.id;
        else console.error("confirmation send failed", confirmRes.status, confirmData);
      } catch (err) {
        console.error("confirmation email error", err);
      }
    }

    return new Response(JSON.stringify({ ok: true, id: data.id, confirmationId }), {
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