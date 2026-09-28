-- EAGLE-J CONNECT — FINAL MEMBER POSTING + MODERATION RLS
-- Run this AFTER any older jobs/business RLS scripts.
-- Rule:
--   * Any ACTIVE authenticated member may submit jobs and business/listing ads.
--   * New submissions are forced to status='pending'.
--   * Only admins can approve/reject/mark unavailable.
--   * Public users see only approved content from active accounts.
--   * Members can manage only their own pending ads.
--   * Members cannot make themselves admins.

BEGIN;

-- ---------------------------------------------------------
-- 1. Required columns
-- ---------------------------------------------------------
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'active';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

UPDATE public.jobs SET status='approved' WHERE status IS NULL;
UPDATE public.businesses SET status='approved' WHERE status IS NULL;
UPDATE public.profiles SET account_status='active' WHERE account_status IS NULL;

CREATE INDEX IF NOT EXISTS jobs_status_idx ON public.jobs(status);
CREATE INDEX IF NOT EXISTS businesses_status_idx ON public.businesses(status);
CREATE INDEX IF NOT EXISTS businesses_user_id_idx ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS profiles_account_status_idx ON public.profiles(account_status);

-- ---------------------------------------------------------
-- 2. Admin helper
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 3. Admin users
-- ---------------------------------------------------------
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users_select_self_or_admin" ON public.admin_users;
DROP POLICY IF EXISTS "Users can verify their own admin status" ON public.admin_users;

CREATE POLICY "admin_users_select_self_or_admin"
ON public.admin_users
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

-- No INSERT/UPDATE/DELETE policy for normal browser users.

-- ---------------------------------------------------------
-- 4. JOBS
-- ---------------------------------------------------------
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_public_read" ON public.jobs;
DROP POLICY IF EXISTS "jobs_employer_insert" ON public.jobs;
DROP POLICY IF EXISTS "jobs_employer_update" ON public.jobs;
DROP POLICY IF EXISTS "jobs_employer_delete" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_select_all" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_update_all" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_delete_all" ON public.jobs;

CREATE POLICY "jobs_public_read"
ON public.jobs
FOR SELECT TO anon, authenticated
USING (
  status = 'approved'
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = jobs.employer_id
      AND COALESCE(p.account_status,'active') = 'active'
  )
);

-- ALL authenticated members may submit a job, not only admins.
-- The row MUST belong to the current user and MUST start pending.
CREATE POLICY "jobs_member_insert"
ON public.jobs
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = employer_id
  AND status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND COALESCE(p.account_status,'active') = 'active'
  )
);

-- Owners may edit only their own pending jobs.
CREATE POLICY "jobs_member_update_pending"
ON public.jobs
FOR UPDATE TO authenticated
USING (
  auth.uid() = employer_id
  AND status = 'pending'
)
WITH CHECK (
  auth.uid() = employer_id
  AND status = 'pending'
);

CREATE POLICY "jobs_member_delete"
ON public.jobs
FOR DELETE TO authenticated
USING (auth.uid() = employer_id);

-- Admin moderation controls.
CREATE POLICY "jobs_admin_select_all"
ON public.jobs
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "jobs_admin_update_all"
ON public.jobs
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "jobs_admin_delete_all"
ON public.jobs
FOR DELETE TO authenticated
USING (public.is_admin());

-- ---------------------------------------------------------
-- 5. BUSINESS / LISTING ADS
-- ---------------------------------------------------------
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "businesses_public_read" ON public.businesses;
DROP POLICY IF EXISTS "businesses_owner_insert" ON public.businesses;
DROP POLICY IF EXISTS "businesses_member_insert" ON public.businesses;
DROP POLICY IF EXISTS "businesses_owner_update" ON public.businesses;
DROP POLICY IF EXISTS "businesses_member_update_pending" ON public.businesses;
DROP POLICY IF EXISTS "businesses_owner_delete" ON public.businesses;
DROP POLICY IF EXISTS "businesses_member_delete" ON public.businesses;
DROP POLICY IF EXISTS "businesses_admin_select_all" ON public.businesses;
DROP POLICY IF EXISTS "businesses_admin_update_all" ON public.businesses;
DROP POLICY IF EXISTS "businesses_admin_delete_all" ON public.businesses;

CREATE POLICY "businesses_public_read"
ON public.businesses
FOR SELECT TO anon, authenticated
USING (
  status = 'approved'
  AND (
    user_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = businesses.user_id
        AND COALESCE(p.account_status,'active') = 'active'
    )
  )
);

-- ALL active authenticated members may submit a listing.
CREATE POLICY "businesses_member_insert"
ON public.businesses
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid()
      AND COALESCE(p.account_status,'active') = 'active'
  )
);

-- Owner can edit only a pending ad. It stays pending.
CREATE POLICY "businesses_member_update_pending"
ON public.businesses
FOR UPDATE TO authenticated
USING (
  auth.uid() = user_id
  AND status = 'pending'
)
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
);

CREATE POLICY "businesses_member_delete"
ON public.businesses
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Admin moderation controls.
CREATE POLICY "businesses_admin_select_all"
ON public.businesses
FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "businesses_admin_update_all"
ON public.businesses
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "businesses_admin_delete_all"
ON public.businesses
FOR DELETE TO authenticated
USING (public.is_admin());

-- ---------------------------------------------------------
-- 6. PROFILES
-- ---------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "admins_update_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admins_delete_profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_active_read" ON public.profiles;

CREATE POLICY "admins_can_view_all_profiles"
ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "profiles_public_active_read"
ON public.profiles
FOR SELECT TO anon, authenticated
USING (COALESCE(account_status,'active') = 'active');

CREATE POLICY "admins_update_all_profiles"
ON public.profiles
FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "admins_delete_profiles"
ON public.profiles
FOR DELETE TO authenticated
USING (public.is_admin());

-- ---------------------------------------------------------
-- 7. STORAGE
-- ---------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images','business-images',true)
ON CONFLICT (id) DO UPDATE SET public=true;

DROP POLICY IF EXISTS "business_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "business_images_owner_insert" ON storage.objects;
DROP POLICY IF EXISTS "business_images_owner_update" ON storage.objects;
DROP POLICY IF EXISTS "business_images_owner_delete" ON storage.objects;

CREATE POLICY "business_images_public_read"
ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id='business-images');

CREATE POLICY "business_images_owner_insert"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id='business-images'
  AND owner_id=auth.uid()
);

CREATE POLICY "business_images_owner_update"
ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id='business-images' AND owner_id=auth.uid())
WITH CHECK (bucket_id='business-images' AND owner_id=auth.uid());

CREATE POLICY "business_images_owner_delete"
ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id='business-images' AND owner_id=auth.uid());

COMMIT;

-- IMPORTANT:
-- Keep this migration AFTER older *_rls_fix.sql files.
-- Existing rows remain approved.
-- New member posts are pending until an admin approves them.
