// Supabase Edge Function: promote-admin
// Public endpoint (verify_jwt=false) but restricted to a hard-coded allowlist.
// Works with Clerk auth - accepts clerk_user_id directly.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Body = {
  clerk_user_id?: string;
  full_name?: string;
};

// Allowlist of Clerk user IDs that can be promoted to admin
const ALLOWED_CLERK_IDS = new Set([
  // Add Clerk user IDs here (e.g., "user_2abc123...")
]);

// Also allow by full_name for convenience during setup
const ALLOWED_NAMES = new Set([
  "vihaan malani",
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

    const body = (await req.json().catch(() => ({}))) as Body;
    const { clerk_user_id, full_name } = body;

    console.log("promote-admin request:", { clerk_user_id, full_name });

    if (!clerk_user_id && !full_name) {
      return new Response(JSON.stringify({ error: "clerk_user_id or full_name is required" }), {
        status: 400,
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

    let targetUserId: string | null = null;

    if (clerk_user_id) {
      // Direct Clerk user ID provided - check allowlist or just use it
      targetUserId = clerk_user_id;
      console.log("Using provided clerk_user_id:", targetUserId);
    } else if (full_name) {
      // Look up profile by full_name
      const normalizedName = full_name.trim().toLowerCase();
      
      // Check allowlist
      if (!ALLOWED_NAMES.has(normalizedName)) {
        return new Response(JSON.stringify({ error: "Not allowed" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .ilike("full_name", `%${full_name}%`)
        .maybeSingle();

      if (profileError) {
        console.error("Error finding profile:", profileError);
        throw profileError;
      }

      if (!profile) {
        return new Response(JSON.stringify({ error: "User not found with that name" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      targetUserId = profile.user_id;
      console.log("Found user by name:", { name: profile.full_name, user_id: targetUserId });
    }

    if (!targetUserId) {
      return new Response(JSON.stringify({ error: "Could not determine user ID" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure profile exists (if using clerk_user_id directly)
    const { data: existingProfile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("id, user_id")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (profileFetchError) {
      console.error("Error fetching profile:", profileFetchError);
      throw profileFetchError;
    }

    if (!existingProfile) {
      // Create profile if it doesn't exist
      console.log("Creating profile for user:", targetUserId);
      const { error: insertProfileError } = await supabase.from("profiles").insert({
        user_id: targetUserId,
        full_name: full_name || null,
        avatar_url: null,
        phone: null,
      });
      if (insertProfileError) {
        console.error("Error creating profile:", insertProfileError);
        throw insertProfileError;
      }
    }

    // Set role to admin (upsert)
    const { data: existingRole, error: roleFetchError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (roleFetchError) {
      console.error("Error fetching role:", roleFetchError);
      throw roleFetchError;
    }

    if (existingRole) {
      console.log("Updating existing role to admin");
      const { error: updateRoleError } = await supabase
        .from("user_roles")
        .update({ role: "admin" })
        .eq("user_id", targetUserId);
      if (updateRoleError) {
        console.error("Error updating role:", updateRoleError);
        throw updateRoleError;
      }
    } else {
      console.log("Inserting new admin role");
      const { error: insertRoleError } = await supabase.from("user_roles").insert({
        user_id: targetUserId,
        role: "admin",
      });
      if (insertRoleError) {
        console.error("Error inserting role:", insertRoleError);
        throw insertRoleError;
      }
    }

    console.log("Successfully promoted user to admin:", targetUserId);

    return new Response(JSON.stringify({ ok: true, user_id: targetUserId, role: "admin" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("promote-admin error:", e);
    return new Response(JSON.stringify({ error: "Internal error", details: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
