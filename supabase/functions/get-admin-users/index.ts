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

    console.log('Fetching users for admin:', userId);

    // Fetch all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profiles' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch roles for all users
    const userIds = profiles?.map(p => p.user_id) || [];
    const { data: roles } = await supabase
      .from('user_roles')
      .select('*')
      .in('user_id', userIds);

    // Map profiles with roles
    const users = profiles?.map(p => ({
      id: p.id,
      user_id: p.user_id,
      email: p.full_name || 'Unknown',
      created_at: p.created_at,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      phone: p.phone,
      role: roles?.find(r => r.user_id === p.user_id)?.role || 'user'
    })) || [];

    return new Response(
      JSON.stringify({ success: true, data: users }),
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
