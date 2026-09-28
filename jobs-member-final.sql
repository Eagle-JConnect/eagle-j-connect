-- =========================================================
-- EAGLE-J CONNECT — JOBS MEMBER POSTING FINAL FIX
-- =========================================================
-- Run this file in Supabase SQL Editor.
-- It removes ALL existing policies on public.jobs first, so an old
-- policy/restrictive policy cannot continue blocking member INSERTs.
-- New jobs are forced to the authenticated user's UUID and pending status.
-- =========================================================

BEGIN;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Remove EVERY existing policy on jobs, regardless of its old name.
DO $$
DECLARE
  p record;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'jobs'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.jobs', p.policyname);
  END LOOP;
END $$;

-- Ensure status exists.
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';

-- Force ownership server-side. The browser cannot choose another employer_id.
CREATE OR REPLACE FUNCTION public.set_job_owner_and_pending()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  NEW.employer_id := auth.uid();
  NEW.status := 'pending';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_job_owner_and_pending ON public.jobs;

CREATE TRIGGER trg_set_job_owner_and_pending
BEFORE INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_job_owner_and_pending();

REVOKE ALL ON FUNCTION public.set_job_owner_and_pending() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_job_owner_and_pending() TO authenticated;

-- Public: approved jobs only.
CREATE POLICY "ej_jobs_public_select"
ON public.jobs
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- Members: own jobs, including pending/rejected/unavailable.
CREATE POLICY "ej_jobs_member_select_own"
ON public.jobs
FOR SELECT
TO authenticated
USING (auth.uid() = employer_id);

-- Members: any authenticated account may submit a job.
-- Ownership/status are enforced by the trigger above and this check.
CREATE POLICY "ej_jobs_member_insert"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL
  AND auth.uid() = employer_id
  AND status = 'pending'
);

-- Members can edit only their own pending jobs.
CREATE POLICY "ej_jobs_member_update_pending"
ON public.jobs
FOR UPDATE
TO authenticated
USING (
  auth.uid() = employer_id
  AND status = 'pending'
)
WITH CHECK (
  auth.uid() = employer_id
  AND status = 'pending'
);

-- Members can delete their own jobs.
CREATE POLICY "ej_jobs_member_delete"
ON public.jobs
FOR DELETE
TO authenticated
USING (auth.uid() = employer_id);

-- Admin moderation.
CREATE POLICY "ej_jobs_admin_select"
ON public.jobs
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "ej_jobs_admin_update"
ON public.jobs
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "ej_jobs_admin_delete"
ON public.jobs
FOR DELETE
TO authenticated
USING (public.is_admin());

COMMIT;

-- =========================================================
-- VERIFY THE POLICIES AFTER RUNNING
-- =========================================================
SELECT
  policyname,
  cmd,
  roles,
  permissive,
  qual,
  with_check
FROM pg_policies
WHERE schemaname='public'
  AND tablename='jobs'
ORDER BY policyname;
