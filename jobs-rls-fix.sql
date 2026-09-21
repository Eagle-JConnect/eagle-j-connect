-- Eagle-J Connect: Public jobs + employer ownership RLS
-- Run this ONCE in Supabase SQL Editor.
-- This script does not enable/disable RLS on tables; it only manages the policies.

BEGIN;

DROP POLICY IF EXISTS "jobs_public_read" ON public.jobs;
CREATE POLICY "jobs_public_read"
ON public.jobs
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "jobs_employer_insert" ON public.jobs;
CREATE POLICY "jobs_employer_insert"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "jobs_employer_update" ON public.jobs;
CREATE POLICY "jobs_employer_update"
ON public.jobs
FOR UPDATE
TO authenticated
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "jobs_employer_delete" ON public.jobs;
CREATE POLICY "jobs_employer_delete"
ON public.jobs
FOR DELETE
TO authenticated
USING (auth.uid() = employer_id);

COMMIT;
