-- ==============================================================================
-- 📦 STORAGE POLICIES (Run this in Supabase SQL Editor)
-- ==============================================================================

-- 1. Ensure the bucket is public (so images show up on the website)
UPDATE storage.buckets
SET public = true
WHERE id = 'product-images';

-- 2. Allow Public Read Access (Everyone can view images)
DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
CREATE POLICY "Public Read Product Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- 3. Allow Admin Upload/Delete Access (Only logged-in users)
DROP POLICY IF EXISTS "Admin Manage Product Images" ON storage.objects;
CREATE POLICY "Admin Manage Product Images"
ON storage.objects FOR ALL
TO authenticated
USING ( bucket_id = 'product-images' )
WITH CHECK ( bucket_id = 'product-images' );
