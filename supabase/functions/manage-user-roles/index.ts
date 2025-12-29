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
    const { userId: adminUserId } = await verifyClerkJwt(token);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if requester is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', adminUserId)
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
    const { user_id, new_role } = body;

    // Validate inputs
    if (!user_id || typeof user_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid user_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validRoles = ['admin', 'moderator', 'user'];
    if (!new_role || !validRoles.includes(new_role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be: admin, moderator, or user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Updating role for user:', user_id, 'to:', new_role, 'by admin:', adminUserId);

    // Check if user already has a role entry
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user_id)
      .maybeSingle();

    if (existingRole) {
      // Update existing role
      const { error } = await supabase
        .from('user_roles')
        .update({ role: new_role })
        .eq('user_id', user_id);
      
      if (error) {
        console.error('Update role error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id, role: new_role });
      
      if (error) {
        console.error('Insert role error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
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
