-- =====================================================================
-- EAGLE-J CONNECT — CANONICAL SUPABASE BASE MIGRATION
-- Run this ONE file in Supabase SQL Editor for the existing Eagle-J project.
-- It preserves existing jobs/businesses and existing approved content.
-- It replaces conflicting RLS policies on the app's core tables with one
-- consistent policy set, fixes admin_users recursion, and creates profiles
-- automatically for future Auth signups.
-- =====================================================================

BEGIN;

-- 1. Ensure the core tables/columns expected by the current frontend exist.
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS profile_image_url text,
  ADD COLUMN IF NOT EXISTS profile_visibility text NOT NULL DEFAULT 'public';

ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS image_urls text;

CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs(status);
CREATE INDEX IF NOT EXISTS jobs_employer_id_idx ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS businesses_status_idx ON public.businesses(status);
CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS profiles_account_status_idx ON public.profiles(account_status);

-- Preserve existing content; make null statuses safe and normalize legacy role labels.
UPDATE public.jobs SET status = 'approved' WHERE status IS NULL OR btrim(status) = '';
UPDATE public.businesses SET status = 'approved' WHERE status IS NULL OR btrim(status) = '';
UPDATE public.profiles SET account_status = 'active' WHERE account_status IS NULL OR btrim(account_status) = '';
UPDATE public.profiles SET profile_visibility = 'public' WHERE profile_visibility IS NULL OR btrim(profile_visibility) = '';
UPDATE public.profiles SET account_type = 'employer' WHERE lower(btrim(account_type)) = 'employer';
UPDATE public.profiles SET account_type = 'job_seeker'
WHERE lower(replace(replace(btrim(account_type), ' ', '_'), '-', '_')) IN ('job_seeker','jobseeker');
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR btrim(p.email) = '');

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_profile_visibility_check;
UPDATE public.profiles SET profile_visibility = 'public'
WHERE profile_visibility NOT IN ('public','private');
ALTER TABLE public.profiles ADD CONSTRAINT profiles_profile_visibility_check
  CHECK (profile_visibility IN ('public','private'));

-- 2. Security-definer helpers. They avoid recursive RLS checks on admin_users.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users a WHERE a.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_active_member(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = target_user_id
      AND COALESCE(p.account_status, 'active') = 'active'
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_member(uuid) TO anon, authenticated;

-- 3. Create a profile automatically when a new Supabase Auth user is created.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  chosen_name text;
  chosen_type text;
BEGIN
  chosen_name := COALESCE(
    NULLIF(btrim(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'name'), ''),
    NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
    'Eagle-J Member'
  );

  chosen_type := lower(replace(replace(
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'job_seeker'),
    ' ', '_'), '-', '_'));
  IF chosen_type <> 'employer' THEN
    chosen_type := 'job_seeker';
  END IF;

  INSERT INTO public.profiles
    (id, full_name, email, phone, account_type, account_status, profile_visibility, created_at)
  VALUES
    (NEW.id, chosen_name, NEW.email,
     COALESCE(NULLIF(btrim(COALESCE(NEW.raw_user_meta_data->>'phone', '')), ''), ''),
     chosen_type, 'active', 'public', now())
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE
          WHEN public.profiles.full_name IS NULL OR btrim(public.profiles.full_name) = ''
          THEN EXCLUDED.full_name ELSE public.profiles.full_name END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_eagle_j ON auth.users;
CREATE TRIGGER on_auth_user_created_eagle_j
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC;

-- Backfill profiles for Auth users that already exist but have no public profile.
INSERT INTO public.profiles
  (id, full_name, email, phone, account_type, account_status, profile_visibility, created_at)
SELECT
  u.id,
  COALESCE(NULLIF(btrim(u.raw_user_meta_data->>'full_name'), ''),
           NULLIF(btrim(u.raw_user_meta_data->>'name'), ''),
           NULLIF(split_part(COALESCE(u.email, ''), '@', 1), ''),
           'Eagle-J Member'),
  u.email,
  COALESCE(NULLIF(btrim(COALESCE(u.raw_user_meta_data->>'phone', '')), ''), ''),
  CASE WHEN lower(COALESCE(u.raw_user_meta_data->>'account_type','')) = 'employer'
       THEN 'employer' ELSE 'job_seeker' END,
  'active', 'public', COALESCE(u.created_at, now())
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Prevent non-admin users from promoting themselves, changing account status,
-- or changing the email stored on their profile. They can edit normal profile fields.
CREATE OR REPLACE FUNCTION public.guard_profile_security_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
DECLARE
  auth_email text;
