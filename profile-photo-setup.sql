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
