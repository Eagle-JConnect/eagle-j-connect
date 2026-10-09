-- Eagle-J Connect: profile photo setup
-- Run this script in Supabase SQL Editor before using profile-photo upload.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_image_url text;

-- Allow authenticated users to update their own profile row only.
-- This does not grant access to edit another user's profile.
DROP POLICY IF EXISTS profiles_update_own_profile_photo ON public.profiles;
CREATE POLICY profiles_update_own_profile_photo
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- The app stores avatars inside business-images/profile-avatars/<auth-user-id>/.
-- The business-images bucket should be public so profile images can display publicly.
DROP POLICY IF EXISTS profile_avatars_insert_own ON storage.objects;
CREATE POLICY profile_avatars_insert_own
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'business-images'
  AND (storage.foldername(name))[1] = 'profile-avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);

DROP POLICY IF EXISTS profile_avatars_update_own ON storage.objects;
CREATE POLICY profile_avatars_update_own
ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'business-images'
  AND (storage.foldername(name))[1] = 'profile-avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'business-images'
  AND (storage.foldername(name))[1] = 'profile-avatars'
  AND (storage.foldername(name))[2] = auth.uid()::text
);


-- Profile editing and public/private visibility
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS profile_visibility text NOT NULL DEFAULT 'public';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_profile_visibility_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_profile_visibility_check
  CHECK (profile_visibility IN ('public','private'));

-- Set the existing business-images bucket upload limit to 100 MB.
UPDATE storage.buckets
SET file_size_limit = 104857600
WHERE id = 'business-images';

-- Restrict the public profile directory to public profiles (owners/admins
-- still retain their own/admin access through the existing policy).
DROP POLICY IF EXISTS "profiles_public_active_read" ON public.profiles;
CREATE POLICY "profiles_public_active_read"
ON public.profiles FOR SELECT TO anon, authenticated
USING (
  COALESCE(account_status, 'active') = 'active'
  AND (COALESCE(profile_visibility, 'public') = 'public' OR auth.uid() = id)
);
