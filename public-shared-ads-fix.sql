-- EAGLE-J CONNECT: FIX PUBLIC BUSINESS AD DETAIL LINKS
-- Run this in the SAME Supabase project used by script.js:
-- https://glwyqrvufmjscjbbszzz.supabase.co
-- Safe intent: visitors can READ approved business ads without logging in.
-- Does not grant public INSERT, UPDATE, or DELETE access.
-- Avoids querying public.profiles inside the business SELECT policy.

BEGIN;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Remove every existing SELECT policy on businesses so an older policy
-- that queries profiles cannot continue triggering "permission denied".
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'businesses'
      AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.businesses', pol.policyname);
  END LOOP;
END
$$;

-- Public and logged-in visitors can read only approved ads.
CREATE POLICY "businesses_public_read"
ON public.businesses
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Logged-in owners can still view their own ads while pending.
CREATE POLICY "businesses_owner_select"
ON public.businesses
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Administrators can review all ads, including pending/rejected ones.
CREATE POLICY "businesses_admin_select_all"
ON public.businesses
FOR SELECT
TO authenticated
USING (public.is_admin());

COMMIT;

-- After running:
-- 1) Open an APPROVED ad link in a private/incognito browser.
-- 2) If it still fails, check that this SQL was run in the project URL above.
