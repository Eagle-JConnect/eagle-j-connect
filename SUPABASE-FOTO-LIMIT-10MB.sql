-- Eagle-J Connect: mete limit chak foto biznis/anons a 10 MB.
-- Kouri sa nan Supabase SQL Editor.
UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif']
WHERE id = 'business-images';

-- Si bucket la poko egziste, kreye li ak limit 10 MB:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'business-images', 'business-images', true, 10485760,
       ARRAY['image/jpeg','image/png','image/webp','image/gif']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'business-images');