BEGIN
  IF auth.uid() IS NULL OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF lower(replace(replace(COALESCE(NEW.account_type, 'job_seeker'), ' ', '_'), '-', '_')) = 'employer' THEN
      NEW.account_type := 'employer';
    ELSE
      NEW.account_type := 'job_seeker';
    END IF;
    NEW.account_status := 'active';
    SELECT u.email INTO auth_email FROM auth.users u WHERE u.id = auth.uid();
    NEW.email := auth_email;
    RETURN NEW;
  END IF;

  NEW.account_type := OLD.account_type;
  NEW.account_status := OLD.account_status;
  NEW.email := OLD.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_profile_security_fields_eagle_j ON public.profiles;
CREATE TRIGGER guard_profile_security_fields_eagle_j
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.guard_profile_security_fields();
REVOKE ALL ON FUNCTION public.guard_profile_security_fields() FROM PUBLIC;

-- 4. Force new jobs/business listings to be owned by the signed-in user and pending.
CREATE OR REPLACE FUNCTION public.set_job_owner_and_pending()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  NEW.employer_id := auth.uid();
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_job_owner_and_pending ON public.jobs;
CREATE TRIGGER trg_set_job_owner_and_pending
BEFORE INSERT ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.set_job_owner_and_pending();
REVOKE ALL ON FUNCTION public.set_job_owner_and_pending() FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.set_business_owner_and_pending()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  NEW.user_id := auth.uid();
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_business_owner_and_pending ON public.businesses;
CREATE TRIGGER trg_set_business_owner_and_pending
BEFORE INSERT ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.set_business_owner_and_pending();
REVOKE ALL ON FUNCTION public.set_business_owner_and_pending() FROM PUBLIC;

-- 5. Remove all old core-table policies. The policies below are the single source of truth.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY (ARRAY['admin_users','profiles','jobs','businesses','applications','business_images'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_images ENABLE ROW LEVEL SECURITY;

-- Admin list: a user can see only their own admin row. No policy calls is_admin()
-- on this table, so there is no infinite recursion.
CREATE POLICY ej_admin_users_select_self
ON public.admin_users FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Profiles: private by default at the table level; public directory uses a safe view below.
CREATE POLICY ej_profiles_select_own_or_admin
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY ej_profiles_insert_own
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY ej_profiles_update_own_or_admin
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY ej_profiles_delete_admin
ON public.profiles FOR DELETE TO authenticated
USING (public.is_admin());

-- Jobs: public sees approved jobs from active profiles; owners see all their own jobs.
CREATE POLICY ej_jobs_public_select
ON public.jobs FOR SELECT TO anon, authenticated
USING (status = 'approved' AND public.is_active_member(employer_id));

CREATE POLICY ej_jobs_owner_select
ON public.jobs FOR SELECT TO authenticated
USING (auth.uid() = employer_id);

CREATE POLICY ej_jobs_admin_select
ON public.jobs FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY ej_jobs_owner_insert
ON public.jobs FOR INSERT TO authenticated
WITH CHECK (auth.uid() = employer_id AND status = 'pending');

CREATE POLICY ej_jobs_owner_update
ON public.jobs FOR UPDATE TO authenticated
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id AND status = 'pending');

CREATE POLICY ej_jobs_owner_delete
ON public.jobs FOR DELETE TO authenticated
USING (auth.uid() = employer_id);

CREATE POLICY ej_jobs_admin_update
ON public.jobs FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY ej_jobs_admin_delete
ON public.jobs FOR DELETE TO authenticated
USING (public.is_admin());

-- Businesses/listings: same moderation flow as jobs. Old approved content remains visible.
CREATE POLICY ej_businesses_public_select
ON public.businesses FOR SELECT TO anon, authenticated
USING (
  status = 'approved'
  AND (user_id IS NULL OR public.is_active_member(user_id))
);

CREATE POLICY ej_businesses_owner_select
ON public.businesses FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY ej_businesses_admin_select
ON public.businesses FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY ej_businesses_owner_insert
ON public.businesses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY ej_businesses_owner_update
ON public.businesses FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY ej_businesses_owner_delete
ON public.businesses FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY ej_businesses_admin_update
ON public.businesses FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY ej_businesses_admin_delete
ON public.businesses FOR DELETE TO authenticated
USING (public.is_admin());

-- Applications: only applicants, the employer for the related job, or admins may read.
CREATE POLICY ej_applications_select_related
ON public.applications FOR SELECT TO authenticated
USING (
  applicant_id = auth.uid()
  OR public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE j.id = applications.job_id AND j.employer_id = auth.uid()
  )
);

CREATE POLICY ej_applications_insert_own
ON public.applications FOR INSERT TO authenticated
WITH CHECK (applicant_id = auth.uid());

-- Legacy business_images rows are public to read, but writes must be tied to an owned listing.
CREATE POLICY ej_business_images_public_select
ON public.business_images FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY ej_business_images_owner_insert
ON public.business_images FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_images.business_id AND b.user_id = auth.uid()
  )
);

CREATE POLICY ej_business_images_owner_delete
ON public.business_images FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_images.business_id AND b.user_id = auth.uid()
  ) OR public.is_admin()
);

