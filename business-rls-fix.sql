-- Eagle-J Connect: Business marketplace RLS + Storage fix
-- Run this ONCE in Supabase SQL Editor.
-- This migration safely adds an owner column if the existing businesses table
-- does not already have one, then locks INSERT/UPDATE/DELETE to the owner.

BEGIN;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS businesses_user_id_idx
  ON public.businesses(user_id);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Public marketplace can read published rows.
DROP POLICY IF EXISTS "businesses_public_read" ON public.businesses;
CREATE POLICY "businesses_public_read"
ON public.businesses
FOR SELECT
TO anon, authenticated
USING (true);

-- A signed-in member may create an ad only for their own account.
DROP POLICY IF EXISTS "businesses_owner_insert" ON public.businesses;
CREATE POLICY "businesses_owner_insert"
ON public.businesses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- A member may edit only their own ads.
DROP POLICY IF EXISTS "businesses_owner_update" ON public.businesses;
CREATE POLICY "businesses_owner_update"
ON public.businesses
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- A member may delete only their own ads.
DROP POLICY IF EXISTS "businesses_owner_delete" ON public.businesses;
CREATE POLICY "businesses_owner_delete"
ON public.businesses
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Storage bucket used by the create-ad form.
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Anyone may read objects from this public marketplace bucket.
DROP POLICY IF EXISTS "business_images_public_read" ON storage.objects;
CREATE POLICY "business_images_public_read"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'business-images');

-- Signed-in users may upload only to this bucket. Supabase sets owner_id to auth.uid().
DROP POLICY IF EXISTS "business_images_owner_insert" ON storage.objects;
CREATE POLICY "business_images_owner_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-images'
  AND owner_id = auth.uid()
);

-- Signed-in users may replace/delete only their own uploaded images.
DROP POLICY IF EXISTS "business_images_owner_update" ON storage.objects;
CREATE POLICY "business_images_owner_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-images'
  AND owner_id = auth.uid()
)
WITH CHECK (
  bucket_id = 'business-images'
  AND owner_id = auth.uid()
);

DROP POLICY IF EXISTS "business_images_owner_delete" ON storage.objects;
CREATE POLICY "business_images_owner_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-images'
  AND owner_id = auth.uid()
);

COMMIT;
