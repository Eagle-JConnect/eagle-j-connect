-- SUPERSEDED: Use SUPABASE-BASE-FINAL.sql (project root) as the only core migration. Do not run this old migration after it.

-- Eagle-J Connect — BUSINESS/LISTING RLS
-- Use member-posting-final.sql as the master migration.
-- This compatibility file is intentionally safe if run by itself.

BEGIN;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "businesses_public_read" ON public.businesses;
DROP POLICY IF EXISTS "businesses_member_select_own" ON public.businesses;
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
ON public.businesses FOR SELECT TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "businesses_member_select_own"
ON public.businesses FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "businesses_member_insert"
ON public.businesses FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "businesses_member_update_pending"
ON public.businesses FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "businesses_member_delete"
ON public.businesses FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "businesses_admin_select_all"
ON public.businesses FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "businesses_admin_update_all"
ON public.businesses FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "businesses_admin_delete_all"
ON public.businesses FOR DELETE TO authenticated
USING (public.is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images','business-images',true)
ON CONFLICT (id) DO UPDATE SET public=true;

COMMIT;
