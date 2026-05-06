import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    // Auth check using caller's JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData.user) {
      return new Response(JSON.stringify({ error: "Niet ingelogd" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: roleRows } = await userClient.from("user_roles").select("role").eq("user_id", userData.user.id);
    const isAdmin = roleRows?.some((r: any) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Geen toegang" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body.action || "list";

    if (action === "list") {
      const { data: roles } = await admin.from("user_roles").select("user_id").eq("role", "admin");
      const ids: string[] = (roles || []).map((r: any) => r.user_id);
      const result: { user_id: string; email: string | null }[] = [];
      for (const id of ids) {
        const { data } = await admin.auth.admin.getUserById(id);
        result.push({ user_id: id, email: data.user?.email ?? null });
      }
      return new Response(JSON.stringify({ admins: result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email) return new Response(JSON.stringify({ error: "E-mail vereist" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const redirectTo = String(body.redirectTo || "");
      // Find existing user by email
      let foundId: string | null = null;
      let page = 1;
      while (page <= 10 && !foundId) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error) break;
        const u = data.users.find((x: any) => (x.email || "").toLowerCase() === email);
        if (u) foundId = u.id;
        if (!data.users.length || data.users.length < 200) break;
        page++;
      }
      // If user does not exist yet, send an invitation email so they can set a password
      if (!foundId) {
        const { data: invited, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
          redirectTo: redirectTo || undefined,
        });
        if (invErr || !invited.user) {
          return new Response(JSON.stringify({ error: invErr?.message || "Uitnodiging versturen mislukt" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        foundId = invited.user.id;
      } else {
        // Existing user — also send a (re)invite/activation link so they have a clear path in
        await admin.auth.admin.inviteUserByEmail(email, { redirectTo: redirectTo || undefined }).catch(() => {});
      }
      const { error: insErr } = await admin.from("user_roles").upsert({ user_id: foundId, role: "admin" }, { onConflict: "user_id,role" });
      if (insErr) return new Response(JSON.stringify({ error: insErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ ok: true, invited: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "remove") {
      const userId = String(body.user_id || "");
      if (!userId) return new Response(JSON.stringify({ error: "user_id vereist" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (userId === userData.user.id) {
        return new Response(JSON.stringify({ error: "Je kunt jezelf niet verwijderen" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { error } = await admin.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Onbekende actie" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Server fout" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
