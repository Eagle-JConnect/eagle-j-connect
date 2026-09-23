-- Eagle-J Connect V8 — Google OAuth profile support
-- Run once in Supabase SQL Editor.
--
-- Google users authenticate through Supabase Auth. This policy lets a signed-in
-- user create the matching public profile row for their own auth.users UUID.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Optional but useful for OAuth users updating their own profile later.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());
