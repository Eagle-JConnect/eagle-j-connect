-- Eagle-J Connect: permanently delete a user from Auth + profile
-- Run this ONCE in Supabase SQL Editor before testing the Retire button.

CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only an existing admin can perform this action.
  IF NOT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;

  -- Never allow an admin to delete their own account.
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own administrator account';
  END IF;

  -- Remove the public profile first.
  DELETE FROM public.profiles
  WHERE id = target_user_id;

  -- Remove the actual Supabase Auth account.
  DELETE FROM auth.users
  WHERE id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;
