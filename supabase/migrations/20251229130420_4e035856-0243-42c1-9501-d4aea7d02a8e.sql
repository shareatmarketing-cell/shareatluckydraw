-- Remove public read access from sensitive tables
-- Keep public read on prizes and winners (needed for public display pages)

-- Drop existing permissive policies on sensitive tables
DROP POLICY IF EXISTS "Anyone can read codes" ON public.codes;
DROP POLICY IF EXISTS "Anyone can read draw entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Anyone can read profiles" ON public.profiles;

-- For codes table: No public access needed - all operations go through edge functions
-- The submit-code edge function validates codes using service role

-- For draw_entries table: No public access needed - users get their entries through edge functions
-- The manage-draw edge function handles admin access

-- For profiles table: No public access needed - profile data accessed through edge functions
-- Winner display can get limited profile data through edge function

-- Note: winners and prizes remain public for display on public pages