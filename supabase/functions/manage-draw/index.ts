import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    console.log('Draw action:', action, 'Admin:', userId);

    switch (action) {
      case 'get_entries': {
        // Get current month entries
        const { month } = body;
        const targetMonth = month || new Date().toISOString().slice(0, 7) + '-01';
        
        console.log('Fetching entries for month:', targetMonth);

        // Get draw entries for the month
        const { data: entries, error: entriesError } = await supabase
          .from('draw_entries')
          .select('id, user_id, created_at, code_id')
          .eq('month', targetMonth);

        if (entriesError) {
          console.error('Error fetching entries:', entriesError);
          return new Response(
            JSON.stringify({ error: entriesError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!entries || entries.length === 0) {
          return new Response(
            JSON.stringify({ data: [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get user profiles and codes
        const userIds = [...new Set(entries.map(e => e.user_id))];
        const codeIds = [...new Set(entries.map(e => e.code_id))];

        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, phone')
          .in('user_id', userIds);

        const { data: codes } = await supabase
          .from('codes')
          .select('id, code')
          .in('id', codeIds);

        // Map data with user info
        const entriesWithDetails = entries.map(entry => {
          const profile = profiles?.find(p => p.user_id === entry.user_id);
          const code = codes?.find(c => c.id === entry.code_id);
          return {
            ...entry,
            full_name: profile?.full_name || 'Unknown',
            phone: profile?.phone || null,
            code: code?.code || 'Unknown',
          };
        });

        return new Response(
          JSON.stringify({ data: entriesWithDetails }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'pick_winners': {
        const { month, count } = body;
        const targetMonth = month || new Date().toISOString().slice(0, 7) + '-01';
        const winnerCount = Math.max(1, Math.min(count || 1, 100));

        console.log('Picking', winnerCount, 'winners for month:', targetMonth);

        // Get draw entries for the month
        const { data: entries, error: entriesError } = await supabase
          .from('draw_entries')
          .select('id, user_id')
          .eq('month', targetMonth);

        if (entriesError) {
          console.error('Error fetching entries:', entriesError);
          return new Response(
            JSON.stringify({ error: entriesError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!entries || entries.length === 0) {
          return new Response(
            JSON.stringify({ error: 'No entries found for this month' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get unique user_ids
        const uniqueUserIds = [...new Set(entries.map(e => e.user_id))];
        
        // Shuffle and pick winners
        const shuffled = uniqueUserIds.sort(() => Math.random() - 0.5);
        const selectedUserIds = shuffled.slice(0, Math.min(winnerCount, shuffled.length));

        // Get profiles for winners
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, phone')
          .in('user_id', selectedUserIds);

        const winners = selectedUserIds.map(userId => {
          const profile = profiles?.find(p => p.user_id === userId);
          return {
            user_id: userId,
            full_name: profile?.full_name || 'Unknown',
            phone: profile?.phone || null,
          };
        });

        return new Response(
          JSON.stringify({ data: winners }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset_entries': {
        const { month } = body;
        const targetMonth = month || new Date().toISOString().slice(0, 7) + '-01';

        console.log('Resetting entries for month:', targetMonth);

        // Delete all draw entries for the month
        const { error: deleteError, count } = await supabase
          .from('draw_entries')
          .delete()
          .eq('month', targetMonth);

        if (deleteError) {
          console.error('Error deleting entries:', deleteError);
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Also reset the codes that were used in this month's entries
        // First get the code IDs from draw entries (but they're deleted now, so we need to reset all used codes for this month)
        // We'll reset codes based on used_at date
        const monthStart = new Date(targetMonth);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);

        const { error: resetCodesError } = await supabase
          .from('codes')
          .update({ is_used: false, used_at: null, used_by: null })
          .gte('used_at', monthStart.toISOString())
          .lt('used_at', monthEnd.toISOString());

        if (resetCodesError) {
          console.error('Error resetting codes:', resetCodesError);
          // Don't fail the whole operation, just log
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Draw entries reset successfully' }),
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
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
