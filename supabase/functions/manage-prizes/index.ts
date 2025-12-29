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

    // Verify user is admin
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: "Unauthorized - admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, ...data } = await req.json();

    console.log('Prize action:', action, 'by admin:', userId);

    if (action === "create") {
      if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0 || data.name.length > 200) {
        return new Response(JSON.stringify({ error: "Invalid prize name" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!data.month || !/^\d{4}-\d{2}-\d{2}$/.test(data.month)) {
        return new Response(JSON.stringify({ error: "Invalid month format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: prize, error } = await supabase
        .from("prizes")
        .insert({
          name: data.name.trim().substring(0, 200),
          description: data.description?.substring(0, 1000) || null,
          month: data.month,
          image_url: data.image_url?.substring(0, 500) || null,
          is_active: data.is_active ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ prize }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      if (!data.id || typeof data.id !== 'string') {
        return new Response(JSON.stringify({ error: "Invalid prize id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const updateData: Record<string, unknown> = {};
      if (data.name !== undefined) updateData.name = String(data.name).trim().substring(0, 200);
      if (data.description !== undefined) updateData.description = data.description?.substring(0, 1000) || null;
      if (data.month !== undefined) updateData.month = data.month;
      if (data.image_url !== undefined) updateData.image_url = data.image_url?.substring(0, 500) || null;
      if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active);

      const { data: prize, error } = await supabase
        .from("prizes")
        .update(updateData)
        .eq("id", data.id)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ prize }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      if (!data.id || typeof data.id !== 'string') {
        return new Response(JSON.stringify({ error: "Invalid prize id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("prizes").delete().eq("id", data.id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes('authorization') || message.includes('token') || message.includes('issuer') || message.includes('subject') ? 401 : 500;
    return new Response(JSON.stringify({ error: status === 401 ? 'Authentication failed' : message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
