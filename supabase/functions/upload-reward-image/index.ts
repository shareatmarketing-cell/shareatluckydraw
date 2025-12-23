import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract user ID from Clerk JWT
    const token = authHeader.replace("Bearer ", "");
    const parts = token.split(".");
    if (parts.length !== 3) {
      return new Response(JSON.stringify({ error: "Invalid token format" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = JSON.parse(atob(parts[1]));
    const userId = payload.sub;

    if (!userId) {
      return new Response(JSON.stringify({ error: "No user ID in token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
      console.log("Role check failed:", roleError, roleData);
      return new Response(JSON.stringify({ error: "Unauthorized - admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the file from the request
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file || !fileName) {
      return new Response(JSON.stringify({ error: "No file or fileName provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Uploading file:", fileName, "Size:", file.size);

    // Upload to storage
    const { data, error } = await supabase.storage
      .from("reward-images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("reward-images")
      .getPublicUrl(fileName);

    console.log("Upload successful, URL:", urlData.publicUrl);

    return new Response(JSON.stringify({ url: urlData.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
