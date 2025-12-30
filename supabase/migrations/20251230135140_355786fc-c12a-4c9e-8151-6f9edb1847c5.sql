-- Fix 1: Remove overly permissive storage policies (Clerk users can't use Supabase auth anyway)
-- Keep only public read access; all writes go through edge functions with service role

DROP POLICY IF EXISTS "Authenticated users can upload reward images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update reward images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete reward images" ON storage.objects;

-- Fix 2: Winners table should respect is_public flag for privacy
DROP POLICY IF EXISTS "Anyone can read winners" ON public.winners;

CREATE POLICY "Anyone can view public winners"
ON public.winners
FOR SELECT
USING (is_public = true);