-- EAGLE-J CONNECT: REPAIR PUBLIC ANONS/BIZNIS LISTINGS
-- Run this in Supabase SQL Editor for project glwyqrvufmjscjbbszzz.
-- Visitors can read only approved business listings. This does NOT allow public writes.
BEGIN;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.businesses TO anon, authenticated;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='public' AND tablename='businesses' AND cmd='SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.businesses', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY eagle_businesses_public_approved_read
ON public.businesses FOR SELECT TO anon, authenticated
USING (status = 'approved');

CREATE POLICY eagle_businesses_owner_read
ON public.businesses FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY eagle_businesses_admin_read
ON public.businesses FOR SELECT TO authenticated
USING (public.is_admin());
COMMIT;
