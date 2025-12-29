import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyClerkJwt, extractToken } from "../_shared/verify-clerk-jwt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Clerk JWT with cryptographic signature validation
    const token = extractToken(req.headers.get("Authorization"));
    const { userId } = await verifyClerkJwt(token);

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action } = body;

    console.log("[get-user-data] Action:", action, "User:", userId);

    if (action === "get_profile") {
      // Get user's own profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("[get-user-data] Profile fetch error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_entries") {
      // Get user's own draw entries
      const { data, error } = await supabase
        .from("draw_entries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[get-user-data] Entries fetch error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch entries" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "has_entered_month") {
      const { month } = body;
      if (!month) {
        return new Response(
          JSON.stringify({ error: "Month required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("draw_entries")
        .select("id")
        .eq("user_id", userId)
        .eq("month", month)
        .maybeSingle();

      if (error) {
        console.error("[get-user-data] Entry check error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to check entry" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ hasEntered: !!data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[get-user-data] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("authorization") || message.includes("token") || message.includes("issuer") || message.includes("subject") ? 401 : 500;
    return new Response(
      JSON.stringify({ error: status === 401 ? "Authentication failed" : "An error occurred" }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
