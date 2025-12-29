import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyClerkJwt, extractToken } from "../_shared/verify-clerk-jwt.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify Clerk JWT with cryptographic signature validation
    const token = extractToken(req.headers.get('Authorization'));
    const { userId } = await verifyClerkJwt(token);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      console.error('Role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action } = body;

    console.log('Action:', action, 'User:', userId);

    switch (action) {
      case 'list': {
        // List all codes for admin
        const { data, error } = await supabase
          .from('codes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('List codes error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch codes' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        const { code } = body;
        if (!code || typeof code !== 'string' || code.trim().length === 0 || code.length > 50) {
          return new Response(
            JSON.stringify({ error: 'Invalid code format' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const { data, error } = await supabase
          .from('codes')
          .insert({ code: code.trim().toUpperCase() })
          .select()
          .single();

        if (error) {
          console.error('Create code error:', error);
          const message = error.message?.includes('unique') 
            ? 'This code already exists'
            : 'Failed to create code';
          return new Response(
            JSON.stringify({ error: message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'bulk_create': {
        const { codes } = body;
        if (!Array.isArray(codes) || codes.length === 0 || codes.length > 1000) {
          return new Response(
            JSON.stringify({ error: 'Invalid codes array' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        // Validate each code
        for (const code of codes) {
          if (typeof code !== 'string' || code.trim().length === 0 || code.length > 50) {
            return new Response(
              JSON.stringify({ error: 'Invalid code format in array' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
        const { data, error } = await supabase
          .from('codes')
          .insert(codes.map((code: string) => ({ code: code.trim().toUpperCase() })))
          .select();

        if (error) {
          console.error('Bulk create codes error:', error);
          const message = error.message?.includes('unique') 
            ? 'One or more codes already exist'
            : 'Failed to create codes';
          return new Response(
            JSON.stringify({ error: message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, count: data?.length || 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { id } = body;
        if (!id || typeof id !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Invalid id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const { error } = await supabase
          .from('codes')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Delete code error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to delete code' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true }),
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
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('authorization') || message.includes('token') || message.includes('issuer') || message.includes('subject') ? 401 : 500;
    return new Response(
      JSON.stringify({ error: status === 401 ? 'Authentication failed' : message }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
