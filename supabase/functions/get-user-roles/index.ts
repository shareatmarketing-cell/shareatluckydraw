// Supabase Edge Function: get-user-roles
// Verifies a Clerk JWT (passed from the client) and returns the roles for that Clerk user.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createRemoteJWKSet, jwtVerify } from "https://esm.sh/jose@5.9.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json().catch(() => ({ token: null }));

    if (!token || typeof token !== "string") {
      return new Response(JSON.stringify({ error: "Missing token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify Clerk JWT using the issuer's JWKS (public keys)
    const unverifiedParts = token.split(".");
    if (unverifiedParts.length !== 3) {
      return new Response(JSON.stringify({ error: "Invalid token format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Decode payload (without verification) only to read issuer for JWKS.
    const payloadJson = JSON.parse(
      atob(unverifiedParts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    const issuer = payloadJson?.iss;
    if (!issuer || typeof issuer !== "string") {
      return new Response(JSON.stringify({ error: "Token missing issuer" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jwksUrl = new URL("/.well-known/jwks.json", issuer);
    const JWKS = createRemoteJWKSet(jwksUrl);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer,
    });

    const clerkUserId = payload?.sub;
    if (!clerkUserId || typeof clerkUserId !== "string") {
      return new Response(JSON.stringify({ error: "Token missing subject" }), {
        status: 401,
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

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", clerkUserId);

    if (error) {
      console.error("[get-user-roles] DB error", error);
      return new Response(JSON.stringify({ error: "Failed to fetch roles" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const roles = (data ?? []).map((r) => r.role);

    return new Response(JSON.stringify({ userId: clerkUserId, roles }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[get-user-roles] Unexpected error", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
