import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyClerkJwt, extractToken } from "../_shared/verify-clerk-jwt.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Clerk JWT with cryptographic signature validation
    const token = extractToken(req.headers.get('Authorization'));
    const { userId } = await verifyClerkJwt(token);

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, full_name, phone, avatar_url } = body;

    console.log('[manage-profiles] Action:', action, 'User:', userId);

    switch (action) {
      case 'fetch_or_create': {
        // First try to find existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (fetchError) {
          console.error('[manage-profiles] Fetch error:', fetchError);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (existingProfile) {
          console.log('[manage-profiles] Found existing profile');
          return new Response(
            JSON.stringify({ success: true, data: existingProfile }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Validate full_name if provided
        const sanitizedName = full_name ? String(full_name).trim().substring(0, 200) : null;

        // Create new profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: userId,
            full_name: sanitizedName,
            avatar_url: avatar_url?.substring(0, 500) || null,
          })
          .select()
          .single();

        if (insertError) {
          console.error('[manage-profiles] Insert error:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to create profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Also create default user role
        await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'user' })
          .select();

        console.log('[manage-profiles] Created new profile and role');
        return new Response(
          JSON.stringify({ success: true, data: newProfile, created: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const updates: Record<string, unknown> = {};
        
        if (full_name !== undefined) {
          updates.full_name = full_name ? String(full_name).trim().substring(0, 200) : null;
        }
        if (phone !== undefined) {
          // Basic phone validation - only allow digits, spaces, +, -, ()
          const sanitizedPhone = phone ? String(phone).trim().substring(0, 20) : null;
          if (sanitizedPhone && !/^[\d\s\+\-\(\)]+$/.test(sanitizedPhone)) {
            return new Response(
              JSON.stringify({ error: 'Invalid phone format' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          updates.phone = sanitizedPhone;
        }
        if (avatar_url !== undefined) {
          // Validate URL format if provided
          const sanitizedUrl = avatar_url ? String(avatar_url).trim().substring(0, 500) : null;
          if (sanitizedUrl) {
            try {
              new URL(sanitizedUrl);
            } catch {
              return new Response(
                JSON.stringify({ error: 'Invalid avatar URL' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }
          updates.avatar_url = sanitizedUrl;
        }
        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) {
          console.error('[manage-profiles] Update error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to update profile' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('[manage-profiles] Profile updated');
        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error: unknown) {
    console.error('[manage-profiles] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('authorization') || message.includes('token') || message.includes('issuer') || message.includes('subject') ? 401 : 500;
    return new Response(
      JSON.stringify({ error: status === 401 ? 'Authentication failed' : message }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