-- 6. Restrict direct table access and grant only what the frontend needs.
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT ON public.businesses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT SELECT, INSERT ON public.applications TO authenticated;
GRANT SELECT ON public.business_images TO anon, authenticated;
GRANT INSERT, DELETE ON public.business_images TO authenticated;

-- Public, privacy-limited member directory: no email, phone, or private profiles exposed.
CREATE OR REPLACE VIEW public.public_member_profiles
WITH (security_invoker = false)
AS
SELECT id, full_name, account_type, profile_image_url, created_at
FROM public.profiles
WHERE COALESCE(account_status, 'active') = 'active'
  AND COALESCE(profile_visibility, 'public') = 'public';

GRANT SELECT ON public.public_member_profiles TO anon, authenticated;

-- 7. Storage bucket and policies. Existing listing images are preserved.
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove old Eagle-J policies for this bucket only; leave unrelated buckets untouched.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND (
        lower(policyname) LIKE '%business%image%'
        OR lower(policyname) LIKE '%profile%avatar%'
        OR lower(COALESCE(qual,'')) LIKE '%business-images%'
        OR lower(COALESCE(with_check,'')) LIKE '%business-images%'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

CREATE POLICY ej_business_images_storage_public_read
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'business-images');

CREATE POLICY ej_business_images_storage_owner_insert
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'business-images' AND owner_id::text = auth.uid()::text);

CREATE POLICY ej_business_images_storage_owner_update
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'business-images' AND owner_id::text = auth.uid()::text)
WITH CHECK (bucket_id = 'business-images' AND owner_id::text = auth.uid()::text);

CREATE POLICY ej_business_images_storage_owner_delete
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'business-images' AND owner_id::text = auth.uid()::text);

-- 8. Social media tables used by the optional Social Media Manager.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.social_oauth_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('facebook','instagram','tiktok','youtube')),
  state_token text NOT NULL UNIQUE,
  redirect_url text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('facebook','instagram','tiktok','youtube','whatsapp')),
  account_name text,
  platform_account_id text,
  status text NOT NULL DEFAULT 'connected' CHECK (status IN ('connected','disconnected','error')),
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform, platform_account_id)
);

CREATE TABLE IF NOT EXISTS public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption text NOT NULL DEFAULT '',
  media_url text,
  media_type text NOT NULL DEFAULT 'image',
  platforms text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','published','partial','failed')),
  results jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE public.social_oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS social_states_select_own ON public.social_oauth_states;
DROP POLICY IF EXISTS social_states_insert_own ON public.social_oauth_states;
DROP POLICY IF EXISTS social_states_delete_own ON public.social_oauth_states;
CREATE POLICY social_states_select_own ON public.social_oauth_states FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY social_states_insert_own ON public.social_oauth_states FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY social_states_delete_own ON public.social_oauth_states FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS social_connections_select_own ON public.social_connections;
DROP POLICY IF EXISTS social_connections_delete_own ON public.social_connections;
CREATE POLICY social_connections_select_own ON public.social_connections FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY social_connections_delete_own ON public.social_connections FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS social_posts_select_own ON public.social_posts;
DROP POLICY IF EXISTS social_posts_insert_own ON public.social_posts;
DROP POLICY IF EXISTS social_posts_update_own ON public.social_posts;
DROP POLICY IF EXISTS social_posts_delete_own ON public.social_posts;
CREATE POLICY social_posts_select_own ON public.social_posts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY social_posts_insert_own ON public.social_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY social_posts_update_own ON public.social_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY social_posts_delete_own ON public.social_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT SELECT, INSERT, DELETE ON public.social_oauth_states TO authenticated;
GRANT SELECT, DELETE ON public.social_connections TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_posts TO authenticated;

-- 9. Safe admin account deletion function; UI calls this RPC, not direct profile DELETE.
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own administrator account';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  DELETE FROM public.applications
  WHERE applicant_id = target_user_id
     OR job_id IN (SELECT id FROM public.jobs WHERE employer_id = target_user_id);
  DELETE FROM public.jobs WHERE employer_id = target_user_id;
  DELETE FROM public.businesses WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_user(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;

-- Judes Versanne's previously verified Auth UUID. This grants admin access to that account.
-- If this SQL is reused for another project, change this UUID before running.
INSERT INTO public.admin_users(user_id)
VALUES ('9b134154-a1b6-4d1a-a91a-dcd8f139d7ff')
ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- Verification summary after successful execution:
SELECT 'profiles' AS item, count(*) AS rows FROM public.profiles
UNION ALL SELECT 'approved_jobs', count(*) FROM public.jobs WHERE status = 'approved'
UNION ALL SELECT 'approved_businesses', count(*) FROM public.businesses WHERE status = 'approved'
UNION ALL SELECT 'admin_users', count(*) FROM public.admin_users;
