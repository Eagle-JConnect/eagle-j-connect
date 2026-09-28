-- Eagle-J Connect — JOBS RLS
-- Use member-posting-final.sql as the master migration.
-- This compatibility file is intentionally safe if run by itself.

BEGIN;

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "jobs_public_read" ON public.jobs;
DROP POLICY IF EXISTS "jobs_member_select_own" ON public.jobs;
DROP POLICY IF EXISTS "jobs_employer_insert" ON public.jobs;
DROP POLICY IF EXISTS "jobs_member_insert" ON public.jobs;
DROP POLICY IF EXISTS "jobs_employer_update" ON public.jobs;
DROP POLICY IF EXISTS "jobs_member_update_pending" ON public.jobs;
DROP POLICY IF EXISTS "jobs_employer_delete" ON public.jobs;
DROP POLICY IF EXISTS "jobs_member_delete" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_select_all" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_update_all" ON public.jobs;
DROP POLICY IF EXISTS "jobs_admin_delete_all" ON public.jobs;

CREATE POLICY "jobs_public_read"
ON public.jobs FOR SELECT TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "jobs_member_select_own"
ON public.jobs FOR SELECT TO authenticated
USING (auth.uid() = employer_id);

CREATE POLICY "jobs_member_insert"
ON public.jobs FOR INSERT TO authenticated
WITH CHECK (auth.uid() = employer_id AND status = 'pending');

CREATE POLICY "jobs_member_update_pending"
ON public.jobs FOR UPDATE TO authenticated
USING (auth.uid() = employer_id AND status = 'pending')
WITH CHECK (auth.uid() = employer_id AND status = 'pending');

CREATE POLICY "jobs_member_delete"
ON public.jobs FOR DELETE TO authenticated
USING (auth.uid() = employer_id);

CREATE POLICY "jobs_admin_select_all"
ON public.jobs FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "jobs_admin_update_all"
ON public.jobs FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "jobs_admin_delete_all"
ON public.jobs FOR DELETE TO authenticated
USING (public.is_admin());

COMMIT;
