-- Eagle-J Connect: add email to profiles and sync existing accounts.
-- Run once in Supabase SQL Editor.

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email text;

-- Backfill email and the full name saved by Supabase Auth metadata.
UPDATE public.profiles p
SET
  email = u.email,
  full_name = COALESCE(NULLIF(u.raw_user_meta_data->>'full_name', ''), p.full_name)
FROM auth.users u
WHERE p.id = u.id;

-- Keep future profile records synchronized when a user signs up or updates metadata.
CREATE OR REPLACE FUNCTION public.sync_profile_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'job_seeker')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE
      WHEN EXCLUDED.full_name <> '' THEN EXCLUDED.full_name
      ELSE public.profiles.full_name
    END,
    phone = CASE
      WHEN EXCLUDED.phone <> '' THEN EXCLUDED.phone
      ELSE public.profiles.phone
    END,
    account_type = CASE
      WHEN EXCLUDED.account_type <> '' THEN EXCLUDED.account_type
      ELSE public.profiles.account_type
    END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_profile_sync ON auth.users;
CREATE TRIGGER on_auth_user_profile_sync
AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_profile_from_auth();
