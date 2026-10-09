-- Eagle-J Connect: listing cover + gallery setup
-- Run in Supabase SQL Editor. image_url is the cover; image_urls stores all public image URLs as a PostgreSQL text array.
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT ARRAY[]::text[];

-- Normalize NULL arrays without overwriting existing image links.
UPDATE public.businesses SET image_urls = ARRAY[]::text[] WHERE image_urls IS NULL;

-- Allow objects up to 100 MiB in the existing image bucket, if that is the limit you want.
UPDATE storage.buckets SET file_size_limit = 104857600 WHERE id = 'business-images';
