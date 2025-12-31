import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { verifyClerkJwt, extractToken } from "../_shared/verify-clerk-jwt.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 code submissions
const RATE_LIMIT_WINDOW_SECONDS = 60; // Per minute

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

    // Rate limiting check - prevent brute force attacks
    const { data: rateLimitPassed, error: rateLimitError } = await supabase.rpc(
      'check_rate_limit',
      {
        p_key: userId,
        p_endpoint: 'submit-code',
        p_max_requests: RATE_LIMIT_MAX_REQUESTS,
        p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      }
    );

    if (rateLimitError) {
      console.error('[submit-code] Rate limit check error:', rateLimitError);
      // Fail open for rate limiting errors but log for monitoring
    } else if (!rateLimitPassed) {
      console.log('[submit-code] Rate limit exceeded for user:', userId);
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== 'string' || code.trim().length === 0 || code.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Invalid code format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[submit-code] User:', userId, 'Code:', code);

    // Get current month as first day of month
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    // Check if user already entered this month
    const { data: existingEntry } = await supabase
      .from('draw_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('month', currentMonth)
      .maybeSingle();

    if (existingEntry) {
      console.log('[submit-code] User already entered this month');
      return new Response(
        JSON.stringify({ error: "You have already entered this month's draw" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the code
    const { data: codeData, error: codeError } = await supabase
      .from('codes')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .maybeSingle();

    if (codeError) {
      console.error('[submit-code] Code lookup error:', codeError);
      return new Response(
        JSON.stringify({ error: 'Error validating code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!codeData) {
      console.log('[submit-code] Invalid code');
      return new Response(
        JSON.stringify({ error: 'Invalid code. Please check and try again.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (codeData.is_used) {
      console.log('[submit-code] Code already used');
      return new Response(
        JSON.stringify({ error: 'This code has already been used.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark code as used
    const { error: updateError } = await supabase
      .from('codes')
      .update({
        is_used: true,
        used_by: userId,
        used_at: new Date().toISOString(),
      })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('[submit-code] Update code error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Error processing code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create draw entry
    const { data: entry, error: entryError } = await supabase
      .from('draw_entries')
      .insert({
        user_id: userId,
        code_id: codeData.id,
        month: currentMonth,
      })
      .select()
      .single();

    if (entryError) {
      console.error('[submit-code] Create entry error:', entryError);
      // Try to rollback the code update
      await supabase
        .from('codes')
        .update({ is_used: false, used_by: null, used_at: null })
        .eq('id', codeData.id);

      return new Response(
        JSON.stringify({ error: 'Error creating draw entry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[submit-code] Successfully created entry:', entry.id);
    return new Response(
      JSON.stringify({ success: true, data: entry }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('[submit-code] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('authorization') || message.includes('token') || message.includes('issuer') || message.includes('subject') ? 401 : 500;
    return new Response(
      JSON.stringify({ error: status === 401 ? 'Authentication failed' : message }),
      { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
