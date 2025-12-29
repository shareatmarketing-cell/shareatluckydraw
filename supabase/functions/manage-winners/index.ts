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

    console.log('Action:', action, 'Admin:', userId);

    switch (action) {
      case 'create': {
        const { user_id, prize_id, month, is_public } = body;
        if (!user_id || typeof user_id !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Invalid user_id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (!month || !/^\d{4}-\d{2}-\d{2}$/.test(month)) {
          return new Response(
            JSON.stringify({ error: 'Invalid month format' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const { data, error } = await supabase
          .from('winners')
          .insert({
            user_id,
            prize_id: prize_id || null,
            month,
            is_public: is_public ?? true,
          })
          .select()
          .single();

        if (error) {
          console.error('Create winner error:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        const { id, user_id, prize_id, month, is_public } = body;
        if (!id || typeof id !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Invalid winner id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const updateData: Record<string, unknown> = {};
        if (user_id !== undefined) updateData.user_id = user_id;
        if (prize_id !== undefined) updateData.prize_id = prize_id || null;
        if (month !== undefined) updateData.month = month;
        if (is_public !== undefined) updateData.is_public = Boolean(is_public);

        const { data, error } = await supabase
          .from('winners')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Update winner error:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { id } = body;
        if (!id || typeof id !== 'string') {
          return new Response(
            JSON.stringify({ error: 'Invalid winner id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const { error } = await supabase
          .from('winners')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Delete winner error:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
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
