-- Eagle-J Connect: allow an authenticated user to read ONLY their own profile.
-- Run this in Supabase SQL Editor if login still says the profile is missing.
-- This does not expose other users' profiles and does not modify profile data.

GRANT SELECT ON TABLE public.profiles TO authenticated;

DROP POLICY IF EXISTS "profiles_select_own_for_login" ON public.profiles;
CREATE POLICY "profiles_select_own_for_login"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);
