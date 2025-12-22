// Supabase Edge Function: promote-admin
// Public endpoint (verify_jwt=false) but restricted to a hard-coded allowlist.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Body = {
  email?: string;
};

const ALLOWED_EMAILS = new Set([
  "vihaanmalani28@gmail.com",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email } = (await req.json().catch(() => ({}))) as Body;

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!ALLOWED_EMAILS.has(normalizedEmail)) {
      return new Response(JSON.stringify({ error: "Not allowed" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Find user by email (paginate if needed)
    let page = 1;
    const perPage = 200;
    let foundUser: any = null;

    while (page <= 10 && !foundUser) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      foundUser = data.users.find((u) => (u.email || "").toLowerCase() === normalizedEmail) || null;
      if (data.users.length < perPage) break;
      page += 1;
    }

    if (!foundUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = foundUser.id as string;

    // Ensure profile exists
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileFetchError) throw profileFetchError;

    const fullName =
      (foundUser.user_metadata?.full_name as string | undefined) ||
      (foundUser.user_metadata?.name as string | undefined) ||
      null;

    if (!existingProfile) {
      const { error: insertProfileError } = await supabase.from("profiles").insert({
        user_id: userId,
        full_name: fullName,
        avatar_url: null,
        phone: null,
      });
      if (insertProfileError) throw insertProfileError;
    }

    // Set role to admin (update if exists else insert)
    const { data: existingRole, error: roleFetchError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleFetchError) throw roleFetchError;

    if (existingRole) {
      const { error: updateRoleError } = await supabase
        .from("user_roles")
        .update({ role: "admin" })
        .eq("user_id", userId);
      if (updateRoleError) throw updateRoleError;
    } else {
      const { error: insertRoleError } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: "admin",
      });
      if (insertRoleError) throw insertRoleError;
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId, role: "admin" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("promote-admin error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
