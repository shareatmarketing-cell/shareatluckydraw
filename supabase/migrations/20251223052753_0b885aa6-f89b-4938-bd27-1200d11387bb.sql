-- Drop existing restrictive policies that block reads
DROP POLICY IF EXISTS "Admins can manage codes" ON public.codes;
DROP POLICY IF EXISTS "Users can view unused codes for validation" ON public.codes;
DROP POLICY IF EXISTS "Admins can manage entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Admins can view all entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Users can create their own entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Admins can manage prizes" ON public.prizes;
DROP POLICY IF EXISTS "Anyone can view active prizes" ON public.prizes;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage winners" ON public.winners;
DROP POLICY IF EXISTS "Anyone can view public winners" ON public.winners;

-- CODES: Public read, writes via edge function
CREATE POLICY "Anyone can read codes"
ON public.codes
FOR SELECT
USING (true);

-- DRAW_ENTRIES: Public read, writes via edge function
CREATE POLICY "Anyone can read draw entries"
ON public.draw_entries
FOR SELECT
USING (true);

-- PRIZES: Public read, writes via edge function
CREATE POLICY "Anyone can read prizes"
ON public.prizes
FOR SELECT
USING (true);

-- PROFILES: Public read, writes via edge function
CREATE POLICY "Anyone can read profiles"
ON public.profiles
FOR SELECT
USING (true);

-- WINNERS: Public read, writes via edge function
CREATE POLICY "Anyone can read winners"
ON public.winners
FOR SELECT
USING (true);

-- Note: user_roles table keeps its existing restrictive policies
-- All writes are handled by edge functions with service role