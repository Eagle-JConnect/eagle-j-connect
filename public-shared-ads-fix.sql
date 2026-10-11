-- EAGLE-J CONNECT: PUBLIC SHARED BUSINESS ADS
-- Run in Supabase SQL Editor after the moderation-v7 migration.
-- This lets visitors read approved business ads without logging in.
-- It does NOT grant public insert/update/delete access.

BEGIN;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "businesses_public_read" ON public.businesses;
CREATE POLICY "businesses_public_read"
ON public.businesses
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

COMMIT;
