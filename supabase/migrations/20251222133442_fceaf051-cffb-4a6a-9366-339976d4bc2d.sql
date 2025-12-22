-- Step 0: Drop foreign key constraints that prevent type change
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.draw_entries DROP CONSTRAINT IF EXISTS draw_entries_user_id_fkey;
ALTER TABLE public.winners DROP CONSTRAINT IF EXISTS winners_user_id_fkey;
ALTER TABLE public.codes DROP CONSTRAINT IF EXISTS codes_used_by_fkey;

-- Step 1: Drop all RLS policies that depend on has_role(uuid, app_role)
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage prizes" ON public.prizes;
DROP POLICY IF EXISTS "Admins can manage codes" ON public.codes;
DROP POLICY IF EXISTS "Admins can view all entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Admins can manage entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Admins can manage winners" ON public.winners;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can create their own entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.draw_entries;
DROP POLICY IF EXISTS "Anyone can view active prizes" ON public.prizes;
DROP POLICY IF EXISTS "Anyone can view public winners" ON public.winners;
DROP POLICY IF EXISTS "Users can view unused codes for validation" ON public.codes;

-- Step 2: Drop old function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- Step 3: Widen identifier columns to text (for Clerk string user IDs)
ALTER TABLE public.profiles
  ALTER COLUMN user_id TYPE text USING user_id::text;

ALTER TABLE public.user_roles
  ALTER COLUMN user_id TYPE text USING user_id::text;

ALTER TABLE public.draw_entries
  ALTER COLUMN user_id TYPE text USING user_id::text;

ALTER TABLE public.winners
  ALTER COLUMN user_id TYPE text USING user_id::text;

ALTER TABLE public.codes
  ALTER COLUMN used_by TYPE text USING used_by::text;

-- Step 4: Create new has_role function with text user_id
CREATE OR REPLACE FUNCTION public.has_role(_user_id text, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Recreate RLS policies with text comparison

-- profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid()::text, 'admin'::public.app_role));

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid()::text = user_id);

-- user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid()::text, 'admin'::public.app_role));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid()::text = user_id);

-- draw_entries
CREATE POLICY "Admins can manage entries"
ON public.draw_entries
FOR ALL
USING (public.has_role(auth.uid()::text, 'admin'::public.app_role));

CREATE POLICY "Admins can view all entries"
ON public.draw_entries
FOR SELECT
USING (public.has_role(auth.uid()::text, 'admin'::public.app_role));

CREATE POLICY "Users can create their own entries"
ON public.draw_entries
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own entries"
ON public.draw_entries
FOR SELECT
USING (auth.uid()::text = user_id);

-- codes
CREATE POLICY "Admins can manage codes"
ON public.codes
FOR ALL
USING (public.has_role(auth.uid()::text, 'admin'::public.app_role));

CREATE POLICY "Users can view unused codes for validation"
ON public.codes
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- prizes
CREATE POLICY "Admins can manage prizes"
ON public.prizes
FOR ALL
USING (public.has_role(auth.uid()::text, 'admin'::public.app_role));

CREATE POLICY "Anyone can view active prizes"
ON public.prizes
FOR SELECT
USING (is_active = true);

-- winners
CREATE POLICY "Admins can manage winners"
ON public.winners
FOR ALL
USING (public.has_role(auth.uid()::text, 'admin'::public.app_role));

CREATE POLICY "Anyone can view public winners"
ON public.winners
FOR SELECT
USING (is_public = true);