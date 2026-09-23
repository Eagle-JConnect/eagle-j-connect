-- Eagle-J Connect: definitive Admin RLS fix
-- Run this once in Supabase SQL Editor.

-- Make sure RLS is enabled.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security-definer helper avoids recursive RLS checks when an admin reads profiles.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Replace the earlier admin profile SELECT policy with the robust version.
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_profiles_select" ON public.profiles;

CREATE POLICY "admins_can_view_all_profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR public.is_admin()
);

-- Ensure the admin can also verify the admin_users row for their own account.
DROP POLICY IF EXISTS "Users can verify their own admin status" ON public.admin_users;
DROP POLICY IF EXISTS "admin_users_select_self_or_admin" ON public.admin_users;

CREATE POLICY "Users can verify their own admin status"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- Email field for the Admin Dashboard.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;

-- Backfill email and full name from Auth for existing users.
UPDATE public.profiles p
SET
  email = u.email,
  full_name = COALESCE(NULLIF(u.raw_user_meta_data->>'full_name', ''), p.full_name)
FROM auth.users u
WHERE p.id = u.id;

-- Do not hard-code an administrator UUID in this migration.
-- Add your own Auth user UUID manually after reviewing the account:
-- INSERT INTO public.admin_users (user_id) VALUES ('YOUR-USER-UUID-HERE') ON CONFLICT (user_id) DO NOTHING;
