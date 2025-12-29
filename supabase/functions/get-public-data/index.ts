import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function serves public data that doesn't require authentication
// Only returns data that should be publicly visible (winners with display name, prizes)
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action } = body;

    console.log("[get-public-data] Action:", action);

    if (action === "get_public_winners") {
      const limit = Math.min(body.limit || 10, 50); // Cap at 50

      // Get public winners
      const { data: winnersData, error: winnersError } = await supabase
        .from("winners")
        .select("id, user_id, prize_id, month, is_public, created_at")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (winnersError) {
        console.error("[get-public-data] Winners fetch error:", winnersError);
        return new Response(
          JSON.stringify({ error: "Failed to fetch winners" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!winnersData || winnersData.length === 0) {
        return new Response(JSON.stringify({ data: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get user_ids and prize_ids for lookups
      const userIds = winnersData.map((w) => w.user_id);
      const prizeIds = winnersData.filter((w) => w.prize_id).map((w) => w.prize_id);

      // Fetch profiles - only return full_name for public display
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      // Fetch prizes
      const { data: prizes } = prizeIds.length > 0
        ? await supabase.from("prizes").select("id, name").in("id", prizeIds)
        : { data: [] };

      // Build response with limited profile data
      const winners = winnersData.map((winner) => {
        const profile = profiles?.find((p) => p.user_id === winner.user_id);
        const prize = prizes?.find((p) => p.id === winner.prize_id);
        return {
          id: winner.id,
          month: winner.month,
          is_public: winner.is_public,
          created_at: winner.created_at,
          // Only expose full_name, never phone or other PII
          full_name: profile?.full_name || "Lucky Winner",
          prize_name: prize?.name || "Prize",
        };
      });

      return new Response(JSON.stringify({ data: winners }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[get-public-data] Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
